from flask import Flask, render_template


app = Flask(
    __name__,
    template_folder='TEMPLATES',
    static_folder='STATIC'
)


@app.route('/')
def inicio():
    return render_template('index.html')


@app.route('/cadastro')
def cadastro():
    return render_template('cadastro.html')


if __name__ == '__main__':
    app.run(debug=True)