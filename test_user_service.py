
from SERVICES.user_service import cadastrar_usuario


def testar_cadastro_aluno():
    print("Iniciando teste de cadastro de aluno...")

    try:
        resultado = cadastrar_usuario(
            name_user="Aluno Teste",
            birth_user="2010-05-15",
            registration_user="TESTE001",
            main_email="aluno.teste@example.com",
            personal_email=None,
            password_user="SenhaTeste123!",
            id_gender=None,
            tipo_usuario="student"
        )

        print("\nCadastro realizado!")
        print(f"Resultado: {resultado}")

    except Exception as erro:
        print("\nO cadastro falhou.")
        print(f"Tipo do erro: {type(erro).__name__}")
        print(f"Mensagem: {erro}")


if __name__ == "__main__":
    testar_cadastro_aluno()
