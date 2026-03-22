from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import numpy as np
import os
import sys
import traceback
import io
from PIL import Image
from diet_plan_generator import generate_diet_plan

app = Flask(__name__)

# ✅ Allow all origins & handle preflight correctly
CORS(app, resources={r"/*": {"origins": "*"}})

def decode_image(base64_string):
    try:
        if "," in base64_string:
            base64_string = base64_string.split(",")[1]
        
        try:
            img_data = base64.b64decode(base64_string)
            image = Image.open(io.BytesIO(img_data)).convert("RGB")
            return np.array(image), None
        except Exception as e:
            return None, f"Decoding error: {e}"

    except Exception as e:
        return None, f"Unexpected error in decode_image: {e}"

@app.route("/", methods=["GET"])
def index():
    return jsonify({"status": "Backend is running", "modules": {"PIL": "Pillow" in os.popen('pip list').read() if os.name != 'nt' else "unknown"}}), 200

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"}), 200

@app.route("/scan/face", methods=["POST", "OPTIONS"])
def scan_face():
    if request.method == "OPTIONS":
        return jsonify({"ok": True}), 200
    
    # Wrap EVERYTHING in a big try-except to catch crashes in decode_image (which imports cv2)
    try:
        try:
            # Lazy import analysis module
            from face_analysis import analyze_face_image
        except ImportError as e:
            print(f"Import Error in scan_face: {e}")
            traceback.print_exc()
            return jsonify({"error": "Server Configuration Error", "details": str(e), "trace": traceback.format_exc()}), 500
        
        data = request.json
        if not data or "image" not in data:
            return jsonify({"error": "No image provided"}), 400
        
        # This calls cv2.imdecode inside
        img, error = decode_image(data["image"])
        if img is None:
            return jsonify({"error": f"Invalid image: {error}"}), 400

        results = analyze_face_image(img)
        if not results:
            return jsonify({"error": "Face analysis failed or no face detected"}), 400
        return jsonify(results)
    except Exception as e:
        print(f"Global Error in scan_face: {e}")
        traceback.print_exc()
        return jsonify({"error": "Server Crash", "details": str(e), "trace": traceback.format_exc()}), 500

@app.route("/scan/palm", methods=["POST", "OPTIONS"])
def scan_palm():
    if request.method == "OPTIONS":
        return jsonify({"ok": True}), 200
    
    try:
        try:
            # Lazy import analysis module
            from palm_analysis import analyze_palm_image
        except ImportError as e:
            return jsonify({"error": "Server Configuration Error", "details": str(e)}), 500
            
        data = request.json
        if not data or "image" not in data:
            return jsonify({"error": "No image provided"}), 400
        
        img, error = decode_image(data["image"])
        if img is None:
            return jsonify({"error": f"Invalid image: {error}"}), 400

        results = analyze_palm_image(img)
        return jsonify(results)
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "Server Crash", "details": str(e)}), 500

@app.route("/scan/nails", methods=["POST", "OPTIONS"])
def scan_nails():
    if request.method == "OPTIONS":
        return jsonify({"ok": True}), 200
        
    try:
        try:
            # Lazy import analysis module
            from nail_analysis import analyze_nail_image
        except ImportError as e:
            return jsonify({"error": "Server Configuration Error", "details": str(e)}), 500

        data = request.json
        if not data or "image" not in data:
            return jsonify({"error": "No image provided"}), 400
        
        img, error = decode_image(data["image"])
        if img is None:
            return jsonify({"error": f"Invalid image: {error}"}), 400

        results = analyze_nail_image(img)
        return jsonify(results)
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "Server Crash", "details": str(e)}), 500

@app.route("/recommendations", methods=["POST", "OPTIONS"])
def get_recommendations():
    if request.method == "OPTIONS":
        return jsonify({"ok": True}), 200
        
    try:
        try:
            from rule_engine import get_recommendations as compute_recommendations
        except ImportError as e:
            return jsonify({"error": "Rule Engine Not Found", "details": str(e)}), 500
            
        data = request.json
        if not data:
            return jsonify({"error": "No patient data provided"}), 400
            
        recommendations = compute_recommendations(data)
        return jsonify(recommendations)
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "Recommendation Analysis Failed", "details": str(e)}), 500

@app.route("/standardize", methods=["POST", "OPTIONS"])
def standardize_text():
    if request.method == "OPTIONS":
        return jsonify({"ok": True}), 200
    
    try:
        from rule_engine import standardize
        data = request.json
        if not data or "text" not in data:
            return jsonify({"error": "No text provided"}), 400
        
        # If it's a list of strings, standardize each one
        if isinstance(data["text"], list):
            standardized = [standardize(t) for t in data["text"]]
        else:
            standardized = standardize(data["text"])
            
        return jsonify({"original": data["text"], "standardized": standardized})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/generate-diet-plan", methods=["POST", "OPTIONS"])
def get_diet_plan():
    if request.method == "OPTIONS":
        return jsonify({"ok": True}), 200
        
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No patient data provided"}), 400
            
        plan = generate_diet_plan(data)
        
        if "error" in plan:
            return jsonify(plan), 500
            
        return jsonify(plan)
        
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "Diet Plan Generation Failed", "details": str(e)}), 500

@app.route("/food-recommendations", methods=["POST", "OPTIONS"])
def get_food_recommendations():
    if request.method == "OPTIONS":
        return jsonify({"ok": True}), 200
        
    try:
        from rule_engine import get_recommendations as compute_recommendations
        from scoring_engine import calculate_food_scores
        import json
        
        data = request.json
        if not data:
            return jsonify({"error": "No patient data provided"}), 400
            
        # 1. Get Selected Rules
        selected_rules = compute_recommendations(data)
        
        # 2. Format rules for scoring engine
        formatted_rules = []
        for r in selected_rules:
            formatted_rules.append({
                "rule_id": r.get("rule_id"),
                "prefer": r.get("details", {}),
                "weight": r.get("final_weight", 1.0)
            })
            
        # 3. Load Food Data
        food_data_path = os.path.join(os.path.dirname(__file__), "food_data", "food_cleaned.json")
        if not os.path.exists(food_data_path):
            return jsonify({"error": "Food dataset not found"}), 500
            
        with open(food_data_path, "r", encoding="utf-8") as f:
            food_dataset = json.load(f)
            
        # 4. Calculate Scores
        scored_foods = calculate_food_scores(food_dataset, formatted_rules, apply_confidence=True)
        
        # Return top 20 foods
        return jsonify(scored_foods[:20])
        
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "Food Recommendation Failed", "details": str(e)}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
