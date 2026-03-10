import google.generativeai as genai
import os

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel("gemini-1.5-flash")


def generate_financial_advice(goal_name, target_amount, current_amount):

    remaining = target_amount - current_amount

    prompt = f"""
    A student is saving money.

    Goal: {goal_name}
    Target amount: {target_amount}
    Current saved: {current_amount}
    Remaining: {remaining}

    Give a short motivational financial advice (1 sentence).
    """

    response = model.generate_content(prompt)

    return response.text
