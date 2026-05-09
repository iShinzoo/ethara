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
      <Filter className="w-5 h-5 text-muted-foreground" />

      <Select value={filters.status || ''} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-44 bg-card border-border text-foreground">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent className="bg-popover border-border">
          {TASK_STATUSES.map((status) => (
            <SelectItem key={status} value={status} className="text-foreground">
              {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.project_id || ''} onValueChange={handleProjectChange}>
        <SelectTrigger className="w-56 bg-card border-border text-foreground">
          <SelectValue placeholder="Filter by project" />
        </SelectTrigger>
        <SelectContent className="bg-popover border-border">
          {projects.map((project) => (
            <SelectItem key={project.id} value={project.id} className="text-foreground">
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
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4 mr-1" />
          Clear filters
        </Button>
      )}
    </div>
  );
}
