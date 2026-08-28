

#===========================
# User.py
#=========================

#rotas user.py
#GET profile
#PUT profile
#avatar
#preferences
#password

"""
===========================================================================
USER ROUTES

Responsável pelas APIs do usuário.

Toda regra de negócio fica em user_service.py
===========================================================================
"""

from flask import Blueprint, request, jsonify, g

from app.middleware.auth_middleware import api_login_required

from app.services.user_service import UserService


user_bp = Blueprint(
    "user",
    __name__
)


user_service = UserService()


# ==========================================================================
# PERFIL
# ==========================================================================

@user_bp.route(
    "/api/users/me",
    methods=["GET"]
)
@api_login_required
def profile():

    result = user_service.get_profile(
        g.current_user
    )

    return jsonify(result["body"]), result["status"]


# ==========================================================================
# ATUALIZAR PERFIL
# ==========================================================================

@user_bp.route(
    "/api/users/me",
    methods=["PUT"]
)
@api_login_required
def update_profile():

    data = request.get_json() or {}

    result = user_service.update_profile(
        g.current_user,
        data
    )

    return jsonify(result["body"]), result["status"]


# ==========================================================================
# ATUALIZAR AVATAR
# ==========================================================================

@user_bp.route(
    "/api/users/me/avatar",
    methods=["PUT"]
)
@api_login_required
def update_avatar():

    data = request.get_json() or {}

    result = user_service.update_avatar(
        g.current_user,
        data
    )

    return jsonify(result["body"]), result["status"]


# ==========================================================================
# ATUALIZAR PREFERÊNCIAS
# ==========================================================================

@user_bp.route(
    "/api/users/me/preferences",
    methods=["PUT"]
)
@api_login_required
def update_preferences():

    data = request.get_json() or {}

    result = user_service.update_preferences(
        g.current_user,
        data
    )

    return jsonify(result["body"]), result["status"]


# ==========================================================================
# ALTERAR SENHA
# ==========================================================================

@user_bp.route(
    "/api/users/me/password",
    methods=["PUT"]
)
@api_login_required
def change_password():

    data = request.get_json() or {}

    result = user_service.change_password(
        g.current_user,
        data
    )

    return jsonify(result["body"]), result["status"]



'''


@usuario_bp.route("/usuarios", methods=["GET"])
def listar_usuarios():
    usuarios = Usuario.query.all()
    return jsonify([{"id": u.id, "nome": u.nome, "pontos": u.pontos} for u in usuarios])

@usuario_bp.route("/usuarios", methods=["POST"])
def criar_usuario():
    data = request.json
    novo_usuario = Usuario(nome=data["nome"], pontos=data.get("pontos", 0))
    db.session.add(novo_usuario)
    db.session.commit()
    return jsonify({"message": "Usuário criado com sucesso!"}), 201
'''