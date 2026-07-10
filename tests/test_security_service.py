from app.services.security_service import SecurityService


security = SecurityService()


senha_original = "123456"


hash_senha = security.hash_password(
    senha_original
)


print("HASH:")
print(hash_senha)


resultado = security.verify_password(
    hash_senha,
    senha_original
)


print("Senha correta:")
print(resultado)


resultado2 = security.verify_password(
    hash_senha,
    "senha_errada"
)


print("Senha errada:")
print(resultado2)