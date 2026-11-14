import secrets
from flask import Blueprint, session
from app.models.database import all_rows, get
from app.services.security import public_user
from app.services.progress import task_done
bp = Blueprint('api', __name__, url_prefix='/api')

@bp.get('/state')
def state():
    session.setdefault('csrf', secrets.token_urlsafe(32))
    u = get('users', session.get('user_id', ''))
    state = dict(current=None, classes=[], users=[], results=[], assignments=[], customQuizzes=[], ranking=[], csrf=session['csrf'])
    if not u:
        return state
    teacher = u['role'] == 'professor'
    classes = [c for c in all_rows('classes') if (c['teacherId'] == u['id'] if teacher else c['id'] == u['classId'])]
    class_ids = {c['id'] for c in classes}
    users = all_rows('users')
    visible = [v for v in users if v['id'] == u['id'] or (teacher and v['role'] == 'aluno' and v['classId'] in class_ids)]
    ids = {v['id'] for v in visible}
    results = [r for r in all_rows('results') if r['userId'] in ids]
    tasks = [a for a in all_rows('assignments') if (a['teacherId'] == u['id'] if teacher else a['classId'] == u['classId'])]
    for a in tasks:
        a['completed'] = not teacher and task_done(a, u['id'], results)
    ranking = [{k:v[k] for k in ('id','name','avatar','xp','classId','createdAt')} for v in users if v['role'] == 'aluno' and v['classId'] and (not teacher or v['classId'] in class_ids)]
    ranking.sort(key=lambda v: (-v['xp'], v['createdAt'], v['id']))
    state.update(current=public_user(u), classes=classes, users=[public_user(v) for v in visible], results=results, assignments=tasks, customQuizzes=[q for q in all_rows('quizzes') if teacher and q['teacherId'] == u['id']], ranking=ranking)
    return state
