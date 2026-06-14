LEVELS = {
    1: 0,
    2: 100,
    3: 250,
    4: 500,
    5: 1000
}

def calculate_level(xp):

    level = 1

    for lvl, required in LEVELS.items():

        if xp >= required:
            level = lvl

    return level

def add_xp(usuario, xp_gained):

    usuario.xp += xp_gained

    usuario.level = calculate_level(
        usuario.xp
    )

    return usuario