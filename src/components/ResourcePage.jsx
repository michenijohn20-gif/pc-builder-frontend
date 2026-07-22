import React, { useEffect, useState } from 'react';
import ComponentCard from './ComponentCard';

export default function ResourcePage({ title, description, resourceApi, primaryFieldLabel, primaryFieldKey }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    resourceApi.getAll()
      .then(data => {
        if (!active) return;
        setItems(Array.isArray(data) ? data : data.items || []);
        setError('');
      })
      .catch(() => {
        if (!active) return;
        setError(`Could not load ${title.toLowerCase()}.`);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [resourceApi, title]);

  return (
    <section className="resource-page">
      <header className="resource-header">
        <h1>{title}</h1>
        <p>{description}</p>
      </header>

      {loading && <p className="resource-state">Loading...</p>}
      {error && <p className="resource-state error">{error}</p>}

      {!loading && !error && (
        <div className="grid-container resource-grid">
          {items.map(item => (
            <ComponentCard
              key={item.id}
              item={item}
              primaryFieldLabel={primaryFieldLabel}
              primaryFieldKey={primaryFieldKey}
            />
          ))}
        </div>
      )}
    </section>
  );
}
