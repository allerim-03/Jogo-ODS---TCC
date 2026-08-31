
# Badge_routes.py

'''
/api/badges

/api/badges/user

/api/badges/claim
'''



#===========================================================================
#ROTAS DE BADGES
#===========================================================================

"""
===========================================================================
ROTAS DE BADGES

Responsabilidades:
- Receber requisições HTTP.
- Validar autenticação.
- Chamar BadgeService.
- Retornar respostas JSON.

A concessão das badges é feita automaticamente pelo BadgeService
quando o usuário atende aos requisitos.
===========================================================================
"""

from flask import Blueprint, jsonify, g

from app.middleware.auth_middleware import api_login_required
from app.services.badge_service import BadgeService


badge_bp = Blueprint(
    "badge",
    __name__
)

badge_service = BadgeService()


# ==========================================================================
# BADGES DO USUÁRIO LOGADO
# ==========================================================================

@badge_bp.route(
    "/api/users/me/badges",
    methods=["GET"]
)
@api_login_required
def user_badges():

    result = badge_service.get_user_badges(
        g.current_user.id
    )

    return jsonify(result), 200


# ==========================================================================
# TODAS AS BADGES DISPONÍVEIS
# ==========================================================================

@badge_bp.route(
    "/api/badges",
    methods=["GET"]
)
@api_login_required
def badges():

    result = badge_service.get_all_badges()

    return jsonify(result), 200

'''
# ==========================================================================
# Resgatar badge
# ==========================================================================

@badge_bp.route("/api/badges/claim", methods=["POST"])
@api_login_required
def claim_badge():

    result = badge_service.claim_badge()

    return jsonify(result)
'''