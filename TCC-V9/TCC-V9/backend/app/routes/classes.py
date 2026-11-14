import secrets
from flask import Blueprint, request
from werkzeug.exceptions import BadRequest
from app.models.database import all_rows, save
from app.services.security import require_user, own_class, text
from .auth import new_id, now, code_class
bp = Blueprint('classes', __name__, url_prefix='/api/classes')

def new_code():
    used = {c['token'] for c in all_rows('classes')}
    free = list(set(map(str, range(1000, 10000))) - used)
    if not free:
        raise BadRequest('Não há códigos disponíveis.')
    return secrets.choice(free)

@bp.get('/validate/<code>')
def validate(code):
    c = code_class(code)
    return {'id': c['id'], 'name': c['name']}

@bp.post('')
def create():
    u = require_user('professor')
    d = request.get_json()
    c = dict(id=new_id(), teacherId=u['id'], token=new_code(), createdAt=now())
    for key in ('name', 'year', 'period', 'discipline', 'description'):
        c[key] = text(d, key, 2000 if key == 'description' else 200, key in ('name', 'year', 'period'))
    save('classes', c)
    return c, 201

@bp.post('/<class_id>/rotate-code')
def rotate(class_id):
    c = own_class(require_user('professor'), class_id)
    c['token'] = new_code()
    save('classes', c)
    return {'token': c['token']}

@bp.post('/join')
def join():
    u = require_user('aluno')
    c = code_class(request.get_json().get('code'))
    if u['classId'] and u['classId'] != c['id']:
        raise BadRequest('Sua conta já está vinculada a uma turma.')
    u['classId'] = c['id']
    save('users', u)
    return c
