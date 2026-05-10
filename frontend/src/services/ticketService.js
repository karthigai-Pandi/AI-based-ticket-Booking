import api from './api';

export async function getTickets(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, value);
    }
  });
  const response = await api.get(`/tickets?${params.toString()}`);
  return response.data.tickets;
}

export async function createTicket(payload) {
  const response = await api.post('/tickets', payload);
  return response.data.ticket;
}

export async function updateTicket(id, payload) {
  const response = await api.patch(`/tickets/${id}`, payload);
  return response.data.ticket;
}

export async function deleteTicket(id) {
  const response = await api.delete(`/tickets/${id}`);
  return response.data;
}
