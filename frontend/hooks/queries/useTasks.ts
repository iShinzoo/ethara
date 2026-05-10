import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { tasksService } from '@/services/tasks.service';
import { CreateTaskRequest, UpdateTaskRequest } from '@/types/dashboard';

interface TaskFilters {
  project_id?: string;
  status?: string;
  assigned_to?: string;
}

export const useTasks = (filters?: TaskFilters) => {
  return useQuery({
    queryKey: ['tasks', filters],
    queryFn: () => tasksService.getTasks(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useTask = (id: string) => {
  return useQuery({
    queryKey: ['tasks', id],
    queryFn: () => tasksService.getTask(id),
    enabled: !!id,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTaskRequest) => tasksService.createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      // Force immediate refetch so project task counts update without waiting for staleTime
      queryClient.refetchQueries({ queryKey: ['projects'] });
      queryClient.refetchQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskRequest }) =>
      tasksService.updateTask(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      // Force immediate refetch so the task completion bar reflects the new status
      queryClient.refetchQueries({ queryKey: ['projects'] });
      queryClient.refetchQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tasksService.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.refetchQueries({ queryKey: ['projects'] });
      queryClient.refetchQueries({ queryKey: ['dashboard'] });
    },
  });
};
