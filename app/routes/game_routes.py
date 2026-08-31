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
- Chamar GameService/ScoreRepository.
- Retornar respostas JSON.

Toda regra de negócio pertence aos Services.
===========================================================================
"""

from flask import Blueprint, jsonify, request, g

from app.middleware.auth_middleware import api_login_required
from app.services.game_service import GameService
from app.repositories.score_repository import ScoreRepository


game_bp = Blueprint(
    "game",
    __name__
)

game_service = GameService()
score_repository = ScoreRepository()


# ==========================================================================
# REGISTRAR PONTUAÇÃO DE UM JOGO
# ==========================================================================

@game_bp.route(
    "/api/games/score",
    methods=["POST"]
)
@api_login_required
def game_score():

    data = request.get_json() or {}

    # ----------------------------------------------------------------------
    # Validação dos dados
    # ----------------------------------------------------------------------

    game_id = data.get("game_id")
    score = data.get("score")

    if game_id is None:

        return jsonify({
            "success": False,
            "message": "Game ID is required."
        }), 400

    if score is None:

        return jsonify({
            "success": False,
            "message": "Score is required."
        }), 400

    # ----------------------------------------------------------------------
    # Processamento
    # ----------------------------------------------------------------------

    result = game_service.process_game_score(

        user_id=g.current_user.id,

        game_id=game_id,

        score=score
    )

    # ----------------------------------------------------------------------
    # Resposta
    # ----------------------------------------------------------------------

    return jsonify(
        result["body"]
    ), result["status"]


# ==========================================================================
# HISTÓRICO DE JOGOS
# ==========================================================================

@game_bp.route(
    "/api/users/me/games/history",
    methods=["GET"]
)
@api_login_required
def game_history():

    history = score_repository.get_user_game_history(
        g.current_user.id
    )

    return jsonify({
        "success": True,
        "history": history
    }), 200


# ==========================================================================
# JOGOS RECENTES
# ==========================================================================

@game_bp.route(
    "/api/users/me/games/recent",
    methods=["GET"]
)
@api_login_required
def recent_games():

    games = score_repository.get_recent_games(
        g.current_user.id
    )

    return jsonify({
        "success": True,
        "games": games
    }), 200


# ==========================================================================
# ESTATÍSTICAS DOS JOGOS
# ==========================================================================

@game_bp.route(
    "/api/users/me/games/statistics",
    methods=["GET"]
)
@api_login_required
def game_statistics():

    statistics = score_repository.get_user_game_statistics(
        g.current_user.id
    )

    return jsonify({
        "success": True,
        "statistics": statistics
    }), 200


'''
from flask import Blueprint, jsonify, request, g

from app.middleware.auth_middleware import api_login_required
from app.services.game_service import GameService


game_bp = Blueprint("game", __name__)

game_service = GameService()

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
'''