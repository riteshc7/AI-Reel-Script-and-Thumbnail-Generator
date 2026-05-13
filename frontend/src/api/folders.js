import api from './axios';

export const getFolders = () => api.get('/folders').then(r => r.data);
export const createFolder = (data) => api.post('/folders', data).then(r => r.data);
export const updateFolder = (id, data) => api.put(`/folders/${id}`, data).then(r => r.data);
export const deleteFolder = (id) => api.delete(`/folders/${id}`).then(r => r.data);
