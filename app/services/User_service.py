"""
===========================================================================
USER SERVICE

Responsável pelas regras de negócio dos usuários.

Exemplos:

- Perfil
- Avatar
- Preferências
- Alteração de senha
- Histórico
- Dados do dashboard

Não recebe requisições HTTP.
Não acessa Flask.
Não renderiza páginas.
Persistência fica no user_repository.
===========================================================================
"""

from app.repositories.user_repository import UserRepository
from app.services.security_service import SecurityService


# ==========================================================================
# AVATARES DISPONÍVEIS
# ==========================================================================

AVAILABLE_AVATARS = {
    "avatar_01",
    "avatar_02",
    "avatar_03",
    "avatar_04",
    "avatar_05"
}


class UserService:

    def __init__(self):

        self.user_repository = UserRepository()
        self.security_service = SecurityService()


    # ==========================================================================
    # PERFIL
    # ==========================================================================

    def get_profile(self, user):

        if user is None:

            return {
                "status": 404,
                "body": {
                    "success": False,
                    "message": "User not found."
                }
            }

        return {
            "status": 200,
            "body": {
                "success": True,
                "user": user.to_dict()
            }
        }


    # ==========================================================================
    # ATUALIZAR PERFIL
    # ==========================================================================

    def update_profile(self, user, data):

        name = data.get("name")
        age = data.get("age")
        institution = data.get("institution")

        # ----------------------------------------------------------------------
        # Tratamento dos campos de texto
        # ----------------------------------------------------------------------

        if isinstance(name, str):
            name = name.strip()

        if isinstance(institution, str):
            institution = institution.strip()

        # ----------------------------------------------------------------------
        # Atualização
        # ----------------------------------------------------------------------

        updated = self.user_repository.update_profile(
            user.id,
            name=name,
            age=age,
            institution=institution
        )

        if not updated:

            return {
                "status": 404,
                "body": {
                    "success": False,
                    "message": "User not found."
                }
            }

        return {
            "status": 200,
            "body": {
                "success": True,
                "message": "Profile updated successfully."
            }
        }


    # ==========================================================================
    # ATUALIZAR AVATAR
    # ==========================================================================

    def update_avatar(self, user, data):

        avatar = data.get("avatar")

        # ----------------------------------------------------------------------
        # Verifica se o avatar foi informado
        # ----------------------------------------------------------------------

        if not avatar:

            return {
                "status": 400,
                "body": {
                    "success": False,
                    "message": "Avatar is required."
                }
            }

        # ----------------------------------------------------------------------
        # Verifica se o avatar pertence à lista disponível
        # ----------------------------------------------------------------------

        if avatar not in AVAILABLE_AVATARS:

            return {
                "status": 400,
                "body": {
                    "success": False,
                    "message": "Invalid avatar."
                }
            }

        # ----------------------------------------------------------------------
        # Atualiza avatar
        # ----------------------------------------------------------------------

        updated = self.user_repository.update_avatar(
            user.id,
            avatar
        )

        if not updated:

            return {
                "status": 404,
                "body": {
                    "success": False,
                    "message": "User not found."
                }
            }

        return {
            "status": 200,
            "body": {
                "success": True,
                "message": "Avatar updated successfully.",
                "avatar": avatar
            }
        }


    # ==========================================================================
    # PREFERÊNCIAS
    # ==========================================================================

    def update_preferences(self, user, preferences):

        updated = self.user_repository.update_preferences(
            user.id,
            preferences
        )

        return {
            "status": 200,
            "body": {
                "success": True,
                "message": "Preferences updated successfully."
            }
        }


    # ==========================================================================
    # ALTERAR SENHA
    # ==========================================================================

    def change_password(self, user, data):

        new_password = data.get("password")

        # ----------------------------------------------------------------------
        # Validação
        # ----------------------------------------------------------------------

        if not new_password:

            return {
                "status": 400,
                "body": {
                    "success": False,
                    "message": "Password is required."
                }
            }

        # ----------------------------------------------------------------------
        # Criptografa nova senha
        # ----------------------------------------------------------------------

        password_hash = self.security_service.hash_password(
            new_password
        )

        # ----------------------------------------------------------------------
        # Atualiza senha
        # ----------------------------------------------------------------------

        updated = self.user_repository.update_password(
            user.id,
            password_hash
        )

        if not updated:

            return {
                "status": 404,
                "body": {
                    "success": False,
                    "message": "Password was not updated."
                }
            }

        return {
            "status": 200,
            "body": {
                "success": True,
                "message": "Password updated successfully."
            }
        }


    # ==========================================================================
    # ESTATÍSTICAS DO USUÁRIO
    # ==========================================================================

    def get_statistics(self, user):

        statistics = self.user_repository.get_user_statistics(
            user.id
        )

        if statistics is None:

            return {
                "status": 404,
                "body": {
                    "success": False,
                    "message": "User not found."
                }
            }

        return {
            "status": 200,
            "body": {
                "success": True,
                "statistics": statistics
            }
        }
