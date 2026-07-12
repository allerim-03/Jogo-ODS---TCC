

"""
===========================================================================
CLASSROOM ROUTES

Responsável pelas APIs de salas de aula.

Todas as regras ficam em classroom_service.py
#classrooms
#join
#leave
#students
#teacher
===========================================================================
"""

from flask import Blueprint, request, jsonify

from app.middleware.auth_middleware import api_login_required
from app.services.classroom_service import (
    create_classroom_service,
    join_classroom_service,
    leave_classroom_service,
    get_teacher_classrooms_service,
    get_classroom_students_service
)

classroom_bp = Blueprint(
    "classroom",
    __name__
)
#criar turma
@classroom_bp.route(
    "/api/classrooms",
    methods=["POST"]
)
@api_login_required
def create_classroom():

    data = request.get_json()

    result = create_classroom_service(
        g.current_user,
        data
    )

    return jsonify(result["body"]), result["status"]

#entrar em uma turma
@classroom_bp.route(
    "/api/classrooms/join",
    methods=["POST"]
)
@api_login_required
def join_classroom():

    data = request.get_json()

    result = join_classroom_service(
        g.current_user,
        data
    )

    return jsonify(result["body"]), result["status"]

#sair da turma
@classroom_bp.route(
    "/api/classrooms/leave",
    methods=["POST"]
)
@api_login_required
def leave_classroom():

    result = leave_classroom_service(
        g.current_user
    )

    return jsonify(result["body"]), result["status"]

#professor listar turma
@classroom_bp.route(
    "/api/classrooms",
    methods=["GET"]
)
@api_login_required
def get_teacher_classrooms():

    result = get_teacher_classrooms_service(
        g.current_user
    )

    return jsonify(result), 200

#lista de alunos
@classroom_bp.route(
    "/api/classrooms/<int:classroom_id>/students",
    methods=["GET"]
)
@api_login_required
def classroom_students(classroom_id):

    result = get_classroom_students_service(
        classroom_id
    )

    return jsonify(result), 200
