import json
from werkzeug.exceptions import NotFound
from flask import Blueprint, current_app, send_from_directory, redirect, request
bp = Blueprint('web', __name__)

@bp.get('/config.js')
def config():
    # A URL relativa acompanha automaticamente host e porta do servidor Python.
    return 'window.EcoConfig = Object.freeze({apiBase: "/api"});', 200, {'Content-Type': 'text/javascript; charset=utf-8', 'Cache-Control': 'no-store'}

@bp.get('/', defaults={'path': ''})
@bp.get('/<path:path>')
def page(path):
    if path.startswith('api/'):
        raise NotFound('Rota da API não encontrada.')
    root = current_app.config['FRONTEND_DIR']
    routes = json.loads((root / 'routes/pages.json').read_text(encoding='utf-8'))
    if path.endswith('/'):
        return redirect('/' + path.rstrip('/'))
    if path in routes:
        target = '/' if path == 'index.html' else routes[path]['url']
        return redirect(target + ('?' + request.query_string.decode() if request.query_string else ''))
    item = next((r for r in routes.values() if r['url'] == '/' + path), None)
    if item:
        return send_from_directory(root, item['file'])
    if path.startswith(('assets/', 'games/', 'pages/', 'routes/')):
        return send_from_directory(root, path)
    return send_from_directory(root, 'pages/public/not-found.html'), 404
