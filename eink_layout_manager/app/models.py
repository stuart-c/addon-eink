from sqlalchemy import Column, String, Integer, JSON, DateTime, func

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
    updated_at = Column(
        DateTime, server_default=func.now(), onupdate=func.now()
    )


class Scene(Base):
    __tablename__ = "scenes"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    layout_id = Column(String, nullable=False)
    status = Column(String, nullable=False, default="draft")
    items = Column(JSON, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(
        DateTime, server_default=func.now(), onupdate=func.now()
    )
