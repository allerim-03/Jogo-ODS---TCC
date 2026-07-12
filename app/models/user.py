'''
o que é model ?
na arquitetura o model não é sqlalchelmy
é uma classe que representa um usuario do plataforma,
Ele deve:
representar um registro da tabela user;
armazenar os dados do usuário;
facilitar a comunicação entre Repository e Services;
converter o objeto em dicionário (to_dict())
Repository cria um objeto User. --> Services trabalham com esse objeto.--> Routes apenas retornam JSON


'''

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
from datetime import datetime


class User:
    """
    Represents a user of the educational platform.

    This class only stores user data.
    It does not access the database or contain business logic.
    """

    def __init__(
        self,
        id=None,
        name=None,
        email=None,
        password=None,
        role="student",
        age=None,
        institution=None,
        use_type="individual",
        xp=0,
        level=1,
        is_active=True,
        created_at=None,
        updated_at=None
    ):
        self.id = id
        self.name = name
        self.email = email
        self.password = password
        self.role = role
        self.use_type = use_type
        self.age = age
        self.institution = institution
        self.xp = xp
        self.level = level
        self.is_active = is_active
        self.created_at = created_at
        self.updated_at = updated_at

    def __repr__(self):
        '''
        especial para testes e depuração
        '''
        return (
                f"User("
                f"id={self.id}, "
                f"name='{self.name}', "
                f"email='{self.email}', "
                f"role='{self.role}', "
                f"xp={self.xp}, "
                f"level={self.level})"
    )
    def to_dict(self):
        '''
        comunicação com a API, sem retornar a senha
        Convert User object to dictionary.
        Password is intentionally omitted
        '''
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "age": self.age,
            "institution": self.institution,
            "use_type": self.use_type,
            "xp": self.xp,
            "level": self.level,
            "is_active": self.is_active,
            "created_at": (
            self.created_at.isoformat()
            if self.created_at else None
            ),

            "updated_at": (
            self.updated_at.isoformat()
            if self.updated_at else None
            )
    }

    @classmethod
    def from_dict(cls, data):
        '''
        método de fábrica para facilitar a criação do objeto a partir de um dicionário.
        '''
        return cls(
            id=data.get("id"),
            name=data.get("name"),
            email=data.get("email"),
            password=data.get("password"),
            role=data.get("role", "student"),
            use_type=data.get("use_type", "individual"),
            age=data.get("age"),
            institution=data.get("institution"),
            xp=data.get("xp") or 0,
            level=data.get("level") or 1,
            is_active=data.get("is_active", True),
            created_at=data.get("created_at"),
            updated_at=data.get("updated_at"),
    )