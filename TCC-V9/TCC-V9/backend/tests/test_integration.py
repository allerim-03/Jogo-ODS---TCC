import sys
from pathlib import Path
import pytest
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from app import create_app

@pytest.fixture
def app(tmp_path):
    return create_app({'TESTING': True, 'DATABASE': str(tmp_path/'test.sqlite3'), 'SECRET_KEY': 'test-only-key'})

def call(client, path, data, method='POST', status=200):
    token = client.get('/api/state').json['csrf']
    response = client.open('/api'+path, method=method, json=data, headers={'X-CSRF-Token': token})
    assert response.status_code == status, response.json
    return response.json

def teacher(client, email='prof@gmail.com'):
    return call(client, '/auth/register', dict(name='Ana Professora', email=email, password='Senha123!', role='professor'), status=201)

def classroom(client):
    return call(client, '/classes', dict(name='Turma A',year='2026',period='Manhã'), status=201)

def student(client, code, name='Aluno Teste'):
    return call(client, '/auth/register', dict(name=name, password='Ab1!cd', code=code, role='aluno'), status=201)

def test_complete_flow_and_restart(app):
    t, s = app.test_client(), app.test_client()
    teacher(t); c=classroom(t)
    u=student(s,c['token'])
    call(s,'/users/me',dict(avatar='gota'),method='PATCH')
    q=call(t,'/quizzes',dict(title='Água',ods=6,questions=[dict(q='Economizar?',options=['Sim','Não','Nunca','Talvez'],answer=0)]),status=201)
    a=call(t,'/assignments',dict(classId=c['id'],title='Estudar',activities=[dict(kind='custom-quiz',resourceId=q['id'])]),status=201)
    result=dict(runId='one',game='quiz',points=100,details=dict(assignmentId=a['id'],customQuizId=q['id'],total=1,correct=1))
    assert call(s,'/results',result,status=201)['xp']==100
    assert call(s,'/results',result)['xp']==0
    call(s,'/users/me/ods',dict(number=6))
    state=s.get('/api/state').json
    assert state['current']['xp']==100 and state['assignments'][0]['completed']
    assert state['current']['odsRead']==[6]
    assert t.get('/api/state').json['users'][1]['xp']==100
    call(s,'/auth/logout',{})
    assert s.get('/api/state').json['current'] is None
    call(s,'/auth/login',dict(identifier='Aluno Teste',password='Ab1!cd',role='aluno'))
    assert s.get('/api/state').json['current']['classId']==c['id']
    other=create_app({'TESTING':True,'DATABASE':app.config['DATABASE'],'SECRET_KEY':'test-only-key'}).test_client()
    call(other,'/auth/login',dict(identifier='Aluno Teste',password='Ab1!cd',role='aluno'))
    assert other.get('/api/state').json['current']['xp']==100
    call(t,'/users/'+u['id'],dict(name='Aluno Renomeado',password='Cd2@ef'),method='PATCH')
    call(other,'/auth/login',dict(identifier='Aluno Renomeado',password='Cd2@ef',role='aluno'))

def test_permissions_validation_and_rotation(app):
    t,s,outsider=app.test_client(),app.test_client(),app.test_client()
    teacher(t);c=classroom(t);student(s,c['token'])
    teacher(outsider,'outra@escola.edu.br')
    call(outsider,'/classes/'+c['id']+'/rotate-code',{},status=403)
    call(s,'/classes',dict(name='Não permitido'),status=403)
    call(s,'/users/me/ods',dict(number=18),status=400)
    call(s,'/results',dict(runId='bad',game='jogo2',points=100,details={'phase':4}),status=400)
    assert app.test_client().post('/api/classes',json={}).status_code==403
    assert app.test_client().get('/api/state').json['users']==[]
    assert outsider.get('/api/state').json['ranking']==[]
    assert all('password_hash' not in u for u in t.get('/api/state').json['users'])
    new=call(t,'/classes/'+c['id']+'/rotate-code',{})['token']
    assert new!=c['token']
    assert t.get('/api/classes/validate/'+c['token']).status_code==400
    assert s.get('/api/state').json['current']['classId']==c['id']

def test_games_and_assignment_ownership(app):
    t,s=app.test_client(),app.test_client()
    teacher(t);c=classroom(t);student(s,c['token'])
    a=call(t,'/assignments',dict(classId=c['id'],title='Jogar',activities=[dict(kind='game',resourceId='jogo2')]),status=201)
    for phase in range(1,5):
        call(s,'/results',dict(runId=str(phase),game='jogo2',points=100,details=dict(phase=phase,assignmentId=a['id'])),status=201)
    assert s.get('/api/state').json['assignments'][0]['completed']
    assert s.get('/api/state').json['current']['gameProgress']['recyclePhase']==5
    call(s,'/results',dict(runId='wrong',game='jogo1',points=100,details=dict(assignmentId=a['id'])),status=403)
    call(s,'/results',dict(runId='mission',game='jogo1',points=100,details=dict(mission=1)),status=201)

def test_routes_and_local_assets(app):
    import json,re
    from urllib.parse import unquote,urlsplit
    root=app.config['FRONTEND_DIR']
    c=app.test_client()
    for route in json.loads((root/'routes/pages.json').read_text()).values():
        response=c.get(route['url'])
        assert response.status_code==200, route
        assert b'EcoConfig' in c.get('/config.js').data
    for file in root.rglob('*.html'):
        for url in re.findall(r'(?:src|href)=["\']([^"\']+)',file.read_text()):
            if url.startswith(('/assets/','/games/')):
                assert c.get(url).status_code==200,(str(file),url)
            elif not url.startswith(('/', '#','http','data:','mailto:')):
                assert (file.parent/unquote(urlsplit(url).path)).exists(),(str(file),url)
    assert c.get('/assets/js/services/api.js').mimetype=='text/javascript'
    assert c.get('/assets/js/services/mock-db.js').status_code==404
    assert c.get('/api/missing').status_code==404


def test_teacher_email_without_school_and_password_protection(app):
    from app.models.database import all_rows
    from werkzeug.security import check_password_hash
    first, second = app.test_client(), app.test_client()
    user = teacher(first, 'prof@gmail.com')
    teacher(second, 'prof@hotmail.com')
    assert user['school'] == ''
    assert 'password_hash' not in user and 'password' not in user
    with app.app_context():
        rows = all_rows('users')
        hashes = [u['password_hash'] for u in rows]
        assert hashes[0] != hashes[1]  # Mesmo texto, salts diferentes.
        assert all(h.startswith('scrypt:') for h in hashes)
        assert all(check_password_hash(h, 'Senha123!') for h in hashes)
        assert all('password' not in u for u in rows)
    call(first, '/auth/logout', {})
    call(first, '/auth/login', dict(identifier='prof@gmail.com', password='Senha123!', role='professor'))
    call(first, '/auth/login', dict(identifier='prof@gmail.com', password='errada', role='professor'), status=401)
    call(second, '/auth/register', dict(name='Outro Professor', email='email-invalido', password='Senha123!', role='professor'), status=400)
    call(second, '/auth/register', dict(name='Outro Professor', email='prof@gmail.com', password='Senha123!', role='professor'), status=409)
    html = first.get('/cadastro/gestor').get_data(as_text=True)
    assert 'id="school"' not in html and 'institucional' not in html
    response = app.test_client().get('/api/state')
    assert 'HttpOnly' in response.headers.get('Set-Cookie', '')
    assert 'SameSite=Lax' in response.headers.get('Set-Cookie', '')
