from playwright.sync_api import Page, expect


def test_page_load(page: Page, app_url: str):
    """Verify that the main page loads and has the correct title."""
    page.goto(app_url)

    # Check for the main heading or title
    expect(page).to_have_title("eInk Layout Manager")

    # Check for a specific element that should be present
    # Based on app-root.ts, it likely has some text or components
    # For example, the toolbar
    expect(page.locator("app-header")).to_be_visible()
