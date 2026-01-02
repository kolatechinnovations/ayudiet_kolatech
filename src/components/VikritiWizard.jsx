import React, { useState } from 'react';
import { vikritiSections, vikritiQuestions } from '../data/vikritiData';

const VikritiWizard = ({ onComplete }) => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  const section = vikritiSections[currentSectionIndex];
  const questions = vikritiQuestions[section.id];
  const progress = ((currentSectionIndex + 1) / vikritiSections.length) * 100;

  const handleIntensityChange = (qId, value) => {
    setAnswers(prev => ({
      ...prev,
      [section.id]: {
        ...(prev[section.id] || {}),
        [qId]: value
      }
    }));
  };

  const handleRankChange = (qId, rank) => {
      // For Agni patterns, only one Dominant (3) and one Secondary (1)
      const currentSectionAnswers = answers[section.id] || {};
      
      // If setting to Dominant, clear any other Dominant
      let newAnswers = { ...currentSectionAnswers };
      if (rank === 3) {
          Object.keys(newAnswers).forEach(key => {
              if (newAnswers[key] === 3) newAnswers[key] = 0;
          });
      }
      
      newAnswers[qId] = rank;
      
      setAnswers(prev => ({
          ...prev,
          [section.id]: newAnswers
      }));
  };

  const handleSingleSelect = (qId) => {
      setAnswers(prev => ({
          ...prev,
          [section.id]: { [qId]: 1 }
      }));
  };

  const handleMultiToggle = (qId) => {
      const currentVal = (answers[section.id] || {})[qId] || 0;
      setAnswers(prev => ({
          ...prev,
          [section.id]: {
              ...(prev[section.id] || {}),
              [qId]: currentVal === 0 ? 1 : 0
          }
      }));
  }

  const nextSection = () => {
    if (currentSectionIndex < vikritiSections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
    } else {
      onComplete(answers);
    }
  };

  const prevSection = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
    }
  };

  const autoFillVikriti = () => {
      const allAnswers = {};
      vikritiSections.forEach(sec => {
          const secQuestions = vikritiQuestions[sec.id];
          const secAnswers = {};
          
          if (sec.type === 'ranking') {
              // One dominant, one secondary
              secAnswers[secQuestions[0].id] = 3;
              secAnswers[secQuestions[1].id] = 1;
          } else if (sec.type === 'single') {
              secAnswers[secQuestions[0].id] = 1;
          } else if (sec.type === 'multi-intensity') {
              secQuestions.forEach(q => {
                  secAnswers[q.id] = Math.floor(Math.random() * 3); // 0, 1, or 2
              });
          } else {
              secQuestions.forEach(q => {
                  secAnswers[q.id] = Math.random() > 0.5 ? 1 : 0;
              });
          }
          allAnswers[sec.id] = secAnswers;
      });
      setAnswers(allAnswers);
      setCurrentSectionIndex(vikritiSections.length - 1);
  };

  return (
    <div className="card">
      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="section-badge" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <span>Vikriti Assessment: {section.title}</span>
        <button 
          onClick={autoFillVikriti}
          style={{ 
            background: 'rgba(255,255,255,0.1)', 
            border: 'none', 
            color: 'var(--text-light)', 
            fontSize: '0.7rem', 
            cursor: 'pointer',
            padding: '2px 8px',
            borderRadius: '4px'
          }}
        >
          DEBUG: Auto-fill
        </button>
      </div>

      <div className="question-container">
        <p className="instruction-text">
            {section.type === 'multi-intensity' && "Select the intensity of symptoms you experience recently (last 2-4 weeks)."}
            {section.type === 'ranking' && "Which pattern fits your digestion most? Choose one primary (Dominant) and one secondary."}
            {section.type === 'single' && "Select the current dominant climate/environment."}
            {section.type === 'multi' && "Select all applicable lifestyle factors."}
        </p>

        <div className="vikriti-items-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {questions.map((q) => {
              const currentVal = (answers[section.id] || {})[q.id] || 0;
              
              return (
                <div key={q.id} className="vikriti-item">
                    <div className="vikriti-item-header">
                        <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-dark)' }}>{q.label}</div>
                        {q.reason && <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginTop: '2px' }}>{q.reason}</div>}
                    </div>
                    
                    <div className="intensity-options">
                        {section.type === 'multi-intensity' && (
                            <>
                                <button 
                                    type="button"
                                    className={`btn-sm ${currentVal === 0 ? 'active' : ''}`}
                                    onClick={() => handleIntensityChange(q.id, 0)}
                                >None</button>
                                <button 
                                    type="button"
                                    className={`btn-sm ${currentVal === 1 ? 'active' : ''}`}
                                    onClick={() => handleIntensityChange(q.id, 1)}
                                >Occasional (+1)</button>
                                <button 
                                    type="button"
                                    className={`btn-sm ${currentVal === 2 ? 'active' : ''}`}
                                    onClick={() => handleIntensityChange(q.id, 2)}
                                >Strong (+2)</button>
                            </>
                        )}

                        {section.type === 'ranking' && (
                            <>
                                 <button 
                                    type="button"
                                    className={`btn-sm ${currentVal === 0 ? 'active' : ''}`}
                                    onClick={() => handleRankChange(q.id, 0)}
                                >None</button>
                                <button 
                                    type="button"
                                    className={`btn-sm ${currentVal === 3 ? 'active' : ''}`}
                                    onClick={() => handleRankChange(q.id, 3)}
                                >Dominant (+3)</button>
                                <button 
                                    type="button"
                                    className={`btn-sm ${currentVal === 1 ? 'active' : ''}`}
                                    onClick={() => handleRankChange(q.id, 1)}
                                >Secondary (+1)</button>
                            </>
                        )}

                        {section.type === 'single' && (
                             <button 
                                type="button"
                                className={`btn-sm ${currentVal === 1 ? 'active' : ''}`}
                                onClick={() => handleSingleSelect(q.id)}
                            >Current Dominant (+1)</button>
                        )}

                        {section.type === 'multi' && (
                            <button 
                                type="button"
                                className={`btn-sm ${currentVal === 1 ? 'active' : ''}`}
                                onClick={() => handleMultiToggle(q.id)}
                            >{currentVal === 1 ? 'Selected' : 'Select'} (+1)</button>
                        )}
                    </div>
                </div>
              );
          })}
        </div>
      </div>

      <div className="wizard-footer">
        <button 
          className="btn btn-outline" 
          onClick={prevSection}
          disabled={currentSectionIndex === 0}
        >
          Previous
        </button>
        
        <span style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
          Section {currentSectionIndex + 1} of {vikritiSections.length}
        </span>

        <button 
          className="btn btn-primary" 
          onClick={nextSection}
        >
          {currentSectionIndex === vikritiSections.length - 1 ? 'Calculate Vikriti' : 'Next Section'}
        </button>
      </div>
    </div>
  );
};

export default VikritiWizard;
