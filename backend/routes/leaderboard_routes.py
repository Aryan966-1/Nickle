from flask import Blueprint, jsonify
from models.user import User

leaderboard_bp = Blueprint('leaderboard', __name__)

@leaderboard_bp.route('/leaderboard', methods=['GET'])
def get_leaderboard():
    """
    Leaderboard ranking users by XP.
    """
    try:
        users = User.query.order_by(User.xp.desc()).limit(10).all()
        
        leaderboard = []
        for index, user in enumerate(users):
            leaderboard.append({
                "rank": index + 1,
                "name": user.name,
                "xp": user.xp
            })
            
        return jsonify(leaderboard), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
