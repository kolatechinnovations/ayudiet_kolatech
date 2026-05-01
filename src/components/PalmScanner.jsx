import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

const PalmScanner = ({ onScanComplete, onCancel }) => {
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
      const apiUrl = import.meta.env.VITE_API_URL || 'https://ayudiet-kolatech.onrender.com';
      const response = await axios.post(`${apiUrl}/scan/palm`, {
        image: imgSrc
      });
      
      onScanComplete(response.data);
    } catch (err) {
      console.error('Scan error:', err);
      const msg = err.response?.data?.error || 'Failed to connect to scanner backend.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "environment" // Use back camera for palm usually easier
  };

  return (
    <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 className="question-text">Step 2: Palm Scan</h2>
      <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Place your open palm clearly in the frame. Ensure good lighting to see skin color and lines.
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
            Analyzing Palm...
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
            <button className="btn btn-outline" onClick={onCancel}>Skip Step</button>
            <button className="btn btn-primary" onClick={capture}>Capture Photo</button>
          </>
        ) : (
          <>
            <button className="btn btn-outline" onClick={retake} disabled={loading}>Retake</button>
            <button className="btn btn-primary" onClick={handleScan} disabled={loading}>
              {loading ? 'Processing...' : 'Confirm Palm'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PalmScanner;
