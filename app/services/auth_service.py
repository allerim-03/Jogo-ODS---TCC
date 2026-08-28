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

        role = data.get("role", "student")
        use_type = data.get("use_type", "individual")

        age = data.get("age")
        institution = data.get("institution")
        avatar = data.get("avatar")

        # ----------------------------------------------------------------------
        # Normalização dos dados
        # ----------------------------------------------------------------------

        if isinstance(name, str):
            name = name.strip()

        if isinstance(email, str):
            email = email.strip().lower()

        if isinstance(institution, str):
            institution = institution.strip()

        # ----------------------------------------------------------------------
        # Validação básica
        # ----------------------------------------------------------------------

        if not name or not email or not password:
            return {
                "status": 400,
                "body": {
                    "success": False,
                    "message": (
                        "Name, email and password are required."
                    )
                }
            }

        # ----------------------------------------------------------------------
        # Validação do perfil
        # ----------------------------------------------------------------------

        if role not in ("student", "teacher"):
            return {
                "status": 400,
                "body": {
                    "success": False,
                    "message": "Invalid user role."
                }
            }

        # ----------------------------------------------------------------------
        # Validação do tipo de utilização
        # ----------------------------------------------------------------------

        if use_type not in ("individual", "institutional"):
            return {
                "status": 400,
                "body": {
                    "success": False,
                    "message": "Invalid use type."
                }
            }

        # ----------------------------------------------------------------------
        # Instituição obrigatória para contas institucionais
        # ----------------------------------------------------------------------

        if use_type == "institutional" and not institution:
            return {
                "status": 400,
                "body": {
                    "success": False,
                    "message": (
                        "Institution is required for institutional accounts."
                    )
                }
            }

        # ----------------------------------------------------------------------
        # Verifica se o e-mail já está cadastrado
        # ----------------------------------------------------------------------

        existing_user = self.user_repository.get_by_email(email)

        if existing_user:
            return {
                "status": 400,
                "body": {
                    "success": False,
                    "message": "Email already registered."
                }
            }

        # ----------------------------------------------------------------------
        # Criptografa a senha
        # ----------------------------------------------------------------------

        password_hash = self.security_service.hash_password(password)

        # ----------------------------------------------------------------------
        # Cria objeto User
        # ----------------------------------------------------------------------

        user = User(
            name=name,
            email=email,
            password=password_hash,
            role=role,
            use_type=use_type,
            age=age,
            institution=institution,
            avatar=avatar
        )

        # ----------------------------------------------------------------------
        # Salva no banco
        # ----------------------------------------------------------------------

        try:
            created_user = self.user_repository.create(user)

            return {
                "status": 201,
                "body": {
                    "success": True,
                    "message": "User registered successfully.",
                    "user": created_user.to_dict()
                }
            }

        except Exception:
            return {
                "status": 500,
                "body": {
                    "success": False,
                    "message": "Internal error while registering user."
                }
            }

    # ==========================================================================
    # LOGIN
    # ==========================================================================

    def login_user(self, data):

        email = data.get("email")
        password = data.get("password")
        role = data.get("role")

        # ----------------------------------------------------------------------
        # Validação
        # ----------------------------------------------------------------------

        if not email or not password:
            return {
                "status": 400,
                "body": {
                    "success": False,
                    "message": "Email and password are required."
                }
            }

        # ----------------------------------------------------------------------
        # Busca usuário
        # ----------------------------------------------------------------------

        user = self.user_repository.get_by_email(email)

        if not user:
            return {
                "status": 404,
                "body": {
                    "success": False,
                    "message": "User not found."
                }
            }

        # ----------------------------------------------------------------------
        # Verifica se a conta está ativa
        # ----------------------------------------------------------------------

        if not user.is_active:
            return {
                "status": 403,
                "body": {
                    "success": False,
                    "message": "Account disabled."
                }
            }

        # ----------------------------------------------------------------------
        # Verifica senha
        # ----------------------------------------------------------------------

        if not self.security_service.verify_password(
            user.password,
            password
        ):
            return {
                "status": 401,
                "body": {
                    "success": False,
                    "message": "Invalid email or password."
                }
            }

        # ----------------------------------------------------------------------
        # Verifica perfil
        # ----------------------------------------------------------------------

        if role and user.role != role:
            return {
                "status": 403,
                "body": {
                    "success": False,
                    "message": (
                        f"This account is registered as {user.role}, "
                        f"but you tried to log in as {role}."
                    )
                }
            }

        # ----------------------------------------------------------------------
        # Gera JWT
        # ----------------------------------------------------------------------

        token = self.security_service.generate_token(user)

        # ----------------------------------------------------------------------
        # Sucesso
        # ----------------------------------------------------------------------

        return {
            "status": 200,
            "body": {
                "success": True,
                "token": token,
                "user": user.to_dict()
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