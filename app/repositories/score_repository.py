from database.connection import get_connection


def save_score(
    user_id,
    game_name,
    points,
    xp_earned
):

    conn = get_connection()

    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO score
        (
            user_id,
            game_name,
            points,
            xp_earned
        )
        VALUES
        (%s,%s,%s,%s)
    """, (
        user_id,
        game_name,
        points,
        xp_earned
    ))

    conn.commit()

    cursor.close()
    conn.close()