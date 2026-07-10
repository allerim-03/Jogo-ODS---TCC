"""
===========================================================================
SERVIÇO DE AUTENTICAÇÃO

Responsabilidade:

- Validar os dados enviados.
- Consultar o banco através do Repository.
- Criptografar senhas.
- Validar senha.
- Validar perfil.
- Gerar Token JWT.

Este arquivo concentra TODA a regra de negócio da autenticação.
As rotas apenas chamam estas funções.

regras de autenticação (cadastro, login, validações de usuário e perfil).
===========================================================================
"""

from app.models.user import User

from app.repositories.user_repository import UserRepository
from app.services.security_service import SecurityService

user_repository = UserRepository()

security_service = SecurityService()


class AuthService:
    def __init__(self):
        self.user_repository = UserRepository()
        self.security_service = SecurityService()

    # ==========================================================================
    # CADASTRO
    # ==========================================================================
    def register_user(self, data):

        name = data.get("name")
        email = data.get("email")
        password = data.get("password")

        role = data.get(
            "role",
            "student"
        )

        age = data.get("age")

        institution = data.get("institution")

        # -----------------------------
        # Validação básica
        # -----------------------------
        if not name or not email or not password:

            return {
                "status":400,
                "body":{
                    "success":False,
                    "message":"Required fields missing.Name, email and password are required."
                }
            }

        # -----------------------------
        # Email já cadastrado
        # -----------------------------


        existing_user = user_repository.get_by_email(email)


        if existing_user:

            return {
                "status":400,
                "body":{
                    "success":False,
                    "message":"Email already registered."
                }
            }


        # -----------------------------
        # Criptografia da senha
        # -----------------------------
        password_hash = security_service.hash_password(
            password
        )

    # criar objeto usuário
        user = User(

            name=name,

            email=email,

            password=password_hash,

            role=role,

            age=age,

            institution=institution
        )

        # -----------------------------
        # Novo usuário
        # -----------------------------
        created_user = user_repository.create(user)


        return {

            "status":201,

            "body":{

                "success":True,

                "message":"User registered successfully.",

                "user":created_user.to_dict()

            }

        }
    '''
    def cadastrar_usuario(data):

        nome = data.get("nome")
        email = data.get("email")
        senha = data.get("senha")

        uso = data.get("uso")
        perfil = data.get("perfil")

        idade = data.get("idade")
        instituicao = data.get("instituicao")

        # -----------------------------
        # Validação básica
        # -----------------------------

        if not nome or not email or not senha:

            return {
                "status": 400,
                "body": {
                    "success": False,
                    "message": "Todos os campos devem ser preenchidos."
                }
            }

        # -----------------------------
        # Email já cadastrado
        # -----------------------------

        usuario_existente = buscar_por_email(email)

        if usuario_existente:

            return {
                "status": 400,
                "body": {
                    "success": False,
                    "message": "Este e-mail já está cadastrado."
                }
            }

        # -----------------------------
        # Criptografia da senha
        # -----------------------------

    
        senha_hash = criptografar_senha(senha)

        # -----------------------------
        # Novo usuário
        # -----------------------------

        novo_usuario = User(

            name=name,

            email=email,

            password=password_hash,

            role=perfil,

            idade=idade,

            instituicao=instituicao
        )

        try:

            salvar(novo_usuario)

            return {
                "status": 201,
                "body": {
                    "success": True,
                    "message": f"Cadastro de {perfil} realizado com sucesso!"
                }
            }

        except Exception as erro:

            return {
                "status": 500,
                "body": {
                    "success": False,
                    "message": "Erro interno ao salvar usuário."
                }
            }

    '''
    # ==========================================================================
    # LOGIN
    # ==========================================================================
    def login_user(self, data):

        email=data.get("email")

        password=data.get("password")

        role=data.get("role")
        '''
    def autenticar_usuario(data):

        email = data.get("email")

        senha = data.get("senha")

        perfil_tela = data.get("perfil")
    '''
        # -----------------------------
        # Validação
        # -----------------------------

        if not email or not password:

            return {
                "status": 400,
                "body": {
                    "success": False,
                    "message": "E-mail e senha são obrigatórios."
                }
            }

        # -----------------------------
        # Busca usuário
        # -----------------------------

        
        user = user_repository.get_by_email(email)
        if not user:

            return {
                "status": 404,
                "body": {
                    "success": False,
                    "message": "Usuário não encontrado."
                }
            }

        # -----------------------------
        # Verifica senha
        # -----------------------------

        
        if not security_service.verify_password(
            user.password,
            password
        ):
            return {
                "status": 401,
                "body": {
                    "success": False,
                    "message": "E-mail ou senha incorretos."
                }
            }
        if not user.is_active:
            return {
                "status": 403,
                "body": {
                    "success": False,
                    "message": "Account disabled."
                }
            }
        # -----------------------------
        # Verifica perfil
        # -----------------------------

        if role and user.role != role:
            return {
                "status": 403,
                "body": {
                    "success": False,
                    "message": f"Esta conta está registrada como {user.role}, mas você tentou entrar como {role}."
                }
            }

        # -----------------------------
        # Token JWT
        # -----------------------------
        token = security_service.generate_token(user)

        # -----------------------------
        # Sucesso
        # -----------------------------
        return {

            "status":200,

            "body":{

            "success":True,

            "token":token,

            "user":user.to_dict()
            #"redirect": redirects[user.role]
            }
        }

        '''
        token = create_access_token(

            identity=str(usuario.id),

            additional_claims={
                "role": usuario.role
            }

        )

        # -----------------------------
        # Sucesso
        # -----------------------------

        return {

            "status": 200,

            "body": {

                "success": True,

                "message": "Login efetuado com sucesso!",

                "access_token": token,

                "user": usuario.to_dict()

            }

        }'''