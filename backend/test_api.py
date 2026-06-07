import urllib.request
import json

BASE_URL = "https://ai-kitchen-hero.vercel.app" 

def test_api():
    try:
        with urllib.request.urlopen(f"{BASE_URL}/api/health") as resp:
            print("Health Check:", resp.read().decode())
    except Exception as e:
        print("Health Check Missing:", e)

    payload = {"name": "Test Item", "category": "other", "quantity": "1"}
    data = json.dumps(payload).encode('utf-8')
    
    try:
        req = urllib.request.Request(f"{BASE_URL}/api/fridge/add", data=data, 
                                     headers={'Content-Type':'application/json'})
        urllib.request.urlopen(req)
    except Exception as e:
        print("Test no token, expect 403:", e)

if __name__ == "__main__":
    test_api()