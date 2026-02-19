import React, { useState } from 'react';

const ResultsDisplay = ({ result, vikriti, onReset, onNext }) => {
  const { prakriti_scores, prakriti_percentage, prakriti_type } = result;
  const [showJson, setShowJson] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [loadingRules, setLoadingRules] = useState(false);
  const [recommendedFoods, setRecommendedFoods] = useState(null);
  const [loadingFoods, setLoadingFoods] = useState(false);

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

  const [selectedRule, setSelectedRule] = useState(null);

  const fetchRecommendations = async () => {
    setLoadingRules(true);
    try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';
        const response = await fetch(`${apiUrl}/recommendations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(vikritiObject)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.details || errorData.error || 'Server error');
        }

        const data = await response.json();
        if (Array.isArray(data)) {
            setRecommendations(data);
        } else {
            console.error("Expected array of rules, got:", data);
            alert("Received invalid data from server.");
        }
    } catch (error) {
        console.error("Error fetching rules:", error);
        alert(`Failed to fetch dietary rules: ${error.message}`);
    } finally {
        setLoadingRules(false);
    }
  };

  const fetchFoodRecommendations = async () => {
    setLoadingFoods(true);
    try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';
        const response = await fetch(`${apiUrl}/food-recommendations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(vikritiObject)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.details || errorData.error || 'Server error');
        }

        const data = await response.json();
        if (Array.isArray(data)) {
            setRecommendedFoods(data);
        } else {
            console.error("Expected array of foods, got:", data);
            alert("Received invalid data from server.");
        }
    } catch (error) {
        console.error("Error fetching foods:", error);
        alert(`Failed to fetch food recommendations: ${error.message}`);
    } finally {
        setLoadingFoods(false);
    }
  };

  const copyToClipboard = (obj) => {
    navigator.clipboard.writeText(JSON.stringify(obj, null, 2));
    alert('Copied to clipboard!');
  };

  const renderDetailSection = (title, data, type) => {
    if (!data || Object.keys(data).length === 0) return null;
    
    return (
      <div style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ 
          fontSize: '0.85rem', 
          fontWeight: 800,
          textTransform: 'uppercase', 
          color: type === 'increase' ? 'var(--primary-color)' : '#e11d48',
          background: type === 'increase' ? '#f0fdf4' : '#fff1f2',
          padding: '6px 12px',
          borderRadius: '8px',
          display: 'inline-block',
          marginBottom: '12px'
        }}>
          {title}
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
          {Object.entries(data).map(([key, values]) => (
            <div key={key} style={{ 
              background: '#f8fafc', 
              padding: '10px', 
              borderRadius: '12px',
              border: '1px solid #f1f5f9'
            }}>
              <div style={{ 
                fontSize: '0.65rem', 
                fontWeight: 800, 
                color: 'var(--text-light)', 
                opacity: 0.7, 
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '2px'
              }}>{key}</div>
              <div style={{ 
                fontSize: '0.9rem', 
                fontWeight: 700,
                color: 'var(--text-dark)'
              }}>{Array.isArray(values) ? values.join(', ') : values}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="card">
      {/* Detail Modal Overlay */}
      {selectedRule && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          backdropFilter: 'blur(8px)'
        }} onClick={() => setSelectedRule(null)}>
          <div style={{
            background: 'var(--white)',
            width: '100%',
            maxWidth: '550px',
            maxHeight: '90vh',
            borderRadius: '24px',
            overflow: 'auto',
            padding: '2.5rem',
            position: 'relative',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: 'none',
            color: 'var(--text-dark)'
          }} onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setSelectedRule(null)}
              style={{
                position: 'absolute',
                top: '1.2rem',
                right: '1.2rem',
                background: '#f1f5f9',
                border: 'none',
                color: 'var(--text-light)',
                fontSize: '1.2rem',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              ×
            </button>

            <div style={{ marginBottom: '1.5rem' }}>
              <span style={{ 
                fontSize: '0.75rem', 
                fontWeight: 800, 
                textTransform: 'uppercase', 
                color: 'var(--primary-color)', 
                background: 'rgba(44, 95, 80, 0.1)',
                padding: '4px 10px',
                borderRadius: '6px'
              }}>
                {selectedRule.category}
              </span>
              <h2 style={{ 
                margin: '12px 0 8px 0', 
                fontSize: '1.8rem', 
                fontWeight: 800,
                color: 'var(--text-dark)',
                lineHeight: 1.2
              }}>
                {selectedRule.rule_id.replace('VR_', '').replace(/_/g, ' ')}
              </h2>
              <p style={{ 
                fontSize: '1rem', 
                color: 'var(--text-light)', 
                lineHeight: '1.6',
                margin: 0 
              }}>
                {selectedRule.why}
              </p>
            </div>
            
            <div style={{ 
              background: '#f8fafc', 
              padding: '1.2rem', 
              borderRadius: '16px', 
              marginBottom: '2rem',
              border: '1px solid #e2e8f0'
            }}>
                <span style={{ 
                  fontSize: '0.7rem', 
                  fontWeight: 700, 
                  textTransform: 'uppercase', 
                  color: 'var(--text-light)',
                  display: 'block',
                  marginBottom: '4px'
                }}>
                  Triggering Factors
                </span>
                <div style={{ 
                  fontSize: '0.95rem', 
                  fontWeight: 600,
                  color: 'var(--text-dark)' 
                }}>
                  {selectedRule.trigger_factor}
                </div>
            </div>

            {renderDetailSection("✅ Recommendations (Increase/Favor)", selectedRule.details?.increase, 'increase')}
            {renderDetailSection("🚫 Avoid (Minimize)", selectedRule.details?.avoid, 'avoid')}

            <button 
              className="btn btn-primary" 
              onClick={() => setSelectedRule(null)}
              style={{ 
                width: '100%', 
                marginTop: '1rem',
                padding: '1rem',
                fontSize: '1.1rem',
                borderRadius: '12px'
              }}
            >
              Close Details
            </button>
          </div>
        </div>
      )}

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
                          <div 
                            key={rule.rule_id} 
                            className="vikriti-item" 
                            onClick={() => setSelectedRule(rule)}
                            style={{ 
                                background: rule.type === 'Primary' ? 'rgba(44, 95, 80, 0.05)' : 'rgba(0,0,0,0.02)', 
                                borderLeft: `4px solid ${rule.type === 'Primary' ? 'var(--primary-color)' : 'var(--accent-color)'}`,
                                cursor: 'pointer',
                                transition: 'transform 0.2s, box-shadow 0.2s'
                            }}
                          >
                               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                   <div>
                                       <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-light)', opacity: 0.6 }}>{rule.category}</span>
                                       <div style={{ fontWeight: 700, fontSize: '1.1rem', margin: '4px 0' }}>{rule.why}</div>
                                       <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                                           <strong>Factor:</strong> {rule.trigger_factor}
                                       </div>
                                       <div style={{ fontSize: '0.75rem', color: 'var(--primary-color)', fontWeight: 600, marginTop: '8px' }}>
                                           View Details →
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

          {recommendedFoods && (
              <section style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
                   <h2 className="question-text" style={{ textAlign: 'center', fontSize: '1.8rem' }}>
                       Selected Superfoods for You
                  </h2>
                  <p style={{ textAlign: 'center', color: 'var(--text-light)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                      Highly recommended foods based on your specific clinical patterns and digestion.
                  </p>
                  <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                      gap: '12px', 
                      marginTop: '1.5rem' 
                  }}>
                      {recommendedFoods.map((food, idx) => (
                          <div 
                            key={idx} 
                            style={{ 
                                background: 'white', 
                                padding: '1.2rem', 
                                borderRadius: '16px',
                                border: '1px solid #e2e8f0',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                          >
                               <div style={{ 
                                   fontSize: '0.7rem', 
                                   fontWeight: 800, 
                                   textTransform: 'uppercase', 
                                   color: food.final_score >= 8 ? 'var(--primary-color)' : 'var(--accent-color)',
                                   marginBottom: '4px'
                               }}>
                                   {food.category}
                               </div>
                               <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-dark)' }}>
                                   {food.food_name}
                               </div>
                               <div style={{ 
                                   display: 'flex', 
                                   justifyContent: 'space-between', 
                                   alignItems: 'center',
                                   marginTop: 'auto',
                                   paddingTop: '12px'
                               }}>
                                   <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>Score: {food.final_score}</div>
                                   <div style={{ 
                                       fontSize: '0.65rem', 
                                       background: '#f1f5f9', 
                                       padding: '2px 6px', 
                                       borderRadius: '4px',
                                       fontWeight: 600
                                   }}>
                                       {food.known_properties}/4 Data
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

        {recommendations && !recommendedFoods && (
            <button 
                className="btn btn-primary" 
                onClick={fetchFoodRecommendations} 
                disabled={loadingFoods}
                style={{ background: '#7c2d12', borderColor: '#7c2d12', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
                {loadingFoods ? 'Calculating...' : '🍎 Show Selected Food'}
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

