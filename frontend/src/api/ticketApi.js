import axios from "axios";

const BASE_URL = "http://localhost:8080/api/tickets";

export const createTicket = (ticketData) =>
  axios.post(BASE_URL, ticketData);

export const getAllTickets = (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.status) params.append("status", filters.status);
  if (filters.priority) params.append("priority", filters.priority);
  if (filters.category) params.append("category", filters.category);
  if (filters.facilityId) params.append("facilityId", filters.facilityId);
  return axios.get(`${BASE_URL}?${params.toString()}`);
};

export const getMyTickets = (email) =>
  axios.get(`${BASE_URL}/my-tickets`, { params: { email } });

export const getTicketStats = () =>
  axios.get(`${BASE_URL}/stats`);

export const getTicketById = (id) =>
  axios.get(`${BASE_URL}/${id}`);

export const updateTicket = (id, updateData) =>
  axios.patch(`${BASE_URL}/${id}/update`, updateData);

export const deleteTicket = (id) =>
  axios.delete(`${BASE_URL}/${id}`);
