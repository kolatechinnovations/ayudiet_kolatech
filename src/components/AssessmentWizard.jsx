import React, { useState } from 'react';
import { questions, sections } from '../data/prakritiData';

const AssessmentWizard = ({ onComplete, initialScanData }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Initialize answers with mapping if scan data is present
  const [answers, setAnswers] = useState(() => {
    const initial = new Array(questions.length).fill(null);
    if (!initialScanData) return initial;

    // Support both flattened and section-based/ID-based structures
    // The previous app.py returned { question_predictions: ... }
    // The new merged data from App.jsx is just { "101": {value:"...", confidence:..}, ... }
    
    // Check if we need to access 'question_predictions' property or use data directly
    const predictions = initialScanData.question_predictions || initialScanData;

    Object.keys(predictions).forEach(qId => {
      const questionIndex = questions.findIndex(q => q.id === parseInt(qId));
      if (questionIndex !== -1) {
        const question = questions[questionIndex];
        const pred = predictions[qId];
        // Handle both object {value, confidence} and simple string formats
        const predictedValue = typeof pred === 'object' && pred.value ? pred.value : pred;
        
        // Find the option that matches the predicted value
        const option = question.options.find(o => o.text === predictedValue);
        if (option) {
          initial[questionIndex] = option;
        }
      }
    });

    return initial;
  });

  const autoFillAll = () => {
    const randomAnswers = questions.map(q => {
      const randomIndex = Math.floor(Math.random() * q.options.length);
      const selected = q.options[randomIndex];
      return q.allowMultiple ? [selected] : selected;
    });
    setAnswers(randomAnswers);
    setCurrentIndex(questions.length - 1);
  };

  /* Updated to handle both single and multiple selection */
  const currentQuestion = questions[currentIndex];
  // Safe check for section
  const currentSection = sections.find(s => s.id === currentQuestion.section) || { id: '?', title: 'Unknown' };
  
  // Get prediction for current question if exists
  const getPrediction = () => {
    if (!initialScanData) return null;
    const predictions = initialScanData.question_predictions || initialScanData;
    const pred = predictions[currentQuestion.id.toString()];
    if (!pred) return null;
    
    // Return object or normalize string
    if (typeof pred === 'object' && pred.value) return pred;
    return { value: pred, confidence: 1.0 }; // Fallback for old style
  };

  const prediction = getPrediction();

  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleOptionSelect = (option) => {
    const newAnswers = [...answers];
    
    if (currentQuestion.allowMultiple) {
      // Initialize if null
      let currentSelection = Array.isArray(newAnswers[currentIndex]) ? [...newAnswers[currentIndex]] : [];
      
      const existsIndex = currentSelection.findIndex(o => o.text === option.text);
      if (existsIndex > -1) {
        currentSelection.splice(existsIndex, 1);
      } else {
        currentSelection.push(option);
      }
      newAnswers[currentIndex] = currentSelection;
    } else {
      newAnswers[currentIndex] = option;
    }
    
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete(answers);
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const canNext = (() => {
    const ans = answers[currentIndex];
    if (currentQuestion.allowMultiple) {
      return Array.isArray(ans) && ans.length > 0;
    }
    return ans !== null;
  })();

  // Calculate which questions were AI-filled for the feedback text
  const aiFilledIndices = React.useMemo(() => {
    if (!initialScanData) return [];
    const predictions = initialScanData.question_predictions || initialScanData;
    const indices = [];
    Object.keys(predictions).forEach(qId => {
      const idx = questions.findIndex(q => q.id === parseInt(qId));
      if (idx !== -1) indices.push(idx + 1); // Store 1-based question numbers
    });
    return indices.sort((a, b) => a - b);
  }, [initialScanData]);

  return (
    <div className="card">
      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>

      {/* AI Auto-fill Feedback Message */}
      {aiFilledIndices.length > 0 && (
        <div style={{ 
          marginBottom: '1.5rem', 
          padding: '12px', 
          backgroundColor: '#f0fdf4', 
          border: '1px solid #86efac', 
          borderRadius: '8px', 
          fontSize: '0.9rem', 
          color: '#166534' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '1.2rem' }}>✨</span>
            <strong>AI Analysis Applied</strong>
          </div>
          <p style={{ margin: 0, lineHeight: '1.4' }}>
            Questions <strong>{aiFilledIndices.join(', ')}</strong> have been auto-filled based on your scan results.
            <br />
            <span style={{ fontSize: '0.85rem', opacity: 0.9 }}>
              You can review and manually change any answer if needed.
            </span>
          </p>
        </div>
      )}

      <div className="section-badge" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Section {currentSection.id}: {currentSection.title}</span>
        {prediction && (
           <span style={{ 
             fontSize: '0.75rem', 
             padding: '4px 8px', 
             borderRadius: '12px',
             backgroundColor: prediction.confidence >= 0.75 ? '#dcfce7' : '#fef9c3',
             color: prediction.confidence >= 0.75 ? '#166534' : '#854d0e',
             fontWeight: 600
           }}>
             {prediction.confidence >= 0.75 ? '✨ AI Filled' : '⚠️ Review Suggested'} 
             {prediction.confidence && ` (${Math.round(prediction.confidence * 100)}%)`}
           </span>
        )}
      </div>

      <div className="question-container">
        <h2 className="question-text">
          {currentIndex + 1}. {currentQuestion.question}
        </h2>

        <div className="options-grid">
          {currentQuestion.options.map((option, idx) => (
            <button
              key={idx}
              className={`option-card ${
                Array.isArray(answers[currentIndex]) 
                  ? answers[currentIndex].some(o => o.text === option.text) ? 'selected' : ''
                  : answers[currentIndex]?.text === option.text ? 'selected' : ''
              }`}
              onClick={() => handleOptionSelect(option)}
            >
              {option.text}
            </button>
          ))}
        </div>
      </div>

      <div className="wizard-footer">
        <button 
          className="btn btn-outline" 
          onClick={prevQuestion}
          disabled={currentIndex === 0}
        >
          Previous
        </button>
        
        <span style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
          Question {currentIndex + 1} of {questions.length}
        </span>

        <button 
          className="btn btn-primary" 
          onClick={nextQuestion}
          disabled={!canNext}
        >
          {currentIndex === questions.length - 1 ? 'See Results' : 'Next Question'}
        </button>
      </div>

      {/* Fast Fill Debug Button */}
      <div style={{ marginTop: '2rem', textAlign: 'center', borderTop: '1px dashed #e2e8f0', paddingTop: '1rem' }}>
        <button 
          onClick={autoFillAll}
          style={{ 
            background: 'transparent', 
            border: '1px solid #cbd5e1', 
            padding: '8px 16px', 
            borderRadius: '6px', 
            fontSize: '0.8rem', 
            color: '#64748b', 
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => { e.target.style.borderColor = '#94a3b8'; e.target.style.color = '#475569'; }}
          onMouseOut={(e) => { e.target.style.borderColor = '#cbd5e1'; e.target.style.color = '#64748b'; }}
        >
          ⚡ Fill all answers for fast testing
        </button>
      </div>
    </div>
  );
};

export default AssessmentWizard;
