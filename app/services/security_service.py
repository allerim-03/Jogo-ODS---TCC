"""
===========================================================================
SERVIÇO DE SEGURANÇA

Responsável por:

- Hash de senha
- Verificação de senha
- Geração de Token JWT

Centraliza todas as operações relacionadas à segurança da aplicação.
criptografia, validação de senhas e geração de tokens.
===========================================================================
"""

from werkzeug.security import (
    generate_password_hash,
    check_password_hash
)

from flask_jwt_extended import create_access_token


# ==========================================================================
# Criptografa uma senha
# ==========================================================================

def criptografar_senha(senha):

    return generate_password_hash(senha)


# ==========================================================================
# Verifica se a senha está correta
# ==========================================================================

def verificar_senha(hash_salvo, senha_digitada):

    return check_password_hash(
        hash_salvo,
        senha_digitada
    )


# ==========================================================================
# Gera JWT
# ==========================================================================

def gerar_token(usuario):

    return create_access_token(

        identity=str(usuario.id),

        additional_claims={
            "role": usuario.role
        }

    )