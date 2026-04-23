import pytest
from sqlalchemy import func
from backend.utils.query import parse_image_sort_params, build_image_filters
from backend import models


def test_parse_image_sort_params_default():
    """Test default sort when input is empty or invalid."""
    # Empty string
    result = parse_image_sort_params("")
    assert len(result) == 1
    # Check it's an ascending sort on lowercase name
    assert result[0].modifier == models.Image.name.asc().modifier

    # Invalid field
    result = parse_image_sort_params("invalid:asc")
    assert len(result) == 1
    assert result[0].modifier == models.Image.name.asc().modifier


def test_parse_image_sort_params_single():
    """Test parsing a single valid sort field."""
    # Name asc (default)
    result = parse_image_sort_params("name")
    assert len(result) == 1
    # Just check it's an ascending sort
    assert "ASC" in str(result[0])

    # Artist desc
    result = parse_image_sort_params("artist:desc")
    assert len(result) == 1
    assert "DESC" in str(result[0])

    # Width asc
    result = parse_image_sort_params("width:asc")
    assert len(result) == 1
    assert str(result[0]) == str(models.Image.width.asc())


def test_parse_image_sort_params_multiple():
    """Test parsing multiple sort fields."""
    result = parse_image_sort_params("collection:desc,name:asc")
    assert len(result) == 2
    assert str(result[0]) == str(func.lower(models.Image.collection).desc())
    assert str(result[1]) == str(func.lower(models.Image.name).asc())


def test_build_image_filters_basic():
    """Test building basic (mandatory) filters."""
    filters = build_image_filters({})
    assert len(filters) == 1
    # Check for status == 'ACTIVE'
    assert "status = 'ACTIVE'" in str(
        filters[0]
    ) or "images.status = :status_1" in str(filters[0])


def test_build_image_filters_numeric():
    """Test building numeric filters."""
    params = {
        "min_width": "100",
        "max_width": "500",
        "min_height": "200",
        "max_height": "600",
    }
    filters = build_image_filters(params)
    assert len(filters) == 5  # 1 mandatory + 4 numeric

    # Check a couple of them
    filter_strs = [str(f) for f in filters]
    assert str(models.Image.width >= 100) in filter_strs
    assert str(models.Image.height <= 600) in filter_strs


def test_build_image_filters_numeric_invalid():
    """Test that invalid numeric parameters raise ValueError."""
    with pytest.raises(ValueError, match="Invalid numeric filter parameter"):
        build_image_filters({"min_width": "not-a-number"})


def test_build_image_filters_text():
    """Test building text filters with ilike."""
    params = {
        "title": "Sunset",
        "artist": "Van Gogh",
        "collection": "Nature",
        "description": "Red sky",
    }
    filters = build_image_filters(params)
    assert len(filters) == 5  # 1 mandatory + 4 text

    filter_strs = [str(f) for f in filters]
    assert str(models.Image.name.ilike("%Sunset%")) in filter_strs
    assert str(models.Image.artist.ilike("%Van Gogh%")) in filter_strs
    assert str(models.Image.collection.ilike("%Nature%")) in filter_strs
    assert str(models.Image.description.ilike("%Red sky%")) in filter_strs


def test_build_image_filters_keywords():
    """Test building keyword filters (JSON array union/OR)."""
    params = {"keyword": "blue, ocean"}
    filters = build_image_filters(params)
    assert len(filters) == 2  # 1 mandatory + 1 grouped OR filter

    # Verify that OR logic is present in the filter string
    filter_str = str(filters[1])
    assert "OR" in filter_str or "EXISTS" in filter_str


def test_parse_sort_params_generic():
    """Test parse_sort_params with generic models."""
    from backend.utils.query import parse_sort_params

    # Test with Scene (default name:asc)
    result = parse_sort_params(models.Scene, "")
    assert len(result) == 1
    assert "ASC" in str(result[0])
    assert "name" in str(result[0])

    # Test with Layout (custom sort)
    result = parse_sort_params(models.Layout, "name:desc")
    assert len(result) == 1
    assert "DESC" in str(result[0])
    assert "name" in str(result[0])


def test_build_filters_generic():
    """Test build_filters with generic models."""
    from backend.utils.query import build_filters

    # Test with Scene (filtering by layout_id)
    params = {"layout": "layout1"}
    filters = build_filters(models.Scene, params)
    assert len(filters) == 1
    assert "layout_id = :layout_id_1" in str(filters[0])

    # Test with Layout (filtering by name)
    params = {"name": "Test Layout"}
    filters = build_filters(models.Layout, params)
    assert len(filters) == 1
    assert "name = :name_1" in str(filters[0])
