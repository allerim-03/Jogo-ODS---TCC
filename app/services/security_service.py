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


class SecurityService:

    # ==========================================================================
    # CRIPTOGRAFA UMA SENHA
    # ==========================================================================

    def hash_password(self, password):

        return generate_password_hash(password)


    # ==========================================================================
    # VERIFICA SE A SENHA ESTÁ CORRETA
    # ==========================================================================

    def verify_password(self, password_hash, password):

        return check_password_hash(
            password_hash,
            password
        )


    # ==========================================================================
    # GERA TOKEN JWT
    # ==========================================================================

    def generate_token(self, user):

        return create_access_token(
            identity=str(user.id),

            additional_claims={
                "role": user.role,
                "email": user.email,
                "use_type": user.use_type
            }
        )