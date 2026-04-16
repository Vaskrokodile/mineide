import axios from 'axios';

const API_BASE = import.meta.env.VITE_PTERODACTYL_URL 
  ? `${import.meta.env.VITE_PTERODACTYL_URL}/api/application`
  : '/api/application';

const http = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  timeout: 20000,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export const setAuthToken = (token: string) => {
  http.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  localStorage.setItem('token', token);
};

export const clearAuthToken = () => {
  delete http.defaults.headers.common['Authorization'];
  localStorage.removeItem('token');
};

export const getAuthToken = () => localStorage.getItem('token');

export default http;