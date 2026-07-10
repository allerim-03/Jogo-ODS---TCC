from app.repositories.user_repository import UserRepository


repo = UserRepository()


user = repo.get_by_email(
    "mirella@cultivandosaber.com"
)


print(user)

print(user.to_dict())