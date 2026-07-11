##somente administração

#create school

#delete school

#manage users

#manage quizzes

#reports

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