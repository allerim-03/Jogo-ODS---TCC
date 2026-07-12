#memory

#sorting

#future games

#score

#save progress

"""
===========================================================================
ROTAS DOS JOGOS

Responsabilidades:
- Receber requisições HTTP.
- Validar autenticação.
- Chamar GameService.
- Retornar respostas JSON.

Toda regra de negócio pertence ao GameService.
===========================================================================
"""

from flask import Blueprint, jsonify, request, g

from app.middleware.auth_middleware import api_login_required
from app.services.game_service import GameService


game_bp = Blueprint("game", __name__)

game_service = GameService()
'''
@routes.route('/game/score', methods=['POST'])
def save_score():
    data = request.json

    user_id = data["user_id"]
    score = data["score"]

    xp_gained = score * 10

    user = type("User", (), {
        "id": user_id,
        "xp": 0,
        "level": 1
    })()

    user = add_xp(user, xp_gained)

    check_and_award_badges(user.id, user.xp, user.level)

    return jsonify({
        "success": True,
        "xp_gained": xp_gained,
        "user": {
            "xp": user.xp,
            "level": user.level
        }
    })@game_bp.route("/game/score", methods=["POST"])
    '''
'''

@routes.route("/game/score", methods=["POST"])
def game_score():
    data = request.json

    user_id = data["user_id"]
    score = data["score"]

    

    user, xp_gained, xp_before = process_game_score(
    user_id,
    score
    )

    return jsonify({
    "message": "XP atualizado",
    "xp_before": xp_before,
    "xp_gained": xp_gained,
    "xp_after": user["xp"],
    "level": user["level"]
    })
'''
@game_bp.route("/api/games/score", methods=["POST"])
@api_login_required
def game_score():

    data = request.get_json() or {}

    result = game_service.process_score(
        user_id=g.current_user["id"],
        score=data["score"]
    )

    return jsonify(result["body"]), result["status"]
#POST /api/games/<game_slug>/score
