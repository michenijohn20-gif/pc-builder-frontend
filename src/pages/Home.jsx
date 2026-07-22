import React from 'react';

export default function Home({ token, setView }) {
  return (
    <section className="hero-section">
      <h1 className="hero-title">The Smarter Way to Build Your Next PC.</h1>
      <p className="hero-subtitle">Select compatible components, track pricing, and save custom builds effortlessly.</p>
      <button className="btn-primary" onClick={() => setView(token ? 'builder' : 'auth')}>
        Start Building
      </button>
    </section>
  );
}