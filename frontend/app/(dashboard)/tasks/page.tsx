'use client';

import { useState } from 'react';
import { useTasks } from '@/hooks/queries/useTasks';
import { useProjects } from '@/hooks/queries/useProjects';
import { TasksSkeleton } from '@/components/tasks/tasks-skeleton';
import { ErrorFallback } from '@/components/common/error-fallback';
import { TaskTable } from '@/components/tasks/task-table';
import { TaskFilters } from '@/components/tasks/task-filters';
import { CreateTaskModal } from '@/components/tasks/create-task-modal';
import { EmptyState } from '@/components/common/empty-state';
import { CheckSquare2 } from 'lucide-react';

export default function TasksPage() {
  const [filters, setFilters] = useState<{ status?: string; project_id?: string }>({});
  const { data: tasks, isLoading, error, refetch } = useTasks(filters);
  const { data: projects = [] } = useProjects();

  if (isLoading) {
    return <TasksSkeleton />;
  }

  if (error) {
    return <ErrorFallback onRetry={() => refetch()} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Tasks</h1>
          <p className="text-slate-400 mt-2">Manage all your tasks in one place</p>
        </div>
        <CreateTaskModal />
      </div>

      <TaskFilters filters={filters} onFilterChange={setFilters} projects={projects} />

      {tasks && tasks.length > 0 ? (
        <TaskTable tasks={tasks} />
      ) : (
        <EmptyState
          icon={CheckSquare2}
          title="No tasks found"
          description="Create a new task to get started"
          action={{
            label: 'Create Task',
            onClick: () => {}, // Modal will handle this
          }}
        />
      )}
    </div>
  );
}
