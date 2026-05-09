import getAxiosInstance from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/constants';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '@/types/dashboard';

export const tasksService = {
  async getTasks(filters?: { project_id?: string; status?: string; assigned_to?: string }): Promise<Task[]> {
    const params = new URLSearchParams();
    if (filters?.project_id) params.append('project_id', filters.project_id);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.assigned_to) params.append('assigned_to', filters.assigned_to);

    const url = params.toString() 
      ? `${API_ENDPOINTS.TASKS.LIST}?${params.toString()}`
      : API_ENDPOINTS.TASKS.LIST;
    
    const response = await getAxiosInstance().get(url);
    return Array.isArray(response.data) ? response.data : response.data.data || [];
  },

  async getTask(id: string): Promise<Task> {
    const response = await getAxiosInstance().get(API_ENDPOINTS.TASKS.GET(id));
    return response.data.data || response.data;
  },

  async createTask(data: CreateTaskRequest): Promise<Task> {
    const response = await getAxiosInstance().post(API_ENDPOINTS.TASKS.CREATE, data);
    return response.data.data || response.data;
  },

  async updateTask(id: string, data: UpdateTaskRequest): Promise<Task> {
    const response = await getAxiosInstance().patch(API_ENDPOINTS.TASKS.UPDATE(id), data);
    return response.data.data || response.data;
  },

  async deleteTask(id: string): Promise<void> {
    await getAxiosInstance().delete(API_ENDPOINTS.TASKS.DELETE(id));
  },
};
