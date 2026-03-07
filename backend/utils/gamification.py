import datetime

def update_gamification(user, amount_saved):
    """
    Updates the user's XP, level, and coins based on the amount saved.
    XP rules: XP = amount_saved / 10
    Level system: level increases every 200 XP (Level 1 is 0-199 XP, Level 2 is 200-399 XP, etc.)
    Coins: 1 coin for every 100 saved
    """
    # Calculate added XP and Coins
    added_xp = int(amount_saved // 10)
    added_coins = int(amount_saved // 100)
    
    # Streak logic
    today = datetime.date.today()
    streak_increased_today = False
    
    if user.last_save_date:
        if today == user.last_save_date + datetime.timedelta(days=1):
            user.streak += 1
            streak_increased_today = True
        elif today == user.last_save_date:
            pass # already saved today, do nothing to streak
        else:
            user.streak = 1
            streak_increased_today = True
    else:
        user.streak = 1
        streak_increased_today = True
        
    user.last_save_date = today

    # Apply streak XP bonuses
    streak_bonuses = {3: 50, 5: 100, 7: 150, 14: 300, 30: 700}
    if streak_increased_today and user.streak in streak_bonuses:
        added_xp += streak_bonuses[user.streak]
    
    # Update user fields
    user.xp += added_xp
    user.coins += added_coins
    
    # Calculate new level based on total XP
    user.level = (user.xp // 200) + 1
    
    return user
