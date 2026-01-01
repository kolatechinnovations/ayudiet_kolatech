---
description: How to run the Ayurveda Diet Generator with Face Scan
---

To run the complete system, you need to start both the Python backend and the React frontend.

### 1. Start the Flask Backend
The backend handles the face scan analysis.

// turbo
```powershell
cd d:\ayurved\backend
python app.py
```

### 2. Start the React Frontend
The frontend is the main user interface.

// turbo
```powershell
cd d:\ayurved\ayurveda_diet_genrator
npm run dev
```

### 3. Access the Application
- Once both are running, open your browser to [http://localhost:3000](http://localhost:3000) (or the URL shown in the terminal).
- Click **"Begin Assessment"**.
- You will be prompted to perform an **AI Face Scan**.
- After the scan, you can review the auto-filled questions and complete the rest of the assessment.
