import http from './http';
import type { User, PaginatedResponse } from '@/types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  object: string;
  attributes: {
    token: string;
    expires_at: string;
  };
}

export const authApi = {
  login: async (data: LoginCredentials): Promise<AuthResponse> => {
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);
    const response = await http.post<AuthResponse>('/auth/login', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  logout: async () => {
    await http.post('/auth/logout');
  },

  getUser: async (): Promise<User> => {
    const response = await http.get('/account');
    return response.data;
  },
};

export const usersApi = {
  getAll: async (page = 1): Promise<PaginatedResponse<User>> => {
    const response = await http.get('/users', { params: { page } });
    return response.data;
  },

  get: async (id: number): Promise<User> => {
    const response = await http.get(`/users/${id}`);
    return response.data;
  },

  create: async (data: Partial<User> & { email: string; username: string; password: string }): Promise<User> => {
    const response = await http.post('/users', data);
    return response.data;
  },

  update: async (id: number, data: Partial<User>): Promise<User> => {
    const response = await http.patch(`/users/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await http.delete(`/users/${id}`);
  },
};