from flask import Flask
from config import Config
from app.routes.app_routes import*
'''from app.routes.auth import auth_bp'''
'''from app.routes.dashboard import dashboard_bp'''
'''from app.routes.quiz import quiz_bp'''
'''from app.routes.game import game_bp'''
'''from app.routes.ranking import ranking_bp'''
def create_app():
    app = Flask(__name__)

    from app.routes.auth import auth_bp
    from app.routes.users import users_bp
    from app.routes.games import games_bp
    from app.routes.ranking import ranking_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(users_bp)
    app.register_blueprint(games_bp)
    app.register_blueprint(ranking_bp)

    return app




def create_app():

    app = Flask(__name__)
    app.config.from_object(Config)

    app.register_blueprint(auth_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(quiz_bp)
    app.register_blueprint(game_bp)
    app.register_blueprint(ranking_bp)

    return app