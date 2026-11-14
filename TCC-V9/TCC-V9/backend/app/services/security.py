import re
from flask import session
from werkzeug.exceptions import BadRequest, Unauthorized, Forbidden
from app.models.database import get

def require_user(role=None):
    user = get('users', session.get('user_id', ''))
    if not user:
        raise Unauthorized('Entre na sua conta para continuar.')
    if role and user['role'] != role:
        raise Forbidden('Este recurso não está disponível para seu perfil.')
    return user

def public_user(user):
    return {k: v for k, v in user.items() if k != 'password_hash'}

def text(data, key, maximum=200, required=False):
    value = data.get(key, '')
    if not isinstance(value, str):
        raise BadRequest(f'Campo inválido: {key}.')
    value = ' '.join(value.split())
    if len(value) > maximum or (required and not value):
        raise BadRequest(f'Preencha corretamente o campo {key} (até {maximum} caracteres).')
    return value

def validate_password(password, student=False):
    if not isinstance(password, str) or not 6 <= len(password) <= 128:
        raise BadRequest('Use uma senha de 6 a 128 caracteres.')
    if student and not re.fullmatch(r'(?=.{6}$)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9\s])\S+', password):
        raise BadRequest('Use 6 caracteres: maiúscula, minúscula, número e símbolo.')

def own_class(user, class_id):
    c = get('classes', class_id)
    if not c or (c['teacherId'] != user['id'] if user['role'] == 'professor' else c['id'] != user['classId']):
        raise Forbidden('Turma não disponível para sua conta.')
    return c
