import requests

url = "http://localhost:8000/auth/signup"
data = {
    "email": "teste2@email.com",
    "full_name": "Teste da Silva",
    "phone_number": "5511999999999",
    "password": "password123"
}

try:
    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Erro ao conectar: {e}")
