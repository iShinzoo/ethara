'use client';

import { useCallback } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';
import { TASK_STATUSES } from '@/lib/constants';

interface TaskFiltersProps {
  filters: {
    status?: string;
    project_id?: string;
  };
  onFilterChange: (filters: { status?: string; project_id?: string }) => void;
  projects: Array<{ id: string; name: string }>;
}

export function TaskFilters({ filters, onFilterChange, projects }: TaskFiltersProps) {
  const hasActiveFilters = !!filters.status || !!filters.project_id;

  const handleStatusChange = useCallback(
    (value: string) => {
      onFilterChange({
        ...filters,
        status: value || undefined,
      });
    },
    [filters, onFilterChange]
  );

  const handleProjectChange = useCallback(
    (value: string) => {
      onFilterChange({
        ...filters,
        project_id: value || undefined,
      });
    },
    [filters, onFilterChange]
  );

  const handleReset = useCallback(() => {
    onFilterChange({});
  }, [onFilterChange]);

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <Filter className="w-5 h-5 text-slate-400" />

      <Select value={filters.status || ''} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-40 bg-slate-700 border-slate-600 text-slate-200">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent className="bg-slate-700 border-slate-600">
          {TASK_STATUSES.map((status) => (
            <SelectItem key={status} value={status} className="text-slate-200">
              {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.project_id || ''} onValueChange={handleProjectChange}>
        <SelectTrigger className="w-40 bg-slate-700 border-slate-600 text-slate-200">
          <SelectValue placeholder="Filter by project" />
        </SelectTrigger>
        <SelectContent className="bg-slate-700 border-slate-600">
          {projects.map((project) => (
            <SelectItem key={project.id} value={project.id} className="text-slate-200">
              {project.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button
          onClick={handleReset}
          variant="ghost"
          size="sm"
          className="text-slate-400 hover:text-slate-200 hover:bg-slate-700"
        >
          <X className="w-4 h-4 mr-1" />
          Clear filters
        </Button>
      )}
    </div>
  );
}
