import React from 'react';

export default function Navbar({ view, setView, token, username, onLogout }) {
  return (
    <nav className="navbar">
      {/* Brand logo acts as a home shortcut */}
      <div className="nav-logo" onClick={() => setView('home')}>MyPC</div>
      
      <div className="nav-links">
        {/* Added explicit Home button */}
        <button className={view === 'home' ? 'active' : ''} onClick={() => setView('home')}>Home</button>
        <button className={view === 'catalog' ? 'active' : ''} onClick={() => setView('catalog')}>Catalog</button>
        <button className={view === 'gpu' ? 'active' : ''} onClick={() => setView('gpu')}>GPU</button>
        <button className={view === 'ram' ? 'active' : ''} onClick={() => setView('ram')}>RAM</button>
        <button className={view === 'builder' ? 'active' : ''} onClick={() => setView('builder')}>Builder</button>
        {token ? (
          <div className="user-menu">
            <span>{username}</span>
            <button className="btn-logout" onClick={onLogout}>Sign Out</button>
          </div>
        ) : (
          <button className={view === 'auth' ? 'active' : ''} onClick={() => setView('auth')}>Sign In</button>
        )}
      </div>
    </nav>
  );
}
