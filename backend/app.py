import cv2
import numpy as np
import base64
from flask import Flask, request, jsonify
from flask_cors import CORS
import os

import mediapipe as mp
from mediapipe.tasks import python as mp_python
from mediapipe.tasks.python import vision

app = Flask(__name__)
CORS(app)

# Load MediaPipe Face Landmarker model
model_path = os.path.join(os.path.dirname(__file__), 'face_landmarker.task')
base_options = mp_python.BaseOptions(model_asset_path=model_path)
options = vision.FaceLandmarkerOptions(
    base_options=base_options,
    output_face_blendshapes=False,
    output_facial_transformation_matrixes=False,
    num_faces=1
)
face_landmarker = vision.FaceLandmarker.create_from_options(options)


def decode_image(data_url):
    """Decode base64 image string to OpenCV image"""
    header, encoded = data_url.split(",", 1)
    img_bytes = base64.b64decode(encoded)
    npimg = np.frombuffer(img_bytes, np.uint8)
    return cv2.imdecode(npimg, cv2.IMREAD_COLOR)


def analyze_face(img):
    """Analyze facial features and skin metrics"""
    rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    mp_img = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb)
    result = face_landmarker.detect(mp_img)

    if not result.face_landmarks:
        return None

    lm = result.face_landmarks[0]
    h, w, _ = img.shape

    def pt(i):
        return np.array([lm[i].x * w, lm[i].y * h])

    # Face dimensions
    face_width = np.linalg.norm(pt(234) - pt(454))
    face_height = np.linalg.norm(pt(10) - pt(152))
    face_ratio = face_width / (face_height + 1e-6)

    # Eye openness
    eye_open = np.linalg.norm(pt(159) - pt(145)) + np.linalg.norm(pt(386) - pt(374))

    # Nose
    nose_len = np.linalg.norm(pt(1) - pt(2))
    nose_width = np.linalg.norm(pt(98) - pt(327))
    nose_ratio = nose_len / (nose_width + 1e-6)

    # Jaw & Chin
    jaw_width = np.linalg.norm(pt(172) - pt(397))
    chin_width = np.linalg.norm(pt(152) - pt(148))

    # Cheeks
    cheek_width = np.linalg.norm(pt(234) - pt(454))

    # Skin metrics
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    skin_brightness = float(np.mean(hsv[:, :, 2]))
    skin_hue = float(np.mean(hsv[:, :, 0]))

    return {
        "face_ratio": float(face_ratio),
        "eye_open": float(eye_open),
        "nose_ratio": float(nose_ratio),
        "jaw_width": float(jaw_width),
        "chin_width": float(chin_width),
        "cheek_width": float(cheek_width),
        "skin_brightness": float(skin_brightness),
        "skin_hue": float(skin_hue)
    }


def infer_questions(f):
    q = {}

    # Map by Question ID for easier matching in React
    q["1"] = "Slim" if f["face_ratio"] < 0.88 else "Medium" if f["face_ratio"] <= 1.05 else "Large"
    q["9"] = "Long/Pointed" if f["nose_ratio"] > 1.4 else "Short/Rounded"
    q["10"] = "Big/Calm" if f["eye_open"] > 40 else "Small/Sunken/Dry"
    q["11"] = "Rounded/Double" if f["chin_width"] > 35 else "Thin/Angular"
    q["12"] = "Rounded/Plump" if f["cheek_width"] > 140 else "Wrinkled/Sunken"
    q["13"] = "Big/Folded" if f["jaw_width"] > 130 else "Medium"
    q["14"] = "Thick/Oily/Cool" if f["skin_brightness"] > 180 else "Thin/Dry/Cold/Bumpy"
    q["15"] = "Fair/Rosy" if 5 < f["skin_hue"] < 15 else "Dark/Pale"
    q["19"] = "Smooth/Oily" if f["cheek_width"] > 140 else "Dry/Cracked"

    return q


@app.route("/scan", methods=["POST"])
def scan():
    data = request.json
    if not data or "image" not in data:
        return jsonify({"error": "No image provided"}), 400

    try:
        img = decode_image(data["image"])
        f = analyze_face(img)

        if not f:
            return jsonify({"error": "No face detected"}), 400

        # Generate predicted answers
        q_predictions = infer_questions(f)

        return jsonify({
            "face_detected": True,
            "face_metrics": f,
            "question_predictions": q_predictions
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(port=5000, debug=True)
