import requests
import json

# Simular um token (você precisa pegar o token real do login)
# Por enquanto vamos testar sem autenticação para ver a resposta

url = "http://localhost:8000/api/admin/all-users"

# Fazer login primeiro para pegar o token
login_data = {
    "email": "coach.honorato@gmail.com",
    "password": "892578"
}

login_response = requests.post("http://localhost:8000/api/auth/login", json=login_data)
print("Login Response:", login_response.status_code)
print(login_response.json())

if login_response.status_code == 200:
    token = login_response.json().get("access_token")
    print(f"\n✅ Token obtido: {token[:20]}...")
    
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(url, headers=headers)
    print(f"\n✅ Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
else:
    print("❌ Erro no login!")
