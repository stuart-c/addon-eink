import json
import uuid
import logging
from aiohttp import web
from jsonschema import ValidationError
from sqlalchemy import select

from .. import database
from ..utils.validation import (
    validate_id,
    validate_read_only,
    validate_data,
)
from ..utils.query import build_filters, parse_sort_params
from ..utils.converters import generic_model_to_dict

logger = logging.getLogger(__name__)


class BaseCRUDHandler:
    """Base class for standard CRUD operations."""

    model_class = None
    schema_name = None
    list_response_schema = "item_list_response"
    status_response_schema = "status_response"

    def __init__(self):
        if not self.model_class:
            raise ValueError("model_class must be defined")
        if not self.schema_name:
            raise ValueError("schema_name must be defined")

    def model_to_dict(self, item):
        """Convert model instance to dictionary for JSON response."""
        return generic_model_to_dict(item)

    async def pre_create(self, data):
        """Hook to modify data before creation."""
        return data

    async def post_create(self, item, session):
        """Hook to run after creation but before commit."""
        pass

    async def pre_update(self, data, existing_item):
        """Hook to modify data before update."""
        return data

    async def post_update(self, item, session):
        """Hook to run after update but before commit."""
        pass

    async def pre_delete(self, item, session):
        """Hook to run before deletion (e.g. referential integrity)."""
        pass

    async def get_collection_query(self, request):
        """Generic implementation of collection query with filtering and sorting."""
        filters = build_filters(self.model_class, request.query)
        sort_query = request.query.get("sort")
        order_by = parse_sort_params(self.model_class, sort_query)

        stmt = select(self.model_class)
        if filters:
            stmt = stmt.where(*filters)
        if order_by:
            stmt = stmt.order_by(*order_by)

        return stmt

    async def list(self, request):
        """Generic list handler."""
        try:
            stmt = await self.get_collection_query(request)
            async with database.get_session() as session:
                result = await session.execute(stmt)
                items = result.scalars().all()
                return web.json_response([self.model_to_dict(item) for item in items])
        except Exception as e:
            logger.error(f"Error in list for {self.schema_name}: {e}")
            return web.json_response(
                {"error": "Database error", "details": str(e)}, status=500
            )

    async def get(self, request):
        """Generic get handler."""
        item_id = request.match_info["id"]
        try:
            item_id = validate_id(item_id)
        except ValueError as e:
            return web.json_response({"error": str(e)}, status=400)

        try:
            async with database.get_session() as session:
                stmt = select(self.model_class).where(self.model_class.id == item_id)
                result = await session.execute(stmt)
                item = result.scalars().first()
                if not item:
                    return web.json_response({"error": "Not Found"}, status=404)
                return web.json_response(self.model_to_dict(item))
        except Exception as e:
            logger.error(f"Error in get for {self.schema_name}: {e}")
            return web.json_response(
                {"error": "Database error", "details": str(e)}, status=500
            )

    async def create(self, request):
        """Generic create handler."""
        try:
            data = await request.json()
        except json.JSONDecodeError:
            return web.json_response({"error": "Invalid JSON"}, status=400)

        # Force server-side ID generation (ignores client-provided ID as
        # per test expectations)
        data["id"] = str(uuid.uuid4())

        # Validation
        try:
            validate_data(data, self.schema_name)
        except ValidationError as e:
            return web.json_response(
                {"error": "Validation failed", "message": e.message},
                status=400,
            )
        except Exception as e:
            return web.json_response({"error": str(e)}, status=500)

        # Pre-create hook for transformations and secondary validation
        try:
            data = await self.pre_create(data)
        except ValidationError as e:
            return web.json_response(
                {"error": "Validation failed", "message": e.message},
                status=400,
            )
        except Exception as e:
            logger.error(f"Error in pre_create: {e}")
            return web.json_response({"error": str(e)}, status=500)

        async with database.get_session() as session:
            # Check for existence
            stmt = select(self.model_class).where(self.model_class.id == data["id"])
            result = await session.execute(stmt)
            if result.scalars().first():
                return web.json_response(
                    {"error": "Resource already exists"}, status=409
                )

            # Defensive: Filter data to only include valid model columns
            valid_columns = {c.name for c in self.model_class.__table__.columns}
            model_data = {k: v for k, v in data.items() if k in valid_columns}

            item = self.model_class(**model_data)
            session.add(item)
            await self.post_create(item, session)
            await session.commit()
            return web.json_response(self.model_to_dict(item), status=201)

    async def update(self, request):
        """Generic update handler."""
        item_id = request.match_info["id"]
        try:
            item_id = validate_id(item_id)
            data = await request.json()
        except (ValueError, json.JSONDecodeError) as e:
            return web.json_response(
                {"error": (str(e) if isinstance(e, ValueError) else "Invalid JSON")},
                status=400,
            )

        async with database.get_session() as session:
            stmt = select(self.model_class).where(self.model_class.id == item_id)
            result = await session.execute(stmt)
            item = result.scalars().first()
            if not item:
                return web.json_response({"error": "Not Found"}, status=404)

            existing_data = self.model_to_dict(item)

            # Ensure ID match
            if "id" in data and data["id"] != item_id:
                return web.json_response(
                    {"error": "ID in body does not match ID in URL"},
                    status=400,
                )

            # Validate read-only fields
            try:
                validate_read_only(data, self.schema_name, existing_data=existing_data)
            except ValidationError as e:
                return web.json_response({"error": str(e)}, status=400)

            # Pre-populate required fields for validation if missing
            # This allows partial updates while satisfying the full schema
            data_to_validate = existing_data.copy()
            data_to_validate.update(data)
            data_to_validate["id"] = item_id

            # Full validation and pre-update hook
            try:
                validate_data(data_to_validate, self.schema_name)
                pre_update_data = await self.pre_update(data, item)
                data_to_validate.update(pre_update_data)
            except ValidationError as e:
                return web.json_response(
                    {"error": "Validation failed", "message": e.message},
                    status=400,
                )
            except Exception as e:
                logger.error(f"Error in pre_update/validation: {e}")
                return web.json_response({"error": str(e)}, status=500)

            # Update fields
            valid_columns = {c.name for c in self.model_class.__table__.columns}
            for key, value in data_to_validate.items():
                if key in valid_columns:
                    setattr(item, key, value)

            await self.post_update(item, session)
            await session.commit()
            return web.json_response(self.model_to_dict(item))

    async def delete(self, request):
        """Generic delete handler."""
        item_id = request.match_info["id"]
        try:
            item_id = validate_id(item_id)
        except ValueError as e:
            return web.json_response({"error": str(e)}, status=400)

        async with database.get_session() as session:
            stmt = select(self.model_class).where(self.model_class.id == item_id)
            result = await session.execute(stmt)
            item = result.scalars().first()
            if not item:
                return web.json_response({"error": "Not Found"}, status=404)

            try:
                await self.pre_delete(item, session)
                await session.delete(item)
                await session.commit()
                return web.json_response({"status": "deleted"})
            except web.HTTPException as e:
                # Map specific HTTP exceptions to JSON responses if they are conflicts
                if e.status == 409:
                    return web.json_response(
                        {"error": "Conflict", "message": e.reason}, status=400
                    )
                raise
            except Exception as e:
                logger.error(f"Error in delete for {self.schema_name}: {e}")
                return web.json_response(
                    {"error": "Database error", "details": str(e)}, status=500
                )
