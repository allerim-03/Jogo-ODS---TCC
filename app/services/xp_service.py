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

    # suporta dict OU objeto
    current_xp = user["xp"] if isinstance(user, dict) else user.xp

    new_xp = current_xp + amount
    new_level = calculate_level(new_xp)

    # atualiza dict OU objeto
    if isinstance(user, dict):
        user["xp"] = new_xp
        user["level"] = new_level
    else:
        user.xp = new_xp
        user.level = new_level

    return user