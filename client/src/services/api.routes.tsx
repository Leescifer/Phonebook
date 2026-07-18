import api from "../lib/apiClient";

// Auth
export const register = (payload: any) =>
  api.post(`/auth/register`, payload).then((r) => r.data);
export const login = (payload: any) =>
  api.post(`/auth/login`, payload).then((r) => r.data);
export const me = () => api.get(`/auth/me`).then((r) => r.data);
export const forgotPassword = (payload: any) =>
  api.post(`/auth/forgot-password`, payload).then((r) => r.data);

// Users
export const getUsers = () => api.get(`/users`).then((r) => r.data);
export const getUser = (id: number) =>
  api.get(`/users/${id}`).then((r) => r.data);
export const approveUser = (id: number) =>
  api.put(`/users/${id}/approve`).then((r) => r.data);
export const deactivateUser = (id: number) =>
  api.put(`/users/${id}/deactivate`).then((r) => r.data);
export const updateUser = (id: number, payload: any) =>
  api.put(`/users/${id}`, payload).then((r) => r.data);
export const deleteUser = (id: number) =>
  api.delete(`/users/${id}`).then((r) => r.data);

// Contacts
export const listContacts = () => api.get(`/contacts`).then((r) => r.data);
export const getContact = (id: string) =>
  api.get(`/contacts/${id}`).then((r) => r.data);
export const createContact = (payload: any) =>
  api.post(`/contacts`, payload).then((r) => r.data);
export const updateContact = (id: string, payload: any) =>
  api.put(`/contacts/${id}`, payload).then((r) => r.data);
export const deleteContact = (id: string) =>
  api.delete(`/contacts/${id}`).then((r) => r.data);
export const shareContact = (id: string, userId: number) =>
  api.post(`/contacts/${id}/share`, { userId }).then((r) => r.data);
export const unshareContact = (id: string, userId: number) =>
  api.post(`/contacts/${id}/unshare`, { userId }).then((r) => r.data);
