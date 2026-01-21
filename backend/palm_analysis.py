import cv2
import numpy as np

def analyze_palm_image(img):
    """
    Analyze palm image for color and texture.
    Returns predictions for Q1001 (Color) and Q1002 (Nature).
    """
    h, w, _ = img.shape
    
    # Focus on center of palm (approximate ROI)
    center_x, center_y = w // 2, h // 2
    roi_w, roi_h = int(w * 0.4), int(h * 0.4)
    roi = img[center_y - roi_h//2 : center_y + roi_h//2, 
              center_x - roi_w//2 : center_x + roi_w//2]
    
    if roi.size == 0:
        return {}
        
    predictions = {}
    
    # --- 1. Palm Color (Q1001) ---
    hsv = cv2.cvtColor(roi, cv2.COLOR_BGR2HSV)
    avg_hue = np.mean(hsv[:,:,0])
    avg_sat = np.mean(hsv[:,:,1])
    avg_val = np.mean(hsv[:,:,2])
    
    # Rules similar to skin but adapted for palm
    # Palms are usually lighter/redder
    if avg_val < 90:
        col_val, col_conf = "Dark", 0.85
    elif avg_sat > 100 or (0 <= avg_hue <= 20) or (160 <= avg_hue <= 180):
        col_val, col_conf = "Reddish", 0.90
    elif avg_sat < 50:
        col_val, col_conf = "Pale Yellow", 0.80
    else:
        col_val, col_conf = "Pink", 0.85
        
    predictions["1001"] = {"value": col_val, "confidence": col_conf}
    
    # --- 2. Palm Nature/Texture (Q1002) - Lines/Wrinkles ---
    # Convert to gray and use Edge Detection
    gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
    # Blur to remove noise
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    # Canny edge detection
    edges = cv2.Canny(blurred, 50, 150)
    edge_density = np.sum(edges) / (roi.size) # Density of lines
    
    # High edge density = Many lines = Wrinkled/Cracked (Vata)
    # Low edge density = Few lines = Firm/Smooth (Kapha)
    if edge_density > 25: # Tunable threshold
        nat_val, nat_conf = "Cracked", 0.80 # Or Wrinkled
        if edge_density > 40:
             nat_val = "Wrinkled"
             nat_conf = 0.85
    else:
        nat_val, nat_conf = "Firm", 0.80
        
    predictions["1002"] = {"value": nat_val, "confidence": nat_conf}
    
    return predictions
