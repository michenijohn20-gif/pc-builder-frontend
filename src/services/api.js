const API_URL = 'http://127.0.0.1:5000/api';

const createCrudApi = (resource) => ({
  async getAll() {
    const res = await fetch(`${API_URL}/${resource}`);
    if (!res.ok) throw new Error(`Failed to fetch ${resource}`);
    return res.json();
  },

  async getById(id) {
    const res = await fetch(`${API_URL}/${resource}/${id}`);
    if (!res.ok) throw new Error(`Failed to fetch ${resource.slice(0, -1)} details`);
    return res.json();
  },

  async create(payload, token) {
    const res = await fetch(`${API_URL}/${resource}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `Failed to create ${resource.slice(0, -1)}`);
    return data;
  },

  async update(id, payload, token) {
    const res = await fetch(`${API_URL}/${resource}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `Failed to update ${resource.slice(0, -1)}`);
    return data;
  },

  async remove(id, token) {
    const res = await fetch(`${API_URL}/${resource}/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `Failed to delete ${resource.slice(0, -1)}`);
    return data;
  }
});

export const api = {
  // Fetch component catalog
  async getComponents() {
    const res = await fetch(`${API_URL}/components`);
    if (!res.ok) throw new Error('Failed to fetch components');
    const data = await res.json();
    return Array.isArray(data) ? data : data.items || [];
  },

  async getComponent(id) {
    const res = await fetch(`${API_URL}/components/${id}`);
    if (!res.ok) throw new Error('Failed to fetch component details');
    return res.json();
  },

  // Auth: Register
  async register(username, email, password) {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    return res.json();
  },

  // Auth: Login
  async login(email, password) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) throw new Error('Invalid credentials');
    return res.json();
  },

  async getCurrentUser(token) {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Session expired');
    return res.json();
  },

  // Create a new custom PC build
  async createBuild(name, token) {
    const res = await fetch(`${API_URL}/builds`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name })
    });
    return res.json();
  },

  async updateBuild(buildId, name, token) {
    const res = await fetch(`${API_URL}/builds/${buildId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update build');
    return data;
  },

  async deleteBuild(buildId, token) {
    const res = await fetch(`${API_URL}/builds/${buildId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete build');
    return data;
  },

  // Fetch all user builds
  async getUserBuilds(token) {
    const res = await fetch(`${API_URL}/builds`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  // Add component to build (with compatibility validation)
  async addComponentToBuild(buildId, componentId, token) {
    const res = await fetch(`${API_URL}/builds/${buildId}/add/${componentId}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to add component');
    return data;
  },

  async removeComponentFromBuild(buildId, componentId, token) {
    const res = await fetch(`${API_URL}/builds/${buildId}/remove/${componentId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to remove component');
    return data;
  },

  gpus: createCrudApi('gpus'),
  rams: createCrudApi('rams')
};
