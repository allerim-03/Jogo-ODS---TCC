#
#------------------------- 
#somente administração
#----------------------------

#create school
#delete school
#manage users
#manage quizzes
#reports

#===================
# importes

#===========================
# Admin_routes.py
#=========================



"""
===========================================================================
ADMIN ROUTES

Responsável pelas APIs administrativas.

Somente administradores podem acessar.

Toda regra de negócio fica em admin_service.py
===========================================================================
"""

from flask import Blueprint, request, jsonify

from app.middleware.auth_middleware import api_login_required
from app.middleware.role_middleware import admin_required

from app.services.admin_service import (
    create_school_service,
    delete_school_service,
    list_users_service,
    update_user_service,
    delete_user_service,
    create_quiz_service,
    delete_quiz_service,
    reports_service
)

admin_bp = Blueprint(
    "admin",
    __name__
)
#criar escola // instituição
@admin_bp.route(
    "/api/admin/schools",
    methods=["POST"]
)
@api_login_required
@admin_required
def create_school():

    data = request.get_json()

    result = create_school_service(data)

    return jsonify(result["body"]), result["status"]
#excluir escola
@admin_bp.route(
    "/api/admin/schools/<int:school_id>",
    methods=["DELETE"]
)
@api_login_required
@admin_required
def delete_school(school_id):

    result = delete_school_service(school_id)

    return jsonify(result["body"]), result["status"]

    #===
    #usuarios
    #====

    #listar usuarios
    @admin_bp.route(
    "/api/admin/users",
    methods=["GET"]
)
    
@api_login_required
@admin_required
def users():

    result = list_users_service()

    return jsonify(result), 200
#atualizar
@admin_bp.route(
    "/api/admin/users/<int:user_id>",
    methods=["PUT"]
)
@api_login_required
@admin_required
def update_user(user_id):

    data = request.get_json()

    result = update_user_service(
        user_id,
        data
    )

    return jsonify(result["body"]), result["status"]
#excluir
@admin_bp.route(
    "/api/admin/users/<int:user_id>",
    methods=["DELETE"]
)
@api_login_required
@admin_required
def delete_user(user_id):

    result = delete_user_service(user_id)

    return jsonify(result["body"]), result["status"]
#
#quizzes
#
#criar
@admin_bp.route(
    "/api/admin/quizzes",
    methods=["POST"]
)
@api_login_required
@admin_required
def create_quiz():

    data = request.get_json()

    result = create_quiz_service(data)

    return jsonify(result["body"]), result["status"]
#excluir
@admin_bp.route(
    "/api/admin/quizzes/<int:quiz_id>",
    methods=["DELETE"]
)
@api_login_required
@admin_required
def delete_quiz(quiz_id):

    result = delete_quiz_service(quiz_id)

    return jsonify(result["body"]), result["status"]
#relatorios
@admin_bp.route(
    "/api/admin/reports",
    methods=["GET"]
)
@api_login_required
@admin_required
def reports():

    result = reports_service()

    return jsonify(result), 200

'''
(futuro modulo de admin)
admin_routes.py
        │
        ▼
admin_service.py
        │
        ├── school_repository.py
        ├── user_repository.py
        ├── quiz_repository.py
        └── report_repository.py
'''