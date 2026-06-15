#temporario para todas as rotas
from flask import Blueprint, request, jsonify
from game_service import process_game_score
from user_repository import get_user, update_user  # ou mysql direto
from xp_service import add_xp
from badge_service import check_and_award_badges

# futuramente trocar por services

#===========================
# auth.py
#=========================
@routes.route('/register')
def register():
    return render_template('register.html')


@routes.route('/register', methods=['POST'])
def register_post():
    # TODO: criar usuário no banco
    return redirect('/login')


@routes.route('/login')
def login():
    return render_template('login.html')


@routes.route('/login', methods=['POST'])
def login_post():
    # TODO: autenticar usuário
    return redirect('/dashboard')


@routes.route('/logout')
def logout():
    # logout_user()
    return redirect('/login')


#===========================
# Dashboard.py
#=========================
@routes.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

#===========================
# quiz.py
#=========================
@routes.route('/quizzes')
def quizzes():
    return render_template('quizzes.html')


@routes.route('/quiz/<int:id>')
def start_quiz(id):
    return render_template('quiz.html')


@routes.route('/quiz/submit', methods=['POST'])
def submit_quiz():
    data = request.json

    user_id = data["user_id"]
    score = data["score"]

    xp_gained = score * 10

    # TEMP: aqui depois vai virar service
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
    })

#===========================
# games.py
#=========================
@routes.route('/games')
def games():
    return render_template('games.html')


@routes.route('/game/<int:id>')
def game(id):
    return render_template('game.html')


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
    })
#===========================
# Ranking.py
#=========================


@routes.route('/ranking')
def ranking():
    return render_template('ranking.html')


#===========================
# classroom.py
#=========================
@routes.route('/classroom/join', methods=['POST'])
def join_classroom():
    return redirect('/dashboard')


@routes.route('/classroom/create', methods=['POST'])
def create_classroom():
    return redirect('/dashboard')

#===========================
# Admin.py
#=========================
@routes.route('/admin')
def admin_dashboard():
    return render_template('admin/dashboard.html')


@routes.route('/admin/students')
def students():
    return render_template('admin/students.html')


@routes.route('/admin/quiz/create', methods=['POST'])
def create_quiz():
    return redirect('/admin')

#===========================
# User.py
#=========================
#rotas user.py
from flask import Blueprint, request, jsonify
from models.usuario import Usuario
from app import db

usuario_bp = Blueprint("usuario", __name__)

@usuario_bp.route("/usuarios", methods=["GET"])
def listar_usuarios():
    usuarios = Usuario.query.all()
    return jsonify([{"id": u.id, "nome": u.nome, "pontos": u.pontos} for u in usuarios])

@usuario_bp.route("/usuarios", methods=["POST"])
def criar_usuario():
    data = request.json
    novo_usuario = Usuario(nome=data["nome"], pontos=data.get("pontos", 0))
    db.session.add(novo_usuario)
    db.session.commit()
    return jsonify({"message": "Usuário criado com sucesso!"}), 201



#game.py
game_bp = Blueprint("game", __name__)

@game_bp.route("/game/score", methods=["POST"])
def game_score():
    data = request.json

    user_id = data["user_id"]
    score = data["score"]

    user = get_user(user_id)

    user, xp_gained = process_game_score(user, score)

    update_user(user)

    return jsonify({
        "message": "XP atualizado",
        "xp_gained": xp_gained,
        "user": {
            "id": user.id,
            "xp": user.xp,
            "level": user.level
        }
    })