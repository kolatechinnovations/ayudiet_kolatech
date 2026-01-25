import numpy as np
import os

# Initialize MediaPipe Face Landmarker safely (Global Variable)
face_landmarker = None

def get_face_landmarker():
    global face_landmarker
    if face_landmarker is not None:
        return face_landmarker
        
    try:
        # Lazy Import MediaPipe ONLY when needed
        import mediapipe as mp
        from mediapipe.tasks import python as mp_python
        from mediapipe.tasks.python import vision
        
        model_path = os.path.join(os.path.dirname(__file__), 'face_landmarker.task')
        if not os.path.exists(model_path):
            print(f"Error: Model file not found at {model_path}")
            return None
            
        base_options = mp_python.BaseOptions(model_asset_path=model_path)
        options = vision.FaceLandmarkerOptions(
            base_options=base_options,
            output_face_blendshapes=False,
            output_facial_transformation_matrixes=False,
            num_faces=1,
            min_face_detection_confidence=0.3
        )
        face_landmarker = vision.FaceLandmarker.create_from_options(options)
        return face_landmarker
    except Exception as e:
        print(f"Failed to initialize Face Landmarker: {e}")
        return None

def analyze_face_image(img):
    """
    Analyze face image and return predictions with confidence.
    """
    # Lazy Import OpenCV and MediaPipe
    import cv2
    import mediapipe as mp
    
    rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    mp_img = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb)
    
    landmarker = get_face_landmarker()
    if landmarker is None:
        print("Face Landmarker not initialized.")
        return None

    try:
        result = landmarker.detect(mp_img)
    except Exception as e:
        print(f"MediaPipe detection error: {e}")
        return None

    if not result.face_landmarks:
        return None

    lm = result.face_landmarks[0]
    h, w, _ = img.shape
    
    def pt(i):
        return np.array([lm[i].x * w, lm[i].y * h])

    # --- MEASUREMENTS ---
    
    # 1. Face Dimensions (Q3.2, Q101)
    face_width = np.linalg.norm(pt(234) - pt(454)) # Zygomatic width
    face_height = np.linalg.norm(pt(10) - pt(152)) # Forehead to chin
    face_ratio = face_width / (face_height + 1e-6)

    # 2. Forehead (Q1.4, Q2.2)
    # Approx forehead width (temples) and length (hairline to brow)
    # Using 10 (top) and 151 (brow center) approx
    forehead_w = np.linalg.norm(pt(70) - pt(300)) # Approx temple width
    forehead_h = np.linalg.norm(pt(10) - pt(151)) 

    # 3. Eyes (Q3.3, Q303)
    # Eye openness (vertical) vs width (horizontal)
    left_eye_open = np.linalg.norm(pt(159) - pt(145))
    left_eye_width = np.linalg.norm(pt(33) - pt(133))
    eye_ratio = left_eye_open / (left_eye_width + 1e-6) # Higher = Bigger/Rounder

    # 4. Lips (Q9.1, Q306)
    # Lip color region
    upper_lip_top = pt(13)
    lower_lip_bottom = pt(14)
    # Create mask for lips to extract color? Simplified: Get color at localized points
    # Point 13 is upper lip, 14 is lower. Let's sample a small ROI around 14.
    lip_center_x, lip_center_y = int(lm[14].x * w), int(lm[14].y * h)
    
    # 5. Skin Color (Q5.4, Q504)
    # Cheek ROI
    cheek_x, cheek_y = int(lm[234].x * w), int(lm[234].y * h)
    
    # --- MAPPING & CONFIDENCE ---
    predictions = {}

    # Q104: Forehead Width (1.4 in Logic)
    # Normalized by face width to be scale invariant
    fw_ratio = forehead_w / face_width
    if fw_ratio < 0.82:
        val, conf = "Thin / Narrow", 0.85
    elif fw_ratio > 0.92:
        val, conf = "Broad", 0.85
    else:
        val, conf = "Medium", 0.80
    predictions["104"] = {"value": val, "confidence": conf}

    # Q202: Forehead Length (2.2 in Logic)
    fh_ratio = forehead_h / face_height
    if fh_ratio > 0.35:
        val, conf = "Long", 0.85
    elif fh_ratio < 0.25:
        val, conf = "Short", 0.85
    else:
        val, conf = "Medium", 0.80
    predictions["202"] = {"value": val, "confidence": conf}

    # Q302: Face Size / Development (3.2 in Logic) -> Using Face Ratio
    if face_ratio < 0.88:
        val, conf = "Small / Weakly Developed", 0.90 # Vata
    elif face_ratio > 1.05:
        val, conf = "Large / Well Developed", 0.90 # Kapha
    else:
        val, conf = "Medium / Moderately Developed", 0.85
    predictions["302"] = {"value": val, "confidence": conf}

    # Q303: Eyes Size (3.3 in Logic) -> Using Eye Openness Ratio
    # Typical ratio ~ 0.2-0.3?
    # Large eyes > 0.35, Small < 0.25
    if eye_ratio > 0.35:
        val, conf = "Large", 0.88
    elif eye_ratio < 0.25:
        val, conf = "Small", 0.88
    else:
        val, conf = "Medium", 0.82
    predictions["303"] = {"value": val, "confidence": conf}

    # Q504: Skin Color (5.4 in Logic)
    # Extract HSV from cheek area
    roi_size = 10
    cheek_roi = img[max(0, cheek_y-roi_size):min(h, cheek_y+roi_size), 
                    max(0, cheek_x-roi_size):min(w, cheek_x+roi_size)]
    
    if cheek_roi.size > 0:
        hsv_roi = cv2.cvtColor(cheek_roi, cv2.COLOR_BGR2HSV)
        hue = np.mean(hsv_roi[:,:,0])
        sat = np.mean(hsv_roi[:,:,1])
        val = np.mean(hsv_roi[:,:,2])

        # HSV Logic (OpenCV Hue is 0-179)
        # 5-15: Reddish/Fair
        # > 15 & < 35: Yellow/Wheatish
        # Low Saturation: Pale
        # Low Value: Dark
        
        if val < 80:
            p_val, p_conf = "Dark", 0.85
        elif sat < 40:
            p_val, p_conf = "Pale Yellow", 0.80
        elif 5 < hue < 20: 
            p_val, p_conf = "Fair Reddish", 0.85
        elif 20 <= hue < 35:
            p_val, p_conf = "Fair Pink", 0.80
        else:
            p_val, p_conf = "Wheatish", 0.75 # Default fallback
            
        predictions["504"] = {"value": p_val, "confidence": p_conf}
    
    # Q901: Lip Color (9.1 in Logic)
    lip_roi = img[max(0, lip_center_y-5):min(h, lip_center_y+5), 
                  max(0, lip_center_x-5):min(w, lip_center_x+5)]
    if lip_roi.size > 0:
        hsv_lip = cv2.cvtColor(lip_roi, cv2.COLOR_BGR2HSV)
        l_hue = np.mean(hsv_lip[:,:,0])
        l_val = np.mean(hsv_lip[:,:,2])
        
        if l_val < 80:
            l_val_str, l_conf = "Dark", 0.80
        elif 0 < l_hue < 10 or 160 < l_hue < 180: # Red range
            l_val_str, l_conf = "Reddish", 0.85
        else:
            l_val_str, l_conf = "Pink", 0.80
            
        predictions["901"] = {"value": l_val_str, "confidence": l_conf}

    return predictions
