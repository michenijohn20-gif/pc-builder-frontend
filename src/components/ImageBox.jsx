import React, { useState } from 'react';

export default function ImageBox({ src, alt }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="image-box">
      {src && !failed ? (
        <img src={src} alt={alt} onError={() => setFailed(true)} />
      ) : (
        <span>IMAGE</span>
      )}
    </div>
  );
}
