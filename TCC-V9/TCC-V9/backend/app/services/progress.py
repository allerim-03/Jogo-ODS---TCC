from app.models.database import all_rows

def is_complete(result):
    return result['completed'] and (result['game'] != 'jogo2' or result['details'].get('journeyComplete') is True)

def matches(activity, result):
    details = result['details']
    if activity['kind'] == 'game':
        return result['game'] == activity['resourceId']
    key = 'customQuizId' if activity['kind'] == 'custom-quiz' else 'theme'
    return result['game'] == 'quiz' and details.get(key) == activity['resourceId']

def task_done(task, user_id, results=None):
    rows = all_rows('results') if results is None else results
    return all(any(r['userId'] == user_id and r['details'].get('assignmentId') == task['id'] and is_complete(r) and matches(a, r) for r in rows) for a in task['activities'])
