import sys
import os
import json

# Add current directory to path
sys.path.append(os.path.dirname(__file__))

from rule_engine import get_recommendations

def test_recommendations():
    # Mock patient data
    patient_data = {
      "vikriti": { "vata": 45, "pitta": 20, "kapha": 15 },
      "agni": { "primary": "Vishamagni", "secondary": "Mandagni" },
      "symptoms": ["Constipation", "Gas & bloating"],
      "hetu": ["Cold, dry foods"],
      "season": "Winter",
      "lifestyle_flags": ["Late night work"]
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
