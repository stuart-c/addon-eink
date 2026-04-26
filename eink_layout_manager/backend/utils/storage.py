import os


def get_storage_path(resource_type):
    """
    Get the filesystem path for a specific resource type.
    Creates the directory if it does not exist.
    """
    # Security: Whitelist allowed resource types to prevent
    # arbitrary directory creation
    allowed_types = {"image", "thumbnail", "scene_display"}
    if resource_type not in allowed_types:
        raise ValueError(f"Invalid resource type: {resource_type}")

    if resource_type == "scene_display":
        base_dir = os.environ.get("MEDIA_DIR", "/media")
        subdir = os.environ.get(
            "MEDIA_SUBDIRECTORY", "eink_layout_manager/scene_display"
        )
        path = os.path.join(base_dir, subdir)
    else:
        base_dir = os.environ.get("DATA_DIR", "/data")
        path = os.path.join(base_dir, resource_type)

    base_canonical = (
        os.path.realpath(base_dir) if os.path.exists(base_dir) else base_dir
    )

    real_path = os.path.realpath(path)

    # Security: Canonical path validation (only if base exists)
    if os.path.exists(base_canonical) and not real_path.startswith(base_canonical):
        raise ValueError(f"Invalid storage path (traversal): {path}")

    os.makedirs(real_path, exist_ok=True)
    return real_path
