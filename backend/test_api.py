import urllib.request
import json
import base64
import os
import sys

# Path to the artifact image
image_path = r"C:/Users/dhkot/.gemini/antigravity/brain/368e5a72-b1a3-4152-915c-613075fba121/uploaded_media_1769313987250.png"

if not os.path.exists(image_path):
    print(f"Error: Image not found at {image_path}")
    sys.exit(1)

with open(image_path, "rb") as image_file:
    raw_data = image_file.read()
    encoded_string = base64.b64encode(raw_data).decode('utf-8')
    full_string = f"data:image/png;base64,{encoded_string}"

url = "http://127.0.0.1:5000/scan/face"
data = {"image": full_string}
json_data = json.dumps(data).encode('utf-8')

req = urllib.request.Request(url, data=json_data, headers={'Content-Type': 'application/json'})

try:
    print(f"Sending POST request to {url}...")
    with urllib.request.urlopen(req) as response:
        print(f"Status Code: {response.getcode()}")
        print(f"Response: {response.read().decode('utf-8')}")
        print("SUCCESS: Server processed the image correctly!")
except urllib.error.HTTPError as e:
    print(f"FAILURE: Server returned error {e.code}")
    print(f"Error Content: {e.read().decode('utf-8')}")
except Exception as e:
    print(f"Exception during request: {e}")
