import { api } from './api';

export const auth = {
  signup: (payload) => api('/auth/signup', { method: 'POST', body: payload }),
  login:  (payload) => api('/auth/login',  { method: 'POST', body: payload }),
  me:     () => api('/auth/me'),
  logout: () => api('/auth/logout', { method: 'POST' }),
};
