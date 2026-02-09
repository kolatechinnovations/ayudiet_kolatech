import React, { useState } from 'react';

const ResultsDisplay = ({ result, vikriti, onReset, onNext }) => {
  const { prakriti_scores, prakriti_percentage, prakriti_type } = result;
  const [showJson, setShowJson] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [loadingRules, setLoadingRules] = useState(false);

  // Prepare structured objects for display
  const prakritiObject = {
    prakriti: result.prakriti,
    baseline_agni: result.baseline_agni,
    bala: result.bala,
    tolerance: result.tolerance
  };

  const vikritiObject = vikriti ? {
    vikriti: vikriti.vikriti,
    agni: vikriti.agni,
    symptoms: vikriti.symptoms,
    hetu: vikriti.hetu,
    season: vikriti.season,
    lifestyle_flags: vikriti.lifestyle_flags
  } : null;

  const fetchRecommendations = async () => {
    setLoadingRules(true);
    try {
        const response = await fetch('http://localhost:5000/recommendations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(vikritiObject)
        });
        const data = await response.json();
        setRecommendations(data);
    } catch (error) {
        console.error("Error fetching rules:", error);
        alert("Failed to fetch dietary rules. Is the backend running?");
    } finally {
        setLoadingRules(false);
    }
  };

  const copyToClipboard = (obj) => {
    navigator.clipboard.writeText(JSON.stringify(obj, null, 2));
    alert('Copied to clipboard!');
  };

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
                <h3 style={{ margin: 0, color: 'var(--white)' }}>{prakriti_type}</h3>
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

          {recommendations && (
              <section style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
                   <h2 className="question-text" style={{ textAlign: 'center', fontSize: '1.8rem' }}>
                      Your Ayurvedic Dietary Rules
                  </h2>
                  <div style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem' }}>
                      {recommendations.map((rule) => (
                          <div key={rule.rule_id} className="vikriti-item" style={{ background: rule.type === 'Primary' ? 'rgba(44, 95, 80, 0.05)' : 'rgba(0,0,0,0.02)', borderLeft: `4px solid ${rule.type === 'Primary' ? 'var(--primary-color)' : 'var(--accent-color)'}` }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                  <div>
                                      <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-light)', opacity: 0.6 }}>{rule.category}</span>
                                      <div style={{ fontWeight: 700, fontSize: '1.1rem', margin: '4px 0' }}>{rule.why}</div>
                                      <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                                          <strong>Factor:</strong> {rule.trigger_factor}
                                      </div>
                                  </div>
                                  <div style={{ textAlign: 'right' }}>
                                      <div style={{ background: rule.type === 'Primary' ? 'var(--primary-color)' : 'var(--accent-color)', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700 }}>{rule.type}</div>
                                      <div style={{ fontSize: '0.75rem', marginTop: '4px', opacity: 0.5 }}>Weight: {rule.final_weight}</div>
                                  </div>
                              </div>
                          </div>
                      ))}
                  </div>
              </section>
          )}
      </div>

      <div className="wizard-footer" style={{ border: 'none', justifyContent: 'center', marginTop: '2rem', gap: '1rem', flexWrap: 'wrap' }}>
        <button className="btn btn-outline" onClick={onReset}>
          Reset All
        </button>
        
        <button 
          className="btn btn-outline" 
          onClick={() => setShowJson(!showJson)}
          style={{ background: 'var(--accent)', borderColor: 'var(--accent)', color: 'white' }}
        >
          📋 {showJson ? 'Hide' : 'View'} Result Objects
        </button>

        {vikriti && !recommendations && (
            <button 
                className="btn btn-primary" 
                onClick={fetchRecommendations} 
                disabled={loadingRules}
                style={{ background: '#2c5f50', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
                {loadingRules ? 'Analyzing...' : '🥗 See Your Selected Rules'}
            </button>
        )}
        
        {!vikriti && (
            <button className="btn btn-primary" onClick={onNext}>
                Assess Vikriti (Imbalance)
            </button>
        )}
      </div>

      {/* JSON Display Modal/Section */}
      {showJson && (
        <div style={{ 
          marginTop: '2rem', 
          padding: '1.5rem', 
          background: 'rgba(0,0,0,0.3)', 
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.2rem' }}>📋 Structured Result Objects</h3>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--accent)' }}>Prakriti Assessment Result</h4>
              <button onClick={() => copyToClipboard(prakritiObject)} style={{ padding: '4px 12px', fontSize: '0.8rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: 'white', cursor: 'pointer' }}>📄 Copy</button>
            </div>
            <pre style={{ background: 'rgba(0,0,0,0.5)', padding: '1rem', borderRadius: '8px', overflow: 'auto', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>{JSON.stringify(prakritiObject, null, 2)}</pre>
          </div>

          {vikritiObject && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h4 style={{ margin: 0, fontSize: '1rem', color: '#ff6b6b' }}>Vikriti Assessment Result</h4>
                <button onClick={() => copyToClipboard(vikritiObject)} style={{ padding: '4px 12px', fontSize: '0.8rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: 'white', cursor: 'pointer' }}>📄 Copy</button>
              </div>
              <pre style={{ background: 'rgba(0,0,0,0.5)', padding: '1rem', borderRadius: '8px', overflow: 'auto', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>{JSON.stringify(vikritiObject, null, 2)}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResultsDisplay;

