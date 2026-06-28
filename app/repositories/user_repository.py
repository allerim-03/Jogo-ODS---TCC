from database.connection import get_connection


def get_user_by_id(user_id):

    conn = get_connection()

    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        "SELECT * FROM user WHERE id = %s",
        (user_id,)
    )

    user = cursor.fetchone()

    cursor.close()
    conn.close()

    return user

def update_user(user):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE user
        SET xp = %s, level = %s
        WHERE id = %s
    """, (user["xp"], user["level"], user["id"]))

    conn.commit()

    cursor.close()
    conn.close()

def get_user_progress(user_id):

    conn = get_connection()

    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            id,
            name,
            xp,
            level
        FROM user
        WHERE id = %s
    """, (user_id,))

    user = cursor.fetchone()

    cursor.close()
    conn.close()

    return user

def get_ranking():

    conn = get_connection()

    cursor = conn.cursor(dictionary=True)

    
    cursor.execute("""
    SELECT
        id,
        name,
        xp,
        level
    FROM user
    ORDER BY xp DESC
    """)

    ranking = cursor.fetchall()

    cursor.close()
    conn.close()

    return ranking