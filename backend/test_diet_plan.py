import json
import sys
import os

# Add the current directory to sys.path so we can import diet_plan_generator
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from diet_plan_generator import generate_diet_plan

def test_generation():
    sample_patient_data = {
        "vikriti": "Vata-Pitta",
        "agni": "Mandagni",
        "symptoms": ["Bloating", "Constipation", "Dry skin"],
        "recommended_foods": [
            {"food_name": "Moong Dal"},
            {"food_name": "Rice"},
            {"food_name": "Ghee"},
            {"food_name": "Ginger"},
            {"food_name": "Cumin"},
            {"food_name": "Zucchini"},
            {"food_name": "Bottle Gourd"},
            {"food_name": "Turmeric"}
        ],
        "avoid_foods": ["Raw salad", "Ice cream", "Coffee"],
        "top_rules": [
            "Eat warm, cooked meals",
            "Use digestive spices like ginger and cumin",
            "Avoid cold drinks"
        ]
    }

    print("Starting Diet Plan Generation Test...")
    plan = generate_diet_plan(sample_patient_data)
    
    print("\nFINAL GENERATED PLAN:")
    print(json.dumps(plan, indent=2))
    
    # Validation
    if "day_1" in plan and "day_7" in plan:
        print("\nSUCCESS: 7-day plan generated successfully.")
        for day in range(1, 8):
            day_key = f"day_{day}"
            if day_key in plan:
                meals = plan[day_key]
                if all(k in meals for k in ["breakfast", "lunch", "dinner"]):
                    print(f"  - {day_key} validated.")
                else:
                    print(f"  - {day_key} MISSING MEALS!")
    else:
        print("\nFAILURE: 7-day plan structure is incorrect.")

if __name__ == "__main__":
    test_generation()
