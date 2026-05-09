export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  assignedToMe: number;
  projects: ProjectProgress[];
  recentTasks: Task[];
}

export interface ProjectProgress {
  id: string;
  name: string;
  totalTasks: number;
  completedTasks: number;
  percentage: number;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate?: string;
  priority: TaskPriority;
  projectId: string;
  projectName?: string;
  assigneeId: string;
  assigneeName?: string;
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus = 'todo' | 'in_progress' | 'in-progress' | 'done' | 'overdue';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface CreateTaskRequest {
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate?: string;
  priority: TaskPriority;
  projectId: string;
  assigneeId: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
  dueDate?: string;
  priority?: TaskPriority;
  assigneeId?: string;
}
