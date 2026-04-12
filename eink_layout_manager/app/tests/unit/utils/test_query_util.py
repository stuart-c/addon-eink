import pytest
from sqlalchemy import func
from app.utils.query import parse_image_sort_params, build_image_filters
from app import models


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
    # Check for status == 'READY'
    assert "status = 'READY'" in str(
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
