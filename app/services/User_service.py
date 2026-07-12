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

from app.repositories.user_repository import (
    get_user_by_id,
    update_user_profile,
    update_avatar,
    update_preferences,
    update_password,
    get_user_statistics
)


class UserService:

    # ======================================================================
    # Perfil
    # ======================================================================

    def get_profile(self, user_id):

        user = get_user_by_id(user_id)

        if user is None:
            return {
                "success": False,
                "message": "User not found."
            }

        return {
            "success": True,
            "user": user
        }

    # ======================================================================
    # Atualizar Perfil
    # ======================================================================

    def update_profile(self, user_id, data):

        updated = update_user_profile(user_id, data)

        if not updated:

            return {
                "success": False,
                "message": "User not found."
            }

        return {
            "success": True,
            "message": "Profile updated successfully."
        }

    # ======================================================================
    # Avatar
    # ======================================================================

    def update_avatar(self, user_id, avatar_url):

        update_avatar(user_id, avatar_url)

        return {
            "success": True,
            "message": "Avatar updated successfully."
        }

    # ======================================================================
    # Preferências
    # ======================================================================

    def update_preferences(self, user_id, preferences):

        update_preferences(user_id, preferences)

        return {
            "success": True,
            "message": "Preferences updated successfully."
        }

    # ======================================================================
    # Senha
    # ======================================================================

    def update_password(self, user_id, password):

        update_password(user_id, password)

        return {
            "success": True,
            "message": "Password updated successfully."
        }

    # ======================================================================
    # Estatísticas do usuário
    # ======================================================================

    def statistics(self, user_id):

        stats = get_user_statistics(user_id)

        return {
            "success": True,
            "statistics": stats
        }
# =====================================================
# COMPATIBILIDADE TEMPORÁRIA
# Mantém rotas antigas funcionando durante migração
# =====================================================

def get_profile_service(user_id):

    from app.repositories.user_repository import get_user_by_id

    user = get_user_by_id(user_id)

    if not user:
        return None

    return user.to_dict()



def update_profile_service(
    user_id,
    data
):

    from app.repositories.user_repository import update_user_profile


    updated = update_user_profile(
        user_id=user_id,
        name=data.get("name"),
        age=data.get("age"),
        institution=data.get("institution")
    )


    return {
        "success": updated
    }



def update_avatar_service(
    user_id,
    avatar
):

    from app.repositories.user_repository import update_avatar


    updated = update_avatar(
        user_id,
        avatar
    )


    return {
        "success": updated
    }



def update_preferences_service(
    user_id,
    preferences
):

    from app.repositories.user_repository import update_preferences


    updated = update_preferences(
        user_id,
        preferences
    )


    return {
        "success": updated
    }

# =====================================================
# COMPATIBILIDADE TEMPORÁRIA
# Alteração de senha
# =====================================================

def change_password_service(
    user_id,
    data
):

    from app.repositories.user_repository import update_password
    from app.services.security_service import SecurityService


    security_service = SecurityService()


    new_password = data.get("password")


    if not new_password:

        return {
            "status":400,
            "body":{
                "success":False,
                "message":"Password is required."
            }
        }


    password_hash = security_service.hash_password(
        new_password
    )


    updated = update_password(
        user_id,
        password_hash
    )


    if not updated:

        return {
            "status":400,
            "body":{
                "success":False,
                "message":"Password was not updated."
            }
        }


    return {
        "status":200,
        "body":{
            "success":True,
            "message":"Password updated successfully."
        }
    }