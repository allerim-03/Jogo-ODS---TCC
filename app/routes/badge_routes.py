
# Badge_routes.py

'''
/api/badges

/api/badges/user

/api/badges/claim
'''



#===========================================================================
#ROTAS DE BADGES
#===========================================================================


from flask import Blueprint, jsonify

from app.middleware.auth_middleware import api_login_required
from app.services.badge_service import BadgeService


badge_bp = Blueprint("badge", __name__)

badge_service = BadgeService()


# ==========================================================================
# Badges do usuário
# ==========================================================================

@badge_bp.route("/api/users/<int:user_id>/badges", methods=["GET"])
@api_login_required
def user_badges(user_id):

    result = badge_service.get_user_badges(user_id)

    return jsonify(result)


# ==========================================================================
# Todas as badges
# ==========================================================================

@badge_bp.route("/api/badges", methods=["GET"])
@api_login_required
def badges():

    result = badge_service.get_all_badges()

    return jsonify(result)


# ==========================================================================
# Resgatar badge
# ==========================================================================

@badge_bp.route("/api/badges/claim", methods=["POST"])
@api_login_required
def claim_badge():

    result = badge_service.claim_badge()

    return jsonify(result)