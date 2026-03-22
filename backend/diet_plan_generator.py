import requests
import json
import os
import re

# OpenRouter Configuration
OPENROUTER_API_KEY = "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"
MODELS = [
    "mistralai/mistral-7b-instruct:free",
    "google/gemma-7b-it:free",
    "nousresearch/nous-hermes-2-mixtral-8x7b-dpo:free",
    "meta-llama/llama-3-8b-instruct:free"
]

SYSTEM_PROMPT = """You are an expert Ayurvedic diet planner and clinical nutrition assistant.

Your task is to:
- Analyze patient data including vikriti, agni, symptoms, and rules
- Use ONLY the provided recommended_foods as ingredients
- Create a 1-day Ayurvedic meal plan (for a specific day)

PRIMARY GOALS:
- Reduce vikriti (dosha imbalance)
- Improve agni (Mandagni / Vishamagni)
- Support digestion using Deepana and Pachana principles

MEAL STRUCTURE:
- Each day must include:
  - breakfast (light, warm, easy to digest)
  - lunch (main/heaviest meal)
  - dinner (light and minimal)

RECIPE REQUIREMENTS:
- Do NOT just list foods
- Create simple Ayurvedic recipes using given ingredients
- Each meal must include:
  - dish_name
  - ingredients (only from recommended_foods)
  - preparation (2–3 simple steps)

AYURVEDIC RULES:
- Favor warm, cooked, light meals for Mandagni
- Balance Vata using warm, slightly unctuous, grounding foods
- Avoid heavy, cold, incompatible combinations
- Use spices/herbs for digestion support (Deepana-Pachana)

STRICT CONSTRAINTS:
- Use ONLY food_name from recommended_foods
- Do NOT introduce new ingredients
- Do NOT use avoid_foods
- Keep meals practical (Indian style)
- Avoid repeating same exact dish every day (variation required)

SPECIAL CASE:
- If mostly herbs/spices are given, create:
  - herbal water
  - decoctions (kashaya)
  - light preparations

OUTPUT FORMAT (STRICT JSON ONLY):

{
  "breakfast": [],
  "lunch": [],
  "dinner": []
}

Each meal array must contain:
{
  "dish_name": "",
  "ingredients": [],
  "preparation": ""
}

Return ONLY JSON. Do not include explanations. Ensure valid JSON format."""

def extract_json(text):
    """
    Robustly extracts JSON from a potentially messy LLM response.
    """
    try:
        # find first { and last }
        start = text.find("{")
        end = text.rfind("}") + 1
        if start == -1 or end == 0:
            return None
        return json.loads(text[start:end])
    except Exception as e:
        print(f"JSON extraction failed: {e}")
        return None

def generate_diet_plan_for_day(patient_data, day_number=1):
    """
    Generates a 1-day Ayurvedic meal plan using OpenRouter models with retry logic.
    """
    user_prompt = f"Day {day_number} - Patient Data:\n{json.dumps(patient_data, indent=2)}"
    
    for model in MODELS:
        for attempt in range(2):  # retry 2 times per model
            print(f"Attempting to generate diet plan for day {day_number} using model: {model} (Attempt {attempt+1})")
            try:
                response = requests.post(
                    url="https://openrouter.ai/api/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                        "Content-Type": "application/json",
                    },
                    data=json.dumps({
                        "model": model,
                        "messages": [
                            {"role": "system", "content": SYSTEM_PROMPT},
                            {"role": "user", "content": user_prompt}
                        ]
                    }),
                    timeout=60
                )
                
                if response.status_code == 200:
                    result = response.json()
                    if "choices" in result and len(result["choices"]) > 0:
                        content = result["choices"][0]["message"]["content"]
                        plan = extract_json(content)
                        if plan:
                            print(f"SUCCESS: Model {model} provided a valid plan.")
                            return plan
                        else:
                            print(f"Model {model} returned invalid JSON. Retrying...")
                    else:
                        print(f"Model {model} returned no choices. Retrying...")
                elif response.status_code in [401, 403, 404]:
                    print(f"Model {model} returned permanent error {response.status_code}. Switching to next model...")
                    break # Break inner loop, move to next model
                else:
                    print(f"Model {model} returned error {response.status_code}. Retrying...")
            
            except requests.exceptions.Timeout:
                print(f"Model {model} timed out. Retrying...")
            except Exception as e:
                print(f"Unexpected error with model {model}: {e}. Retrying...")
        
        print(f"Moving to next model after attempts with {model}...")
                
    # Fallback default plan
    print(f"All models failed for day {day_number}. Returning fallback.")
    return {
        "breakfast": [{"dish_name": "Warm herbal water", "ingredients": ["Ginger", "Cumin"], "preparation": "Boil water with ginger and cumin. Drink warm."}],
        "lunch": [{"dish_name": "Moong Dal Khichdi", "ingredients": ["Moong Dal", "Rice", "Turmeric"], "preparation": "Pressure cook moong dal and rice with turmeric and salt."}],
        "dinner": [{"dish_name": "Vegetable Soup", "ingredients": ["Bottle Gourd", "Carrot", "Black Pepper"], "preparation": "Boil vegetables, blend, and season with black pepper."}]
    }

def generate_diet_plan(patient_data):
    """
    Generates a full 7-day Ayurvedic meal plan by calling the 1-day generator 7 times.
    """
    weekly_plan = {}
    
    for i in range(1, 8):
        day_plan = generate_diet_plan_for_day(patient_data, day_number=i)
        weekly_plan[f"day_{i}"] = day_plan
        
    return weekly_plan
