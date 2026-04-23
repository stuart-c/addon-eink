import asyncio
import os
import json
from backend import database, models
from sqlalchemy import select


async def inspect():
    # Set DATA_DIR if not set (default to .data for dev)
    if "DATA_DIR" not in os.environ:
        os.environ["DATA_DIR"] = os.path.join(os.getcwd(), ".data")

    print(f"Using DATA_DIR: {os.environ['DATA_DIR']}")

    await database.init_db()

    async with database.get_session() as session:
        # Inspect Layouts
        print("\n--- Layouts ---")
        stmt = select(models.Layout)
        result = await session.execute(stmt)
        layouts = result.scalars().all()
        for layout in layouts:
            print(f"ID: {layout.id}, Name: {layout.name}, Status: {layout.status}")
            print(f"Items: {json.dumps(layout.items, indent=2)}")

        # Inspect Scenes
        print("\n--- Scenes ---")
        stmt = select(models.Scene)
        result = await session.execute(stmt)
        scenes = result.scalars().all()
        for s in scenes:
            print(
                f"ID: {s.id}, Name: {s.name}, Status: {s.status}, Layout: {s.layout_id}"
            )
            print(f"Items: {json.dumps(s.items, indent=2)}")


if __name__ == "__main__":
    asyncio.run(inspect())
