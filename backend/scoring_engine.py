import json
import os

# SCORING CONSTANTS
BASE_POINTS = {
    "rasa": 3,
    "guna": 2,
    "virya": 3,
    "vipaka": 2
}

BASE_PENALTY = {
    "rasa": -4,
    "guna": -3,
    "virya": -4,
    "vipaka": -3
}

def infer_rule_weight(rule):
    """
    Infers the rule weight based on the strict hierarchy defined:
    1. Symptom + Agni (1.60)
    2. Symptom + Hetu (1.50)
    3. Symptom + Season (1.40)
    4. Symptom + Lifestyle (1.30)
    5. Symptom (single) (1.25)
    6. Primary Agni (1.20)
    7. Agni + Season (1.15)
    8. Secondary Agni (1.10)
    9. Hetu + Lifestyle (1.05)
    10. Agni + Lifestyle (1.00)
    11. Hetu + Season (0.95)
    12. Hetu (single) (0.90)
    13. Season (single) (0.85)
    14. Lifestyle (single) (0.80)
    15. Physical/Emotional Signs (0.75)
    """
    trigger = rule.get("trigger", {})
    keys = set(trigger.keys())
    
    # Check for provided weight first
    if "weight" in rule:
        return rule["weight"]
    
    if "symptoms" in keys:
        if "agni" in keys: return 1.60
        if "hetu" in keys: return 1.50
        if "season" in keys: return 1.40
        if "lifestyle" in keys: return 1.30
        return 1.25
        
    if "agni" in keys:
        if "season" in keys: return 1.15
        if "lifestyle" in keys: return 1.00
        # For single Agni, we check rule_id or patient data context if available.
        # Defaults: 1.20 for Primary, 1.10 for Secondary.
        rule_id = rule.get("rule_id", "").upper()
        if "PRIMARY" in rule_id or "MANDAGNI" in rule_id or "TIKSHNAGNI" in rule_id or "VISHAMAGNI" in rule_id:
            return 1.20
        return 1.10
        
    if "hetu" in keys:
        if "lifestyle" in keys: return 1.05
        if "season" in keys: return 0.95
        return 0.90
        
    if "season" in keys: return 0.85
    if "lifestyle" in keys: return 0.80
    if "physical_signs" in keys: return 0.75
    
    return 1.0

def calculate_food_scores(food_dataset, selected_rules, apply_confidence=False):
    """
    Computes deterministic Ayurvedic scores for each food based on selected rules.
    """
    # 1. PRE-PROCESSING: Property Boost System
    # property_weight[property] = 1 + (match_count * 0.15) (Max 1.75)
    property_match_counts = {}
    for rule in selected_rules:
        prefer = rule.get("prefer", {})
        increase = prefer.get("increase", {})
        for prop_list in increase.values():
            for val in prop_list:
                if val:
                    property_match_counts[val] = property_match_counts.get(val, 0) + 1
                    
    property_boosts = {}
    for val, count in property_match_counts.items():
        if count > 1:
            boost = 1 + (count * 0.15)
            property_boosts[val] = min(boost, 1.75)
        else:
            property_boosts[val] = 1.0

    scored_foods = []
    for food in food_dataset:
        food_name = food.get("food_name", "Unknown")
        final_score = 0.0
        known_props_count = 0
        
        # We evaluate each property category: rasa, guna, virya, vipaka
        categories = ["rasa", "guna", "virya", "vipaka"]
        
        for cat in categories:
            food_values = food.get(cat, [])
            if not food_values:
                # MISSING PROPERTY HANDLING: Skip scoring for this property
                continue
            
            known_props_count += 1
            cat_score = 0.0
            
            for rule in selected_rules:
                rule_weight = rule.get("weight") or infer_rule_weight(rule)
                prefer = rule.get("prefer", {})
                increase_list = prefer.get("increase", {}).get(cat, [])
                avoid_list = prefer.get("avoid", {}).get(cat, [])
                
                # Check for matches in food's values
                for val in food_values:
                    # Increase matches
                    if val in increase_list:
                        boost = property_boosts.get(val, 1.0)
                        cat_score += BASE_POINTS[cat] * boost * rule_weight
                    
                    # Avoid matches
                    if val in avoid_list:
                        cat_score += BASE_PENALTY[cat] * rule_weight
            
            final_score += cat_score

        # Apply confidence factor if requested
        # confidence_factor = known_properties / 4
        if apply_confidence:
            confidence_factor = known_props_count / 4.0
            final_score *= confidence_factor
        
        scored_foods.append({
            "food_name": food_name,
            "final_score": round(final_score, 2),
            "category": categorize_score(final_score),
            "known_properties": known_props_count
        })

    # Sort by score descending
    scored_foods.sort(key=lambda x: x["final_score"], reverse=True)
    return scored_foods

def categorize_score(score):
    if score >= 8: return "Highly Recommended"
    if score >= 4: return "Recommended"
    if score >= 1: return "Moderate"
    if score >= -2: return "Limit"
    return "Avoid"

if __name__ == "__main__":
    # Test case: Haritaki Example
    test_food = {
        "food_name": "Haritaki",
        "rasa": ["Kashaya"],
        "guna": [],
        "virya": [],
        "vipaka": []
    }
    
    test_rule = {
        "rule_id": "TEST_01",
        "trigger": {"symptoms": ["Constipation"]},
        "prefer": {
            "increase": {
                "guna": ["Laghu"],
                "virya": ["Ushna"]
            },
            "avoid": {
                "vipaka": ["Madhura"]
            }
        },
        "weight": 1.25
    }
    
    # Since guna, virya, vipaka are missing in Haritaki, 
    # score should be 0 because Rasa (Kashaya) is not in increase/avoid.
    results = calculate_food_scores([test_food], [test_rule])
    print(f"Test Result: {json.dumps(results, indent=2)}")
