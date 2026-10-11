from MODELS.student import Student
from MODELS.teacher import Teacher

aluno = Student(
    name_user="Ana",
    main_email="ana@example.com",
    code_classroom=123
)

professor = Teacher(
    name_user="Carlos",
    main_email="carlos@example.com"
)

print("Nome do aluno:", aluno.name_user)
print("Turma do aluno:", aluno.code_classroom)

print("Nome do professor:", professor.name_user)

print("Aluno é Student?", isinstance(aluno, Student))
print("Aluno é Teacher?", isinstance(aluno, Teacher))