from app.models.user import User

user = User(
    id=2,
    name="Samira Close",
    email="samiraclose@cultivandosaber.com",
    password="123456",
    role="student",
    age=24,
    institution="FATEC SBC",
    xp=430,
    level=3
)

user = User(
    id=3,
    name="Beatrix",
    email="bia@cultivandosaber.com",
    role="student",
    xp=30,
    level=1
)

print(user)

print(user.to_dict())

novo_user = User.from_dict(user.to_dict())

print(novo_user)