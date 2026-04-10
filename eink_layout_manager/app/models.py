from sqlalchemy import Column, String, Integer, JSON, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base


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


class Layout(Base):
    __tablename__ = "layouts"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    canvas_width_mm = Column(Integer, nullable=False)
    canvas_height_mm = Column(Integer, nullable=False)
    items = Column(JSON, nullable=False)


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
