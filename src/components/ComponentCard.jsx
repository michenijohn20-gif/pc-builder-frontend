import React from 'react';
import ImageBox from './ImageBox';

export default function ComponentCard({ item, primaryFieldLabel, primaryFieldKey }) {
  return (
    <article className="component-card resource-card">
      <ImageBox src={item.image_url} alt={item.name} />
      <div className="card-details">
        <h3 className="comp-title">{item.name}</h3>
        <p className="comp-subtitle">{item.brand}</p>
        {item.socket && (
          <p className="comp-subtitle">Socket: {item.socket}</p>
        )}
        <p className="comp-subtitle">
          {primaryFieldLabel}: {item[primaryFieldKey] || 'N/A'}
        </p>
        <p className="comp-price-blue">${Number(item.price).toFixed(2)}</p>
      </div>
    </article>
  );
}
