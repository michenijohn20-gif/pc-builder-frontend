import React, { useEffect, useState } from 'react';

export default function Builder({ 
  token, 
  setView, 
  builds, 
  selectedBuild, 
  setSelectedBuild, 
  newBuildName, 
  setNewBuildName, 
  onCreateBuild, 
  components, 
  onAddComponent,
  onRemoveComponent,
  onUpdateBuild,
  onDeleteBuild
}) {
  const [draftName, setDraftName] = useState(selectedBuild?.name || '');

  useEffect(() => {
    setDraftName(selectedBuild?.name || '');
  }, [selectedBuild]);

  if (!token) {
    return (
      <div className="auth-alert" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
        <h3>Authentication Required</h3>
        <p>Please sign in to save rigs and track hardware component compatibility.</p>
        <button className="btn-primary" onClick={() => setView('auth')}>Go to Sign In</button>
      </div>
    );
  }

  return (
    <section className="builder-section">
      <div className="workspace-layout">
        <div className="builder-left">
          <div className="build-creator">
            <h3>My Custom Builds</h3>
            <form onSubmit={onCreateBuild} className="inline-form">
              <input 
                type="text" 
                placeholder="e.g., Gaming Rig 2026" 
                value={newBuildName}
                onChange={(e) => setNewBuildName(e.target.value)}
                required
              />
              <button className="btn-action" type="submit">New Build</button>
            </form>

            {builds.length > 0 && (
              <select 
                value={selectedBuild?.id || ''} 
                onChange={(e) => setSelectedBuild(builds.find(b => b.id === parseInt(e.target.value, 10)))}
                className="build-selector"
              >
                {builds.map(b => (
                  <option key={b.id} value={b.id}>{b.name} (${b.total_price.toFixed(2)})</option>
                ))}
              </select>
            )}

            {selectedBuild && (
              <form
                className="inline-form build-update-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (draftName.trim()) onUpdateBuild(selectedBuild.id, draftName.trim());
                }}
              >
                <input
                  type="text"
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  placeholder="Rename selected build"
                />
                <button className="btn-action" type="submit">Update</button>
                <button
                  type="button"
                  className="btn-danger"
                  onClick={() => onDeleteBuild(selectedBuild.id)}
                >
                  Delete
                </button>
              </form>
            )}
          </div>

          <div className="quick-catalog">
            <h3>Add Parts to Build</h3>
            <div className="quick-list">
              {components.map(comp => (
                <div key={comp.id} className="quick-item">
                  <div>
                    <strong>{comp.name}</strong>
                    <p>{comp.category} | ${comp.price}</p>
                  </div>
                  <button className="btn-mini-add" onClick={() => onAddComponent(comp.id)}>Add</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="builder-right">
          {selectedBuild ? (
            <div className="receipt-card">
              <div className="receipt-header">
                <h2>{selectedBuild.name}</h2>
                <span className="timestamp">Saved</span>
              </div>
              <div className="receipt-items">
                {selectedBuild.components.length === 0 ? (
                  <p className="empty-state">No parts added yet. Click 'Add' on the left panel catalog to start customizing!</p>
                ) : (
                  selectedBuild.components.map((c, index) => (
                    <div key={index} className="receipt-row">
                      <span>{c.name}</span>
                      {/* Flex wrapper to host both price and the removal button */}
                      <div className="receipt-row-right">
                        <strong>${c.price.toFixed(2)}</strong>
                        <button 
                          type="button"
                          className="btn-remove-item" 
                          onClick={() => onRemoveComponent(selectedBuild.id, c.id)}
                          title="Remove component from build"
                        >
                          &times;
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="receipt-total">
                <span>Total Est. Cost:</span>
                <h2>${selectedBuild.total_price.toFixed(2)}</h2>
              </div>
            </div>
          ) : (
            <div className="empty-workspace">
              <p>Create a build on the left panel to begin assembling components.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}   
