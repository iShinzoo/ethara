'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { useCreateTask } from '@/hooks/queries/useTasks';
import { useProjects } from '@/hooks/queries/useProjects';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { TASK_STATUSES, TASK_PRIORITIES } from '@/lib/constants';

const createTaskSchema = z.object({
  title: z.string().min(1, 'Task title is required'),
  description: z.string().optional(),
  projectId: z.string().min(1, 'Project is required'),
  status: z.enum(['todo', 'in_progress', 'in-progress', 'done', 'overdue']),
  priority: z.enum(['low', 'medium', 'high']),
  dueDate: z.string().optional(),
  assigneeId: z.string().min(1, 'Assignee is required'),
});

type CreateTaskFormData = z.infer<typeof createTaskSchema>;

export function CreateTaskModal() {
  const [open, setOpen] = useState(false);
  const createTaskMutation = useCreateTask();
  const { data: projects = [] } = useProjects();

  const form = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: '',
      description: '',
      projectId: '',
      status: 'todo',
      priority: 'medium',
      assigneeId: '',
    },
  });

  const onSubmit = async (data: CreateTaskFormData) => {
    try {
      await createTaskMutation.mutateAsync(data);
      toast.success('Task created successfully!');
      setOpen(false);
      form.reset();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create task';
      toast.error(errorMessage);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          New Task
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-800 border-slate-700 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Create New Task</DialogTitle>
          <DialogDescription className="text-slate-400">
            Add a new task to track
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium text-slate-200">
              Task Title
            </label>
            <Input
              id="title"
              placeholder="e.g., Design dashboard mockup"
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              {...form.register('title')}
            />
            {form.formState.errors.title && (
              <p className="text-sm text-red-400">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="projectId" className="text-sm font-medium text-slate-200">
              Project
            </label>
            <Select defaultValue={form.getValues('projectId')} onValueChange={(value) => form.setValue('projectId', value)}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id} className="text-white">
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.projectId && (
              <p className="text-sm text-red-400">{form.formState.errors.projectId.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium text-slate-200">
                Status
              </label>
              <Select defaultValue={form.getValues('status')} onValueChange={(value) => form.setValue('status', value as any)}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="todo" className="text-white">To Do</SelectItem>
                  <SelectItem value="in_progress" className="text-white">In Progress</SelectItem>
                  <SelectItem value="done" className="text-white">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="priority" className="text-sm font-medium text-slate-200">
                Priority
              </label>
              <Select defaultValue={form.getValues('priority')} onValueChange={(value) => form.setValue('priority', value as any)}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="low" className="text-white">Low</SelectItem>
                  <SelectItem value="medium" className="text-white">Medium</SelectItem>
                  <SelectItem value="high" className="text-white">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-slate-600 text-slate-200 hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={createTaskMutation.isPending}
            >
              {createTaskMutation.isPending ? 'Creating...' : 'Create Task'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
