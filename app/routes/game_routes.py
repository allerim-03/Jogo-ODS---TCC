#memory

#sorting

#future games

#score

#save progress

#===========================
# games.py
#=========================
'''
game_bp = Blueprint("game", __name__)
'''

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



