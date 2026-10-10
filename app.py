from flask import Flask, render_template


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


@app.route('/cadastro') # URL - Acessar pelo navegador
def cadastro():
    return render_template('cadastro.html') # Arquivo que vai acessar com base na URL


if __name__ == '__main__':
    app.run(debug=True)