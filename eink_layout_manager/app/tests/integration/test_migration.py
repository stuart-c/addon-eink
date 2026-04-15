import os
import json
import pytest
from app import database, models
from app.utils.storage import get_storage_path
from sqlalchemy import select


@pytest.mark.asyncio
async def test_json_to_db_migration(tmp_path):
    """Test that JSON files are migrated to the database on startup."""
    # 1. Setup temporary data directory
    os.environ["DATA_DIR"] = str(tmp_path)
    
    dt_path = get_storage_path("display_type")
    layout_path = get_storage_path("layout")
    
    dt_data = {
        "id": "migrated_dt",
        "name": "Migrated DT",
        "width_mm": 50,
        "height_mm": 100,
        "panel_width_mm": 25,
        "panel_height_mm": 50,
        "width_px": 122,
        "height_px": 250,
        "colour_type": "MONO",
        "frame": {"border_width_mm": 5, "colour": "#000000"},
        "mat": {"colour": "#FFFFFF"},
    }
    
    layout_data = {
        "id": "migrated_layout",
        "name": "Migrated Layout",
        "canvas_width_mm": 100,
        "canvas_height_mm": 100,
        "items": [
            {
                "display_type_id": "migrated_dt",
                "x_mm": 0,
                "y_mm": 0,
                "orientation": "landscape",
            }
        ],
    }
    
    with open(os.path.join(dt_path, "migrated_dt.json"), "w") as f:
        json.dump(dt_data, f)
    
    with open(os.path.join(layout_path, "migrated_layout.json"), "w") as f:
        json.dump(layout_data, f)
        
    # 2. Initialise database (triggers migration)
    await database.init_db()
    
    try:
        # 3. Verify data in DB
        async with database.get_session() as session:
            # Check DisplayType
            result = await session.execute(
                select(models.DisplayType).where(models.DisplayType.id == "migrated_dt")
            )
            dt = result.scalars().first()
            assert dt is not None
            assert dt.name == "Migrated DT"
            
            # Check Layout
            result = await session.execute(
                select(models.Layout).where(models.Layout.id == "migrated_layout")
            )
            layout = result.scalars().first()
            assert layout is not None
            assert layout.name == "Migrated Layout"
            assert layout.items[0]["display_type_id"] == "migrated_dt"
            
        # 4. Verify files are renamed
        assert not os.path.exists(os.path.join(dt_path, "migrated_dt.json"))
        assert os.path.exists(os.path.join(dt_path, "migrated_dt.json.migrated"))
        
        assert not os.path.exists(os.path.join(layout_path, "migrated_layout.json"))
        assert os.path.exists(os.path.join(layout_path, "migrated_layout.json.migrated"))
        
    finally:
        await database.close_db()
