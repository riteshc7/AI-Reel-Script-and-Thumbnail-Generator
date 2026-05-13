import api from './axios';

export const loginUser = (data) => api.post('/auth/login', data).then(r => r.data);
export const signupUser = (data) => api.post('/auth/signup', data).then(r => r.data);
export const getMe = () => api.get('/auth/me').then(r => r.data);
