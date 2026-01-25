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

def analyze_nail_image(img):
    """
    Analyze nail image.
    Strict rule: Low confidence (< 0.75) for traits to ensure review.
    Maps to Q701 (Color), Q702 (Texture), Q307 (Size - optional).
    Input 'img' is expected to be RGB numpy array.
    """

    # Assuming the user takes a close-up of fingers.
    # We will look at central region for color.
    h, w, _ = img.shape
    roi = img[int(h*0.3):int(h*0.7), int(w*0.3):int(w*0.7)]
    
    if roi.size == 0:
        return {}

    predictions = {}
    
    # --- 1. Nail Color (Q701) ---
    # Use custom HSV conversion
    hsv = rgb_to_hsv_opencv_scale(roi)
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
    # Using Laplacian variance for texture/roughness
    roi_pil = Image.fromarray(roi)
    gray_pil = roi_pil.convert("L")
    
    # Define Laplacian Kernel logic manually since standard Kernel filter might behave differently
    # Or just use FIND_EDGES which is a gradient filter.
    # Or construct Kernel:
    # 0  1  0
    # 1 -4  1
    # 0  1  0
    lap_kernel = ImageFilter.Kernel((3, 3), (0, 1, 0, 1, -4, 1, 0, 1, 0), scale=1, offset=0)
    laplacian_img = gray_pil.filter(lap_kernel)
    laplacian_arr = np.array(laplacian_img)
    
    laplacian_var = laplacian_arr.var()
    
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
