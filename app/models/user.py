#classes / tabela do banco
'''
from app import db

class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    pontos = db.Column(db.Integer, default=0)

    def __repr__(self):
        return f"<Usuario {self.nome}>"
  
class Usuario:
 def __init__(self, id=None, nome=None, senha=None):
        self.id = id
        self.nome = nome
        self.senha = senha
def __repr__(self):
     return f"<Usuario id={self.id}, nome={self.nome}>"
  
class Usuario(db.Model):

    __tablename__ = "users"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    nome = db.Column(
        db.String(100),
        nullable=False
    )

    senha = db.Column(
        db.String(255),
        nullable=False
    )

    xp = db.Column(
        db.Integer,
        default=0
    )

    level = db.Column(
        db.Integer,
        default=1
    )
    '''
class Usuario:

    def __init__(
        self,
        id=None,
        nome=None,
        senha=None,
        xp=0,
        level=1
    ):
        self.id = id
        self.nome = nome
        self.senha = senha
        self.xp = xp
        self.level = level

    def __repr__(self):
        return (
            f"<Usuario "
            f"id={self.id}, "
            f"nome={self.nome}, "
            f"xp={self.xp}, "
            f"level={self.level}>"
        )