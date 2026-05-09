import getAxiosInstance from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/constants';
import { DashboardStats } from '@/types/dashboard';

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const response = await getAxiosInstance().get(API_ENDPOINTS.DASHBOARD.STATS);
    return response.data;
  },
};
