from datetime import datetime, timezone
import math

def generate_financial_advice(target_amount, current_amount, deadline):
    """
    Calculates remaining amount and days left before deadline and suggests daily saving amount.
    """
    remaining_amount = target_amount - current_amount
    
    if remaining_amount <= 0:
        return "Congratulations! You have reached your goal."
        
    # Ensure deadline is aware or make current time naive if needed, 
    # but let's assume deadline from db is datetime object.
    # It might be naive if not configured with timezone correctly in some setups, but let's handle timezone properly.
    now = datetime.now(timezone.utc)
    
    # If deadline is naive, replace tzinfo
    if deadline.tzinfo is None:
        deadline = deadline.replace(tzinfo=timezone.utc)
        
    remaining_days = (deadline - now).days
    
    if remaining_days < 0:
        return "The deadline for this goal has passed."
    
    if remaining_days == 0:
        return f"To reach your goal on time, try saving ₹{remaining_amount:.2f} today."
        
    daily_saving = math.ceil(remaining_amount / remaining_days)
    
    return f"To reach your goal on time, try saving ₹{daily_saving} per day."
