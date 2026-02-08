import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../App.css';
import './pages.css';

function GoogleCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('Processing...');

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');

      if (error) {
        setStatus('Authentication failed. Redirecting...');
        setTimeout(() => navigate('/signin'), 2000);
        return;
      }

      if (!code) {
        setStatus('No authorization code received. Redirecting...');
        setTimeout(() => navigate('/signin'), 2000);
        return;
      }

      try {
        setStatus('Authenticating with Google...');
        
        // TODO: Send the code to your backend to exchange for tokens
        // Example backend call:
        // const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/google`, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ code })
        // });
        // const data = await response.json();
        
        // For now, simulate successful authentication
        console.log('Authorization code:', code);
        
        // Store user data (you'll get this from your backend)
        // localStorage.setItem('token', data.token);
        // localStorage.setItem('user', JSON.stringify(data.user));
        
        setStatus('Success! Redirecting to home...');
        setTimeout(() => navigate('/'), 2000);
        
      } catch (err) {
        console.error('Authentication error:', err);
        setStatus('Authentication failed. Redirecting...');
        setTimeout(() => navigate('/signin'), 2000);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="auth-page">
      <section className="page-hero">
        <div className="container">
          <h1 className="display-l">Authenticating...</h1>
        </div>
      </section>

      <section className="auth-content">
        <div className="container">
          <div className="auth-container">
            <div className="auth-card" style={{ textAlign: 'center' }}>
              <div style={{ padding: '40px 0' }}>
                <div className="loading-spinner" style={{ 
                  width: '50px', 
                  height: '50px', 
                  border: '4px solid #f3f3f3',
                  borderTop: '4px solid var(--color-primary-teal)',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 24px'
                }}></div>
                <h2 className="heading-2">{status}</h2>
                <p className="body-m" style={{ color: 'var(--color-text-secondary)', marginTop: '16px' }}>
                  Please wait while we complete your authentication...
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default GoogleCallback;
