#inicialização do app
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import config

app = Flask(__name__)
app.config.from_object(config)

db = SQLAlchemy(app)

# Importar rotas
from routes.usuario_routes import usuario_bp
app.register_blueprint(usuario_bp)

if __name__ == "__main__":
    app.run(debug=True)