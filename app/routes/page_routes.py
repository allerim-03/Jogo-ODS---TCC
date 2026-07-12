#rederinzação do HTML

'''
/
/home
/login

/register

/dashboard

/profile

/games

/ranking

/about
'''

"""
==============================================================================
PAGE ROUTES

Responsável apenas por renderizar templates HTML.

Não contém regras de negócio.
Não acessa banco de dados.
Não retorna JSON.

As APIs ficam separadas em:

auth_routes.py
dashboard_routes.py
quiz_routes.py
game_routes.py
ranking_routes.py
user_routes.py
...

==============================================================================
"""

from flask import Blueprint, render_template, redirect
from app.middleware.page_middleware import page_login_required
from flask import g
from flask import session
page_bp = Blueprint("pages", __name__)
##rotas html
#==================
# Inicial
#====================
@page_bp.route('/home')
def home():
    return render_template('home.html',
   profile="public")

@page_bp.route('/index')
def index():
    return render_template('index.html',
   profile="public")# paginá de carregamento
#==================
# Públicas 
#====================

@page_bp.route('/about-us')
def about_us():
    return render_template('about-us.html',
     profile="public")

@page_bp.route('/ods')
def ods():
    return render_template('ods.html',
     profile="public"
    )
#===========================
# auth.py pages -> autenticação
#=========================
@page_bp.route('/register')
def register():
    return render_template('auth/register.html',profile="public")

@page_bp.route('/login')
def login():
    return render_template('auth/login.html', profile="public")
@page_bp.route('/logout')
def logout():
    # logout_user()
    # futuramente podemos limpar cookies/sessão
    return redirect('/login', profile="public")

#===========================
# Dashboard.py pages -> estudante profile
#=========================

@page_bp.route('/dashboard')
@page_login_required
def dashboard():
     return render_template("dashboard/student-dashboard.html",
                            profile=g.current_user["role"]
                            )## modelo quando tiver flask-login {% if current_user.tipo == 'estudante' %}


@page_bp.route("/dashboard/profile")
@page_login_required
def student_profile():

    # Temporário enquanto o login não está integrado - user_id = 1
    #user_id = session["user_id"]
    user_id = g.current_user["id"]
    return render_template(
        "dashboard/student-profile.html",
       profile=g.current_user["role"],
        user_id = g.current_user["id"]
    )

#===========================
# games.py pages
#=========================
'''
game_bp = Blueprint("game", __name__)
'''

@page_bp.route('/about-games')
def about_games():
    return render_template("games/about-games.html", profile="public")


@page_bp.route('/game/<int:id>')
@page_login_required
def game(id):
    return render_template('game.html')

@page_bp.route('/game1')#página temporaria de teste
@page_login_required
def game1():
    return render_template(
        'games/game1.html'
    )

@page_bp.route('/game/memory/menu')#menu inicial do jogo da memoria
@page_login_required
def game_menu():
    return render_template(
        'games/game-menu.html'
    )

@page_bp.route('/games') # pagina que redireciona do estudante para seus jogos favoritos
@page_login_required
def games():
    return render_template("games/games.html")

@page_bp.route('/games/index')#página com todos os cards dos games, central dos jogos
@page_login_required
def games_index():
    return render_template(
        'games/game-index.html'
    )


@page_bp.route('/games/memory')
@page_login_required
def memory_game():
    return render_template(
        'games/memory-game.html'
    )






# =========================================
# quiz
# =========================================
# Página HTML-quiz
@page_bp.route("/quizzes")
@page_login_required
def quizzes():

    return render_template(
        "quizzes/quiz-list.html",
        profile=g.current_user["role"]
    )
'''
@routes.route("/quiz")
def quiz():
    return render_template("quizzes/quiz.html")
'''
'''
@routes.route("/quiz/<int:quiz_id>")
def start_quiz(quiz_id):

    user_id = session.get("user_id", 1)#usando o usuario 1 para desenvolvimento.

    return render_template(
        "quizzes/quiz.html",
        quiz_id=quiz_id,
        user_id=user_id,
        perfil="estudante"
    )
'''
@page_bp.route("/quiz/<int:quiz_id>")
@page_login_required
def start_quiz(quiz_id):
    user_id = g.current_user["id"]
    return render_template(
        "quizzes/quiz.html",
        quiz_id=quiz_id,
        user_id=user_id,
        profile=g.current_user["role"]
    )


@page_bp.route("/quizzes/result")
@page_login_required
def quiz_result():

    return render_template(
        "quizzes/quiz-result.html",
        profile=g.current_user["role"]
    )

# ==========================
# PAINEL ADMIN - QUIZZES
# ==========================

@page_bp.route("/admin/quizzes")
@page_login_required
def quiz_admin():

    return render_template(
        "quizzes/quiz-admin.html",
        profile=g.current_user["role"]
    )
@page_bp.route("/admin/quizzes/<int:quiz_id>/questions")
@page_login_required
def question_admin(quiz_id):

    return render_template(
        "quizzes/quiz-question-admin.html",
        quiz_id=quiz_id,
       profile=g.current_user["role"]
    )

# ======================================
# ranking pages 
# ======================================

@page_bp.route("/ranking")
@page_login_required
def ranking():

    return render_template(
        "dashboard/ranking.html",
        profile=g.current_user["role"]
    )
#==================
# Teacher 
#====================

@page_bp.route("/teacher/dashboard")
@page_login_required
def teacher_dashboard():
    return render_template("classroom/teacher-dashboard.html",
    profile=g.current_user["role"])

@page_bp.route("/teacher/classroom")
@page_login_required
def classroom():
    return render_template("classroom/classroom.html",
   profile=g.current_user["role"])

@page_bp.route("/teacher/classroom/reports")
@page_login_required
def relatorios():
    return render_template("classroom/reports.html",
  profile=g.current_user["role"])

@page_bp.route("/teacher/classroom/analytics")
@page_login_required
def metricas():
    return render_template("classroom/analytics.html",
    profile=g.current_user["role"])
# ======================================
# admin pages 
# ======================================

@page_bp.route('/admin')
def admin_dashboard():
    return render_template('admin/dashboard.html',
    profile=g.current_user["role"])

@page_bp.route('/admin/students')
def students():
    return render_template('admin/students.html',
    profile=g.current_user["role"])
# ======================================
#outras pages 
# ======================================