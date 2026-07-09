"""
===========================================================================
SERVIÇO DE AUTENTICAÇÃO

Responsabilidade:

- Validar os dados enviados.
- Consultar o banco através do Repository.
- Criptografar senhas.
- Validar senha.
- Validar perfil.
- Gerar Token JWT.

Este arquivo concentra TODA a regra de negócio da autenticação.
As rotas apenas chamam estas funções.

regras de autenticação (cadastro, login, validações de usuário e perfil).
===========================================================================
"""

from app.services.security_service import criptografar_senha



from flask_jwt_extended import create_access_token

from app.models.user import User

from app.repositories.user_repository import (
    buscar_por_email,
    salvar
)


# ==========================================================================
# CADASTRO
# ==========================================================================

def cadastrar_usuario(data):

    nome = data.get("nome")
    email = data.get("email")
    senha = data.get("senha")

    uso = data.get("uso")
    perfil = data.get("perfil")

    idade = data.get("idade")
    instituicao = data.get("instituicao")

    # -----------------------------
    # Validação básica
    # -----------------------------

    if not nome or not email or not senha:

        return {
            "status": 400,
            "body": {
                "success": False,
                "message": "Todos os campos devem ser preenchidos."
            }
        }

    # -----------------------------
    # Email já cadastrado
    # -----------------------------

    usuario_existente = buscar_por_email(email)

    if usuario_existente:

        return {
            "status": 400,
            "body": {
                "success": False,
                "message": "Este e-mail já está cadastrado."
            }
        }

    # -----------------------------
    # Criptografia da senha
    # -----------------------------

   
    senha_hash = criptografar_senha(senha)

    # -----------------------------
    # Novo usuário
    # -----------------------------

    novo_usuario = User(

        nome=nome,

        email=email,

        senha=senha_hash,

        role=perfil,

        idade=idade,

        instituicao=instituicao
    )

    try:

        salvar(novo_usuario)

        return {
            "status": 201,
            "body": {
                "success": True,
                "message": f"Cadastro de {perfil} realizado com sucesso!"
            }
        }

    except Exception as erro:

        return {
            "status": 500,
            "body": {
                "success": False,
                "message": "Erro interno ao salvar usuário."
            }
        }


# ==========================================================================
# LOGIN
# ==========================================================================

def autenticar_usuario(data):

    email = data.get("email")

    senha = data.get("senha")

    perfil_tela = data.get("perfil")

    # -----------------------------
    # Validação
    # -----------------------------

    if not email or not senha:

        return {
            "status": 400,
            "body": {
                "success": False,
                "message": "E-mail e senha são obrigatórios."
            }
        }

    # -----------------------------
    # Busca usuário
    # -----------------------------

    usuario = buscar_por_email(email)

    if not usuario:

        return {
            "status": 404,
            "body": {
                "success": False,
                "message": "Usuário não encontrado."
            }
        }

    # -----------------------------
    # Verifica senha
    # -----------------------------

    if not check_password_hash(usuario.senha, senha):

        return {
            "status": 401,
            "body": {
                "success": False,
                "message": "E-mail ou senha incorretos."
            }
        }

    # -----------------------------
    # Verifica perfil
    # -----------------------------

    if usuario.role != perfil_tela:

        return {
            "status": 403,
            "body": {
                "success": False,
                "message": f"Esta conta está registrada como {usuario.role}, mas você tentou entrar como {perfil_tela}."
            }
        }

    # -----------------------------
    # Token JWT
    # -----------------------------

    token = create_access_token(

        identity=str(usuario.id),

        additional_claims={
            "role": usuario.role
        }

    )

    # -----------------------------
    # Sucesso
    # -----------------------------

    return {

        "status": 200,

        "body": {

            "success": True,

            "message": "Login efetuado com sucesso!",

            "access_token": token,

            "user": usuario.to_dict()

        }

    }