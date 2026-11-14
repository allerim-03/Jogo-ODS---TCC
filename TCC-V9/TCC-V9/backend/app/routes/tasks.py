from flask import Blueprint, request
from werkzeug.exceptions import BadRequest, Forbidden
from app.models.database import get, save
from app.services.security import require_user, own_class, text
from .auth import new_id, now
bp = Blueprint('tasks', __name__, url_prefix='/api')

@bp.post('/quizzes')
def create_quiz():
    u = require_user('professor')
    d = request.get_json()
    title = text(d, 'title', 120, True)
    questions = d.get('questions')
    if not isinstance(questions, list) or not 1 <= len(questions) <= 20:
        raise BadRequest('Inclua de 1 a 20 perguntas.')
    cleaned = []
    for q in questions:
        if not isinstance(q, dict):
            raise BadRequest('Pergunta inválida.')
        prompt = text(q, 'q', 1000, True)
        options = q.get('options')
        answer = q.get('answer')
        if not isinstance(options, list) or len(options) != 4 or any(not isinstance(o, str) or not o.strip() or len(o) > 300 for o in options):
            raise BadRequest('Preencha quatro alternativas de até 300 caracteres.')
        options = [o.strip() for o in options]
        if len({o.casefold() for o in options}) != 4 or type(answer) is not int or not 0 <= answer <= 3:
            raise BadRequest('Use alternativas diferentes e marque a resposta correta.')
        cleaned.append(dict(q=prompt, options=options, answer=answer))
    ods = d.get('ods')
    if type(ods) is not int or not 1 <= ods <= 17:
        raise BadRequest('ODS inválido.')
    q = dict(id=new_id(), teacherId=u['id'], title=title, ods=ods, questions=cleaned, createdAt=now())
    save('quizzes', q)
    return q, 201

@bp.post('/assignments')
def assign():
    u = require_user('professor')
    d = request.get_json()
    c = own_class(u, d.get('classId'))
    title = text(d, 'title', 120, True)
    instructions = text(d, 'instructions', 2000)
    activities = d.get('activities')
    if not isinstance(activities, list) or not 1 <= len(activities) <= 3:
        raise BadRequest('Escolha de 1 a 3 atividades.')
    items, seen = [], set()
    for a in activities:
        if not isinstance(a, dict):
            raise BadRequest('Atividade inválida.')
        kind, resource = text(a, 'kind'), text(a, 'resourceId')
        if (kind, resource) in seen:
            raise BadRequest('Não repita atividades.')
        seen.add((kind, resource))
        quiz = None
        if kind == 'custom-quiz':
            quiz = get('quizzes', resource)
            if not quiz or quiz['teacherId'] != u['id']:
                raise Forbidden('Quiz indisponível.')
        elif not ((kind == 'game' and resource in ('jogo1', 'jogo2')) or (kind == 'quiz' and resource in ('agua', 'terrestres', 'reciclagem'))):
            raise BadRequest('Atividade inválida.')
        items.append(dict(kind=kind, resourceId=resource, quiz=quiz))
    task = dict(id=new_id(), teacherId=u['id'], classId=c['id'], title=title, instructions=instructions, activities=items, createdAt=now(), **items[0])
    save('assignments', task)
    return task, 201
