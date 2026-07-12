#parte para a etapa de desenvolvimento
#rota para testes
'''
/ping

/test

/debug

/reset-db

/mock
'''

"""
===========================================================================
ROTAS DE DESENVOLVIMENTO

Utilizadas apenas durante o desenvolvimento.

Exemplos:
- Teste de conexão
- Teste de banco
- Reset
- Mock
- Ping

Estas rotas NÃO devem existir em produção.
===========================================================================
"""

from flask import Blueprint, jsonify

from database.connection import get_connection

from app.repositories.user_repository import UserRepository
from app.services.badge_service import check_and_award_badges

dev_bp = Blueprint("dev", __name__)

user_repository = UserRepository()

# ==========================================================================
# Ping
# ==========================================================================

@dev_bp.route("/api/dev/ping")
def ping():

    return jsonify({
        "success": True,
        "message": "pong"
    }), 200
# ==========================================================================
# Database
# ==========================================================================
#teste banco de dados conecta
@dev_bp.route("/api/dev/test-db")
def test_db():

    conn = get_connection()

    if conn.is_connected():

        return jsonify({
            "success": True,
            "message": "Database conectado."
        }), 200

    return jsonify({
        "success": False,
        "message": "Database unavailable."
    }), 500
# ==========================================================================
# Dashboard
# ==========================================================================

@dev_bp.route("/api/dev/test-dashboard")
def test_dashboard():

    return jsonify({
        "success": True,
        "message": "Dashboard OK."
    }), 200
# ==========================================================================
# Badges
# ==========================================================================

@dev_bp.route("/api/dev/test-badges/<int:user_id>")
def test_badges(user_id):

    user = user_repository.get_by_id(user_id)

    if user is None:

        return jsonify({
            "success": False,
            "message": "User not found."
        }), 404

    check_and_award_badges(
        user["id"],
        user["xp"],
        user["level"]
    )

    return jsonify({
        "success": True,
        "message": "Badges verified."
    }), 200
# ==========================================================================
# Mock
# ==========================================================================

@dev_bp.route("/api/dev/mock")
def mock():

    return jsonify({
        "message": "Not implemented."
    }), 501


# ==========================================================================
# Reset Database
# ==========================================================================

@dev_bp.route("/api/dev/reset-db", methods=["POST"])
def reset_database():

    return jsonify({
        "message": "Not implemented."
    }), 501


# ==========================================================================
# Debug
# ==========================================================================

@dev_bp.route("/api/dev/debug")
def debug():

    return jsonify({
        "message": "Not implemented."
    }), 501