import requests
import json

BASE_URL = "http://localhost:8099/api"

def test_filtering():
    # 1. Create two layouts
    l1 = requests.post(f"{BASE_URL}/layout", json={"name": "Layout 1", "canvas_width_mm": 100, "canvas_height_mm": 100, "items": []}).json()
    l2 = requests.post(f"{BASE_URL}/layout", json={"name": "Layout 2", "canvas_width_mm": 100, "canvas_height_mm": 100, "items": []}).json()
    
    # 2. Create scenes for each layout
    s1 = requests.post(f"{BASE_URL}/scene", json={"name": "Scene 1", "layout": l1["id"]}).json()
    s2 = requests.post(f"{BASE_URL}/scene", json={"name": "Scene 2", "layout": l2["id"]}).json()
    
    # 3. Test filtering
    r1 = requests.get(f"{BASE_URL}/scene", params={"layout": l1["id"]}).json()
    print(f"Scenes for Layout 1: {[s['name'] for s in r1]}")
    
    r2 = requests.get(f"{BASE_URL}/scene", params={"layout": l2["id"]}).json()
    print(f"Scenes for Layout 2: {[s['name'] for s in r2]}")

if __name__ == "__main__":
    test_filtering()
