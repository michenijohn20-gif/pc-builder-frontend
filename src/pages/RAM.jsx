import React from 'react';
import ResourcePage from '../components/ResourcePage';
import { api } from '../services/api';

export default function RAM() {
  return (
    <ResourcePage
      title="RAM"
      description="Browse memory kits and compare capacity, speed, and specs."
      resourceApi={api.rams}
      primaryFieldLabel="Capacity"
      primaryFieldKey="capacity"
    />
  );
}
