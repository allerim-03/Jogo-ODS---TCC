
from database.connection import get_connection


# ==========================================================
# QUIZZES
# ==========================================================

#listinha com todos os quizes
def get_all_quizzes():

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            id,
            title,
            theme,
            difficulty,
            xp_reward,
            is_active
        FROM quiz
        WHERE is_active = TRUE
        ORDER BY title;
    """)

    quizzes = cursor.fetchall()

    cursor.close()
    conn.close()

    return quizzes
#retorna dados de um quiz em especifico

def get_quiz_by_id(quiz_id):

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            id,
            title,
            theme,
            difficulty,
            xp_reward
        FROM quiz
        WHERE id = %s
    """, (quiz_id,))

    quiz = cursor.fetchone()

    cursor.close()
    conn.close()

    return quiz


# ==========================================================
# QUESTIONS
# ==========================================================

#retorna a pergunta sem revelar a alternativa correta
def get_questions_by_quiz(quiz_id):

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            id,
            question_text,
            option_a,
            option_b,
            option_c,
            option_d,
            question_order
        FROM question
        WHERE quiz_id = %s
        ORDER BY question_order;
    """, (quiz_id,))

    questions = cursor.fetchall()

    cursor.close()
    conn.close()

    return questions

# retorna  a resposta correta para validação no backend
def get_correct_answers(quiz_id):

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
                   

        SELECT
            id,
            question_text,
            option_a,
            option_b,
            option_c,
            option_d,
            correct_option
        FROM question
        WHERE quiz_id = %s
        ORDER BY id;
    """, (quiz_id,))

    answers = cursor.fetchall()

    cursor.close()
    conn.close()

    return answers


# ==========================================================
# ATTEMPTS
# ==========================================================

#registra tentativa do aluno
def save_quiz_attempt(
    user_id,
    quiz_id,
    score,
    total_questions,
    xp_earned
):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO quiz_attempt
        (
            user_id,
            quiz_id,
            score,
            total_questions,
            xp_earned
        )
        VALUES
        (%s,%s,%s,%s,%s)
    """, (
        user_id,
        quiz_id,
        score,
        total_questions,
        xp_earned
    ))

    conn.commit()

    cursor.close()
    conn.close()

#consulta historico de tentativas por usuario
def get_attempts_by_user(user_id):

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            qa.id,
            q.title,
            qa.score,
            qa.total_questions,
            qa.xp_earned,
            qa.completed_at
        FROM quiz_attempt qa
        INNER JOIN quiz q
            ON qa.quiz_id = q.id
        WHERE qa.user_id = %s
        ORDER BY qa.completed_at DESC;
    """, (user_id,))

    attempts = cursor.fetchall()

    cursor.close()
    conn.close()

    return attempts

#busca uma tentaiva em especifico
def get_attempt_by_id(attempt_id):

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT *
        FROM quiz_attempt
        WHERE id = %s
    """, (attempt_id,))

    attempt = cursor.fetchone()

    cursor.close()
    conn.close()

    return attempt

#----
#sistema para evitar farmar XP
#---------

def count_attempts_today(user_id, quiz_id):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT COUNT(*)
        FROM quiz_attempt
        WHERE user_id = %s
          AND quiz_id = %s
          AND DATE(attempted_at) = CURDATE()
    """, (user_id, quiz_id))

    attempts = cursor.fetchone()[0]

    cursor.close()
    conn.close()

    return attempts
#busca a melhor pontuação do day
def get_best_score_today(user_id, quiz_id):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT MAX(score)
        FROM quiz_attempt
        WHERE user_id = %s
          AND quiz_id = %s
          AND DATE(attempted_at) = CURDATE()
    """, (user_id, quiz_id))

    best_score = cursor.fetchone()[0]

    cursor.close()
    conn.close()

    return best_score