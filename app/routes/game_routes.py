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
@routes.route('/games')
def games():
    return render_template("games/games.html")

@routes.route('/game/<int:id>')
def game(id):
    return render_template('game.html')

@routes.route('/about-games')
def about_games():
    return render_template("games/about-games.html",perfil="publico")
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



@routes.route('/games-index')
def games_index():
    return render_template(
        'games/game-index.html'
    )


@routes.route('/game-menu')
def game_menu():
    return render_template(
        'games/game-menu.html'
    )


@routes.route('/memoryGame')
def memory_game():
    return render_template(
        'games/memoryGame.html'
    )


@routes.route('/game1')
def game1():
    return render_template(
        'games/game1.html'
    )
