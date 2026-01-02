import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

const FaceScanner = ({ onScanComplete, onCancel }) => {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef]);

  const retake = () => {
    setImgSrc(null);
    setError(null);
  };

  const handleScan = async () => {
    if (!imgSrc) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('http://localhost:5000/scan', {
        image: imgSrc
      });
      
      onScanComplete(response.data);
    } catch (err) {
      console.error('Scan error:', err);
      const msg = err.response?.data?.error || 'Failed to connect to scanner backend. Make sure the Flask server is running.';
      setError(msg);
      // If it's a backend error (like no face), let the user retake
    } finally {
      setLoading(false);
    }
  };

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user"
  };

  return (
    <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 className="question-text">AI Face Scan</h2>
      <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Point your face to the camera. We'll analyze your facial structure and skin tone to help auto-fill some questions.
      </p>

      <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', backgroundColor: '#000', borderRadius: '12px', overflow: 'hidden', marginBottom: '1.5rem' }}>
        {!imgSrc ? (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            onUserMediaError={() => setError("Webcam access denied. Please allow camera permissions.")}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <img src={imgSrc} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        )}
        
        {loading && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            Analyzing...
          </div>
        )}
      </div>

      {error && (
        <div style={{ padding: '10px', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem' }}>
          {error}
        </div>
      )}

      <div className="wizard-footer">
        {!imgSrc ? (
          <>
            <button className="btn btn-outline" onClick={onCancel}>Skip Scan</button>
            <button className="btn btn-primary" onClick={capture}>Capture Photo</button>
          </>
        ) : (
          <>
            <button className="btn btn-outline" onClick={retake} disabled={loading}>Retake</button>
            <button className="btn btn-primary" onClick={handleScan} disabled={loading}>
              {loading ? 'Processing...' : 'Analyze Face'}
            </button>
          </>
        )}
      </div>

      <p style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center' }}>
        <strong>Privacy Note:</strong> Your photo is processed locally and not stored. 
        <br />Camera works only on HTTPS in production.
      </p>
    </div>
  );
};

export default FaceScanner;
