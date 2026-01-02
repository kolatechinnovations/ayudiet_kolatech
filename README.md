<<<<<<< HEAD
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

### 2. Backend Setup (Flask & Python)

If you are a React developer and haven't used Python before, follow these exact commands in your terminal at the root of the project:

1. **Check if Python is installed**: Open your terminal and run `python --version` or `python3 --version`.
2. **Create a Virtual Environment**:
   ```powershell
   python -m venv venv
   ```
3. **Activate the Virtual Environment**:
   - **Windows (PowerShell)**:
     ```powershell
     .\venv\Scripts\activate
     ```
   - **Windows (Command Prompt)**:
     ```cmd
     venv\Scripts\activate
     ```
   - **Mac/Linux**:
     ```bash
     source venv/bin/activate
     ```
4. **Install all dependencies** (This is the `pip` command you need):
   ```bash
   pip install -r requirements.txt
   ```
5. **Run the Flask Backend**:
   ```bash
   python backend/app.py
   ```
   The backend will run on `http://localhost:5000`.

> [!TIP]
> **React Developer Note**: Think of `pip install -r requirements.txt` like `npm install`. It installs all the Python libraries listed in the `requirements.txt` file into your virtual environment.

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
=======
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
>>>>>>> origin/main
