from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from database import db
from models.user import User

import random
import time

# Create Blueprint FIRST
auth_bp = Blueprint('auth', __name__)

# OTP storage
otp_store = {}
OTP_EXPIRY_SECONDS = 300


# ---------------- SIGNUP ----------------
@auth_bp.route('/signup', methods=['POST'])
def signup():
    """
    Example JSON request:
    {
        "name": "Jane Doe",
        "email": "jane@example.com",
        "password": "securepassword123"
    }
    """

    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not name or not email or not password:
        return jsonify({"error": "name, email, and password are required"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "User already exists"}), 400

    hashed_password = generate_password_hash(password)

    new_user = User(
        name=name,
        email=email,
        password=hashed_password
    )

    try:
        db.session.add(new_user)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

    return jsonify({
        "message": "User registered successfully",
        "user": new_user.to_dict()
    }), 201


# ---------------- LOGIN ----------------
@auth_bp.route('/login', methods=['POST'])
def login():
    """
    Example JSON request:
    {
        "email": "jane@example.com",
        "password": "securepassword123"
    }
    """

    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "email and password are required"}), 400

    user = User.query.filter_by(email=email).first()

    if not user or not user.password or not check_password_hash(user.password, password):
        return jsonify({"error": "Invalid email or password"}), 401

    return jsonify({
        "message": "Login successful",
        "user": user.to_dict()
    }), 200


# ---------------- FORGOT PASSWORD (OTP GENERATE) ----------------
@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():

    data = request.json
    email = data.get("email")

    if not email:
        return jsonify({"error": "email required"}), 400

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"error": "user not found"}), 404

    otp = str(random.randint(100000, 999999))

    otp_store[email] = {
        "otp": otp,
        "expires": time.time() + OTP_EXPIRY_SECONDS
    }

    # Hackathon demo (shows OTP in backend terminal)
    print("OTP for", email, "=", otp)

    return jsonify({
        "message": "OTP generated (check backend console)"
    }), 200


# ---------------- VERIFY OTP ----------------
@auth_bp.route('/verify-otp', methods=['POST'])
def verify_otp():

    data = request.json
    email = data.get("email")
    otp = data.get("otp")

    if not email or not otp:
        return jsonify({"error": "email and otp required"}), 400

    if email not in otp_store:
        return jsonify({"error": "OTP not requested"}), 400

    record = otp_store[email]

    if time.time() > record["expires"]:
        del otp_store[email]
        return jsonify({"error": "OTP expired"}), 400

    if record["otp"] != otp:
        return jsonify({"error": "Invalid OTP"}), 400

    return jsonify({
        "message": "OTP verified"
    }), 200


# ---------------- RESET PASSWORD ----------------
@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():

    data = request.json
    email = data.get("email")
    new_password = data.get("new_password")

    if not email or not new_password:
        return jsonify({"error": "email and new_password required"}), 400

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"error": "User not found"}), 404

    hashed_password = generate_password_hash(new_password)
    user.password = hashed_password

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

    # Remove OTP after reset
    if email in otp_store:
        del otp_store[email]

    return jsonify({
        "message": "Password reset successful"
    }), 200