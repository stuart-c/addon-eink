import hashlib
import io
import os
import uuid
from collections import Counter
from PIL import Image as PILImage
from sqlalchemy import select, func
from aiohttp import web

from .. import database, models
from ..utils.storage import get_storage_path
from ..utils.converters import (
    image_model_to_dict,
    image_model_to_summary_dict,
)
from ..utils.images import delete_image_files_and_record
from ..utils.validation import (
    validate_id,
    load_schema,
    response_schema,
    validate_read_only,
)
from ..utils.query import parse_image_sort_params, build_image_filters
from jsonschema import validate, ValidationError
import json


@response_schema("image")
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

    except Exception:
        import traceback
        print("Error saving image:", flush=True)
        traceback.print_exc()
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
                status="READY",
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


@response_schema("image")
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


@response_schema("image_list_response")
async def handle_image_list(request):
    """Retrieve image metadata with sorting and pagination."""
    # 1. Parse sorting parameters
    # Args:
    #     sort_query (str): Comma-separated sort string
    #         (e.g., "name:asc,artist:desc")
    sort_query = request.query.get("sort", "name:asc")
    order_by_clauses = parse_image_sort_params(sort_query)

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

    # 3. Parse filtering parameters
    try:
        filters = build_image_filters(request.query)
    except ValueError as e:
        return web.json_response({"error": str(e)}, status=400)

    try:
        async with database.get_session() as session:
            # Build base statement with filters
            base_stmt = select(models.Image).where(*filters)

            # Get total count (from filtered set)
            count_stmt = select(func.count()).select_from(
                base_stmt.alias("filtered_images")
            )
            count_result = await session.execute(count_stmt)
            total_count = count_result.scalar() or 0

            # Get sorted and paginated results
            stmt = (
                base_stmt.order_by(*order_by_clauses)
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


@response_schema("status_response")
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

        # Delete from DB and disk using shared utility
        try:
            await delete_image_files_and_record(image, session)
        except Exception as e:
            return web.json_response(
                {"error": "Deletion failed", "details": str(e)}, status=500
            )

    return web.json_response({"status": "deleted"})


@response_schema("keyword_list_response")
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


@response_schema("image")
async def handle_image_update(request):
    """Update image metadata in the SQL database."""
    image_id = request.match_info["id"]

    try:
        image_id = validate_id(image_id)
        data = await request.json()
    except (ValueError, json.JSONDecodeError) as e:
        return web.json_response(
            {"error": str(e) if isinstance(e, ValueError) else "Invalid JSON"},
            status=400,
        )

    try:
        async with database.get_session() as session:
            stmt = select(models.Image).where(models.Image.id == image_id)
            result = await session.execute(stmt)
            image = result.scalar_one_or_none()

            if not image:
                return web.json_response({"error": "Not Found"}, status=404)

            existing_data = image_model_to_dict(image)

            # Ensure ID in URL matches ID in body (if provided)
            if "id" in data and data["id"] != image_id:
                return web.json_response(
                    {"error": "ID in body does not match ID in URL"},
                    status=400,
                )

            # Validate read-only fields against EXISTING data
            try:
                validate_read_only(data, "image", existing_data=existing_data)
            except ValidationError as e:
                return web.json_response({"error": str(e)}, status=400)

            # Pre-populate required fields for validation if missing
            # This allows partial updates from the frontend while
            # satisfying the full schema
            if "id" not in data:
                data["id"] = image.id
            if "name" not in data:
                data["name"] = image.name
            if "file_type" not in data:
                data["file_type"] = image.file_type
            if "dimensions" not in data:
                data["dimensions"] = {
                    "width": image.width,
                    "height": image.height,
                }

            # Validation against image schema
            try:
                schema = load_schema("image")
                validate(instance=data, schema=schema)
            except FileNotFoundError:
                return web.json_response(
                    {"error": "Schema for image not found"}, status=500
                )
            except ValidationError as e:
                return web.json_response(
                    {"error": "Validation failed", "message": e.message},
                    status=400,
                )

            # Update fields from sanitized data
            image.name = data.get("name", image.name)
            image.artist = data.get("artist", image.artist)
            image.collection = data.get("collection", image.collection)
            image.description = data.get("description", image.description)
            image.keywords = data.get("keywords", image.keywords)
            image.license = data.get("license", image.license)
            image.source = data.get("source", image.source)
            image.file_type = data.get("file_type", image.file_type)

            # Always set status to READY upon update
            image.status = "READY"

            # Dimensions are nested in the dictionary but flat in the model
            dims = data.get("dimensions", {})
            image.width = dims.get("width", image.width)
            image.height = dims.get("height", image.height)

            image.colour_depth = data.get("colour_depth", image.colour_depth)

            await session.commit()
            await session.refresh(image)

            return web.json_response(image_model_to_dict(image))
    except Exception as e:
        return web.json_response(
            {"error": "Database error", "details": str(e)}, status=500
        )
