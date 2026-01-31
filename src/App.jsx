import React, { useState } from 'react';
import AssessmentWizard from './components/AssessmentWizard';
import ResultsDisplay from './components/ResultsDisplay';
import FaceScanner from './components/FaceScanner';
import PalmScanner from './components/PalmScanner';
import NailScanner from './components/NailScanner';
import VikritiWizard from './components/VikritiWizard';
import { calculatePrakriti, calculateVikriti } from './utils/scoringLogic';

function App() {
  // Stages: welcome, scan_face, scan_palm, scan_nails, assessment, results, vikriti, final_results
  const [stage, setStage] = useState('welcome'); 
  const [prakritiResult, setPrakritiResult] = useState(null);
  const [vikritiResult, setVikritiResult] = useState(null);
  
  // Accumulate scan data
  const [preFilledAnswers, setPreFilledAnswers] = useState({});

  const startAssessment = () => {
    setStage('scan_face');
    setPreFilledAnswers({});
  };

  // --- Scan Handlers ---
  const mergeData = (newData) => {
    setPreFilledAnswers(prev => ({
      ...prev,
      ...newData
    }));
  };

  const handleFaceComplete = (scanData) => {
    mergeData(scanData);
    setStage('scan_palm');
  };
  
  const handleFaceSkip = () => {
    setStage('scan_palm');
  };

  const handlePalmComplete = (scanData) => {
    mergeData(scanData);
    setStage('scan_nails');
  };
  
  const handlePalmSkip = () => {
    setStage('scan_nails');
  };

  const handleNailComplete = (scanData) => {
    mergeData(scanData);
    setStage('assessment');
  };
  
  const handleNailSkip = () => {
    setStage('assessment');
  };

  // --- Assessment Handlers ---
  const handleAssessmentComplete = (answers) => {
    const res = calculatePrakriti(answers);
    
    // Log structured Prakriti result for rule extraction
    console.log('\n=== PRAKRITI RESULT OBJECT ===');
    console.log(JSON.stringify({
      prakriti: res.prakriti,
      baseline_agni: res.baseline_agni,
      bala: res.bala,
      tolerance: res.tolerance
    }, null, 2));
    console.log('==============================\n');
    
    setPrakritiResult(res);
    setStage('results');
  };

  const startVikriti = () => {
    setStage('vikriti');
  };

  const handleVikritiComplete = (answers) => {
    const res = calculateVikriti(answers);
    
    // Log structured Vikriti result for rule extraction
    console.log('\n=== VIKRITI RESULT OBJECT ===');
    console.log(JSON.stringify({
      vikriti: res.vikriti,
      agni: res.agni,
      symptoms: res.symptoms,
      hetu: res.hetu,
      season: res.season,
      lifestyle_flags: res.lifestyle_flags
    }, null, 2));
    console.log('=============================\n');
    
    setVikritiResult(res);
    setStage('final_results');
  };

  const resetAssessment = () => {
    setPrakritiResult(null);
    setVikritiResult(null);
    setPreFilledAnswers({});
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
            Identify your primal constitution (Vata, Pitta, or Kapha) through our multi-modal AI assessment (Face, Palm, Nails) followed by a detailed questionnaire.
          </p>
          <button className="btn btn-primary" onClick={startAssessment}>
            Begin Assessment
          </button>
        </div>
      )}

      {stage === 'scan_face' && (
        <FaceScanner 
          onScanComplete={handleFaceComplete} 
          onCancel={handleFaceSkip} 
        />
      )}
      
      {stage === 'scan_palm' && (
        <PalmScanner 
          onScanComplete={handlePalmComplete} 
          onCancel={handlePalmSkip} 
        />
      )}
      
      {stage === 'scan_nails' && (
        <NailScanner 
          onScanComplete={handleNailComplete} 
          onCancel={handleNailSkip} 
        />
      )}

      {stage === 'assessment' && (
        <AssessmentWizard 
          onComplete={handleAssessmentComplete} 
          initialScanData={preFilledAnswers} // Pass combined data
        />
      )}

      {stage === 'results' && prakritiResult && (
        <ResultsDisplay 
            result={prakritiResult} 
            onReset={resetAssessment} 
            onNext={startVikriti}
        />
      )}

      {stage === 'vikriti' && (
        <VikritiWizard onComplete={handleVikritiComplete} />
      )}

      {stage === 'final_results' && prakritiResult && vikritiResult && (
        <ResultsDisplay 
            result={prakritiResult} 
            vikriti={vikritiResult}
            onReset={resetAssessment} 
        />
      )}

      <footer style={{ marginTop: '4rem', textAlign: 'center', opacity: 0.5, fontSize: '0.8rem' }}>
        &copy; 2026 Ayurveda Diet AI System • Full Prakriti & Vikriti Module
      </footer>
    </div>
  );
}

export default App;
