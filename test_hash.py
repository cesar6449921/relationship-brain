from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

try:
    print("Testando hash...")
    hash = pwd_context.hash("senha123")
    print(f"Hash gerado: {hash}")
    print("Sucesso!")
except Exception as e:
    print(f"Erro ao gerar hash: {e}")
