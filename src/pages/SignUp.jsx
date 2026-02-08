import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import '../App.css';
import './pages.css';

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    if (!acceptTerms) {
      setError('Please accept the terms and conditions');
      setLoading(false);
      return;
    }

    try {
      // Sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            full_name: `${formData.firstName} ${formData.lastName}`
          }
        }
      });

      if (error) throw error;

      console.log('Signed up successfully:', data);
      // Show success message
      setError('Account created! Please check your email to verify your account.');
      // Navigate to sign in page after a delay
      setTimeout(() => navigate('/signin'), 3000);
    } catch (error) {
      setError(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const { data, error} = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });

      if (error) throw error;
    } catch (error) {
      setError(error.message || 'Failed to sign up with Google');
    }
  };

  const handleGitHubSignUp = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });

      if (error) throw error;
    } catch (error) {
      setError(error.message || 'Failed to sign up with GitHub');
    }
  };

  return (
    <div className="auth-page">
      <section className="page-hero">
        <div className="container">
          <h1 className="display-l">Sign <span className="hero-accent">Up</span></h1>
          <p className="body-l">Join the Élanora community</p>
        </div>
      </section>

      <section className="auth-content">
        <div className="container">
          <div className="auth-container">
            <div className="auth-card">
              <h2 className="heading-2">Create Your Account</h2>
              <p className="body-m auth-subtitle">Start your premium fashion journey</p>

              {error && (
                <div className="auth-error">
                  <p className="body-s">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName" className="body-m">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="John"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="lastName" className="body-m">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="body-m">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password" className="body-m">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="At least 8 characters"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword" className="body-m">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Re-enter your password"
                    required
                  />
                </div>

                <div className="auth-options">
                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                    />
                    <span className="body-s">
                      I agree to the <a href="#terms" className="auth-link">Terms & Conditions</a> and <a href="#privacy" className="auth-link">Privacy Policy</a>
                    </span>
                  </label>
                </div>

                <button 
                  type="submit" 
                  className="btn-primary btn-full"
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>

              <div className="auth-divider">
                <span className="body-s">Or sign up with</span>
              </div>

              <div className="auth-social">
                <button className="auth-social-btn" onClick={handleGoogleSignUp}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M19.8 10.2273C19.8 9.51818 19.7364 8.83636 19.6182 8.18182H10V12.05H15.4818C15.2364 13.3 14.5273 14.3591 13.4727 15.0682V17.5773H16.7636C18.7182 15.8364 19.8 13.2727 19.8 10.2273Z" fill="#4285F4"/>
                    <path d="M10 20C12.7 20 14.9636 19.1045 16.7636 17.5773L13.4727 15.0682C12.5909 15.6682 11.4545 16.0227 10 16.0227C7.39545 16.0227 5.19091 14.2636 4.40455 11.9H0.995453V14.4909C2.78636 18.0591 6.10909 20 10 20Z" fill="#34A853"/>
                    <path d="M4.40455 11.9C4.19091 11.3 4.06818 10.6591 4.06818 10C4.06818 9.34091 4.19091 8.7 4.40455 8.1V5.50909H0.995453C0.363636 6.77273 0 8.18182 0 10C0 11.8182 0.363636 13.2273 0.995453 14.4909L4.40455 11.9Z" fill="#FBBC04"/>
                    <path d="M10 3.97727C11.5909 3.97727 13.0091 4.51818 14.1091 5.56364L17.0273 2.64545C14.9591 0.727273 12.6955 0 10 0C6.10909 0 2.78636 1.94091 0.995453 5.50909L4.40455 8.1C5.19091 5.73636 7.39545 3.97727 10 3.97727Z" fill="#EA4335"/>
                  </svg>
                  <span>Google</span>
                </button>

                <button className="auth-social-btn" onClick={handleGitHubSignUp}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" clipRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.137 18.165 20 14.418 20 10c0-5.523-4.477-10-10-10z"/>
                  </svg>
                  <span>GitHub</span>
                </button>
              </div>

              <div className="auth-footer">
                <p className="body-m">
                  Already have an account? <Link to="/signin" className="auth-link">Sign In</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SignUp;
