import api from './api';

export async function login(payload) {
  const response = await api.post('/auth/login', payload);
  return response.data;
}

export async function register(payload) {
  const response = await api.post('/auth/register', payload);
  return response.data;
}

export function saveSession(data) {
  localStorage.setItem('aiTicketToken', data.token);
  localStorage.setItem('aiTicketUser', JSON.stringify(data.user));
}

export function clearSession() {
  localStorage.removeItem('aiTicketToken');
  localStorage.removeItem('aiTicketUser');
}

export function getCurrentUser() {
  const raw = localStorage.getItem('aiTicketUser');
  return raw ? JSON.parse(raw) : null;
}
