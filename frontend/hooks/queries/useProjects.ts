import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { projectsService } from '@/services/projects.service';
import { CreateProjectRequest, AddProjectMemberRequest, UpdateProjectRequest } from '@/types/projects';

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: () => projectsService.getProjects(),
    staleTime: 1000 * 10, // 10 seconds — keeps project cards fresh after task/member mutations
  });
};

export const useProject = (id: string) => {
  return useQuery({
    queryKey: ['projects', id],
    queryFn: () => projectsService.getProject(id),
    enabled: !!id,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProjectRequest) => projectsService.createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.refetchQueries({ queryKey: ['projects'] });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProjectRequest }) =>
      projectsService.updateProject(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.refetchQueries({ queryKey: ['projects'] });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => projectsService.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.refetchQueries({ queryKey: ['projects'] });
    },
  });
};

export const useAddProjectMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data: AddProjectMemberRequest }) =>
      projectsService.addMember(projectId, data),
    onMutate: async ({ projectId }) => {
      // Cancel any in-flight refetches so they don't overwrite the optimistic update
      await queryClient.cancelQueries({ queryKey: ['projects'] });

      // Snapshot the current projects list for rollback on error
      const previousProjects = queryClient.getQueryData<import('@/types/projects').Project[]>(['projects']);

      // Optimistically increment the member count for the target project
      if (previousProjects) {
        queryClient.setQueryData<import('@/types/projects').Project[]>(
          ['projects'],
          previousProjects.map((p) =>
            p.id === projectId
              ? { ...p, members: [...p.members, { id: 'optimistic', userId: '', userName: '', userEmail: '', role: 'MEMBER' as const, joinedAt: new Date().toISOString() }] }
              : p
          )
        );
      }

      return { previousProjects };
    },
    onError: (_err, _variables, context) => {
      // Roll back to the snapshot if the mutation fails
      if (context?.previousProjects) {
        queryClient.setQueryData(['projects'], context.previousProjects);
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects', variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.refetchQueries({ queryKey: ['projects'] });
    },
  });
};

export const useRemoveProjectMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, memberId }: { projectId: string; memberId: string }) =>
      projectsService.removeMember(projectId, memberId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects', variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.refetchQueries({ queryKey: ['projects'] });
    },
  });
};
