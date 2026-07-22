import React from 'react';

export default function Toast({ feedback }) {
  if (!feedback || !feedback.message) return null;
  return (
    <div className={`toast ${feedback.isError ? 'toast-error' : 'toast-success'}`}>
      {feedback.message}
    </div>
  );
}