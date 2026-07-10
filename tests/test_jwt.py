from app import create_app
from app.services.security_service import SecurityService
from app.models.user import User


app = create_app()


security = SecurityService()


user = User(
    id=1,
    name="Mirella",
    email="mirella@cultivandosaber.com",
    role="student"
)


with app.app_context():

    token = security.generate_token(user)

    print(token)