"""
===========================================================================
CLASSROOM REPOSITORY

Responsabilidade:
- Acessar os dados das turmas.
- Gerenciar alunos e professores vinculados.
- Não contém regras de negócio.
===========================================================================
"""

from database.connection import get_connection


class ClassroomRepository:

    # ======================================================================
    # Turmas
    # ======================================================================

    def create_classroom(self, data):

        connection = get_connection()
        cursor = connection.cursor()

        query = """
            INSERT INTO classrooms (
                name,
                code,
                teacher_id
            )
            VALUES (%s, %s, %s)
        """

        cursor.execute(
            query,
            (
                data["name"],
                data["code"],
                data["teacher_id"]
            )
        )

        connection.commit()

        classroom_id = cursor.lastrowid

        cursor.close()
        connection.close()

        return classroom_id

    # ======================================================================

    def get_by_id(self, classroom_id):

        connection = get_connection()
        cursor = connection.cursor(dictionary=True)

        query = """
            SELECT *
            FROM classrooms
            WHERE id = %s
        """

        cursor.execute(query, (classroom_id,))
        classroom = cursor.fetchone()

        cursor.close()
        connection.close()

        return classroom

    # ======================================================================

    def get_by_code(self, code):

        connection = get_connection()
        cursor = connection.cursor(dictionary=True)

        query = """
            SELECT *
            FROM classrooms
            WHERE code = %s
        """

        cursor.execute(query, (code,))
        classroom = cursor.fetchone()

        cursor.close()
        connection.close()

        return classroom

    # ======================================================================

    def get_teacher_classrooms(self, teacher_id):

        connection = get_connection()
        cursor = connection.cursor(dictionary=True)

        query = """
            SELECT *
            FROM classrooms
            WHERE teacher_id = %s
            ORDER BY name
        """

        cursor.execute(query, (teacher_id,))
        classrooms = cursor.fetchall()

        cursor.close()
        connection.close()

        return classrooms

    # ======================================================================
    # Matrículas
    # ======================================================================

    def join_classroom(self, user_id, classroom_id):

        connection = get_connection()
        cursor = connection.cursor()

        query = """
            INSERT INTO classroom_students (
                classroom_id,
                user_id
            )
            VALUES (%s, %s)
        """

        cursor.execute(
            query,
            (
                classroom_id,
                user_id
            )
        )

        connection.commit()

        cursor.close()
        connection.close()

    # ======================================================================

    def leave_classroom(self, user_id, classroom_id):

        connection = get_connection()
        cursor = connection.cursor()

        query = """
            DELETE FROM classroom_students
            WHERE classroom_id = %s
            AND user_id = %s
        """

        cursor.execute(
            query,
            (
                classroom_id,
                user_id
            )
        )

        connection.commit()

        cursor.close()
        connection.close()

    # ======================================================================
    # Alunos
    # ======================================================================

    def get_students(self, classroom_id):

        connection = get_connection()
        cursor = connection.cursor(dictionary=True)

        query = """
            SELECT
                u.id,
                u.name,
                u.email,
                u.level,
                u.xp
            FROM classroom_students cs
            INNER JOIN users u
                ON u.id = cs.user_id
            WHERE cs.classroom_id = %s
            ORDER BY u.name
        """

        cursor.execute(query, (classroom_id,))
        students = cursor.fetchall()

        cursor.close()
        connection.close()

        return students
    
   


"""
 ClassroomRepository
proximas buscas :
Turmas
├── create_classroom()
├── update_classroom()
├── delete_classroom()
├── get_by_id()
├── get_by_code()
├── get_teacher_classrooms()
├── get_all()

Alunos
├── join_classroom()
├── leave_classroom()
├── get_students()
├── get_student_count()

Professor
├── get_teacher()
├── transfer_teacher()

Convites
├── validate_code()
├── generate_code()
├── regenerate_code()"""