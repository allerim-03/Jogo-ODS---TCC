from app.database.connection import get_connection


def get_user_by_id(user_id):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
    user = cursor.fetchone()

    cursor.close()
    conn.close()

    return user

def update_user(user):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE users
        SET xp = %s, level = %s
        WHERE id = %s
    """, (user["xp"], user["level"], user["id"]))

    conn.commit()

    cursor.close()
    conn.close()