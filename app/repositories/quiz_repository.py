
from database.connection import get_connection
from datetime import date


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
# cria um novo quiz
def create_quiz(title, theme, difficulty, xp_reward):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO quiz
        (
            title,
            theme,
            difficulty,
            xp_reward,
            is_active
        )
        VALUES
        (%s,%s,%s,%s,TRUE)
    """, (
        title,
        theme,
        difficulty,
        xp_reward
    ))

    conn.commit()

    quiz_id = cursor.lastrowid

    cursor.close()
    conn.close()

    return quiz_id
# atualiza os dados de um quiz
def update_quiz(
    quiz_id,
    title,
    theme,
    difficulty,
    xp_reward,
    is_active
):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE quiz
        SET
            title = %s,
            theme = %s,
            difficulty = %s,
            xp_reward = %s,
            is_active = %s
        WHERE id = %s
    """, (
        title,
        theme,
        difficulty,
        xp_reward,
        is_active,
        quiz_id
    ))

    conn.commit()

    updated = cursor.rowcount > 0

    cursor.close()
    conn.close()

    return updated

def delete_quiz(quiz_id):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE quiz
        SET is_active = FALSE
        WHERE id = %s
    """, (quiz_id,))

    conn.commit()

    deleted = cursor.rowcount > 0

    cursor.close()
    conn.close()

    return deleted

def get_all_quizzes_admin():

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
        ORDER BY id DESC
    """)

    quizzes = cursor.fetchall()

    cursor.close()
    conn.close()

    return quizzes
#Resultados dos quizzes para o professor
def get_quiz_results():

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            qa.id,
            u.name AS student,
            q.title AS quiz,
            qa.score,
            qa.total_questions,
            qa.xp_earned,
            qa.completed_at
        FROM quiz_attempt qa
        INNER JOIN user u
            ON qa.user_id = u.id
        INNER JOIN quiz q
            ON qa.quiz_id = q.id
        ORDER BY qa.completed_at DESC;
    """)

    results = cursor.fetchall()

    cursor.close()
    conn.close()

    return results

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
#criar pergunta
def create_question(
    quiz_id,
    question_text,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_option,
    question_order
):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO question
        (
            quiz_id,
            question_text,
            option_a,
            option_b,
            option_c,
            option_d,
            correct_option,
            question_order
        )
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
    """,(
        quiz_id,
        question_text,
        option_a,
        option_b,
        option_c,
        option_d,
        correct_option,
        question_order
    ))

    conn.commit()

    question_id = cursor.lastrowid

    cursor.close()
    conn.close()

    return question_id
#atualizar pergunta
def update_question(
    question_id,
    question_text,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_option,
    question_order
):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE question
        SET
            question_text=%s,
            option_a=%s,
            option_b=%s,
            option_c=%s,
            option_d=%s,
            correct_option=%s,
            question_order=%s
        WHERE id=%s
    """,(
        question_text,
        option_a,
        option_b,
        option_c,
        option_d,
        correct_option,
        question_order,
        question_id
    ))

    conn.commit()

    updated = cursor.rowcount

    cursor.close()
    conn.close()

    return updated > 0
#excluir pergunta
def delete_question(question_id):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        DELETE FROM question
        WHERE id=%s
    """,(question_id,))

    conn.commit()

    deleted = cursor.rowcount

    cursor.close()
    conn.close()

    return deleted > 0
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

#------------------------------
#sistema para evitar farmar XP
#------------------------------


#busca a melhor pontuação do day
def get_best_score_today(user_id, quiz_id):

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT MAX(score) AS best
        FROM quiz_attempt
        WHERE user_id = %s
          AND quiz_id = %s
          AND DATE(created_at) = CURDATE()
    """, (user_id, quiz_id))

    result = cursor.fetchone()

    cursor.close()
    conn.close()

    return result["best"] or 0

def count_attempts_today(user_id, quiz_id):

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT COUNT(*) AS total
        FROM quiz_attempt
        WHERE user_id = %s
          AND quiz_id = %s
          AND DATE(created_at) = CURDATE()
    """, (user_id, quiz_id))

    result = cursor.fetchone()

    cursor.close()
    conn.close()

    return result["total"]
    

