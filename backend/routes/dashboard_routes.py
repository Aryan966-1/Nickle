from flask import Blueprint, jsonify
from database import db
from models.user import User
from models.saving import Saving

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/dashboard/<int:user_id>', methods=['GET'])
def get_dashboard(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
        
    total_saved = db.session.query(db.func.sum(Saving.amount)).filter(Saving.user_id == user_id).scalar() or 0.0
    
    # Calculate leaderboard rank based on XP
    higher_xp_count = User.query.filter(User.xp > user.xp).count()
    rank = higher_xp_count + 1
    
    return jsonify({
        "wallet_balance": user.wallet_balance,
        "xp": user.xp,
        "level": user.level,
        "coins": user.coins,
        "streak": user.streak,
        "total_saved": float(total_saved),
        "leaderboard_rank": rank
    }), 200
