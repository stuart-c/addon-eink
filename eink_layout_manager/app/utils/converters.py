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
        "file_path": image.file_path,
        "original_archive_file": image.original_archive_file,
        "license": image.license,
        "source": image.source,
        "status": image.status,
        "file_hash": image.file_hash,
        "thumbnail_path": image.thumbnail_path,
    }
