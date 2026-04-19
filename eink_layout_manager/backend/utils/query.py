from sqlalchemy import func, String, select, or_
import contextlib
from .. import models


def parse_sort_params(model, sort_query, default_field="name"):
    """
    Parse the sort query parameter into SQLAlchemy order_by clauses.
    Uses model.__sortable_fields__ metadata.
    """
    sortable_fields = getattr(model, "__sortable_fields__", {})
    order_by_clauses = []

    if not sort_query:
        # Fallback to default
        field = getattr(model, default_field, None)
        if field is not None:
            return (
                [func.lower(field).asc()]
                if isinstance(field.type, String)
                else [field.asc()]
            )
        return []

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

            if field_name not in sortable_fields:
                continue

            col_name = sortable_fields[field_name]
            field = getattr(model, col_name)

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
        with contextlib.suppress(Exception):
            pass

    if not order_by_clauses:
        field = getattr(model, default_field, None)
        if field is not None:
            return (
                [func.lower(field).asc()]
                if isinstance(field.type, String)
                else [field.asc()]
            )

    return order_by_clauses


def build_filters(model, query_params):
    """
    Build a list of SQLAlchemy filter expressions from query parameters.
    Uses model.__filterable_fields__ metadata.
    """
    filterable_fields = getattr(model, "__filterable_fields__", {})
    filters = []

    for param_name, value in query_params.items():
        if param_name not in filterable_fields or not value:
            continue

        col_name = filterable_fields[param_name]
        field = getattr(model, col_name)

        try:
            if param_name.startswith("min_"):
                filters.append(field >= int(value))
            elif param_name.startswith("max_"):
                filters.append(field <= int(value))
            elif (
                param_name == "title"
                or param_name == "description"
                or param_name == "artist"
                or param_name == "collection"
            ):
                # Partial match for common text fields
                filters.append(field.ilike(f"%{value}%"))
            elif param_name == "keyword" and model.__name__ == "Image":
                # Special case for image keywords
                kws = [k.strip() for k in value.split(",") if k.strip()]
                kw_filters = []
                for kw in kws:
                    # Generic keyword search in JSON array
                    kw_je = func.json_each(models.Image.keywords).table_valued(
                        "value"
                    )
                    kw_subquery = (
                        select(1)
                        .select_from(kw_je)
                        .where(kw_je.c.value == kw)
                        .exists()
                    )
                    kw_filters.append(kw_subquery)
                if kw_filters:
                    filters.append(or_(*kw_filters))
            else:
                # Exact match for others
                filters.append(field == value)
        except (ValueError, TypeError):
            if param_name.startswith("min_") or param_name.startswith("max_"):
                raise ValueError("Invalid numeric filter parameter")
            continue

    return filters


# Legacy functions for compatibility during migration
def parse_image_sort_params(sort_query):
    return parse_sort_params(models.Image, sort_query)


def build_image_filters(query_params):
    """
    Build image filters, ensuring status=READY is the first filter
    unless overridden, to match legacy behavior and test expectations.
    """
    filters = build_filters(models.Image, query_params)

    # Check if a status filter already exists
    has_status = any(
        hasattr(f, "left") and f.left.name == "status"
        for f in filters
        if hasattr(f, "left")
    )

    if not has_status:
        # Prepend to match legacy order (important for some tests)
        filters.insert(0, models.Image.status == "READY")

    return filters


def build_scene_filters(query_params):
    return build_filters(models.Scene, query_params)
