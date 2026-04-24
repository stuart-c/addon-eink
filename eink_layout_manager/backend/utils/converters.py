from sqlalchemy.inspection import inspect


def generic_model_to_dict(
    model_instance, include_fields=None, exclude_fields=None
):
    """
    Generic converter from SQLAlchemy model to dictionary.

    Args:
        model_instance: The SQLAlchemy model instance to convert.
        include_fields: Optional set of field names to include.
        exclude_fields: Optional set of field names to exclude.
    """
    if model_instance is None:
        return None

    data = {}
    mapper = inspect(model_instance.__class__)

    # Start with mapped attributes
    for column in mapper.attrs:
        if include_fields and column.key not in include_fields:
            continue
        if exclude_fields and column.key in exclude_fields:
            continue
        data[column.key] = getattr(model_instance, column.key)

    # Handle any remaining fields in include_fields that might be properties
    if include_fields:
        for field in include_fields:
            if field not in data and hasattr(model_instance, field):
                data[field] = getattr(model_instance, field)

    return data


def image_model_to_dict(image):
    """Convert an Image model instance to a dictionary according to schema."""
    return {
        "id": image.id,
        "name": image.name,
        "artist": image.artist,
        "collection": image.collection,
        "file_type": image.file_type,
        "dimensions": {
            "width": image.width,
            "height": image.height,
        },
        "colour_depth": image.colour_depth,
        "keywords": image.keywords if image.keywords is not None else [],
        "description": image.description,
        "original_archive_file": image.original_archive_file,
        "license": image.license,
        "source": image.source,
        "conversion": image.conversion,
        "brightness": image.brightness,
        "contrast": image.contrast,
        "saturation": image.saturation,
        "settings_hash": image.settings_hash,
    }


def image_model_to_summary_dict(image):
    """Convert an Image model instance to a summary dictionary."""
    return {
        "id": image.id,
        "name": image.name,
        "artist": image.artist,
        "collection": image.collection,
        "description": image.description,
        "file_type": image.file_type,
        "dimensions": {
            "width": image.width,
            "height": image.height,
        },
    }


def scene_model_to_dict(scene):
    """Convert a Scene model instance to a dictionary according to schema."""
    return {
        "id": scene.id,
        "name": scene.name,
        "layout": scene.layout_id,
        "status": scene.status,
        "items": scene.items if scene.items is not None else [],
        "scene_hash": scene.scene_hash,
    }
