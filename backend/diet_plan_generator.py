import requests
import json
import os
import re

# OpenRouter Configuration
OPENROUTER_API_KEY = "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"
MODELS = [
    "openai/gpt-4o-mini",
    "anthropic/claude-3-haiku",
    "meta-llama/llama-3-70b-instruct"
]

SYSTEM_PROMPT = """You are an expert Ayurvedic diet planner and clinical nutrition assistant.

Your task is to:
- Analyze patient data including vikriti, agni, symptoms, and rules
- Use ONLY the provided recommended_foods as ingredients
- Create a 7-day (weekly) Ayurvedic meal plan

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
  "day_1": {
    "breakfast": [],
    "lunch": [],
    "dinner": []
  },
  "day_2": {
    "breakfast": [],
    "lunch": [],
    "dinner": []
  },
  "day_3": {
    "breakfast": [],
    "lunch": [],
    "dinner": []
  },
  "day_4": {
    "breakfast": [],
    "lunch": [],
    "dinner": []
  },
  "day_5": {
    "breakfast": [],
    "lunch": [],
    "dinner": []
  },
  "day_6": {
    "breakfast": [],
    "lunch": [],
    "dinner": []
  },
  "day_7": {
    "breakfast": [],
    "lunch": [],
    "dinner": []
  }
}

Each meal array must contain:
{
  "dish_name": "",
  "ingredients": [],
  "preparation": ""
}

Return ONLY JSON. Do not include explanations. Ensure valid JSON format."""

def generate_diet_plan(patient_data):
    """
    Generates a 7-day Ayurvedic meal plan using OpenRouter models with fallback logic.
    """
    user_prompt = f"Patient Data:\n{json.dumps(patient_data, indent=2)}"
    
    for model in MODELS:
        print(f"Attempting to generate diet plan using model: {model}")
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
                    print(f"RAW RESPONSE from {model}:", content)
                    try:
                        # Clean and validate the JSON content
                        cleaned = re.sub(r"```json|```", "", content).strip()
                        plan = json.loads(cleaned)
                        return plan
                    except json.JSONDecodeError:
                        print(f"Model {model} returned invalid JSON even after cleaning. Falling back...")
                        continue
                else:
                    print(f"Model {model} returned no choices. Falling back...")
            else:
                print(f"Model {model} returned error {response.status_code}: {response.text}. Falling back...")
        
        except requests.exceptions.Timeout:
            print(f"Model {model} timed out. Falling back...")
        except Exception as e:
            print(f"An unexpected error occurred with model {model}: {e}. Falling back...")
            
    return {"error": "Failed to generate diet plan after trying all models."}
