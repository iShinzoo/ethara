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
  title: z.string().min(3, 'Task title must be at least 3 characters'),
  description: z.string().optional(),
  project_id: z.string().uuid('Please select a valid project'),
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

  const selectedProjectId = form.watch('project_id');

  const onSubmit = async (data: CreateTaskFormData) => {
    try {
      // Ensure we never send empty strings for optional fields
      await createTaskMutation.mutateAsync({
        ...data,
        description: data.description?.trim() || '',
        project_id: data.project_id,
        due_date: data.due_date?.trim() ? data.due_date.trim() : undefined,
        assigned_to: data.assigned_to?.trim() ? data.assigned_to.trim() : undefined,
      });
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
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">
          <Plus className="w-4 h-4 mr-2" />
          New Task
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">Create New Task</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Add a new task to track
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium text-foreground">
              Task Title
            </label>
            <Input
              id="title"
              placeholder="e.g., Design dashboard mockup"
              className="bg-background border-input text-foreground placeholder:text-muted-foreground"
              {...form.register('title')}
            />
            {form.formState.errors.title && (
              <p className="text-sm text-red-400">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium text-foreground">
              Description (Optional)
            </label>
            <Input
              id="description"
              placeholder="Task description"
              className="bg-background border-input text-foreground placeholder:text-muted-foreground"
              {...form.register('description')}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="project_id" className="text-sm font-medium text-foreground">
              Project
            </label>
            <Select
              value={selectedProjectId || ''}
              onValueChange={(value) =>
                form.setValue('project_id', value, { shouldDirty: true, shouldTouch: true, shouldValidate: true })
              }
            >
              <SelectTrigger className="bg-background border-input text-foreground">
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id} className="text-foreground">
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
            <label htmlFor="due_date" className="text-sm font-medium text-foreground">
              Due Date (Optional)
            </label>
            <Input
              id="due_date"
              type="date"
              className="bg-background border-input text-foreground"
              {...form.register('due_date')}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="assigned_to" className="text-sm font-medium text-foreground">
              Assign To (Optional)
            </label>
            <Input
              id="assigned_to"
              placeholder="User ID"
              className="bg-background border-input text-foreground placeholder:text-muted-foreground"
              {...form.register('assigned_to')}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-border"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
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
