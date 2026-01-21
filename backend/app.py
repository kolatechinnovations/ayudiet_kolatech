import cv2
import numpy as np
import base64
from flask import Flask, request, jsonify
from flask_cors import CORS
import os

# Import Modules
from face_analysis import analyze_face_image
from palm_analysis import analyze_palm_image
from nail_analysis import analyze_nail_image

app = Flask(__name__)
CORS(app)

def decode_image(data_url):
    """Decode base64 image string to OpenCV image"""
    try:
        if "," in data_url:
            header, encoded = data_url.split(",", 1)
        else:
            encoded = data_url
        img_bytes = base64.b64decode(encoded)
        npimg = np.frombuffer(img_bytes, np.uint8)
        return cv2.imdecode(npimg, cv2.IMREAD_COLOR)
    except Exception as e:
        print(f"Image decode error: {e}")
        return None

@app.route("/scan/face", methods=["POST"])
def scan_face():
    data = request.json
    if not data or "image" not in data:
        return jsonify({"error": "No image provided"}), 400

    img = decode_image(data["image"])
    if img is None:
        return jsonify({"error": "Invalid image format"}), 400

    predictions = analyze_face_image(img)
    if predictions is None:
        return jsonify({"error": "No face detected or analysis failed"}), 400

    return jsonify(predictions)

@app.route("/scan/palm", methods=["POST"])
def scan_palm():
    data = request.json
    if not data or "image" not in data:
        return jsonify({"error": "No image provided"}), 400

    img = decode_image(data["image"])
    if img is None:
        return jsonify({"error": "Invalid image format"}), 400

    predictions = analyze_palm_image(img)
    return jsonify(predictions)

@app.route("/scan/nails", methods=["POST"])
def scan_nails():
    data = request.json
    if not data or "image" not in data:
        return jsonify({"error": "No image provided"}), 400

    img = decode_image(data["image"])
    if img is None:
        return jsonify({"error": "Invalid image format"}), 400

    predictions = analyze_nail_image(img)
    return jsonify(predictions)

@app.route("/health")
def health():
    return {"status": "ok"}

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
