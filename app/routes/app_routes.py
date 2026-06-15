#temporario para todas as rotas


from flask import (
    Blueprint,
    request,
    jsonify,
    render_template,
    redirect
)
routes = Blueprint(
    "routes",
    __name__
)
@routes.route("/")
def home():
    return {
        "message": "API Gamificação Cultivando o saber funcionando"
    }
from app.services.game_service import process_game_score 
from app.repositories.user_repository import (
    get_user_by_id,
    update_user,
    get_ranking
)# ou mysql direto
from app.services.xp_service import add_xp
from app.services.badge_service import check_and_award_badges

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
# Badge.py
#=========================
from app.repositories.badge_repository import get_user_badges
@routes.route("/user/<int:user_id>/badges")
def user_badges(user_id):

    badges = get_user_badges(user_id)

    return jsonify(badges)

#rota para testes 
@routes.route("/test-badges/<int:user_id>")
def test_badges(user_id):

    user = get_user_by_id(user_id)

    check_and_award_badges(
        user["id"],
        user["xp"],
        user["level"]
    )

    return jsonify({
        "message": "Badges verificadas"
    })


#===========================
# Dashboard.py
#=========================

@routes.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

'''
rota para testes 
@routes.route("/dashboard")
def dashboard():
    return {
        "message": "dashboard ok"
    }
    '''
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

'''
@routes.route('/ranking')
def ranking():
    return render_template('ranking.html')
'''

@routes.route("/ranking")
def ranking():

    ranking_data = get_ranking()

    return jsonify(ranking_data)

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
'''
from flask import Blueprint, request, jsonify


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
'''
#===========================
# Game.py
#=========================

#game.py
game_bp = Blueprint("game", __name__)

@game_bp.route("/game/score", methods=["POST"])
def game_score():
    data = request.json

    user_id = data["user_id"]
    score = data["score"]

    user =get_user_by_id()(user_id)

    user, xp_gained = process_game_score(user, score)

    update_user(user)

    
    return jsonify({
    "message": "XP atualizado",
    "xp_gained": xp_gained,
    "user": {
        "id": user["id"],
        "xp": user["xp"],
        "level": user["level"]
    }
    })

#teste banco de dados conecta
@routes.route("/test-db")
def test_db():

    conn = get_connection()

    if conn.is_connected():
        return {"message": "Banco conectado"}

    return {"message": "Erro"}