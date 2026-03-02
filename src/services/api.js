import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://sell-portfolio-backend.onrender.com';

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        // JWT tokens should have 3 parts separated by dots
        const isLikelyJWT = token && typeof token === 'string' && token.split('.').length === 3;

        if (isLikelyJWT) {
            config.headers.Authorization = `Bearer ${token}`;
        } else if (token) {
            // Remove corrupted or placeholder tokens
            console.warn("Invalid token detected and removed:", token);
            localStorage.removeItem('token');
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const skillsApi = {
    getAll: () => api.get('/skills/'),
    create: (data) => api.post('/skills/', data),
    update: (id, data) => api.put(`/skills/${id}`, data),
    delete: (id) => api.delete(`/skills/${id}`),
};

export const journeyApi = {
    getAll: () => api.get('/journey/'),
    create: (data) => api.post('/journey/', data),
    update: (id, data) => api.put(`/journey/${id}`, data),
    delete: (id) => api.delete(`/journey/${id}`),
};

export const certsApi = {
    getAll: () => api.get('/certifications/'),
    create: (data) => api.post('/certifications/', data),
    update: (id, data) => api.put(`/certifications/${id}`, data),
    delete: (id) => api.delete(`/certifications/${id}`),
};

export const projectsApi = {
    getAll: () => api.get('/projects/'),
    create: (data) => api.post('/projects/', data),
    update: (id, data) => api.put(`/projects/${id}`, data),
    delete: (id) => api.delete(`/projects/${id}`),
};

export const contactApi = {
    send: (data) => api.post('/contact/', data),
    getAll: () => api.get('/contact/'),
    delete: (id) => api.delete(`/contact/${id}`),
};

export const authApi = {
    login: (email, password) => api.post('/users/login', { email, password }),
    forgotPassword: (email) => api.post('/users/forgot-password', { email }),
    getMe: () => api.get('/users/me'),
    updateProfile: (data) => api.put('/users/me', data),
    uploadProfilePic: (formData) => api.post('/users/upload-profile-pic', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    uploadResume: (formData) => api.post('/users/upload-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
};

export default api;
