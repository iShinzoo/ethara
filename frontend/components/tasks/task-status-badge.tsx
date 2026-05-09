import { TaskStatus } from '@/types/dashboard';
import { Badge } from '@/components/ui/badge';

interface TaskStatusBadgeProps {
  status: TaskStatus;
}

const statusConfig = {
  todo: { label: 'To Do', color: 'bg-muted text-muted-foreground' },
  in_progress: { label: 'In Progress', color: 'bg-primary/10 text-primary' },
  'in-progress': { label: 'In Progress', color: 'bg-primary/10 text-primary' },
  done: { label: 'Done', color: 'bg-secondary/10 text-secondary' },
  overdue: { label: 'Overdue', color: 'bg-destructive/10 text-destructive' },
};

export function TaskStatusBadge({ status }: TaskStatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.todo;

  return <Badge className={config.color}>{config.label}</Badge>;
}
