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
      {/* Background effects */}
      <div className="bg-grid" />
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />

      <div className="auth-container">
        <div className="auth-card">
          {/* Header */}
          <div className="auth-header">
            <div className="auth-logo">♻️</div>
            <div className="auth-brand">
              Circular <span className="highlight">Exchange</span>
            </div>
            <p className="auth-tagline">
              The marketplace for recycled packaging &amp; sustainable materials
            </p>
          </div>

          {/* Mode title */}
          <p className="auth-mode-title">
            {isLogin ? '👋 Welcome back' : '🌱 Create your account'}
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <>
                <div className="form-group">
                  <label className="form-label" htmlFor="company-name">Company / User Name</label>
                  <input
                    id="company-name"
                    type="text"
                    required
                    className="form-input"
                    placeholder="Eco Corp Ltd."
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="email">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    required
                    className="form-input"
                    placeholder="contact@ecocorp.com"
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
                placeholder="+91 98765 43210"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">
                {isLogin ? 'Password' : 'Create Strong Password'}
              </label>
              <input
                id="password"
                type="password"
                required
                className="form-input"
                placeholder="••••••••••"
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '4px' }}>
              {isLogin ? '→ Sign In' : '🌿 Create Account'}
            </button>
          </form>

          {/* Toggle */}
          <p className="auth-toggle">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="auth-toggle-btn"
            >
              {isLogin ? 'Sign up free' : 'Sign in'}
            </button>
          </p>

          {/* Feature pills */}
          <div className="auth-feature-pills">
            <div className="feature-pill">🌍 Carbon Neutral</div>
            <div className="feature-pill">♻️ Circular Economy</div>
            <div className="feature-pill">🔒 Verified Sellers</div>
          </div>
        </div>
      </div>
    </div>
  );
}