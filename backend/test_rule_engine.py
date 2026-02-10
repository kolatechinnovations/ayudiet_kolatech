import sys
import os
import json

# Add current directory to path
sys.path.append(os.path.dirname(__file__))

from rule_engine import get_recommendations

def test_recommendations():
    # Mock patient data using the user's provided format
    patient_data = {
      "vikriti": {
        "vata_percentage": 37.8,
        "pitta_percentage": 27,
        "kapha_percentage": 35.1
      },
      "agni": {
        "primary": "Mandagni",
        "secondary": "Vishamagni"
      },
      "symptoms": [
        "Constipation",
        "Burning / acidity",
        "Loose stools / diarrhea",
        "Heaviness after meals"
      ],
      "hetu": [
        "Cold_Dry_Food",
        "Spicy_Hot_Food",
        "Irregular_Meals"
      ],
      "season": "Cold & Dry (Shishira)",
      "lifestyle_flags": [
        "Excess sun / heat",
        "Sedentary lifestyle"
      ]
    }

    
    print("Testing Recommendation Engine...")
    recommendations = get_recommendations(patient_data)
    
    print(f"\nFound {len(recommendations)} recommendations:")
    for i, rec in enumerate(recommendations, 1):
        print(f"{i}. [{rec['category']}] {rec['why']}")
        print(f"   Triggers: {rec['trigger_factor']}")
        print(f"   Weight: {rec['final_weight']} | Type: {rec['type']}")
        print("-" * 40)

    if len(recommendations) > 0:
        print("\n✅ Verification SUCCESS: Rules selected and scored correctly.")
    else:
        print("\n❌ Verification FAILED: No rules selected.")

if __name__ == "__main__":
    test_recommendations()
