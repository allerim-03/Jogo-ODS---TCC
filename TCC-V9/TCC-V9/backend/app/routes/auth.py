import re
import secrets
from datetime import datetime, timezone
from uuid import uuid4
from flask import Blueprint, request, session
from werkzeug.exceptions import BadRequest, Unauthorized, Conflict
from werkzeug.security import generate_password_hash, check_password_hash
from app.models.database import all_rows, save
from app.services.security import public_user, validate_password, text
bp = Blueprint('auth', __name__, url_prefix='/api/auth')

def new_id():
    return str(uuid4())

def now():
    return datetime.now(timezone.utc).isoformat()

def code_class(code):
    c = next((c for c in all_rows('classes') if c['token'] == str(code).strip()), None)
    if not c:
        raise BadRequest('Código de acesso inválido. Peça o código atual ao professor.')
    return c

def sign_in(user):
    session.clear()
    session['user_id'] = user['id']
    session['csrf'] = secrets.token_urlsafe(32)
    return public_user(user)

@bp.post('/register')
def register():
    d = request.get_json()
    role = d.get('role')
    if role not in ('aluno', 'professor'):
        raise BadRequest('Escolha um perfil válido.')
    name = text(d, 'name', required=True)
    password = d.get('password')
    validate_password(password, role == 'aluno')
    if 'confirm' in d and d['confirm'] != password:
        raise BadRequest('As senhas não coincidem.')
    email = text(d, 'email').lower() if role == 'professor' else ''
    school = text(d, 'school')  # Opcional: compatibilidade com contas/cliente anteriores.
    if role == 'professor' and not re.fullmatch(r'[^\s@]+@[^\s@]+\.[^\s@]+', email):
        raise BadRequest('Informe um e-mail válido.')
    c = code_class(d.get('code')) if role == 'aluno' else None
    if role == 'aluno' and len(name.split()) < 2:
        raise BadRequest('Informe nome e sobrenome.')
    users = all_rows('users')
    if email and any(u['email'] == email for u in users):
        raise Conflict('Este e-mail já está cadastrado.')
    if c and any(u['classId'] == c['id'] and u['name'].casefold() == name.casefold() for u in users):
        raise Conflict('Já existe um aluno com esse nome nesta turma.')
    u = dict(id=new_id(), name=name, role=role, email=email, school=school, password_hash=generate_password_hash(password), classId=c['id'] if c else None, avatar='tuga', avatarChosen=role != 'aluno', discipline='', xp=0, gameProgress={}, odsRead=[], createdAt=now())
    save('users', u)
    return sign_in(u), 201

@bp.post('/login')
def login():
    d = request.get_json()
    identifier = text(d, 'identifier').casefold()
    password = d.get('password', '')
    if not isinstance(password, str) or len(password) > 128:
        raise BadRequest('Senha inválida.')
    matches = [u for u in all_rows('users') if u['role'] == d.get('role') and (u['name'].casefold() if u['role'] == 'aluno' else u['email'].casefold()) == identifier and check_password_hash(u['password_hash'], password)]
    if not matches:
        raise Unauthorized('Nome/e-mail ou senha incorretos.')
    if len(matches) > 1:
        raise Conflict('Há contas com o mesmo nome e senha. Peça ao professor para redefinir sua senha.')
    return sign_in(matches[0])

@bp.post('/logout')
def logout():
    session.clear()
    return {'ok': True}
