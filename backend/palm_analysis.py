import numpy as np
from PIL import Image, ImageFilter

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

def analyze_palm_image(img):
    """
    Analyze palm image for color and texture.
    Returns predictions for Q1001 (Color) and Q1002 (Nature).
    Input 'img' is expected to be RGB numpy array.
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
    # Use custom HSV conversion
    hsv = rgb_to_hsv_opencv_scale(roi)
    avg_hue = np.mean(hsv[:,:,0])
    avg_sat = np.mean(hsv[:,:,1])
    avg_val = np.mean(hsv[:,:,2])
    
    # Rules for Q1001 (Palm Color)
    # 0. Dark
    # 1. Reddish
    # 2. Pale Yellow
    # 3. Pink
    if avg_val < 90:
        col_val, col_conf = "Dark", 0.85
    elif avg_sat > 100 or (0 <= avg_hue <= 15) or (165 <= avg_hue <= 180):
        col_val, col_conf = "Reddish", 0.90
    elif avg_sat < 50:
        col_val, col_conf = "Pale Yellow", 0.80
    else:
        col_val, col_conf = "Pink", 0.85
        
    predictions["1001"] = {"value": col_val, "confidence": col_conf}
    
    # --- 2. Palm Nature/Texture (Q1002) - Lines/Wrinkles ---
    # Convert to PIL Image for filters
    roi_pil = Image.fromarray(roi)
    # Convert to grayscale
    gray_pil = roi_pil.convert("L")
    # Blur to remove noise
    blurred_pil = gray_pil.filter(ImageFilter.GaussianBlur(radius=1))
    # Edge detection (Approximate Canny)
    edges_pil = blurred_pil.filter(ImageFilter.FIND_EDGES)
    
    # Convert to numpy to calculate density
    edges = np.array(edges_pil)
    # Thresholding to mimic Canny binary output (tunable)
    # FIND_EDGES gives gradient magnitude. Strong edges > 50 (approx)
    binary_edges = edges > 50
    
    edge_density = np.sum(binary_edges) / (roi.size / 3) * 100 # Percent of pixels that are edges
    
    # High edge density = Many lines = Wrinkled/Cracked (Vata)
    # Low edge density = Few lines = Firm/Smooth (Kapha)
    # Adjusted threshold for different edge detection method
    if edge_density > 5.0: # Tunable threshold
         nat_val, nat_conf = "Cracked", 0.80 
         if edge_density > 8.0:
             nat_val = "Wrinkled"
             nat_conf = 0.85
    else:
        nat_val, nat_conf = "Firm", 0.80
        
    predictions["1002"] = {"value": nat_val, "confidence": nat_conf}
    
    return predictions
