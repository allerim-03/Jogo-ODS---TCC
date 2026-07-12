#painel
#/api/dashboard

#/api/dashboard/stats

#/api/dashboard/student

#/api/dashboard/teacher

"""
===========================================================================
DASHBOARD ROUTES

Responsável pelas APIs do Dashboard.

As regras de negócio ficam em dashboard_service.py
===========================================================================
"""

from flask import Blueprint, jsonify, g

from app.middleware.auth_middleware import api_login_required

from app.services.dashboard_service import (
    get_dashboard_service,
    get_dashboard_stats_service,
    get_student_dashboard_service,
    get_teacher_dashboard_service
)

dashboard_bp = Blueprint(
    "dashboard",
    __name__
)

#geral
@dashboard_bp.route(
    "/api/dashboard",
    methods=["GET"]
)
@api_login_required
def dashboard():

    result = get_dashboard_service(
        g.current_user
    )

    return jsonify(result), 200

#estatisticas
@dashboard_bp.route(
    "/api/dashboard/stats",
    methods=["GET"]
)
@api_login_required
def dashboard_stats():

    result = get_dashboard_stats_service(
        g.current_user
    )

    return jsonify(result), 200

#dashboard do aluno
@dashboard_bp.route(
    "/api/dashboard/student",
    methods=["GET"]
)
@api_login_required
def student_dashboard():

    result = get_student_dashboard_service(
        g.current_user
    )

    return jsonify(result), 200

#dashboard gestor
@dashboard_bp.route(
    "/api/dashboard/teacher",
    methods=["GET"]
)
@api_login_required
def teacher_dashboard():

    result = get_teacher_dashboard_service(
        g.current_user
    )

    return jsonify(result), 200