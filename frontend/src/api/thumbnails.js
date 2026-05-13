import api from './axios';

export const generateThumbnail = (data) => api.post('/thumbnails/generate', data).then(r => r.data);
export const getThumbnails = () => api.get('/thumbnails').then(r => r.data);
export const deleteThumbnail = (id) => api.delete(`/thumbnails/${id}`).then(r => r.data);
