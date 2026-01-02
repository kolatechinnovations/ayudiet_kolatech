import React from 'react';

const ResultsDisplay = ({ result, vikriti, onReset, onNext }) => {
  const { prakriti_scores, prakriti_percentage, prakriti_type } = result;

  return (
    <div className="card">
      <div className="section-badge">{vikriti ? 'Full Ayurveda Profile' : 'Stage 1: Prakriti Complete'}</div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <section>
            <h2 className="question-text" style={{ textAlign: 'center', fontSize: '1.8rem' }}>
                Your Prakriti (Birth Nature)
            </h2>
            
            <p style={{ textAlign: 'center', color: 'var(--text-light)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                Your permanent constitution that doesn't change throughout life.
            </p>

            <div className="results-grid">
                <div className="score-card vata">
                <div className="score-value">{prakriti_percentage.vata}%</div>
                <div className="score-label">Vata</div>
                <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>Score: {prakriti_scores.vata}</div>
                </div>
                
                <div className="score-card pitta">
                <div className="score-value">{prakriti_percentage.pitta}%</div>
                <div className="score-label">Pitta</div>
                <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>Score: {prakriti_scores.pitta}</div>
                </div>
                
                <div className="score-card kapha">
                <div className="score-value">{prakriti_percentage.kapha}%</div>
                <div className="score-label">Kapha</div>
                <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>Score: {prakriti_scores.kapha}</div>
                </div>
            </div>

            <div className="type-banner" style={{ marginTop: '1.5rem', padding: '1rem' }}>
                <p style={{ textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                Dominant Prakriti
                </p>
                <h3 style={{ margin: 0, color: 'var(--primary)' }}>{prakriti_type}</h3>
            </div>
          </section>

          {vikriti && (
              <section style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
                  <h2 className="question-text" style={{ textAlign: 'center', fontSize: '1.8rem' }}>
                      Your Vikriti (Current State)
                  </h2>
                  
                  <p style={{ textAlign: 'center', color: 'var(--text-light)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                      Your current imbalances based on symptoms and environment.
                  </p>

                  <div className="results-grid">
                      <div className="score-card vata" style={{ opacity: vikriti.vikriti_percentage.vata >= 40 ? 1 : 0.6 }}>
                        <div className="score-value">{vikriti.vikriti_percentage.vata}%</div>
                        <div className="score-label">Vata</div>
                        <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>Score: {vikriti.vikriti_scores.vata}</div>
                      </div>
                      
                      <div className="score-card pitta" style={{ opacity: vikriti.vikriti_percentage.pitta >= 40 ? 1 : 0.6 }}>
                        <div className="score-value">{vikriti.vikriti_percentage.pitta}%</div>
                        <div className="score-label">Pitta</div>
                        <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>Score: {vikriti.vikriti_scores.pitta}</div>
                      </div>
                      
                      <div className="score-card kapha" style={{ opacity: vikriti.vikriti_percentage.kapha >= 40 ? 1 : 0.6 }}>
                        <div className="score-value">{vikriti.vikriti_percentage.kapha}%</div>
                        <div className="score-label">Kapha</div>
                        <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>Score: {vikriti.vikriti_scores.kapha}</div>
                      </div>
                  </div>

                  <div className="type-banner imbalance" style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255, 107, 107, 0.1)', border: '1px solid rgba(255, 107, 107, 0.2)' }}>
                      <p style={{ textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                      Detected Imbalance
                      </p>
                      <h3 style={{ margin: 0, color: '#ff6b6b' }}>{vikriti.vikriti_interpretation}</h3>
                  </div>
              </section>
          )}
      </div>

      <div className="wizard-footer" style={{ border: 'none', justifyContent: 'center', marginTop: '2rem', gap: '1rem' }}>
        <button className="btn btn-outline" onClick={onReset}>
          Reset All
        </button>
        {!vikriti && (
            <button className="btn btn-primary" onClick={onNext}>
                Assess Vikriti (Imbalance)
            </button>
        )}
      </div>
    </div>
  );
};

export default ResultsDisplay;
