from flask import Blueprint, request
from werkzeug.exceptions import BadRequest, Conflict, NotFound
from werkzeug.security import generate_password_hash
from app.models.database import get, save, all_rows
from app.services.security import require_user, public_user, own_class, text, validate_password
bp = Blueprint('users', __name__, url_prefix='/api/users')

@bp.patch('/me')
def profile():
    u = require_user()
    d = request.get_json()
    if u['role'] == 'professor':
        u['name'] = text(d, 'name', required=True)
        u['discipline'] = text(d, 'discipline')
    avatar = d.get('avatar', u['avatar'])
    if avatar not in ('tuga', 'peixe', 'gota', 'guri', 'planeta'):
        raise BadRequest('Avatar inválido.')
    u.update(avatar=avatar, avatarChosen=True)
    save('users', u)
    return public_user(u)

@bp.patch('/<user_id>')
def edit_student(user_id):
    teacher = require_user('professor')
    u = get('users', user_id)
    if not u or u['role'] != 'aluno':
        raise NotFound('Aluno não encontrado.')
    own_class(teacher, u['classId'])
    d = request.get_json()
    name = text(d, 'name', required=True)
    if len(name.split()) < 2:
        raise BadRequest('Informe nome e sobrenome.')
    if any(v['id'] != u['id'] and v['classId'] == u['classId'] and v['name'].casefold() == name.casefold() for v in all_rows('users')):
        raise Conflict('Nome já cadastrado nesta turma.')
    if d.get('password'):
        validate_password(d['password'], True)
        u['password_hash'] = generate_password_hash(d['password'])
    u['name'] = name
    save('users', u)
    return public_user(u)

@bp.post('/me/ods')
def ods():
    u = require_user('aluno')
    n = request.get_json().get('number')
    if type(n) is not int or not 1 <= n <= 17:
        raise BadRequest('ODS inválido.')
    u['odsRead'] = sorted(set(u['odsRead'] + [n]))
    save('users', u)
    return {'ok': True}
