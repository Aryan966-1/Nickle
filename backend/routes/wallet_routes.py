from flask import Blueprint, request, jsonify
from database import db
from models.user import User

wallet_bp = Blueprint('wallet', __name__)

@wallet_bp.route('/wallet/<int:user_id>', methods=['GET'])
def get_wallet(user_id):
    """
    Get wallet balance for a user.
    """
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
        
    return jsonify({
        "user_id": user.id,
        "wallet_balance": user.wallet_balance
    }), 200

@wallet_bp.route('/wallet/deposit', methods=['POST'])
def deposit():
    """
    Example JSON request:
    {
        "user_id": 1,
        "amount": 100.0
    }
    """
    data = request.json
    user_id = data.get('user_id')
    amount = data.get('amount')
    
    if not user_id or amount is None:
        return jsonify({"error": "user_id and amount are required"}), 400
        
    try:
        amount = float(amount)
        if amount <= 0:
            return jsonify({"error": "Amount must be strictly positive"}), 400
    except ValueError:
        return jsonify({"error": "Amount must be a valid number"}), 400
        
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
        
    user.wallet_balance += amount
    
    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400
        
    return jsonify({
        "message": "Deposit successful",
        "wallet_balance": user.wallet_balance
    }), 200
