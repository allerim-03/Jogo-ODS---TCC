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


##rotas html


#==================
# Públicas 
#====================

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
#===========================
# auth.py pages
#=========================
@routes.route('/register')
def register():
    return render_template('auth/register.html',profile="public")

@routes.route('/login')
def login():
    return render_template('auth/login.html')
@routes.route('/logout')
def logout():
    # logout_user()
    # futuramente podemos limpar cookies/sessão
    return redirect('/login')

#===========================
# Dashboard.py pages
#=========================

@routes.route('/dashboard')
@login_required
def dashboard():
     return render_template("dashboard/dashboard-final.html",
                            perfil="estudante"
                            )## modelo quando tiver flask-login {% if current_user.tipo == 'estudante' %}


@routes.route("/dashboard/student/profile")
@login_required
def student_profile():

    # Temporário enquanto o login não está integrado
    user_id = 1
    #user_id = session["user_id"]
    return render_template(
        "dashboard/student-profile.html",
        perfil="estudante",
        user_id=user_id
    )


#==================
# Teacher 
#====================

@routes.route("/teacher-dashboard")
@login_required
def teacher_dashboard():
    return render_template("classroom/teacher-dashboard.html",
    perfil="gestor")

@routes.route("/classroom")
@login_required
def classroom():
    return render_template("classroom/classroom.html",
    perfil="gestor")

@routes.route("/relatorios")
@login_required
def relatorios():
    return render_template("classroom/relatorios.html",
    perfil="gestor")

@routes.route("/metricas")
@login_required
def metricas():
    return render_template("classroom/metricas.html",
    perfil="gestor")
#===========================
# games.py pages
#=========================
'''
game_bp = Blueprint("game", __name__)
'''

@routes.route('/about-games')
def about_games():
    return render_template("games/about-games.html",perfil="publico")


@routes.route('/game/<int:id>')
@login_required
def game(id):
    return render_template('game.html')

@routes.route('/game1')
@login_required
def game1():
    return render_template(
        'games/game1.html'
    )

@routes.route('/game-menu')
@login_required
def game_menu():
    return render_template(
        'games/game-menu.html'
    )

@routes.route('/games')
@login_required
def games():
    return render_template("games/games.html")

@routes.route('/games-index')
@login_required
def games_index():
    return render_template(
        'games/game-index.html'
    )


@routes.route('/memory-game')
@login_required
def memory_game():
    return render_template(
        'games/memory-game.html'
    )






# =========================================
# quiz
# =========================================
# Página HTML-quiz
@routes.route("/quizzes")
@login_required
def quizzes():

    return render_template(
        "quizzes/quiz-list.html",
        perfil="estudante"
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
@routes.route("/quiz/<int:quiz_id>")
@login_required
def start_quiz(quiz_id):

    user_id = session.get("user_id", 1)

    return render_template(
        "quizzes/quiz.html",
        quiz_id=quiz_id,
        user_id=user_id,
        perfil="estudante"
    )


@routes.route("/quiz/result")
@login_required
def quiz_result():

    return render_template(
        "quizzes/quiz-result.html",
        perfil="estudante"
    )

# ======================================
# ranking pages 
# ======================================
@routes.route('/ranking')
@login_required
def ranking():
    return render_template('ranking.html')
    return jsonify(ranking_data)

@routes.route("/ranking")
@login_required
def ranking():
    return render_template("dashboard/ranking.html")