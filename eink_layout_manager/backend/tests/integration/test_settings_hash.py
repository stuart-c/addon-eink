import pytest
import hashlib
import json
import io
from aiohttp import FormData
from PIL import Image as PILImage


@pytest.mark.asyncio
async def test_image_settings_hash_calculation(aiohttp_client, app):
    """Verify that settings_hash is correctly calculated on upload and updates."""
    client = await aiohttp_client(app)

    # 1. Upload a new image
    width, height = 10, 10
    img = PILImage.new("RGB", (width, height), color="red")
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format="PNG")
    img_data = img_byte_arr.getvalue()

    file_hash = hashlib.sha256(img_data).hexdigest()

    data = FormData()
    data.add_field(
        "file", img_data, filename="test.png", content_type="image/png"
    )

    resp = await client.post("/api/image", data=data)
    assert resp.status == 201
    image = await resp.json()

    assert "settings_hash" in image
    initial_hash = image["settings_hash"]

    # Manually calculate expected hash
    # Note: conversion is None by default in model
    expected_settings = {
        "conversion": None,
        "brightness": 1.0,
        "contrast": 1.0,
        "saturation": 1.0,
    }
    expected_json = json.dumps(expected_settings, sort_keys=True)
    expected_hash = hashlib.sha256(
        expected_json.encode() + file_hash.encode()
    ).hexdigest()

    assert initial_hash == expected_hash

    image_id = image["id"]

    # 2. Update settings (e.g., brightness)
    update_data = {"brightness": 1.2}
    resp = await client.put(f"/api/image/{image_id}", json=update_data)
    assert resp.status == 200
    updated_image = await resp.json()

    new_hash = updated_image["settings_hash"]
    assert new_hash != initial_hash

    # Manually calculate new expected hash
    expected_settings["brightness"] = 1.2
    expected_json = json.dumps(expected_settings, sort_keys=True)
    expected_hash = hashlib.sha256(
        expected_json.encode() + file_hash.encode()
    ).hexdigest()

    assert new_hash == expected_hash

    # 3. Update non-hash-affecting field (e.g., name)
    resp = await client.put(
        f"/api/image/{image_id}", json={"name": "New Name"}
    )
    assert resp.status == 200
    renamed_image = await resp.json()

    assert renamed_image["settings_hash"] == new_hash

    # 4. Update conversion
    conversion_data = {"ditheringType": "errorDiffusion"}
    resp = await client.put(
        f"/api/image/{image_id}", json={"conversion": conversion_data}
    )
    assert resp.status == 200
    converted_image = await resp.json()

    final_hash = converted_image["settings_hash"]
    assert final_hash != new_hash

    # Manually calculate final expected hash
    # Note: conversion_data is updated
    expected_settings["conversion"] = conversion_data
    expected_json = json.dumps(expected_settings, sort_keys=True)
    expected_hash = hashlib.sha256(
        expected_json.encode() + file_hash.encode()
    ).hexdigest()

    assert final_hash == expected_hash
