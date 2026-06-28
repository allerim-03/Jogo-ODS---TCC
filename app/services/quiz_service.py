from app.repositories.quiz_repository import (
    get_quiz_by_id,
    get_questions_by_quiz,
    get_correct_answers,
    save_quiz_attempt
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