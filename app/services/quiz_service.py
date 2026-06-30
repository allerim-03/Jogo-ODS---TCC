
from app.repositories.quiz_repository import (
    get_quiz_by_id,
    get_questions_by_quiz,
    get_correct_answers,
    save_quiz_attempt,
    count_attempts_today,
    get_best_score_today,
    create_quiz,
    update_quiz,
    delete_quiz,
    get_quiz_results,
    create_question,
    update_question,
    delete_question
)

from app.services.game_service import process_game_score

def get_quiz_details(quiz_id):

    quiz = get_quiz_by_id(quiz_id)

    if quiz is None:
        return None

    quiz["questions"] = get_questions_by_quiz(quiz_id)

    return quiz
#objeto final que será enviado para a API.


def submit_quiz(quiz_id, user_id, answers):

    quiz = get_quiz_by_id(quiz_id)

    if quiz is None:
        return None

    correct_answers = get_correct_answers(quiz_id)

    questions_result = []
    score = 0

    for question in correct_answers:

        question_id = str(question["id"])

        user_answer = answers.get(question_id)
        correct_answer = question["correct_option"]

        is_correct = user_answer == correct_answer

        if is_correct:
            score += 1

        questions_result.append({
        "question_id": question["id"],
        "question": question["question_text"],
        "options": {
            "A": question["option_a"],
            "B": question["option_b"],
            "C": question["option_c"],
            "D": question["option_d"]
        },
        "user_answer": user_answer,
        "correct_answer": correct_answer,
        "correct": is_correct
    })
    # O for termina aqui

    total_questions = len(correct_answers)

    xp_earned = 0
    xp_reason = None

    attempts_today = count_attempts_today(user_id, quiz_id)
    best_score = get_best_score_today(user_id, quiz_id)

    if attempts_today >= 3:

        xp_reason = "daily_limit"

    elif best_score is None or score >= best_score:

        xp_earned = quiz["xp_reward"]
        xp_reason = "score_improved"

    else:

        xp_reason = "score_not_improved"

    # Salva a tentativa
    save_quiz_attempt(
        user_id=user_id,
        quiz_id=quiz_id,
        score=score,
        total_questions=total_questions,
        xp_earned=xp_earned
    )

    # Atualiza XP, nível e badges
    user, xp_gained, xp_before = process_game_score(
        user_id=user_id,
        score=score,
        xp_gained=xp_earned,
        game_name="quiz_ods"
    )

    return {
        "success": True,
        "score": score,
        "total_questions": total_questions,
        "xp_gained": xp_gained,
        "xp_before": xp_before,
        "xp_after": user["xp"],
        "level": user["level"],
        "xp_reason": xp_reason,
        "questions_result": questions_result
    }

#criar quiz
def create_quiz_service(data):

    quiz_id = create_quiz(
        title=data["title"],
        theme=data["theme"],
        difficulty=data["difficulty"],
        xp_reward=data["xp_reward"]
    )

    return {
        "success": True,
        "quiz_id": quiz_id
    }
#atualiza quiz
def update_quiz_service(quiz_id, data):

    quiz = get_quiz_by_id(quiz_id)

    if quiz is None:
        return None

    update_quiz(
        quiz_id=quiz_id,
        title=data["title"],
        theme=data["theme"],
        difficulty=data["difficulty"],
        xp_reward=data["xp_reward"]
    )

    return {
        "success": True
    }
#desativar por exclusão lógica 
def delete_quiz_service(quiz_id):

    quiz = get_quiz_by_id(quiz_id)

    if quiz is None:
        return None

    delete_quiz(quiz_id)

    return {
        "success": True
    }
#resultados dos quizzes p/ professor
def get_quiz_results_service():

    return get_quiz_results()

####perguntas 

def create_question_service(data):

    question_id = create_question(
        quiz_id=data["quiz_id"],
        question_text=data["question_text"],
        option_a=data["option_a"],
        option_b=data["option_b"],
        option_c=data["option_c"],
        option_d=data["option_d"],
        correct_option=data["correct_option"],
        question_order=data["question_order"]
    )

    return {
        "success": True,
        "question_id": question_id
    }
def update_question_service(question_id,data):

    success = update_question(
        question_id=question_id,
        question_text=data["question_text"],
        option_a=data["option_a"],
        option_b=data["option_b"],
        option_c=data["option_c"],
        option_d=data["option_d"],
        correct_option=data["correct_option"],
        question_order=data["question_order"]
    )

    if not success:
        return None

    return {
        "success":True
    }
def delete_question_service(question_id):

    success = delete_question(question_id)

    if not success:
        return None

    return {
        "success":True
    }