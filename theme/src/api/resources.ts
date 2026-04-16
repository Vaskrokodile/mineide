import http from './http';
import type { Node, Location, PaginatedResponse } from '@/types';

export const nodesApi = {
  getAll: async (page = 1): Promise<PaginatedResponse<Node>> => {
    const response = await http.get('/nodes', { params: { page } });
    return response.data;
  },

  get: async (id: number): Promise<Node> => {
    const response = await http.get(`/nodes/${id}`);
    return response.data;
  },

  getDeployable: async (): Promise<Node[]> => {
    const response = await http.get('/nodes/deployable');
    return response.data.data;
  },

  create: async (data: Partial<Node>): Promise<Node> => {
    const response = await http.post('/nodes', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Node>): Promise<Node> => {
    const response = await http.patch(`/nodes/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await http.delete(`/nodes/${id}`);
  },
};

export const locationsApi = {
  getAll: async (page = 1): Promise<PaginatedResponse<Location>> => {
    const response = await http.get('/locations', { params: { page } });
    return response.data;
  },

  get: async (id: number): Promise<Location> => {
    const response = await http.get(`/locations/${id}`);
    return response.data;
  },

  create: async (data: Partial<Location>): Promise<Location> => {
    const response = await http.post('/locations', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Location>): Promise<Location> => {
    const response = await http.patch(`/locations/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await http.delete(`/locations/${id}`);
  },
};