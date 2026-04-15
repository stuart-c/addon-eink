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
    }
