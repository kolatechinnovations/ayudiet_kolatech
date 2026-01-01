import React from 'react';

const ResultsDisplay = ({ result, onReset }) => {
  const { prakriti_scores, prakriti_percentage, prakriti_type } = result;

  return (
    <div className="card">
      <div className="section-badge">Assessment Complete</div>
      <h2 className="question-text" style={{ textAlign: 'center', fontSize: '2rem' }}>
        Your Prakriti Analysis
      </h2>
      
      <p style={{ textAlign: 'center', color: 'var(--text-light)', marginBottom: '2rem' }}>
        Based on your physical structure, habits, and mental traits, here is your unique Ayurvedic constitution.
      </p>

      <div className="results-grid">
        <div className="score-card vata">
          <div className="score-value">{prakriti_percentage.vata}%</div>
          <div className="score-label">Vata</div>
          <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>Value: {prakriti_scores.vata}</div>
        </div>
        
        <div className="score-card pitta">
          <div className="score-value">{prakriti_percentage.pitta}%</div>
          <div className="score-label">Pitta</div>
          <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>Value: {prakriti_scores.pitta}</div>
        </div>
        
        <div className="score-card kapha">
          <div className="score-value">{prakriti_percentage.kapha}%</div>
          <div className="score-label">Kapha</div>
          <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>Value: {prakriti_scores.kapha}</div>
        </div>
      </div>

      <div className="type-banner">
        <p style={{ textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
          Your Dominant Prakriti
        </p>
        <h2>{prakriti_type}</h2>
        <p style={{ opacity: 0.9, marginTop: '1rem' }}>
          This assessment represents your birth nature (Prakriti). 
          In the next phase, we will assess your current imbalance (Vikriti).
        </p>
      </div>

      <div className="wizard-footer" style={{ border: 'none', justifyContent: 'center' }}>
        <button className="btn btn-outline" onClick={onReset}>
          Retake Assessment
        </button>
      </div>
    </div>
  );
};

export default ResultsDisplay;
