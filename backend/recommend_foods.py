import json
import os
from rule_engine import get_recommendations
from scoring_engine import calculate_food_scores, categorize_score

# Paths
FOOD_DATA_PATH = os.path.join(os.path.dirname(__file__), "food_data", "food_cleaned.json")

def load_food_data():
    if not os.path.exists(FOOD_DATA_PATH):
        print(f"Error: Food data not found at {FOOD_DATA_PATH}")
        return []
    with open(FOOD_DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def run_recommender(patient_data):
    print("\n--- Ayurvedic Food Recommendation Engine ---")
    
    # 1. Get Selected Rules for the patient
    print("Extracting clinical rules based on patient assessment...")
    selected_rules = get_recommendations(patient_data)
    print(f"Found {len(selected_rules)} relevant rules.")
    
    # rule_engine returns rule_info objects with 'details' which is the 'prefer' object
    # We need to map them back to what scoring_engine expects
    formatted_rules = []
    for r in selected_rules:
        formatted_rules.append({
            "rule_id": r["rule_id"],
            "prefer": r["details"],
            "weight": r["final_weight"],
            "trigger": {} # Not strictly needed for calculation if weight is present
        })
    
    # 2. Load Food Dataset
    print("Loading food dataset...")
    food_dataset = load_food_data()
    print(f"Loaded {len(food_dataset)} food items.")
    
    # 3. Calculate Scores
    print("Calculating deterministic scores...")
    scored_foods = calculate_food_scores(food_dataset, formatted_rules, apply_confidence=True)
    
    # 4. Display Results
    print("\n--- TOP RECOMMENDATIONS ---")
    top_n = 10
    for i, food in enumerate(scored_foods[:top_n]):
        print(f"{i+1}. {food['food_name']} - Score: {food['final_score']} ({food['category']})")
        
    print("\n--- FOODS TO AVOID / LIMIT ---")
    limit_avoid = [f for f in scored_foods if f['category'] in ["Avoid", "Limit"]]
    # Sort by score ascending
    limit_avoid.sort(key=lambda x: x["final_score"])
    for i, food in enumerate(limit_avoid[:5]):
        print(f"X. {food['food_name']} - Score: {food['final_score']} ({food['category']})")

if __name__ == "__main__":
    # Mock patient data: Constipation + Cold intolerance
    mock_patient = {
        "symptoms": ["Constipation", "Gas & bloating"],
        "agni": {"primary": "Mandagni"},
        "vikriti": {"vata": 60, "pitta": 20, "kapha": 20},
        "season": "Winter"
    }
    
    run_recommender(mock_patient)
