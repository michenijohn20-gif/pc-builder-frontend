import React, { useState } from 'react';
import ImageBox from '../components/ImageBox';

export default function Catalog({ components, token, onAddComponent, selectedComponent, onViewSpecs }) {
  const [activeCategory, setActiveCategory] = useState('ALL');

  // Dynamically extract categories from components array, and sanitize to uppercase
  const dynamicCategories = ['ALL', ...new Set(components.map(c => c.category.toUpperCase()))];

  // Filter based on active category selection
  const filteredComponents = activeCategory === 'ALL'
    ? components
    : components.filter(c => c.category.toUpperCase() === activeCategory);

  return (
    <div className="catalog-layout">
      {/* 1. Left Categories Sidebar */}
      <aside className="catalog-sidebar">
        <h3 className="sidebar-title">Categories</h3>
        <ul className="category-list">
          {dynamicCategories.map(cat => (
            <li
              key={cat}
              className={`category-item ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </li>
          ))}
        </ul>
      </aside>

      {/* 2. Right Products Workspace */}
      <div className="catalog-main">
        {selectedComponent && (
          <section className="spec-panel">
            <div>
              <p className="spec-label">Selected Component</p>
              <h3>{selectedComponent.name}</h3>
              <p>{selectedComponent.brand} | {selectedComponent.category}</p>
              <p>{selectedComponent.socket || selectedComponent.specs?.type ? `Socket: ${selectedComponent.socket || selectedComponent.specs?.type}` : 'No socket listed'}</p>
              <p className="comp-price-blue">Price: ${selectedComponent.price.toFixed(2)}</p>
            </div>
          </section>
        )}

        <div className="grid-container">
          {filteredComponents.map(comp => (
            <div key={comp.id} className="component-card centered-style">
              <ImageBox src={comp.image_url} alt={comp.name} />

              {/* Hardware Spec Info */}
              <div className="card-details">
                <h3 className="comp-title">{comp.name}</h3>
                <p className="comp-subtitle">
                  {comp.socket ? `Socket: ${comp.socket}` : comp.brand} 
                  {comp.cores ? ` | ${comp.cores} Cores` : ''}
                </p>
                <p className="comp-price-blue">Est. Market Price: ${comp.price.toFixed(2)}</p>
              </div>

              {/* Action Triggers */}
              <div className="card-buttons">
                <button className="btn-specs-red" onClick={() => onViewSpecs(comp.id)}>View Specs</button>
                {token && (
                  <button className="btn-add-to-rig" onClick={() => onAddComponent(comp.id)}>
                    Add to Rig
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
