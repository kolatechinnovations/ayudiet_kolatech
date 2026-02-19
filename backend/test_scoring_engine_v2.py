from scoring_engine import calculate_food_scores, infer_rule_weight
import json

def test_missing_property_handling():
    print("\n--- Testing Missing Property Handling ---")
    food = {
        "food_name": "Haritaki",
        "rasa": ["Kashaya"],
        "guna": [],
        "virya": [],
        "vipaka": []
    }
    
    rule = {
        "rule_id": "TEST_CONSTIPATION",
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
    
    results = calculate_food_scores([food], [rule])
    score = results[0]["final_score"]
    # Haritaki has rasa: Kashaya. Rule doesn't mention rasa.
    # Haritaki's missing guna/virya/vipaka should not match rule's increase/avoid.
    # Result should be 0.
    print(f"Haritaki Score: {score}")
    assert score == 0, f"Expected 0, got {score}"
    print("SUCCESS")

def test_property_boost():
    print("\n--- Testing Property Boost ---")
    food = {
        "food_name": "Hot Spices",
        "virya": ["Ushna"],
        "rasa": ["Katu"]
    }
    
    # Rule 1: Increase Ushna Virya (+3 base)
    rule1 = {
        "rule_id": "R1",
        "trigger": {"symptoms": ["Cold"]},
        "prefer": {"increase": {"virya": ["Ushna"]}},
        "weight": 1.0 # inferred as 1.25 usually, but override for simplicity
    }
    
    # Rule 2: Increase Ushna Virya (+3 base)
    rule2 = {
        "rule_id": "R2",
        "trigger": {"symptoms": ["Stiffness"]},
        "prefer": {"increase": {"virya": ["Ushna"]}},
        "weight": 1.0
    }
    
    # Match count for Ushna = 2
    # Boost = 1 + (2 * 0.15) = 1.3
    # Calculation: 
    # rule1: 3 * 1.3 * 1.0 = 3.9
    # rule2: 3 * 1.3 * 1.0 = 3.9
    # Total = 7.8
    results = calculate_food_scores([food], [rule1, rule2])
    score = results[0]["final_score"]
    print(f"Ushna Boost Score: {score}")
    assert score == 7.8, f"Expected 7.8, got {score}"
    print("SUCCESS")

def test_conflict_handling():
    print("\n--- Testing Conflict Handling ---")
    food = {
        "food_name": "Amla",
        "rasa": ["Amla"]
    }
    
    # Rule 1 (High priority): Increase Amla rasa (weight 1.5)
    rule1 = {
        "rule_id": "R1",
        "trigger": {"symptoms": ["Digestive", "Cause"]}, # Symptom + Hetu
        "prefer": {"increase": {"rasa": ["Amla"]}},
        "weight": 1.5
    }
    
    # Rule 2 (Low priority): Avoid Amla rasa (weight 0.8)
    rule2 = {
        "rule_id": "R2",
        "trigger": {"lifestyle": ["pitta_lifestyle"]},
        "prefer": {"avoid": {"rasa": ["Amla"]}},
        "weight": 0.8
    }
    
    # Calculation:
    # Rule 1: 3 (base) * 1.0 (boost) * 1.5 (weight) = 4.5
    # Rule 2: -4 (penalty) * 0.8 (weight) = -3.2
    # Total = 1.3
    results = calculate_food_scores([food], [rule1, rule2])
    score = results[0]["final_score"]
    print(f"Conflict Score: {score}")
    assert score == 1.3, f"Expected 1.3, got {score}"
    print("SUCCESS")

def test_confidence_factor():
    print("\n--- Testing Confidence Factor ---")
    # Food with only 1 property known
    food = {
        "food_name": "Simple Herb",
        "rasa": ["Tikta"]
    }
    
    rule = {
        "rule_id": "R1",
        "trigger": {"symptoms": ["Infection"]},
        "prefer": {"increase": {"rasa": ["Tikta"]}},
        "weight": 1.0
    }
    
    # Without confidence: 3 * 1.0 * 1.0 = 3.0
    # With confidence: 3.0 * (1 / 4) = 0.75
    results = calculate_food_scores([food], [rule], apply_confidence=True)
    score = results[0]["final_score"]
    print(f"Confidence Score: {score}")
    assert score == 0.75, f"Expected 0.75, got {score}"
    print("SUCCESS")

if __name__ == "__main__":
    test_missing_property_handling()
    test_property_boost()
    test_conflict_handling()
    test_confidence_factor()
    print("\nALL TESTS PASSED!")
