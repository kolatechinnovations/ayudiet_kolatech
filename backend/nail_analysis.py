import numpy as np

def analyze_nail_image(img):
    """
    Analyze nail image.
    Strict rule: Low confidence (< 0.75) for traits to ensure review.
    Maps to Q701 (Color), Q702 (Texture), Q307 (Size - optional).
    """
    import cv2 # Lazy Load

    # Assuming the user takes a close-up of fingers.
    # We will look at central region for color.
    h, w, _ = img.shape
    roi = img[int(h*0.3):int(h*0.7), int(w*0.3):int(w*0.7)]
    
    if roi.size == 0:
        return {}

    predictions = {}
    
    # --- 1. Nail Color (Q701) ---
    hsv = cv2.cvtColor(roi, cv2.COLOR_BGR2HSV)
    avg_hue = np.mean(hsv[:,:,0])
    avg_val = np.mean(hsv[:,:,2])
    
    if avg_val < 80:
        val, conf = "Dark", 0.65 # Review Required
    elif 0 <= avg_hue <= 15 or 165 <= avg_hue <= 180:
        val, conf = "Reddish", 0.70
    elif 20 <= avg_hue <= 40:
        val, conf = "Pale Yellow", 0.65
    else:
        val, conf = "Pink", 0.70
        
    predictions["701"] = {"value": val, "confidence": conf}
    
    # --- 2. Nail Texture (Q702) ---
    # Using simple variance of Laplacian or edge density
    gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
    laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
    
    # High variance might mean roughness or just detail
    # Very heuristic, keep confidence LOW
    if laplacian_var > 600:
        t_val, t_conf = "Rough", 0.60
    else:
        t_val, t_conf = "Smooth", 0.60
        
    predictions["702"] = {"value": t_val, "confidence": t_conf}
    
    # --- 3. Nail Size (Q307) ---
    # Hard to detect without scale. Default to Medium with low config?
    # Or skip.
    # Let's add a placeholder "Medium" with low confidence
    predictions["307"] = {"value": "Medium", "confidence": 0.40}
    
    return predictions
