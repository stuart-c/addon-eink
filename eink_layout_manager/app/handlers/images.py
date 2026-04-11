import hashlib
import io
import os
import uuid
from PIL import Image as PILImage
from sqlalchemy import select
from aiohttp import web

from .. import database, models
from ..utils.storage import get_storage_path
from ..utils.validation import validate_id
from ..utils.converters import image_model_to_dict


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
    """Retrieve all image metadata from the SQL database."""
    try:
        async with database.get_session() as session:
            stmt = select(models.Image).order_by(models.Image.name)
            result = await session.execute(stmt)
            images = result.scalars().all()

            return web.json_response([image_model_to_dict(i) for i in images])
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
