import requests
import json

def test_generate_diet_plan():
    url = "http://127.0.0.1:5000/generate-diet-plan"
    
    sample_data = {
        "agni": {
            "primary": "Mandagni",
            "secondary": "Vishamagni"
        },
        "assessment_id": "mBeQfXqLc5gNtJUrmNTC",
        "avoid_foods": [],
        "moderate_foods": [],
        "recommendation_id": "6xAzG9EIAyC4F9AWOjqZ",
        "recommended_foods": [
            {"category": "Highly Recommended", "food_name": "Tumburu", "score": 100.33},
            {"category": "Highly Recommended", "food_name": "Kachura", "score": 98.74},
            {"category": "Highly Recommended", "food_name": "Renuka", "score": 98.74},
            {"category": "Highly Recommended", "food_name": "Dhanyaka", "score": 85.2},
            {"category": "Highly Recommended", "food_name": "Devadaru", "score": 80.65},
            {"category": "Highly Recommended", "food_name": "Bharangi", "score": 79.94},
            {"category": "Highly Recommended", "food_name": "Kapoor Kachari", "score": 78.75},
            {"category": "Highly Recommended", "food_name": "Kutaki", "score": 71.01},
            {"category": "Highly Recommended", "food_name": "Ajwain", "score": 69.38},
            {"category": "Highly Recommended", "food_name": "Agaru", "score": 69.38},
            {"category": "Highly Recommended", "food_name": "Jatiphala", "score": 69.38},
            {"category": "Highly Recommended", "food_name": "Tvak (Taj)", "score": 69.38},
            {"category": "Highly Recommended", "food_name": "Granthiparna", "score": 69.38},
            {"category": "Highly Recommended", "food_name": "Hapusha", "score": 68.41},
            {"category": "Highly Recommended", "food_name": "Sarala", "score": 63.77},
            {"category": "Highly Recommended", "food_name": "Choraka", "score": 63.74},
            {"category": "Highly Recommended", "food_name": "Chitraka", "score": 62.53},
            {"category": "Highly Recommended", "food_name": "Sthula Ela", "score": 62.53},
            {"category": "Highly Recommended", "food_name": "Bhanga", "score": 60.99}
        ],
        "top_rules": [
            {"final_weight": 0.75, "priority": "Low", "rule_id": "VR_CONSTIPATION_COLD_DRY_01"},
            {"final_weight": 0.7, "priority": "Low", "rule_id": "VR_HEAVINESS_MANDAGNI_01"}
        ],
        "user_id": "SqLtKdnWFwh9wuTbIQK5Pw6NrhV2",
        "vikriti": {
            "kapha_percentage": 37.8,
            "pitta_percentage": 24.3,
            "primary_dosha": "Vata",
            "vata_percentage": 37.8
        }
    }
    
    print("Sending request to /generate-diet-plan...")
    try:
        response = requests.post(url, json=sample_data)
        if response.status_code == 200:
            print("Success! Diet plan generated:")
            print(json.dumps(response.json(), indent=2))
        else:
            print(f"Failed with status code {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_generate_diet_plan()
