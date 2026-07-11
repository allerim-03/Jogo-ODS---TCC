
# Badge_routes.py

'''
/api/badges

/api/badges/user

/api/badges/claim
'''
#imports
from app.repositories.badge_repository import get_user_badges
#===========================
# Badge.py
#=========================

@routes.route("/user/<int:user_id>/badges")
def user_badges(user_id):

    badges = get_user_badges(user_id)

    return jsonify(badges)

