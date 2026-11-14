import math
from flask import Blueprint, request
from werkzeug.exceptions import BadRequest, Forbidden
from app.models.database import all_rows, get, save
from app.services.security import require_user, text
from app.services.progress import matches
from .auth import new_id, now
bp = Blueprint('games', __name__, url_prefix='/api/results')

@bp.post('')
def record():
    u = require_user('aluno')
    d = request.get_json()
    run_id = text(d, 'runId', 150, True)
    game, points = d.get('game'), d.get('points')
    completed, details = d.get('completed', True), d.get('details', {})
    if not u['classId'] or game not in ('quiz', 'jogo1', 'jogo2') or type(points) not in (int, float) or not math.isfinite(points) or not 0 <= points <= 100000 or type(completed) is not bool or not isinstance(details, dict):
        raise BadRequest('Resultado inválido.')
    if any(r['runId'] == run_id and r['userId'] == u['id'] for r in all_rows('results')):
        return {'xp': 0}
    if details.get('assignmentId'):
        task = get('assignments', details['assignmentId'])
        if not task or task['classId'] != u['classId'] or not any(matches(a, {'game': game, 'details': details}) for a in task['activities']):
            raise Forbidden('A atividade não pertence a uma tarefa da sua turma.')
    if game == 'quiz':
        correct, total = details.get('correct'), details.get('total')
        if type(correct) is not int or type(total) is not int or not 0 <= correct <= total <= 20 or total < 1:
            raise BadRequest('Resultado do quiz inválido.')
        points = correct * 100
    if game == 'jogo1' and points != 100:
        raise BadRequest('Pontuação de missão inválida.')
    if game == 'jogo2':
        phase = details.get('phase')
        if type(phase) is not int or not 1 <= phase <= 5 or phase > u['gameProgress'].get('recyclePhase', 1):
            raise BadRequest('Fase inválida ou ainda bloqueada.')
        phases = set(u['gameProgress'].get('recycleCompleted', []))
        if completed and phase <= 4:
            phases.add(phase)
            u['gameProgress']['recyclePhase'] = max(u['gameProgress'].get('recyclePhase', 1), phase + 1)
        u['gameProgress']['recycleCompleted'] = sorted(phases)
        details['journeyComplete'] = completed and phase == 4 and {1, 2, 3, 4}.issubset(phases)
    else:
        details['journeyComplete'] = completed
    xp = math.floor(points)
    r = dict(id=new_id(), runId=run_id, userId=u['id'], classId=u['classId'], game=game, points=xp, completed=completed, details=details, createdAt=now())
    save('results', r)
    u['xp'] += xp
    save('users', u)
    return {'xp': xp}, 201
