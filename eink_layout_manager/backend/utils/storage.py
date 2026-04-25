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
        data_dir = os.environ.get("MEDIA_DIR", "/media/eink_layout_manager")
    else:
        data_dir = os.environ.get("DATA_DIR", "/data")

    data_root_canonical = (
        os.path.realpath(data_dir) if os.path.exists(data_dir) else data_dir
    )

    path = os.path.join(data_dir, resource_type)
    real_path = os.path.realpath(path)

    # Security: Canonical path validation (only if base exists)
    if os.path.exists(data_root_canonical) and not real_path.startswith(
        data_root_canonical
    ):
        raise ValueError(f"Invalid storage path (traversal): {path}")

    os.makedirs(real_path, exist_ok=True)
    return real_path
