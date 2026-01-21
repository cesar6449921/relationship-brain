import requests

try:
    print("Tentando conectar em localhost:8000...")
    response = requests.get("http://localhost:8000/", timeout=2)
    print(f"Status: {response.status_code}")
    print(f"Resposta: {response.json()}")
except Exception as e:
    print(f"ERRO CRÍTICO: Não foi possível conectar no Backend. {e}")
