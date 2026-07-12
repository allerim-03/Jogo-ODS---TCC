from app.routes.auth_routes import auth_bp
from app.routes.page_routes import page_bp
from app.routes.dashboard_routes import dashboard_bp
from app.routes.quiz_routes import quiz_bp
from app.routes.game_routes import game_bp
from app.routes.ranking_routes import ranking_bp
from app.routes.progress_routes import progress_bp
from app.routes.classroom_routes import classroom_bp
from app.routes.admin_routes import admin_bp
from app.routes.user_routes import user_bp
from app.routes.badge_routes import badge_bp
from app.routes.dev_routes import dev_bp

def register_routes(app):
    app.register_blueprint(auth_bp)
    app.register_blueprint(page_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(quiz_bp)
    app.register_blueprint(game_bp)
    app.register_blueprint(ranking_bp)
    app.register_blueprint(progress_bp)
    app.register_blueprint(classroom_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(badge_bp)
    app.register_blueprint(dev_bp)