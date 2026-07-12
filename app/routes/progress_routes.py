#xp

#level

#progress

#history

#statistics


#===========================================================================
#ROTAS DE PROGRESSO
#===========================================================================


from flask import Blueprint, jsonify

from app.middleware.auth_middleware import api_login_required
from app.services.game_service import process_game_score


progress_bp = Blueprint("progress", __name__)




# ==========================================================================
# Progresso do usuário
# ==========================================================================

@progress_bp.route("/api/users/<int:user_id>/progress", methods=["GET"])
@api_login_required
def user_progress(user_id):

    result =process_game_score(user_id)

    return jsonify(result)

'''
@routes.route(
    "/user/<int:user_id>/progress",
    methods=["GET"]
)
def user_progress(user_id):

    user = get_user_progress(user_id)

    if not user:
        return jsonify({
            "message": "Usuário não encontrado"
        }), 404

    return jsonify(user)
'''

# ==========================
# PAINEL ADMIN - QUIZZES
# ==========================

@progress_bp.route('/quiz/submit', methods=['POST'])
@api_login_required
def submit_game_quiz():
    data = request.json

    user_id = data["user_id"]
    score = data["score"]

    xp_gained = score * 10
   

    user, xp_gained = process_game_score(
        user_id,
        score
    )

    return jsonify({
        "message": "Quiz finalizado",
        "xp_gained": xp_gained,
        "xp": user["xp"],
        "level": user["level"]
    })