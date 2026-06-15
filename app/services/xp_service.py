#adciona xp
#calcula service

LEVELS = [
    (1, 0),
    (2, 100),
    (3, 250),
    (4, 500),
    (5, 1000)
]

def calculate_level(xp):
    level = 1

    for lvl, required in LEVELS:
        if xp >= required:
            level = lvl
        else:
            break

    return level



def add_xp(user, amount):
    if amount < 0:
        raise ValueError("XP não pode ser negativo")

    user.xp = (user.xp or 0) + amount
    user.level = calculate_level(user.xp)

    return user