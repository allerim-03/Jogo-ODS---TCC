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