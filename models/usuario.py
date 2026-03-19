#classes / tabela do banco
'''
from app import db

class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    pontos = db.Column(db.Integer, default=0)

    def __repr__(self):
        return f"<Usuario {self.nome}>"
    '''
class Usuario:
 def __init__(self, id=None, nome=None, senha=None):
        self.id = id
        self.nome = nome
        self.senha = senha
def __repr__(self):
     return f"<Usuario id={self.id}, nome={self.nome}>"
