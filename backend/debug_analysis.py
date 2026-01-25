import cv2
import os
import sys
import numpy as np

# Add current directory to path so we can import face_analysis
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from face_analysis import analyze_face_image, get_face_landmarker
except ImportError as e:
    print(f"Import failed: {e}")
    sys.exit(1)

import mediapipe as mp

image_path = r"C:/Users/dhkot/.gemini/antigravity/brain/368e5a72-b1a3-4152-915c-613075fba121/uploaded_media_1769313987250.png"

if not os.path.exists(image_path):
    print(f"Image not found: {image_path}")
    sys.exit(1)

print(f"Reading image from {image_path}")
img = cv2.imread(image_path)
if img is None:
    print("cv2.imread returned None")
    sys.exit(1)

print(f"Image shape: {img.shape}")

# debug run
try:
    print("Initializing landmarker...")
    landmarker = get_face_landmarker()
    if landmarker is None:
        print("Landmarker is None")
        sys.exit(1)
        
    print("Preparing MediaPipe image...")
    rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    mp_img = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb)
    
    print("Detecting...")
    result = landmarker.detect(mp_img)
    
    if not result.face_landmarks:
        print("No face landmarks detected!")
        # Save a debug image just to be sure what we are looking at (optional, but good for verification if we could see it)
    else:
        print(f"Faces found: {len(result.face_landmarks)}")
        print("Calling analyze_face_image...")
        analysis = analyze_face_image(img)
        print("Analysis result:", analysis)

except Exception as e:
    print(f"Exception: {e}")
    import traceback
    traceback.print_exc()
