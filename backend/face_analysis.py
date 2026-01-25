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

def rgb_to_hsv_opencv_scale(rgb_array):
    """
    Convert RGB (0-255) numpy array to HSV (H:0-179, S:0-255, V:0-255)
    to match existing logic.
    """
    rgb = rgb_array.astype('float32') / 255.0
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    
    max_c = np.max(rgb, axis=-1)
    min_c = np.min(rgb, axis=-1)
    delta = max_c - min_c
    
    # Value
    v = max_c
    
    # Saturation
    s = np.zeros_like(v)
    mask = max_c != 0
    s[mask] = delta[mask] / max_c[mask]
    
    # Hue
    h = np.zeros_like(v)
    mask = delta != 0
    
    # Red is max
    idx = (r == max_c) & mask
    h[idx] = (g[idx] - b[idx]) / delta[idx]
    
    # Green is max
    idx = (g == max_c) & mask
    h[idx] = 2.0 + (b[idx] - r[idx]) / delta[idx]
    
    # Blue is max
    idx = (b == max_c) & mask
    h[idx] = 4.0 + (r[idx] - g[idx]) / delta[idx]
    
    h = (h / 6.0) % 1.0
    
    # Convert to OpenCV scale
    # H: 0-1 -> 0-179 (degrees/2)
    # S: 0-1 -> 0-255
    # V: 0-1 -> 0-255
    out_h = (h * 179).astype('uint8')
    out_s = (s * 255).astype('uint8')
    out_v = (v * 255).astype('uint8')
    
    return np.stack([out_h, out_s, out_v], axis=-1)

def analyze_face_image(img):
    """
    Analyze face image and return predictions with confidence.
    Input 'img' is expected to be RGB numpy array (from PIL).
    """
    # Lazy Import MediaPipe
    import mediapipe as mp
    
    # Input is already RGB
    mp_img = mp.Image(image_format=mp.ImageFormat.SRGB, data=img)
    
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
        # Try finding face with simpler logic if mediapipe fails? No, just fail.
        # Ensure input was good.
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
        # Use our custom HSV function
        hsv_roi = rgb_to_hsv_opencv_scale(cheek_roi)
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
        hsv_lip = rgb_to_hsv_opencv_scale(lip_roi)
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
