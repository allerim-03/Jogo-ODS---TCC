"""Fábrica Flask: API, autenticação, transações e frontend na mesma origem."""
import secrets
from pathlib import Path
from flask import Flask, request, session, jsonify
from werkzeug.exceptions import HTTPException, BadRequest, Forbidden
from config import Config
from .models.database import connection, init_db, close_db

def create_app(test_config=None):
    app = Flask(__name__, static_folder=None)
    app.config.from_object(Config)
    if test_config:
        app.config.update(test_config)
    if not app.config['SECRET_KEY']:
        key_path = Path(app.config['DATABASE']).parent / '.secret_key'
        key_path.parent.mkdir(parents=True, exist_ok=True)
        if not key_path.exists():
            try:
                with key_path.open('x') as file:
                    file.write(secrets.token_hex(32))
                key_path.chmod(0o600)
            except FileExistsError:
                pass
        app.config['SECRET_KEY'] = key_path.read_text().strip()
    app.teardown_appcontext(close_db)
    with app.app_context():
        init_db()
    from .routes import auth, classes, users, tasks, games, api, web
    for module in (auth, classes, users, tasks, games, api, web):
        app.register_blueprint(module.bp)

    @app.before_request
    def begin():
        if request.path.startswith('/api/') and request.method in ('POST', 'PATCH', 'PUT', 'DELETE'):
            if not session.get('csrf') or not secrets.compare_digest(request.headers.get('X-CSRF-Token', ''), session['csrf']):
                raise Forbidden('Sessão expirada. Atualize a página e tente novamente.')
            data = request.get_json(silent=True)
            if not isinstance(data, dict):
                raise BadRequest('Envie um objeto JSON válido.')
            connection().execute('BEGIN IMMEDIATE')

    @app.after_request
    def finish(response):
        from flask import g
        if 'db' in g:
            g.db.commit() if response.status_code < 400 else g.db.rollback()
        response.headers['X-Content-Type-Options'] = 'nosniff'
        if request.path.startswith('/api/'):
            response.headers['Cache-Control'] = 'no-store'
        return response

    @app.errorhandler(HTTPException)
    def http_error(error):
        if request.path.startswith('/api/'):
            return jsonify(error=error.description), error.code
        return error

    @app.errorhandler(Exception)
    def unexpected(error):
        app.logger.exception('Falha ao processar solicitação')
        return jsonify(error='Não foi possível concluir a operação. Tente novamente.'), 500
    return app
