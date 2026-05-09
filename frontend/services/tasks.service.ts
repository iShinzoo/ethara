import getAxiosInstance from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/constants';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '@/types/dashboard';

export const tasksService = {
  async getTasks(filters?: { projectId?: string; status?: string; assigneeId?: string }): Promise<Task[]> {
    const params = new URLSearchParams();
    if (filters?.projectId) params.append('projectId', filters.projectId);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.assigneeId) params.append('assigneeId', filters.assigneeId);

    const url = `${API_ENDPOINTS.TASKS.LIST}?${params.toString()}`;
    const response = await getAxiosInstance().get(url);
    return response.data;
  },

  async getTask(id: string): Promise<Task> {
    const response = await getAxiosInstance().get(API_ENDPOINTS.TASKS.GET(id));
    return response.data;
  },

  async createTask(data: CreateTaskRequest): Promise<Task> {
    const response = await getAxiosInstance().post(API_ENDPOINTS.TASKS.CREATE, data);
    return response.data;
  },

  async updateTask(id: string, data: UpdateTaskRequest): Promise<Task> {
    const response = await getAxiosInstance().put(API_ENDPOINTS.TASKS.UPDATE(id), data);
    return response.data;
  },

  async deleteTask(id: string): Promise<void> {
    await getAxiosInstance().delete(API_ENDPOINTS.TASKS.DELETE(id));
  },
};
