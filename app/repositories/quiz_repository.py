
from database.connection import get_connection
'''
quizzes e tentativas.
'''
class QuizRepository:

    # ==========================================================
    # QUIZZES
    # ==========================================================

    #listinha com todos os quizes
    def get_all_quizzes(self):

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
    #lista todos os quizzes para o professor
    def get_all_quizzes_admin(self):

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
    #retorna dados de um quiz em especifico

    def get_quiz_by_id(self,quiz_id):

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
            WHERE id = %s
        """, (quiz_id,))

        quiz = cursor.fetchone()

        cursor.close()
        conn.close()

        return quiz
    # cria um novo quiz
    def create_quiz_repository(self,title, theme, difficulty, xp_reward):

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
    def update_quiz(self,
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

    def delete_quiz(self,quiz_id):

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


    #Resultados dos quizzes para o professor
    def get_quiz_results(self):

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
    def get_questions_by_quiz(self,quiz_id):

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
    def get_correct_answers(self,quiz_id):

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
    def create_question(self,
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
    def update_question(self,
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
    def delete_question(self,question_id):

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

    #buscar questão
    def get_question_by_id(self,question_id):

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT *
            FROM question
            WHERE id = %s
        """, (question_id,))

        question = cursor.fetchone()

        cursor.close()
        conn.close()

        return question
    # ==========================================================
    # ATTEMPTS
    # ==========================================================

    #registra tentativa do aluno
    def save_quiz_attempt(self,
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
    def get_attempts_by_user(self,user_id):

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
    def get_attempt_by_id(self,attempt_id):

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
    def get_best_score_today(self,user_id, quiz_id):

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

    def count_attempts_today(self,user_id, quiz_id):

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
        

        # ==========================================================
        # Últimos quizzes realizados pelo usuário
        # ==========================================================

    def get_recent_quizzes(self, user_id, limit=5):

            conn = get_connection()
            cursor = conn.cursor(dictionary=True)

            cursor.execute("""
                SELECT
                    q.title,
                    qa.score,
                    qa.xp_earned,
                    qa.completed_at
                FROM quiz_attempt qa
                INNER JOIN quiz q
                    ON qa.quiz_id = q.id
                WHERE qa.user_id = %s
                ORDER BY qa.completed_at DESC
                LIMIT %s
            """, (user_id, limit))

            quizzes = cursor.fetchall()

            cursor.close()
            conn.close()

            return quizzes
        
_repository = QuizRepository()


def get_recent_quizzes(user_id):
            return _repository.get_recent_quizzes(user_id)


def get_all_quizzes():
            return _repository.get_all_quizzes()


def get_all_quizzes_admin():
            return _repository.get_all_quizzes_admin()


def get_quiz_by_id(quiz_id):
            return _repository.get_quiz_by_id(quiz_id)


def create_quiz_repository(title, theme, difficulty, xp_reward):
            return _repository.create_quiz_repository(
                title,
                theme,
                difficulty,
                xp_reward
            )


def update_quiz(
            quiz_id,
            title,
            theme,
            difficulty,
            xp_reward,
            is_active
        ):
            return _repository.update_quiz(
                quiz_id,
                title,
                theme,
                difficulty,
                xp_reward,
                is_active
            )


def delete_quiz(quiz_id):
            return _repository.delete_quiz(quiz_id)


def get_quiz_results():
            return _repository.get_quiz_results()


def get_questions_by_quiz(quiz_id):
            return _repository.get_questions_by_quiz(quiz_id)


def get_correct_answers(quiz_id):
            return _repository.get_correct_answers(quiz_id)


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
            return _repository.create_question(
                quiz_id,
                question_text,
                option_a,
                option_b,
                option_c,
                option_d,
                correct_option,
                question_order
            )


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
            return _repository.update_question(
                question_id,
                question_text,
                option_a,
                option_b,
                option_c,
                option_d,
                correct_option,
                question_order
            )


def delete_question(question_id):
            return _repository.delete_question(question_id)


def get_question_by_id(question_id):
            return _repository.get_question_by_id(question_id)


def save_quiz_attempt(
            user_id,
            quiz_id,
            score,
            total_questions,
            xp_earned
        ):
            return _repository.save_quiz_attempt(
                user_id,
                quiz_id,
                score,
                total_questions,
                xp_earned
            )


def get_attempts_by_user(user_id):
            return _repository.get_attempts_by_user(user_id)

def get_attempt_by_id(attempt_id):
            return _repository.get_attempt_by_id(attempt_id)


def get_best_score_today(user_id, quiz_id):
            return _repository.get_best_score_today(user_id, quiz_id)


def count_attempts_today(user_id, quiz_id):
            return _repository.count_attempts_today(user_id, quiz_id)