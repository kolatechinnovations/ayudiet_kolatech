import React, { useState } from 'react';
import { questions, sections } from '../data/prakritiData';

const AssessmentWizard = ({ onComplete, initialScanData }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Initialize answers with mapping if scan data is present
  const [answers, setAnswers] = useState(() => {
    const initial = new Array(questions.length).fill(null);
    if (!initialScanData || !initialScanData.question_predictions) return initial;

    const predictions = initialScanData.question_predictions;

    // Use a more dynamic approach: iterate through backend predictions
    Object.keys(predictions).forEach(qId => {
      const questionIndex = questions.findIndex(q => q.id === parseInt(qId));
      if (questionIndex !== -1) {
        const question = questions[questionIndex];
        const predictedValue = predictions[qId];
        
        // Find the option that matches the predicted value
        const option = question.options.find(o => o.text === predictedValue);
        if (option) {
          initial[questionIndex] = option;
        }
      }
    });

    return initial;
  });

  const currentQuestion = questions[currentIndex];
  const currentSection = sections.find(s => s.id === currentQuestion.section);
  
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleOptionSelect = (option) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = option;
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

  const canNext = answers[currentIndex] !== null;

  return (
    <div className="card">
      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="section-badge">
        Section {currentSection.id}: {currentSection.title}
      </div>

      <div className="question-container">
        <h2 className="question-text">
          {currentIndex + 1}. {currentQuestion.question}
        </h2>

        <div className="options-grid">
          {currentQuestion.options.map((option, idx) => (
            <button
              key={idx}
              className={`option-card ${answers[currentIndex]?.text === option.text ? 'selected' : ''}`}
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
    </div>
  );
};

export default AssessmentWizard;
