from getpass import getpass
from SERVICES.user_service import autentificar_user


email = input("E-mail: ")
senha = getpass("Senha: ")

usuario = autentificar_user(email, senha)

if usuario:
    print(f"Login bem-sucedido! Olá, {usuario['name_user']}.")

    if usuario["id_role"] == 1:
        print("Tipo de usuário: Aluno")
    elif usuario["id_role"] == 2:
        print("Tipo de usuário: Professor")
else:
    print("E-mail ou senha inválidos.")
