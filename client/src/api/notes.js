import { api } from '../lib/api';

export const notesApi = {
  list:   () => api('/api/notes'),
  get:    (id) => api(`/api/notes/${id}`),
  create: (payload) => api('/api/notes', { method: 'POST', body: payload }),
  update: (id, payload) => api(`/api/notes/${id}`, { method: 'PUT', body: payload }),
  remove: (id) => api(`/api/notes/${id}`, { method: 'DELETE' }),
};
