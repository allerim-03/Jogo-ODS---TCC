from flask import Flask, render_template, request, redirect, url_for

app = Flask(
    __name__,
    template_folder='TEMPLATES',
    static_folder='STATIC'
)


@app.route('/')
def inicio():
    return render_template('index.html')


@app.route('/ods')
def ods():
    return render_template('ods.html')


@app.route('/cadastro', methods=['GET', 'POST'])
def cadastro():
    if request.method == 'POST':
        usuario = request.form.get('usuario')
        email = request.form.get('email')
        senha = request.form.get('senha')
        
        # Lógica para salvar o aluno no MySQL futuramente...
        
        return redirect(url_for('inicio'))
        
    return render_template('cadastro.html')


@app.route('/cadastro-professor', methods=['GET', 'POST'])
def cadastro_professor():
    if request.method == 'POST':
        nome = request.form.get('name_user')
        genero = request.form.get('id_gender')
        nascimento = request.form.get('birth_user')
        matricula = request.form.get('registration_user')
        email_org = request.form.get('main_email')
        email_sec = request.form.get('personal_email')
        senha = request.form.get('password_user')
        
        # Lógica para salvar o professor no MySQL futuramente...
        
        return redirect(url_for('inicio'))
        
    return render_template('cadastro-professor.html')


@app.route('/classroom')
def classroom():
    return render_template('classroom.html')


@app.route('/create-classroom', methods=['GET', 'POST'])
def create_classroom():
    if request.method == 'POST':
        nome_turma = request.form.get('nome_turma')
        ano_letivo = request.form.get('ano_letivo')
        periodo_letivo = request.form.get('periodo_letivo')
        disciplina = request.form.get('disciplina_turma')
        descricao = request.form.get('descricao_turma')
        
        # Lógica para gerar o token e salvar a turma no MySQL futuramente...
        
        return redirect(url_for('classroom'))
        
    return render_template('create-classroom.html')


if __name__ == '__main__':
    app.run(debug=True)