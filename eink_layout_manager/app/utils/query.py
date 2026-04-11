from sqlalchemy import func, String, select
from .. import models


def parse_image_sort_params(sort_query):
    """
    Parse the sort query parameter into SQLAlchemy order_by clauses.

    Args:
        sort_query (str): Comma-separated sort string
            (e.g., "name:asc,artist:desc")

    Returns:
        list: SQLAlchemy order_by expressions.
    """
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
        return [func.lower(models.Image.name).asc()]

    if not order_by_clauses:
        return [func.lower(models.Image.name).asc()]

    return order_by_clauses


def build_image_filters(query_params):
    """
    Build a list of SQLAlchemy filter expressions from query parameters.

    Args:
        query_params (dict): Dictionary of query parameters from the request.

    Returns:
        list: SQLAlchemy filter expressions.
    """
    filters = []

    # Mandatory status filter
    filters.append(models.Image.status == "READY")

    # Numeric filters
    try:
        min_width = query_params.get("min_width")
        if min_width:
            filters.append(models.Image.width >= int(min_width))

        max_width = query_params.get("max_width")
        if max_width:
            filters.append(models.Image.width <= int(max_width))

        min_height = query_params.get("min_height")
        if min_height:
            filters.append(models.Image.height >= int(min_height))

        max_height = query_params.get("max_height")
        if max_height:
            filters.append(models.Image.height <= int(max_height))
    except ValueError:
        raise ValueError("Invalid numeric filter parameter")

    # Text filters (Case-insensitive partial match)
    # title maps to name
    title = query_params.get("title")
    if title:
        filters.append(models.Image.name.ilike(f"%{title}%"))

    description = query_params.get("description")
    if description:
        filters.append(models.Image.description.ilike(f"%{description}%"))

    artist = query_params.get("artist")
    if artist:
        filters.append(models.Image.artist.ilike(f"%{artist}%"))

    collection = query_params.get("collection")
    if collection:
        filters.append(models.Image.collection.ilike(f"%{collection}%"))

    # Keyword filter (comma-separated, AND logic/intersection)
    keyword_query = query_params.get("keyword")
    if keyword_query:
        kws = [k.strip() for k in keyword_query.split(",") if k.strip()]
        for kw in kws:
            # Subquery to check for keyword in JSON array
            kw_je = func.json_each(models.Image.keywords).table_valued("value")
            kw_subquery = (
                select(1)
                .select_from(kw_je)
                .where(kw_je.c.value == kw)
                .exists()
            )
            filters.append(kw_subquery)

    return filters
