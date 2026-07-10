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

print(user)
print(user.to_dict())

