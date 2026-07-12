"""
===========================================================================
CLASSROOM SERVICE

Responsabilidade:
- Regras de negócio relacionadas às turmas.
- Professores.
- Alunos.
- Convites.
- Entrada e saída das turmas.

As consultas ao banco ficam no classroom_repository.py.
===========================================================================
"""

from app.repositories.classroom_repository import (
    create_classroom,
    find_classroom_by_code,
    add_student_to_classroom,
    remove_student_from_classroom,
    get_classroom_students,
    get_teacher_classrooms
)


class ClassroomService:

    # ==========================================================
    # Criar turma
    # ==========================================================

    def create(self, teacher_id, data):

        classroom_id = create_classroom(
            teacher_id,
            data
        )

        return {
            "success": True,
            "message": "Classroom created successfully.",
            "classroom_id": classroom_id
        }

    # ==========================================================
    # Entrar na turma
    # ==========================================================

    def join(self, user_id, classroom_code):

        classroom = find_classroom_by_code(classroom_code)

        if classroom is None:

            return {
                "status": 404,
                "body": {
                    "success": False,
                    "message": "Classroom not found."
                }
            }

        add_student_to_classroom(
            user_id,
            classroom["id"]
        )

        return {
            "status": 200,
            "body": {
                "success": True,
                "message": "Student added successfully."
            }
        }

    # ==========================================================
    # Sair da turma
    # ==========================================================

    def leave(self, user_id, classroom_id):

        remove_student_from_classroom(
            user_id,
            classroom_id
        )

        return {
            "status": 200,
            "body": {
                "success": True,
                "message": "Student removed successfully."
            }
        }

    # ==========================================================
    # Alunos da turma
    # ==========================================================

    def students(self, classroom_id):

        students = get_classroom_students(classroom_id)

        return {
            "status": 200,
            "body": students
        }

    # ==========================================================
    # Turmas do professor
    # ==========================================================

    def teacher_classrooms(self, teacher_id):

        classrooms = get_teacher_classrooms(
            teacher_id
        )

        return {
            "status": 200,
            "body": classrooms
        }