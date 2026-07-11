#classrooms

#join

#leave

#students

#teacher

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
