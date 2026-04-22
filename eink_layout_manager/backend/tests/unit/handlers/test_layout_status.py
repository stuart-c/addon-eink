from backend.handlers.items import LayoutHandler


def test_calculate_status_no_items():
    handler = LayoutHandler()
    data = {"items": []}
    assert handler._calculate_status(data) == "draft"


def test_calculate_status_with_items_no_device_id():
    handler = LayoutHandler()
    data = {
        "items": [
            {"display_type_id": "dt1", "device_id": ""},
            {"display_type_id": "dt2", "device_id": "device2"},
        ]
    }
    assert handler._calculate_status(data) == "draft"


def test_calculate_status_with_items_missing_device_id():
    handler = LayoutHandler()
    data = {
        "items": [
            {"display_type_id": "dt1"},
            {"display_type_id": "dt2", "device_id": "device2"},
        ]
    }
    assert handler._calculate_status(data) == "draft"


def test_calculate_status_active():
    handler = LayoutHandler()
    data = {
        "items": [
            {"display_type_id": "dt1", "device_id": "device1"},
            {"display_type_id": "dt2", "device_id": "device2"},
        ]
    }
    assert handler._calculate_status(data) == "active"


def test_calculate_status_one_item_active():
    handler = LayoutHandler()
    data = {"items": [{"display_type_id": "dt1", "device_id": "device1"}]}
    assert handler._calculate_status(data) == "active"
