#inicialização do app
'''
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import config
from flask import Flask
from app.config import settings
from app.routes.app_routes import*
app = Flask(__name__)
app.config.from_object(config)

db = SQLAlchemy(app)

# Importar rotas
from routes.usuario_routes import usuario_bp
app.register_blueprint(usuario_bp)

if __name__ == "__main__":
    app.run(debug=True)
'''
from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
jwt = JWTManager()

def create_app():
    app = Flask(__name__,
                template_folder="../frontend/templates",
        static_folder="../frontend/static"
                
                )
    #CORS(app) temporario durante o desenvolvimento por conta do live server
    CORS(
    app,
    resources={
        r"/api/*": {
            "origins": [
                "http://127.0.0.1:5500",
                "http://localhost:5500"
            ]
        }
    }
)



    # JWT Configuration
    app.config["JWT_SECRET_KEY"] = "chave-temporaria-dev"
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = False


    jwt.init_app(app)
    from app.routes import register_routes

    register_routes(app)
   
    return app


'''from app.routes.auth import auth_bp'''
'''from app.routes.dashboard import dashboard_bp'''
'''from app.routes.quiz import quiz_bp'''
'''from app.routes.game import game_bp'''
'''from app.routes.ranking import ranking_bp'''
'''
    from routes.auth import auth_bp--feito
    from routes.users import users_bp
    from routes.games import games_bp
    from routes.ranking import ranking_bp

    app.register_blueprint(auth_bp)--feito
    app.register_blueprint(users_bp)
    app.register_blueprint(games_bp)
    app.register_blueprint(ranking_bp)

    return app
 # IMPORT DO SEU BLUEPRINT ÚNICO TEMPORÁRIO
    from app.routes.app_routes import routes
    from app.routes.auth_routes import auth_bp
    
    app.register_blueprint(routes)
    app.register_blueprint(auth_bp)




    app.config.from_object(Config)

    app.register_blueprint(auth_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(quiz_bp)
    app.register_blueprint(game_bp)
    app.register_blueprint(ranking_bp)

    return app
    '''