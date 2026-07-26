import React from 'react';
import ResourcePage from '../components/ResourcePage';
import { api } from '../services/api';

export default function GPU() {
  return (
    <ResourcePage
      title="GPU"
      description="Browse available graphics cards and compare VRAM, pricing, and specs."
      resourceApi={api.gpus}
      primaryFieldLabel="VRAM"
      primaryFieldKey="vram"
    />
  );
}
