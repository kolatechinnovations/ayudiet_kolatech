import React, { useState } from 'react';
import AssessmentWizard from './components/AssessmentWizard';
import ResultsDisplay from './components/ResultsDisplay';
import { calculatePrakriti } from './utils/scoringLogic';

function App() {
  const [stage, setStage] = useState('welcome'); // welcome, assessment, results
  const [result, setResult] = useState(null);

  const startAssessment = () => {
    setStage('assessment');
  };

  const handleAssessmentComplete = (answers) => {
    const prakritiResult = calculatePrakriti(answers);
    setResult(prakritiResult);
    setStage('results');
  };

  const resetAssessment = () => {
    setResult(null);
    setStage('welcome');
  };

  return (
    <div className="container">
      <header>
        <h1>Ayurveda <span style={{ fontWeight: 300 }}>Diet AI</span></h1>
        <p>Your journey to holistic health begins with self-discovery.</p>
      </header>

      {stage === 'welcome' && (
        <div className="card" style={{ textAlign: 'center' }}>
          <div className="section-badge">Stage 1: Prakriti</div>
          <h2 className="question-text">Prakriti Assessment</h2>
          <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>
            Identify your primal constitution (Vata, Pitta, or Kapha) through our comprehensive 50-step questionnaire based on classical Ayurvedic principles.
          </p>
          <button className="btn btn-primary" onClick={startAssessment}>
            Begin Assessment
          </button>
        </div>
      )}

      {stage === 'assessment' && (
        <AssessmentWizard onComplete={handleAssessmentComplete} />
      )}

      {stage === 'results' && result && (
        <ResultsDisplay result={result} onReset={resetAssessment} />
      )}

      <footer style={{ marginTop: '4rem', textAlign: 'center', opacity: 0.5, fontSize: '0.8rem' }}>
        &copy; 2026 Ayurveda Diet AI System • Stage 1 Prakriti Module
      </footer>
    </div>
  );
}

export default App;
