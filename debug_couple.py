import requests

# 0. Criar Usuário (caso não exista)
signup_url = "http://localhost:8000/auth/signup"
signup_data = {
    "email": "teste2@email.com",
    "full_name": "Teste Debug",
    "phone_number": "5527999559678",
    "password": "password123"
}
try:
    print("0. Criando usuário...")
    requests.post(signup_url, json=signup_data)
except: pass

# 1. Login
login_url = "http://localhost:8000/auth/token"
login_data = {"username": "teste2@email.com", "password": "password123"} # Usando o usuário que criamos no teste anterior

print("1. Tentando Login...")
try:
    resp = requests.post(login_url, data=login_data)
    if resp.status_code != 200:
        print(f"Falha no Login: {resp.text}")
        exit()
    
    token = resp.json()["access_token"]
    print("Login OK! Token obtido.")
except Exception as e:
    print(f"Erro no Login: {e}")
    exit()

# 2. Criar Casal
couple_url = "http://localhost:8000/couples"
couple_data = {
    "partner_name": "Taina",
    "partner_phone": "5527999559678"
}
headers = {"Authorization": f"Bearer {token}"}

print("\n2. Tentando Criar Casal (e Grupo)...")
try:
    resp = requests.post(couple_url, json=couple_data, headers=headers)
    print(f"Status Code: {resp.status_code}")
    print(f"Resposta: {resp.text}")
except Exception as e:
    print(f"Erro ao Criar Casal: {e}")
