from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import numpy as np
import os
import sys
import traceback

app = Flask(__name__)

# ✅ Allow all origins & handle preflight correctly
CORS(app, resources={r"/*": {"origins": "*"}})

def decode_image(base64_string):
    try:
        # Lazy import cv2 inside try to catch missing library
        try:
            import cv2
        except ImportError as e:
            return None, f"cv2 import error: {e}"

        if "," in base64_string:
            base64_string = base64_string.split(",")[1]
        
        try:
            img_data = base64.b64decode(base64_string)
            nparr = np.frombuffer(img_data, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            if img is None:
                return None, "cv2.imdecode returned None (corrupt data?)"
            return img, None
        except Exception as e:
            return None, f"Decoding error: {e}"

    except Exception as e:
        return None, f"Unexpected error in decode_image: {e}"

@app.route("/", methods=["GET"])
def index():
    return jsonify({"status": "Backend is running", "modules": {"cv2": "opencv-python-headless" in os.popen('pip list').read() if os.name != 'nt' else "unknown"}}), 200

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

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
