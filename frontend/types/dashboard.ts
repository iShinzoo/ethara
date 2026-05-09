export interface DashboardStats {
  total_tasks: number;
  completed_tasks: number;
  overdue_tasks: number;
  assigned_to_me: number;
  project_progress: ProjectProgress[];
}

export interface ProjectProgress {
  project_id: string;
  project_name: string;
  total_tasks: number;
  completed_tasks: number;
  progress: number;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  due_date?: string;
  priority?: TaskPriority;
  project_id: string;
  project_name?: string;
  assigned_to?: string;
  assignee_name?: string;
  created_at: string;
  updated_at: string;
}

export type TaskStatus = 'todo' | 'in_progress' | 'in-progress' | 'done' | 'overdue';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface CreateTaskRequest {
  title: string;
  description?: string;
  project_id: string;
  assigned_to?: string;
  due_date?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
  due_date?: string;
  assigned_to?: string;
}
