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
def teste():
    return {
        "message": "API Gamificação Cultivando o saber funcionando"
    }
from app.services.game_service import process_game_score 
from app.repositories.user_repository import (
    get_user_by_id,
    update_user,
    get_ranking,
    get_user_progress
)# ou mysql direto
from app.services.xp_service import add_xp
from app.services.badge_service import check_and_award_badges

# futuramente trocar por services

#===========================
# auth.py
#=========================
@routes.route('/register')
def register():
    return render_template('auth/register.html',
    perfil="publico")


@routes.route('/register', methods=['POST'])
def register_post():
    # TODO: criar usuário no banco
    return redirect('/login')


@routes.route('/login')
def login():
    return render_template('auth/login.html')

@routes.route('/login', methods=['POST'])
def login_post():
    # TODO: autenticar usuário
    return redirect('/dashboard')
'''
--melhoria para o futuro
@routes.route('/login', methods=['POST'])
def login_post():

    email = request.form.get('email')
    senha = request.form.get('senha')
    tipo_usuario = request.form.get('tipo_usuario')

    print(email, senha, tipo_usuario)

    return redirect('/dashboard')
'''
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
     return render_template("dashboard/dashboard-final.html",
                            perfil="estudante"
                            )## modelo quando tiver flask-login {% if current_user.tipo == 'estudante' %}

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
from app.repositories.quiz_repository import get_all_quizzes
from app.services.quiz_service import get_quiz_details
from app.services.quiz_service import submit_quiz as submit_quiz_service


# Página HTML
@routes.route("/quizzes")
def quizzes():

    return render_template(
        "quizzes/quiz-list.html",
        perfil="estudante"
    )


# API
@routes.route("/api/quizzes", methods=["GET"])
def list_quizzes():

    quizzes = get_all_quizzes()

    return jsonify(quizzes), 200

@routes.route("/api/quizzes/<int:quiz_id>", methods=["GET"])
def get_quiz(quiz_id):

    quiz = get_quiz_details(quiz_id)

    if quiz is None:
        return jsonify({
            "success": False,
            "message": "Quiz not found."
        }), 404

    return jsonify(quiz), 200


@routes.route("/quiz/<int:id>")
def start_quiz(id):
    return render_template("quizzes/quiz.html",perfil="estudante",id=id)

@routes.route('/quiz/submit', methods=['POST'])
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

@routes.route("/api/quizzes/<int:quiz_id>/submit", methods=["POST"])
def submit_quiz_route(quiz_id):

    data = request.get_json()

    result = submit_quiz_service(
        quiz_id=quiz_id,
        user_id=data["user_id"],
        answers=data["answers"]
    )

    if result is None:
        return jsonify({
            "success": False,
            "message": "Quiz not found."
        }), 404

    return jsonify(result), 200

    '''
    --TEMP: aqui depois vai virar service
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

'''
@routes.route("/quiz")
def quiz():
    return render_template("quizzes/quiz.html")


'''
adicionar no futuro
gestor // (area administrativa)
POST   /api/quizzes
PUT    /api/quizzes/<id>
DELETE /api/quizzes/<id>
GET /api/users/<int:user_id>/quiz-results- historico
'''
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
#===========================
# Ranking.py
#=========================
from app.services.ranking_service import get_ranking_data

@routes.route("/api/ranking")
def api_ranking():
    return jsonify(get_ranking_data())
'''
@routes.route('/ranking')
def ranking():
    return render_template('ranking.html')
    return jsonify(ranking_data)
'''

@routes.route("/ranking")
def ranking():
    return render_template("dashboard/ranking.html")


    
#===========================
# Progress
#===========================

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
#===========================
# classroom.py
#=========================
@routes.route('/classroom/join', methods=['POST'])
def join_classroom():
    return redirect('/dashboard',
    perfil="gestor")


@routes.route('/classroom/create', methods=['POST'])
def create_classroom():
    return redirect('/dashboard',
    perfil="gestor")

#===========================
# Admin.py
#=========================
@routes.route('/admin')
def admin_dashboard():
    return render_template('admin/dashboard.html',
    perifl="admin")

@routes.route('/admin/students')
def students():
    return render_template('admin/students.html',
    perfil="admin")

@routes.route('/admin/quiz/create', methods=['POST'])
def create_quiz():
    return redirect('/admin',
    perfil="admin")
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


#teste banco de dados conecta
@routes.route("/test-db")
def test_db():

    conn = get_connection()

    if conn.is_connected():
        return {"message": "Banco conectado"}

    return {"message": "Erro"}

##rotas html
@routes.route("/teacher-dashboard")
def teacher_dashboard():
    return render_template("classroom/teacher-dashboard.html",
    perfil="gestor")

@routes.route("/classroom")
def classroom():
    return render_template("classroom/classroom.html",
    perfil="gestor")

@routes.route("/relatorios")
def relatorios():
    return render_template("classroom/relatorios.html",
    perfil="gestor")

@routes.route("/metricas")
def metricas():
    return render_template("classroom/metricas.html",
    perfil="gestor")



@routes.route('/index')
def index():
    return render_template('index.html',
    perfil="publico")

@routes.route('/home')
def home():
    return render_template('home.html',
    perfil="publico")

@routes.route('/about-us')
def about_us():
    return render_template('about-us.html',
    perfil='publico')

@routes.route('/ods')
def ods():
    return render_template('ods.html',
    perfil='publico'
    )