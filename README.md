# Ayurveda Diet Generator with Face Scan

A full-stack application that uses facial recognition and an assessment wizard to provide personalized Ayurvedic diet recommendations.

## Project Structure

- `/ayurveda_diet_genrator`: React Frontend (Vite)
- `/backend`: Flask Backend (Python)
- `prakriti_scan.py`: Standalone Python script for real-time face analysis.

---

## 🚀 Getting Started

### 1. Frontend Setup (React)

1. Open a terminal in the `ayurveda_diet_genrator` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

### 2. Backend Setup (Python)

To run the AI face scan backend, follow these steps:

1. **Create a Virtual Environment** (Recommended):
   ```powershell
   python -m venv venv
   ```
2. **Activate the Virtual Environment**:
   - On Windows:
     ```powershell
     .\venv\Scripts\activate
     ```
   - On Mac/Linux:
     ```bash
     source venv/bin/activate
     ```
3. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
4. **Run the Flask Backend**:
   ```bash
   python backend/app.py
   ```
   The backend will run on `http://localhost:5000`.

---

## 📂 Features

- **Face Analysis**: Detects facial features to predict Ayurvedic body type (Vata, Pitta, Kapha).
- **Assessment Wizard**: Interactive questionnaire for deeper analysis.
- **Diet Recommendations**: Personalized diet plans based on the assessment.
- **Modern UI**: Built with React and designed for a premium experience.

## 🛠 Tech Stack

- **Frontend**: React, Vite, CSS.
- **Backend**: Flask, Python, OpenCV, MediaPipe.
- **Face Model**: Google MediaPipe Face Landmarker.
