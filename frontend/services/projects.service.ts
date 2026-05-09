import getAxiosInstance from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/constants';
import { Project, CreateProjectRequest, AddProjectMemberRequest, UpdateProjectRequest } from '@/types/projects';

export const projectsService = {
  async getProjects(): Promise<Project[]> {
    const response = await getAxiosInstance().get(API_ENDPOINTS.PROJECTS.LIST);
    return Array.isArray(response.data) ? response.data : response.data.data || [];
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
