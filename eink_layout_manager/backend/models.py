import hashlib
import json
from sqlalchemy import (
    Column,
    String,
    Integer,
    Float,
    JSON,
    DateTime,
    func,
    event,
)

try:
    from .database import Base
except ImportError:
    from database import Base


class Image(Base):
    __tablename__ = "images"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    artist = Column(String, nullable=True)
    collection = Column(String, nullable=True)
    file_type = Column(String, nullable=False)
    width = Column(Integer, nullable=False)
    height = Column(Integer, nullable=False)
    colour_depth = Column(Integer, nullable=True)
    keywords = Column(JSON, nullable=True)
    description = Column(String, nullable=True)
    file_path = Column(String, nullable=False)
    original_archive_file = Column(String, nullable=True)
    license = Column(String, nullable=True)
    source = Column(String, nullable=True)
    status = Column(String, nullable=False)
    file_hash = Column(String, nullable=False)
    thumbnail_path = Column(String, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    conversion = Column(JSON, nullable=True)
    brightness = Column(Float, nullable=False, default=1.0)
    contrast = Column(Float, nullable=False, default=1.0)
    saturation = Column(Float, nullable=False, default=1.0)
    settings_hash = Column(String, nullable=True)

    def compute_settings_hash(self) -> str:
        """
        Compute a SHA-256 hash of the image settings and file hash.
        Includes: conversion, brightness, contrast, saturation, and file_hash.
        """
        settings = {
            "conversion": self.conversion,
            "brightness": self.brightness,
            "contrast": self.contrast,
            "saturation": self.saturation,
        }
        # Use sort_keys=True for consistent JSON representation
        settings_json = json.dumps(settings, sort_keys=True)
        combined = settings_json + (self.file_hash or "")
        return hashlib.sha256(combined.encode()).hexdigest()

    __filterable_fields__ = {
        "title": "name",
        "artist": "artist",
        "collection": "collection",
        "min_width": "width",
        "max_width": "width",
        "min_height": "height",
        "max_height": "height",
        "description": "description",
        "keyword": "keywords",
    }
    __sortable_fields__ = {
        "name": "name",
        "artist": "artist",
        "collection": "collection",
        "width": "width",
        "height": "height",
    }


@event.listens_for(Image, "before_insert")
@event.listens_for(Image, "before_update")
def update_image_settings_hash(mapper, connection, target):
    """Automatically update the settings_hash before saving."""
    target.settings_hash = target.compute_settings_hash()


class Scene(Base):
    __tablename__ = "scenes"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    layout_id = Column(String, nullable=False)
    status = Column(String, nullable=False, default="draft")
    items = Column(JSON, nullable=True)
    scene_hash = Column(String, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    def compute_scene_hash(self) -> str:
        """Compute a SHA-256 hash of the scene items."""
        items_json = json.dumps(self.items or [], sort_keys=True)
        return hashlib.sha256(items_json.encode()).hexdigest()

    __filterable_fields__ = {
        "title": "name",
        "layout": "layout_id",
    }
    __sortable_fields__ = {
        "name": "name",
    }


@event.listens_for(Scene, "before_insert")
@event.listens_for(Scene, "before_update")
def update_scene_hash(mapper, connection, target):
    """Automatically update the scene_hash before saving."""
    target.scene_hash = target.compute_scene_hash()


class DisplayType(Base):
    __tablename__ = "display_types"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    width_mm = Column(Integer, nullable=False)
    height_mm = Column(Integer, nullable=False)
    panel_width_mm = Column(Integer, nullable=False)
    panel_height_mm = Column(Integer, nullable=False)
    width_px = Column(Integer, nullable=False)
    height_px = Column(Integer, nullable=False)
    colour_type = Column(String, nullable=False)
    frame = Column(JSON, nullable=False)
    mat = Column(JSON, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    @property
    def pixel_width_mm(self) -> float:
        """Calculate the physical width of a single pixel in mm."""
        if not self.width_px:
            return 0.0
        return self.panel_width_mm / self.width_px

    @property
    def pixel_height_mm(self) -> float:
        """Calculate the physical height of a single pixel in mm."""
        if not self.height_px:
            return 0.0
        return self.panel_height_mm / self.height_px

    __filterable_fields__ = {
        "name": "name",
    }
    __sortable_fields__ = {
        "name": "name",
    }


class Layout(Base):
    __tablename__ = "layouts"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    canvas_width_mm = Column(Integer, nullable=False)
    canvas_height_mm = Column(Integer, nullable=False)
    items = Column(JSON, nullable=False)
    status = Column(String, nullable=False, default="draft")
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    __filterable_fields__ = {
        "name": "name",
    }
    __sortable_fields__ = {
        "name": "name",
    }


class ImagePalette(Base):
    __tablename__ = "image_palettes"

    image_id = Column(String, primary_key=True)
    palette = Column(String, primary_key=True)
    filename = Column(String, nullable=False, default="")
    image_settings_hash = Column(String, nullable=False, default="")
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())


class SceneDisplayImage(Base):
    __tablename__ = "scene_display_images"

    scene_id = Column(String, primary_key=True)
    display_id = Column(String, primary_key=True)
    image_id = Column(String, primary_key=True)
    image_hash = Column(String, nullable=False)
    scene_hash = Column(String, nullable=False)
    filename = Column(String, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
