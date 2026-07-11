#painel
#/api/dashboard

#/api/dashboard/stats

#/api/dashboard/student

#/api/dashboard/teacher


#===========================
# Dashboard.py
#=========================

@routes.route('/dashboard')
def dashboard():
     return render_template("dashboard/dashboard-final.html",
                            perfil="estudante"
                            )## modelo quando tiver flask-login {% if current_user.tipo == 'estudante' %}


@routes.route("/dashboard/student/profile")
def student_profile():

    # Temporário enquanto o login não está integrado
    user_id = 1
    #user_id = session["user_id"]
    return render_template(
        "dashboard/student-profile.html",
        perfil="estudante",
        user_id=user_id
    )