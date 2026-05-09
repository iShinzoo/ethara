'use client';

import { Task } from '@/types/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TaskStatusBadge } from './task-status-badge';
import { useDeleteTask, useUpdateTask } from '@/hooks/queries/useTasks';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface TaskTableProps {
  tasks: Task[];
}

export function TaskTable({ tasks }: TaskTableProps) {
  const deleteTaskMutation = useDeleteTask();
  const updateTaskMutation = useUpdateTask();

  const handleDelete = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await deleteTaskMutation.mutateAsync(taskId);
      toast.success('Task deleted successfully');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      await updateTaskMutation.mutateAsync({
        id: taskId,
        data: { status: newStatus as any },
      });
      toast.success('Task updated successfully');
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  if (tasks.length === 0) {
    return (
      <Card className="border border-border bg-card">
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No tasks found. Create one to get started.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border bg-card">
      <CardHeader>
        <CardTitle className="text-foreground font-semibold">Tasks ({tasks.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-3 text-muted-foreground font-semibold text-xs uppercase tracking-wide">Title</th>
                <th className="text-left py-3 px-3 text-muted-foreground font-semibold text-xs uppercase tracking-wide">Project</th>
                <th className="text-left py-3 px-3 text-muted-foreground font-semibold text-xs uppercase tracking-wide">Status</th>
                <th className="text-left py-3 px-3 text-muted-foreground font-semibold text-xs uppercase tracking-wide">Assignee</th>
                <th className="text-left py-3 px-3 text-muted-foreground font-semibold text-xs uppercase tracking-wide">Due Date</th>
                <th className="text-left py-3 px-3 text-muted-foreground font-semibold text-xs uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-3 text-foreground truncate max-w-xs font-medium">{task.title}</td>
                  <td className="py-3 px-3 text-muted-foreground text-sm">{task.projectName || '-'}</td>
                  <td className="py-3 px-3">
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task.id, e.target.value)}
                      className="bg-muted border border-border text-foreground text-xs rounded px-2 py-1 cursor-pointer transition-colors hover:bg-border"
                    >
                      <option value="todo">To Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="done">Done</option>
                      <option value="overdue">Overdue</option>
                    </select>
                  </td>
                  <td className="py-3 px-3 text-muted-foreground text-sm">{task.assigneeName || '-'}</td>
                  <td className="py-3 px-3 text-muted-foreground text-sm">
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}
                  </td>
                  <td className="py-3 px-3">
                    <Button
                      onClick={() => handleDelete(task.id)}
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                      disabled={deleteTaskMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
