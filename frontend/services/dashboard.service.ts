import getAxiosInstance from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/constants';
import { DashboardStats } from '@/types/dashboard';

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const response = await getAxiosInstance().get(API_ENDPOINTS.DASHBOARD.GET);
    const raw = response.data?.data ?? response.data ?? {};

    // Some backends return `project_progress: null` when there are no projects.
    // Normalize to keep the UI simple and avoid runtime crashes.
    return {
      total_tasks: Number(raw.total_tasks ?? 0),
      completed_tasks: Number(raw.completed_tasks ?? 0),
      overdue_tasks: Number(raw.overdue_tasks ?? 0),
      assigned_to_me: Number(raw.assigned_to_me ?? 0),
      project_progress: Array.isArray(raw.project_progress) ? raw.project_progress : [],
    };
  },
};
