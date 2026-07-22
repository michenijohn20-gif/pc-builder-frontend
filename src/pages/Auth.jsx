import React from 'react';

export default function Auth({ 
  isRegistering, 
  setIsRegistering, 
  authUsername, 
  setAuthUsername, 
  authEmail, 
  setAuthEmail, 
  authPassword, 
  setAuthPassword, 
  onAuth 
}) {
  return (
    <section className="auth-section">
      <div className="auth-card">
        <h2>{isRegistering ? 'Create Account' : 'Welcome Back'}</h2>
        <form onSubmit={onAuth}>
          {isRegistering && (
            <div className="form-group">
              <label>Username</label>
              <input 
                type="text" 
                value={authUsername} 
                onChange={(e) => setAuthUsername(e.target.value)} 
                required 
              />
            </div>
          )}
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              value={authEmail} 
              onChange={(e) => setAuthEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              value={authPassword} 
              onChange={(e) => setAuthPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="btn-primary w-100">
            {isRegistering ? 'Sign Up' : 'Sign In'}
          </button>
        </form>
        <button className="btn-flat" onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </button>
      </div>
    </section>
  );
}