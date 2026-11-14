"""Persistência SQLite transacional; documentos JSON por entidade, nunca no navegador."""
import json
import sqlite3
from flask import current_app, g
from pathlib import Path
TABLES = ('users', 'classes', 'quizzes', 'assignments', 'results')

def connection():
    if 'db' not in g:
        g.db = sqlite3.connect(current_app.config['DATABASE'], timeout=20)
        g.db.execute('PRAGMA journal_mode=WAL')
    return g.db

def init_db():
    Path(current_app.config['DATABASE']).parent.mkdir(parents=True, exist_ok=True)
    db = connection()
    for table in TABLES:
        db.execute(f'CREATE TABLE IF NOT EXISTS {table} (id TEXT PRIMARY KEY, data TEXT NOT NULL)')
    db.execute("CREATE UNIQUE INDEX IF NOT EXISTS result_run ON results(json_extract(data,'$.userId'), json_extract(data,'$.runId'))")
    db.execute("CREATE UNIQUE INDEX IF NOT EXISTS class_code ON classes(json_extract(data,'$.token'))")
    db.commit()

def all_rows(table):
    assert table in TABLES
    return [json.loads(row[0]) for row in connection().execute(f'SELECT data FROM {table} ORDER BY rowid')]

def get(table, identifier):
    assert table in TABLES
    row = connection().execute(f'SELECT data FROM {table} WHERE id=?', (identifier,)).fetchone()
    return json.loads(row[0]) if row else None

def save(table, item):
    assert table in TABLES
    connection().execute(f'INSERT INTO {table}(id,data) VALUES(?,?) ON CONFLICT(id) DO UPDATE SET data=excluded.data', (item['id'], json.dumps(item, ensure_ascii=False)))

def close_db(error=None):
    db = g.pop('db', None)
    if db is not None:
        db.close()
