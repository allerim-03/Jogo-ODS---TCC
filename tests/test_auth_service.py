
from app import create_app
from app.services.auth_service import AuthService

app = create_app()

auth_service = AuthService()
register_data = {
    "name": "Novo Teste",
    "email": "novo@email.com",
    "password": "123456",
    "role": "student",
    "age": 20,
    "institution": "FATEC"
}

login_data = {
    "email": "teste@email.com",
    "password": "123456",
    "role": "student"
}

with app.app_context():

    print("\n=== LOGIN ===")
    resultado = auth_service.login_user(login_data)
    print(resultado)

    print("\n=== CADASTRO ===")
    resultado = auth_service.register_user(register_data)
    print(resultado)

    print("\n=== LOGIN NOVAMENTE ===")
    resultado = auth_service.login_user(login_data)
    print(resultado)


