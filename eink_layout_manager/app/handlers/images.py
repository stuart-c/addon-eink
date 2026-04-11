import hashlib
import io
import os
import uuid
from collections import Counter
from PIL import Image as PILImage
from sqlalchemy import select, func, String
from aiohttp import web

from .. import database, models
from ..utils.storage import get_storage_path
from ..utils.validation import validate_id
from ..utils.converters import (
    image_model_to_dict,
    image_model_to_summary_dict,
)


async def handle_image_create(request):
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

        with PILImage.open(io.BytesIO(content)) as img:
            width, height = img.size
            file_type = img.format
    except Exception as e:
        if isinstance(e, web.HTTPException):
            raise
        return web.json_response({"error": "Invalid image"}, status=400)

    try:
        ext = file_type.lower() if file_type else "bin"
        storage_path = get_storage_path("image")
        filename_on_disk = f"{image_id}.{ext}"
        file_path = os.path.join(storage_path, filename_on_disk)
        with open(file_path, "wb") as f:
            f.write(content)

        # Generate thumbnail
        thumb_storage_path = get_storage_path("thumbnail")
        thumb_path = os.path.join(thumb_storage_path, filename_on_disk)
        with PILImage.open(io.BytesIO(content)) as img:
            img.thumbnail((200, 200))
            img.save(thumb_path)
    except Exception:
        return web.json_response({"error": "Failed to save"}, status=500)

    try:
        async with database.get_session() as session:
            new_image = models.Image(
                id=image_id,
                name=filename or "unnamed",
                file_type=file_type,
                width=width,
                height=height,
                file_path=filename_on_disk,
                status="UPLOADED",
                file_hash=file_hash,
                thumbnail_path=filename_on_disk,
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
            {"error": "DB fail", "details": str(e)}, status=500
        )


async def handle_image_get(request):
    """Retrieve image metadata from the SQL database."""
    image_id = request.match_info["id"]
    try:
        image_id = validate_id(image_id)
    except ValueError as e:
        return web.json_response({"error": str(e)}, status=400)

    try:
        async with database.get_session() as session:
            stmt = select(models.Image).where(models.Image.id == image_id)
            result = await session.execute(stmt)
            image = result.scalar_one_or_none()

            if not image:
                return web.json_response({"error": "Not Found"}, status=404)

            return web.json_response(image_model_to_dict(image))
    except Exception as e:
        return web.json_response(
            {"error": "Database error", "details": str(e)}, status=500
        )


async def handle_image_list(request):
    """Retrieve image metadata from the SQL database with sorting and pagination."""
    # 1. Parse sorting parameters
    sort_query = request.query.get("sort", "name:asc")

    valid_fields = {
        "name": models.Image.name,
        "artist": models.Image.artist,
        "collection": models.Image.collection,
        "width": models.Image.width,
        "height": models.Image.height,
    }

    order_by_clauses = []

    try:
        for sort_part in sort_query.split(","):
            if not sort_part.strip():
                continue

            if ":" in sort_part:
                field_name, order = sort_part.split(":", 1)
            else:
                field_name, order = sort_part, "asc"

            field_name = field_name.strip()
            order = order.strip().lower()

            if field_name not in valid_fields:
                continue

            field = valid_fields[field_name]

            # Apply case-insensitivity for strings
            if isinstance(field.type, String):
                sort_expr = func.lower(field)
            else:
                sort_expr = field

            if order == "desc":
                order_by_clauses.append(sort_expr.desc())
            else:
                order_by_clauses.append(sort_expr.asc())
    except Exception:
        # Fallback to default if parsing fails
        order_by_clauses = [func.lower(models.Image.name).asc()]

    if not order_by_clauses:
        order_by_clauses = [func.lower(models.Image.name).asc()]

    # 2. Parse pagination parameters
    try:
        page = int(request.query.get("page", 1))
        limit = int(request.query.get("limit", 20))
    except ValueError:
        return web.json_response(
            {"error": "Invalid page or limit parameter"}, status=400
        )

    if page < 1:
        page = 1
    if limit < 1:
        limit = 20
    if limit > 100:
        limit = 100

    offset = (page - 1) * limit

    try:
        async with database.get_session() as session:
            # Get total count
            count_stmt = select(func.count()).select_from(models.Image)
            count_result = await session.execute(count_stmt)
            total_count = count_result.scalar() or 0

            # Get sorted and paginated results
            stmt = (
                select(models.Image)
                .order_by(*order_by_clauses)
                .limit(limit)
                .offset(offset)
            )
            result = await session.execute(stmt)
            images = result.scalars().all()

            summary_list = [image_model_to_summary_dict(i) for i in images]

            # Calculate total pages
            total_pages = (
                (total_count + limit - 1) // limit if total_count > 0 else 0
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


async def handle_image_thumbnail_get(request):
    """Serve the thumbnail image file from disk."""
    image_id = request.match_info["id"]
    try:
        image_id = validate_id(image_id)
    except ValueError as e:
        return web.json_response({"error": str(e)}, status=400)

    try:
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
    except Exception as e:
        return web.json_response(
            {"error": "Database error", "details": str(e)}, status=500
        )


async def handle_image_delete(request):
    """Permanently delete an image record and its files."""
    image_id = request.match_info["id"]
    try:
        image_id = validate_id(image_id)
    except ValueError as e:
        return web.json_response({"error": str(e)}, status=400)

    async with database.get_session() as session:
        stmt = select(models.Image).where(models.Image.id == image_id)
        result = await session.execute(stmt)
        image = result.scalar_one_or_none()

        if not image:
            return web.json_response({"error": "Not Found"}, status=404)

        filename = image.file_path
        thumbnail = image.thumbnail_path

        # Delete from DB
        await session.delete(image)
        await session.commit()

        # Delete files from disk
        try:
            # Delete main image
            storage_path = get_storage_path("image")
            file_path = os.path.join(storage_path, filename)
            if os.path.exists(file_path):
                os.remove(file_path)

            # Delete thumbnail if it exists
            if thumbnail:
                thumb_storage_path = get_storage_path("thumbnail")
                thumb_file_path = os.path.join(thumb_storage_path, thumbnail)
                if os.path.exists(thumb_file_path):
                    os.remove(thumb_file_path)
        except Exception as e:
            # Log but don't fail, as DB record is already gone
            print(f"Error deleting image files for {image_id}: {str(e)}")

    return web.json_response({"status": "deleted"})


async def handle_image_keywords_get(request):
    """Retrieve an ordered list of keywords and their usage counts."""
    try:
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

            # Convert to list of objects, ordered by count descending.
            # We also sort alphabetically for stable results on equal counts.
            sorted_kws = sorted(
                counts.items(), key=lambda x: (-x[1], x[0].lower())
            )

            ordered_keywords = [
                {"keyword": kw, "count": count} for kw, count in sorted_kws
            ]

            return web.json_response(ordered_keywords)
    except Exception as e:
        return web.json_response(
            {"error": "Database error", "details": str(e)}, status=500
        )
