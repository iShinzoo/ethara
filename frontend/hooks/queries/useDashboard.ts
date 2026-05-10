import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboard.service';

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: () => dashboardService.getStats(),
    staleTime: 1000 * 10, // 10 seconds — ensures stats stay in sync with task/project mutations
  });
};
