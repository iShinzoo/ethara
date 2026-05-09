'use client';

import { useProjects } from '@/hooks/queries/useProjects';
import { ProjectsSkeleton } from '@/components/projects/projects-skeleton';
import { ErrorFallback } from '@/components/common/error-fallback';
import { ProjectCard } from '@/components/projects/project-card';
import { CreateProjectModal } from '@/components/projects/create-project-modal';
import { EmptyState } from '@/components/common/empty-state';
import { FolderPlus } from 'lucide-react';

export default function ProjectsPage() {
  const { data: projects, isLoading, error, refetch } = useProjects();

  if (isLoading) {
    return <ProjectsSkeleton />;
  }

  if (error) {
    return <ErrorFallback onRetry={() => refetch()} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Projects</h1>
          <p className="text-muted-foreground mt-2">Manage and organize your projects</p>
        </div>
        <CreateProjectModal />
      </div>

      {projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FolderPlus}
          title="No projects yet"
          description="Create your first project to get started"
          action={{
            label: 'Create Project',
            onClick: () => {}, // Modal will handle this
          }}
        />
      )}
    </div>
  );
}
