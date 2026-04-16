import http from './http';
import type { Server, PaginatedResponse, Allocation, Database } from '@/types';

export const serversApi = {
  getAll: async (page = 1): Promise<PaginatedResponse<Server>> => {
    const response = await http.get('/servers', { params: { page } });
    return response.data;
  },

  get: async (id: number): Promise<Server> => {
    const response = await http.get(`/servers/${id}`);
    return response.data;
  },

  getAllocations: async (serverId: number): Promise<Allocation[]> => {
    const response = await http.get(`/servers/${serverId}/allocations`);
    return response.data.data;
  },

  getDatabases: async (serverId: number): Promise<PaginatedResponse<Database>> => {
    const response = await http.get(`/servers/${serverId}/databases`);
    return response.data;
  },

  updateDetails: async (id: number, data: { name?: string; description?: string }): Promise<Server> => {
    const response = await http.patch(`/servers/${id}/details`, data);
    return response.data;
  },

  suspend: async (id: number): Promise<void> => {
    await http.post(`/servers/${id}/suspend`);
  },

  unsuspend: async (id: number): Promise<void> => {
    await http.post(`/servers/${id}/unsuspend`);
  },

  reinstall: async (id: number): Promise<void> => {
    await http.post(`/servers/${id}/reinstall`);
  },

  delete: async (id: number): Promise<void> => {
    await http.delete(`/servers/${id}`);
  },
};