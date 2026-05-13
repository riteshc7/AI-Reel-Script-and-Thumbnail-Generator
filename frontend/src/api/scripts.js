import api from './axios';

export const generateScript = (data) => api.post('/scripts/generate', data).then(r => r.data);
export const saveScript = (data) => api.post('/scripts/save', data).then(r => r.data);
export const getScripts = (folder) => api.get('/scripts', { params: { folder } }).then(r => r.data);
export const getScript = (id) => api.get(`/scripts/${id}`).then(r => r.data);
export const updateScript = (id, data) => api.put(`/scripts/${id}`, data).then(r => r.data);
export const duplicateScript = (id) => api.post(`/scripts/${id}/duplicate`).then(r => r.data);
export const deleteScript = (id) => api.delete(`/scripts/${id}`).then(r => r.data);
export const getTrendingTopics = (niche) => api.get(`/scripts/trending/${niche}`).then(r => r.data);
export const getScriptIdeas = (niche, platform) => api.get(`/scripts/ideas/${niche}/${platform}`).then(r => r.data);
