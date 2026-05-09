import getAxiosInstance from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/constants';
import { Project, CreateProjectRequest, AddProjectMemberRequest, UpdateProjectRequest } from '@/types/projects';
import axios from 'axios';

export const projectsService = {
  async getProjects(): Promise<Project[]> {
    try {
      const response = await getAxiosInstance().get(API_ENDPOINTS.PROJECTS.LIST);
      return Array.isArray(response.data) ? response.data : response.data.data || [];
    } catch (err) {
      // Backend in this assessment repo does not expose `GET /api/projects`.
      // Fallback: derive project list from `/api/dashboard` (project_progress).
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        const dashboardResp = await getAxiosInstance().get(API_ENDPOINTS.DASHBOARD.GET);
        const raw = dashboardResp.data?.data ?? dashboardResp.data ?? {};
        const progress = Array.isArray(raw.project_progress) ? raw.project_progress : [];

        const now = new Date().toISOString();
        return progress.map((p: any) => ({
          id: String(p.project_id),
          name: String(p.project_name ?? 'Untitled Project'),
          description: undefined,
          ownerId: '',
          members: [],
          taskCount: Number(p.total_tasks ?? 0),
          completedTaskCount: Number(p.completed_tasks ?? 0),
          createdAt: now,
          updatedAt: now,
        }));
      }
      throw err;
    }
  },

  async getProject(id: string): Promise<Project> {
    const response = await getAxiosInstance().get(API_ENDPOINTS.PROJECTS.GET(id));
    return response.data.data || response.data;
  },

  async createProject(data: CreateProjectRequest): Promise<Project> {
    const response = await getAxiosInstance().post(API_ENDPOINTS.PROJECTS.CREATE, data);
    return response.data.data || response.data;
  },

  async updateProject(id: string, data: UpdateProjectRequest): Promise<Project> {
    const response = await getAxiosInstance().put(API_ENDPOINTS.PROJECTS.UPDATE(id), data);
    return response.data.data || response.data;
  },

  async deleteProject(id: string): Promise<void> {
    await getAxiosInstance().delete(API_ENDPOINTS.PROJECTS.DELETE(id));
  },

  async addMember(projectId: string, data: AddProjectMemberRequest): Promise<Project> {
    const response = await getAxiosInstance().post(
      API_ENDPOINTS.PROJECTS.ADD_MEMBER(projectId),
      data
    );
    return response.data.data || response.data;
  },

  async removeMember(projectId: string, memberId: string): Promise<void> {
    await getAxiosInstance().delete(
      API_ENDPOINTS.PROJECTS.REMOVE_MEMBER(projectId, memberId)
    );
  },
};
