import React, { useState } from 'react';

interface AuthProps {
  onSuccess: () => void;
}

export default function Auth({ onSuccess }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess();
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 2v6h-6"></path>
                <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
                <path d="M3 22v-6h6"></path>
                <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
              </svg>
            </div>
            <h1 className="auth-title">
              {isLogin ? 'Sign in to your account' : 'Create an account'}
            </h1>
            <p className="auth-subtitle">
              Welcome to Circular Exchange, the premier B2B materials marketplace.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <>
                <div className="form-group">
                  <label className="form-label" htmlFor="company-name">Company Name</label>
                  <input
                    id="company-name"
                    type="text"
                    required
                    className="form-input"
                    placeholder="Acme Corp"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="email">Business Email</label>
                  <input
                    id="email"
                    type="email"
                    required
                    className="form-input"
                    placeholder="contact@acme.com"
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                type="tel"
                required
                className="form-input"
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">
                {isLogin ? 'Password' : 'Create Password'}
              </label>
              <input
                id="password"
                type="password"
                required
                className="form-input"
                placeholder="••••••••"
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '8px' }}>
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p className="auth-toggle">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="auth-toggle-btn"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>

      <div className="auth-right">
        <h2 style={{ fontFamily: 'Space Grotesk', fontSize: '36px', fontWeight: 700, marginBottom: '24px', lineHeight: 1.2 }}>
          Accelerate your transition to a circular economy.
        </h2>
        <p style={{ fontSize: '18px', opacity: 0.9, lineHeight: 1.6, maxWidth: '480px' }}>
          Join hundreds of leading enterprises trading surplus packaging materials. Cut procurement costs and reduce your scope 3 emissions on a single, secure platform.
        </p>
        <div style={{ display: 'flex', gap: '24px', marginTop: '48px' }}>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 700 }}>2.4K+</div>
            <div style={{ fontSize: '14px', opacity: 0.8 }}>Active Listings</div>
          </div>
          <div style={{ width: '1px', background: 'rgba(255,255,255,0.2)' }} />
          <div>
            <div style={{ fontSize: '24px', fontWeight: 700 }}>850t</div>
            <div style={{ fontSize: '14px', opacity: 0.8 }}>CO₂ Saved</div>
          </div>
        </div>
      </div>
    </div>
  );
}