def calculate_risk(female_count, male_count, gesture, people_count):
    score = 0
    reasons = []

    # Lone woman condition
    if female_count == 1 and male_count == 0:
        score += 10
        reasons.append("lone_woman")

    # Woman with more men around
    if female_count >= 1 and male_count >= 2:
        score += 20
        reasons.append("male_dominance")

    # Woman surrounded by many men
    if female_count == 1 and male_count >= 3:
        score += 35
        reasons.append("woman_surrounded")

    # Large crowd around single female
    if female_count == 1 and people_count >= 5:
        score += 20
        reasons.append("crowd_density")

    # SOS gesture
    if gesture == "SOS":
        score += 50
        reasons.append("distress_gesture")

    # Final severity mapping
    if score >= 80:
        severity = "critical"
    elif score >= 50:
        severity = "high"
    elif score >= 25:
        severity = "medium"
    else:
        severity = "low"

    return score, severity, reasons