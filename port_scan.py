import socket

target_ip = "35.247.254.108"
ports = [80, 443, 8080, 8081, 3000]

print(f"Testando conexao com {target_ip}...")

for port in ports:
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(2)
    result = sock.connect_ex((target_ip, port))
    if result == 0:
        print(f"Porta {port}: ABERTA")
    else:
        print(f"Porta {port}: Fechada/Filtrada")
    sock.close()
