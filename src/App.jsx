import React, { useState, useEffect } from 'react';
import { api } from './services/api';

// Import Custom Modular UI Files
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import GPU from './pages/GPU';
import RAM from './pages/RAM';
import Builder from './pages/Builder';
import Auth from './pages/Auth';

import './App.css';

export default function App() {
  const [view, setView] = useState('home'); 

  // Authentication State
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authUsername, setAuthUsername] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  // Core App Data State
  const [components, setComponents] = useState([]);
  const [builds, setBuilds] = useState([]);
  const [selectedBuild, setSelectedBuild] = useState(null);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [newBuildName, setNewBuildName] = useState('');
  const [feedback, setFeedback] = useState({ message: '', isError: false });

  // Load components on startup
  useEffect(() => {
    api.getComponents()
      .then(setComponents)
      .catch(() => showFeedback('Could not load hardware catalog.', true));
  }, []);

  // Load builds when token changes
  useEffect(() => {
    let active = true;

    const syncSession = async () => {
      if (!token) {
        setBuilds([]);
        setSelectedBuild(null);
        setSelectedComponent(null);
        return;
      }

      try {
        const user = await api.getCurrentUser(token);
        if (!active) return;
        setUsername(user.username);

        const data = await api.getUserBuilds(token);
        if (!active) return;
        setBuilds(data);
        setSelectedBuild(data[0] || null);
      } catch {
        if (!active) return;
        localStorage.clear();
        setToken('');
        setUsername('');
        setBuilds([]);
        setSelectedBuild(null);
        setSelectedComponent(null);
        setView('home');
      }
    };

    syncSession();

    return () => {
      active = false;
    };
  }, [token]);

  const showFeedback = (msg, isErr = false) => {
    setFeedback({ message: msg, isError: isErr });
    setTimeout(() => setFeedback({ message: '', isError: false }), 4000);
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isRegistering) {
        const res = await api.register(authUsername, authEmail, authPassword);
        if (res.error) throw new Error(res.error);
        showFeedback('Registration complete! Please sign in.');
        setIsRegistering(false);
      } else {
        const data = await api.login(authEmail, authPassword);
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('username', data.username);
        setToken(data.access_token);
        setUsername(data.username);
        showFeedback(`Welcome back, ${data.username}!`);
        setView('builder');
      }
    } catch (err) {
      showFeedback(err.message, true);
    }
  };

  const handleRemoveComponent = async (buildId, componentId) => {
    try {
      const res = await api.removeComponentFromBuild(buildId, componentId, token);
      showFeedback(res.message || 'Component removed.');
      
      // Refresh build data to update the totals and UI component list
      const updatedBuilds = await api.getUserBuilds(token);
      setBuilds(updatedBuilds);
      setSelectedBuild(updatedBuilds.find(b => b.id === buildId));
    } catch (err) {
      showFeedback(err.message, true);
    }
  };

  const handleViewSpecs = async (componentId) => {
    try {
      const data = await api.getComponent(componentId);
      setSelectedComponent(data);
    } catch (err) {
      showFeedback('Could not load component specs.', true);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setToken('');
    setUsername('');
    setBuilds([]);
    setSelectedBuild(null);
    setSelectedComponent(null);
    setView('home');
    showFeedback('Signed out successfully.');
  };

  const handleUpdateBuild = async (buildId, name) => {
    try {
      const res = await api.updateBuild(buildId, name, token);
      const updatedBuilds = await api.getUserBuilds(token);
      setBuilds(updatedBuilds);
      setSelectedBuild(updatedBuilds.find(b => b.id === buildId) || null);
      setNewBuildName('');
      showFeedback(res.message || 'Build updated.');
    } catch (err) {
      showFeedback(err.message, true);
    }
  };

  const handleDeleteBuild = async (buildId) => {
    try {
      const res = await api.deleteBuild(buildId, token);
      const updatedBuilds = await api.getUserBuilds(token);
      setBuilds(updatedBuilds);
      setSelectedBuild(updatedBuilds[0] || null);
      showFeedback(res.message || 'Build deleted.');
    } catch (err) {
      showFeedback(err.message, true);
    }
  };

  const handleCreateBuild = async (e) => {
    e.preventDefault();
    if (!newBuildName.trim()) return;
    try {
      await api.createBuild(newBuildName, token);
      const updatedBuilds = await api.getUserBuilds(token);
      setBuilds(updatedBuilds);
      const newlyCreated = updatedBuilds.find(b => b.name === newBuildName);
      if (newlyCreated) setSelectedBuild(newlyCreated);
      setNewBuildName('');
      showFeedback('Custom build initialized!');
    } catch (err) {
      showFeedback('Error starting build file.', true);
    }
  };

  const handleAddComponent = async (componentId) => {
    if (!selectedBuild) {
      showFeedback('Please create or select a PC Build first!', true);
      return;
    }
    try {
      const res = await api.addComponentToBuild(selectedBuild.id, componentId, token);
      showFeedback(res.message);
      const updatedBuilds = await api.getUserBuilds(token);
      setBuilds(updatedBuilds);
      setSelectedBuild(updatedBuilds.find(b => b.id === selectedBuild.id));
    } catch (err) {
      showFeedback(err.message, true); 
    }
  };

    return (
    <div className="app-container">
      {/* 1. Global Navigation */}
      <Navbar 
        view={view} 
        setView={setView} 
        token={token} 
        username={username} 
        onLogout={handleLogout} 
      />

      {/* 2. Global Status Notifications */}
      <Toast feedback={feedback} />

      {/* 3. Conditional Page Router */}
      <main className="main-content">
        {view === 'home' && (
          <Home token={token} setView={setView} />
        )}

        {view === 'catalog' && (
          <Catalog 
            components={components} 
            token={token} 
            onAddComponent={handleAddComponent} 
            selectedComponent={selectedComponent}
            onViewSpecs={handleViewSpecs}
          />
        )}

        {view === 'gpu' && <GPU />}

        {view === 'ram' && <RAM />}

        {view === 'builder' && (
          <Builder 
            token={token}
            setView={setView}
            builds={builds}
            selectedBuild={selectedBuild}
            setSelectedBuild={setSelectedBuild}
            newBuildName={newBuildName}
            setNewBuildName={setNewBuildName}
            onCreateBuild={handleCreateBuild}
            components={components}
            onAddComponent={handleAddComponent}
            onRemoveComponent={handleRemoveComponent}
            onUpdateBuild={handleUpdateBuild}
            onDeleteBuild={handleDeleteBuild}
          />
        )}

        {view === 'auth' && (
          <Auth 
            isRegistering={isRegistering}
            setIsRegistering={setIsRegistering}
            authUsername={authUsername}
            setAuthUsername={setAuthUsername}
            authEmail={authEmail}
            setAuthEmail={setAuthEmail}
            authPassword={authPassword}
            setAuthPassword={setAuthPassword}
            onAuth={handleAuth}
          />
        )}
      </main>
    </div>
  );

}
