export interface Project {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  members: ProjectMember[];
  taskCount: number;
  completedTaskCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectMember {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  role: ProjectRole;
  joinedAt: string;
}

export type ProjectRole = 'owner' | 'member' | 'viewer';

export interface CreateProjectRequest {
  name: string;
  description?: string;
}

export interface AddProjectMemberRequest {
  email: string;
  role: ProjectRole;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
}
