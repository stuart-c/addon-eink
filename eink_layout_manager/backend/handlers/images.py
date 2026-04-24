import hashlib
import io
import os
import uuid
import logging
from collections import Counter
from PIL import Image as PILImage, UnidentifiedImageError
from sqlalchemy import select, func
from aiohttp import web

logger = logging.getLogger(__name__)

from .base import BaseCRUDHandler
from .. import database, models
from ..utils.storage import get_storage_path
from ..utils.converters import (
    image_model_to_dict,
    image_model_to_summary_dict,
)
from ..utils.images import delete_image_files_and_record
from ..utils.validation import (
    validate_id,
    response_schema,
)
from ..utils.query import parse_sort_params, build_filters


class ImageHandler(BaseCRUDHandler):
    model_class = models.Image
    schema_name = "image"

    def model_to_dict(self, item):
        """Standard model to dict for images."""
        return image_model_to_dict(item)

    async def create(self, request):
        """Custom create to handle multipart file upload."""
        try:
            reader = await request.multipart()
            field = await reader.next()
            if not field or field.name != "file":
                return web.json_response(
                    {"error": 'Missing "file" field'}, status=400
                )
            filename = field.filename
            content = await field.read()
        except Exception as e:
            return web.json_response(
                {"error": f"Failed to read: {str(e)}"}, status=400
            )

        image_id = uuid.uuid4().hex
        try:
            file_hash = hashlib.sha256(content).hexdigest()

            # Check for duplicate image by hash
            async with database.get_session() as session:
                stmt = select(models.Image).where(
                    models.Image.file_hash == file_hash
                )
                result = await session.execute(stmt)
                existing_image = result.scalar_one_or_none()
                if existing_image:
                    return web.json_response(
                        {
                            "error": "Duplicate image",
                            "message": "This image has already been uploaded.",
                            "id": existing_image.id,
                        },
                        status=409,
                    )

            # Open image and get metadata
            with PILImage.open(io.BytesIO(content)) as img:
                img.load()  # Force load
                width, height = img.size
                file_type = img.format or "PNG"

                # Save original file
                ext = file_type.lower()
                storage_path = get_storage_path("image")
                filename_on_disk = f"{image_id}.{ext}"
                file_path = os.path.join(storage_path, filename_on_disk)
                with open(file_path, "wb") as f:
                    f.write(content)

                # Generate thumbnail
                thumb_storage_path = get_storage_path("thumbnail")
                thumb_path = os.path.join(thumb_storage_path, filename_on_disk)

                # Create a copy for the thumbnail and save it
                thumb_img = img.copy()
                thumb_img.thumbnail((200, 200))
                thumb_img.save(thumb_path, format=file_type)

        except UnidentifiedImageError as e:
            return web.json_response(
                {"error": "Invalid image file", "details": str(e)}, status=400
            )
        except Exception as e:
            return web.json_response(
                {"error": f"Failed to save: {str(e)}"}, status=500
            )

        try:
            async with database.get_session() as session:
                new_image = models.Image(
                    id=image_id,
                    name=filename or "unnamed",
                    file_type=file_type,
                    width=width,
                    height=height,
                    file_path=filename_on_disk,
                    status="ACTIVE",
                    file_hash=file_hash,
                    thumbnail_path=filename_on_disk,
                    brightness=1.0,
                    contrast=1.0,
                    saturation=1.0,
                )
                session.add(new_image)
                await session.commit()
                await session.refresh(new_image)
                return web.json_response(
                    image_model_to_dict(new_image), status=201
                )
        except Exception as e:
            if os.path.exists(file_path):
                os.remove(file_path)
            return web.json_response(
                {"error": "Database error", "details": str(e)}, status=500
            )

    async def list(self, request):
        """Custom list to handle pagination and summary dicts."""
        sort_query = request.query.get("sort", "name:asc")
        order_by_clauses = parse_sort_params(self.model_class, sort_query)

        try:
            page = int(request.query.get("page", 1))
            limit = int(request.query.get("limit", 20))
        except ValueError:
            return web.json_response(
                {"error": "Invalid page or limit parameter"}, status=400
            )

        page = max(1, page)
        limit = max(1, min(100, limit))
        offset = (page - 1) * limit

        filters = build_filters(self.model_class, request.query)
        # Images MUST be ACTIVE unless specified
        if not any(
            hasattr(f, "left") and f.left.name == "status" for f in filters
        ):
            filters.append(models.Image.status == "ACTIVE")

        try:
            async with database.get_session() as session:
                base_stmt = select(models.Image).where(*filters)

                count_stmt = select(func.count()).select_from(
                    base_stmt.alias("filtered_images")
                )
                count_result = await session.execute(count_stmt)
                total_count = count_result.scalar() or 0

                stmt = (
                    base_stmt.order_by(*order_by_clauses)
                    .limit(limit)
                    .offset(offset)
                )
                logger.info(f"Executing image list query: {stmt}")
                result = await session.execute(stmt)
                images = result.scalars().all()
                logger.info(
                    f"Found {len(images)} images (total_count: {total_count})"
                )

                summary_list = [image_model_to_summary_dict(i) for i in images]
                total_pages = (
                    (total_count + limit - 1) // limit
                    if total_count > 0
                    else 0
                )

                return web.json_response(
                    {
                        "items": summary_list,
                        "pagination": {
                            "page": page,
                            "limit": limit,
                            "total_items": total_count,
                            "total_pages": total_pages,
                        },
                    }
                )
        except Exception as e:
            return web.json_response(
                {"error": "Database error", "details": str(e)}, status=500
            )

    async def delete(self, request):
        """Custom delete to handle physical file removal."""
        item_id = request.match_info["id"]
        try:
            item_id = validate_id(item_id)
        except ValueError as e:
            return web.json_response({"error": str(e)}, status=400)

        async with database.get_session() as session:
            stmt = select(models.Image).where(models.Image.id == item_id)
            result = await session.execute(stmt)
            image = result.scalar_one_or_none()

            if not image:
                return web.json_response({"error": "Not Found"}, status=404)

            try:
                await delete_image_files_and_record(image, session)
                return web.json_response({"status": "deleted"})
            except Exception as e:
                return web.json_response(
                    {"error": "Deletion failed", "details": str(e)}, status=500
                )

    async def thumbnail_get(self, request):
        """Custom endpoint for thumbnail retrieval."""
        image_id = request.match_info["id"]
        try:
            image_id = validate_id(image_id)
        except ValueError as e:
            return web.json_response({"error": str(e)}, status=400)

        async with database.get_session() as session:
            stmt = select(models.Image).where(models.Image.id == image_id)
            result = await session.execute(stmt)
            image = result.scalar_one_or_none()

            if not image or not image.thumbnail_path:
                return web.json_response({"error": "Not Found"}, status=404)

            thumb_storage_path = get_storage_path("thumbnail")
            thumb_file_path = os.path.join(
                thumb_storage_path, image.thumbnail_path
            )

            if not os.path.exists(thumb_file_path):
                return web.json_response({"error": "Not Found"}, status=404)

            return web.FileResponse(thumb_file_path)

    async def file_get(self, request):
        """Custom endpoint for original image file retrieval."""
        image_id = request.match_info["id"]
        try:
            image_id = validate_id(image_id)
        except ValueError as e:
            return web.json_response({"error": str(e)}, status=400)

        async with database.get_session() as session:
            stmt = select(models.Image).where(models.Image.id == image_id)
            result = await session.execute(stmt)
            image = result.scalar_one_or_none()

            if not image or not image.file_path:
                return web.json_response({"error": "Not Found"}, status=404)

            image_storage_path = get_storage_path("image")
            file_path = os.path.join(image_storage_path, image.file_path)

            if not os.path.exists(file_path):
                return web.json_response({"error": "Not Found"}, status=404)

            return web.FileResponse(file_path)

    async def keywords_get(self, _request):  # noqa: U101
        """Custom endpoint for keyword list."""
        async with database.get_session() as session:
            stmt = select(models.Image.keywords).where(
                models.Image.keywords.is_not(None)
            )
            result = await session.execute(stmt)
            all_keywords_lists = result.scalars().all()

            counts = Counter()
            for kw_list in all_keywords_lists:
                if kw_list:
                    counts.update(kw_list)

            sorted_kws = sorted(
                counts.items(), key=lambda x: (-x[1], x[0].lower())
            )

            ordered_keywords = [
                {"keyword": kw, "count": count} for kw, count in sorted_kws
            ]

            return web.json_response(ordered_keywords)


# Instantiate handler
image_handler = ImageHandler()


# Map routes to handler methods
@response_schema("image")
async def handle_image_create(request):
    """Handle image creation via multipart upload."""
    return await image_handler.create(request)


@response_schema("image")
async def handle_image_get(request):
    """Handle retrieval of image metadata."""
    return await image_handler.get(request)


@response_schema("image_list_response")
async def handle_image_list(request):
    """Handle retrieval of a list of image metadata."""
    return await image_handler.list(request)


async def handle_image_thumbnail_get(request):
    """Handle retrieval of image thumbnail binary."""
    return await image_handler.thumbnail_get(request)


async def handle_image_file_get(request):
    """Handle retrieval of original image binary."""
    return await image_handler.file_get(request)


@response_schema("status_response")
async def handle_image_delete(request):
    """Handle image deletion."""
    return await image_handler.delete(request)


@response_schema("keyword_list_response")
async def handle_image_keywords_get(request):
    """Handle retrieval of all used image keywords."""
    return await image_handler.keywords_get(request)


@response_schema("image")
async def handle_image_update(request):
    """Handle update of image metadata."""
    return await image_handler.update(request)
