import base64
import numpy as np
import cv2
import sys
import os

def decode_image(base64_string):
    try:
        # Simulate the logic in app.py
        if "," in base64_string:
            base64_string = base64_string.split(",")[1]
        img_data = base64.b64decode(base64_string)
        nparr = np.frombuffer(img_data, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        return img
    except Exception as e:
        print(f"Image decode error: {e}")
        return None

try:
    # Read the artifact image
    image_path = r"C:/Users/dhkot/.gemini/antigravity/brain/368e5a72-b1a3-4152-915c-613075fba121/uploaded_media_1769313987250.png"
    
    if not os.path.exists(image_path):
        print(f"Image not found at {image_path}")
        sys.exit(1)

    with open(image_path, "rb") as image_file:
        raw_data = image_file.read()
        encoded_string = base64.b64encode(raw_data).decode('utf-8')
        # Add a dummy data URI prefix to test that logic too
        full_string = f"data:image/png;base64,{encoded_string}"
    
    print(f"Encoded image length: {len(full_string)}")
    
    img = decode_image(full_string)
    
    if img is None:
        print("FAIL: decode_image returned None")
    else:
        print(f"SUCCESS: Image decoded. Shape: {img.shape}")

except Exception as e:
    print(f"Script failed: {e}")
