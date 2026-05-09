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
  project_id: z.string().min(1, 'Project is required'),
  due_date: z.string().optional(),
  assigned_to: z.string().optional(),
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
      project_id: '',
      due_date: '',
      assigned_to: '',
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
            <label htmlFor="description" className="text-sm font-medium text-slate-200">
              Description (Optional)
            </label>
            <Input
              id="description"
              placeholder="Task description"
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              {...form.register('description')}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="project_id" className="text-sm font-medium text-slate-200">
              Project
            </label>
            <Select defaultValue={form.getValues('project_id')} onValueChange={(value) => form.setValue('project_id', value)}>
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
            {form.formState.errors.project_id && (
              <p className="text-sm text-red-400">{form.formState.errors.project_id.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="due_date" className="text-sm font-medium text-slate-200">
              Due Date (Optional)
            </label>
            <Input
              id="due_date"
              type="date"
              className="bg-slate-700 border-slate-600 text-white"
              {...form.register('due_date')}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="assigned_to" className="text-sm font-medium text-slate-200">
              Assign To (Optional)
            </label>
            <Input
              id="assigned_to"
              placeholder="User ID"
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              {...form.register('assigned_to')}
            />
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
