import requests
import json

API_KEY = "429683C4C977415CAAFCCE10F7D57E11"
INSTANCE = "test-bot-2"
BASE_URL = "http://evo-api_evolution-api:8080"
HEADERS = {"apikey": API_KEY}

def check():
    print(f"--- Checking Instance: {INSTANCE} ---")
    try:
        # Check Connection State
        r = requests.get(f"{BASE_URL}/instance/connectionState/{INSTANCE}", headers=HEADERS)
        print(f"Connection Status: {r.status_code}")
        print(f"Body: {r.text}")
        
        # Check Webhook Config
        r = requests.get(f"{BASE_URL}/webhook/find/{INSTANCE}", headers=HEADERS)
        print(f"\nWebhook Config Status: {r.status_code}")
        print(f"Body: {r.text}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check()
