import getAxiosInstance from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/constants';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '@/types/dashboard';

const normalizeStatus = (raw: unknown): Task['status'] => {
  const s = String(raw ?? '').toUpperCase();
  if (s === 'IN_PROGRESS' || s === 'IN-PROGRESS') return 'in_progress';
  if (s === 'DONE') return 'done';
  if (s === 'OVERDUE') return 'overdue';
  return 'todo';
};

const toBackendStatus = (raw: unknown): string | undefined => {
  if (raw == null) return undefined;
  const s = String(raw);
  if (!s) return undefined;
  if (s === 'todo' || s.toUpperCase() === 'TODO') return 'TODO';
  if (s === 'in_progress' || s.toUpperCase() === 'IN_PROGRESS') return 'IN_PROGRESS';
  if (s === 'done' || s.toUpperCase() === 'DONE') return 'DONE';
  // Backend does not support OVERDUE as a status value
  return undefined;
};

const toRFC3339 = (raw: unknown): string | undefined => {
  if (raw == null) return undefined;
  const s = String(raw).trim();
  if (!s) return undefined;

  // If already parseable to a valid date, keep ISO.
  // Handles RFC3339/ISO strings.
  const parsed = new Date(s);
  if (!Number.isNaN(parsed.getTime())) return parsed.toISOString();

  // Handle `<input type="date" />` value: YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const d = new Date(`${s}T00:00:00.000Z`);
    if (!Number.isNaN(d.getTime())) return d.toISOString();
  }

  return undefined;
};

const normalizeTask = (raw: any): Task => {
  // Backend returns Go structs without json tags, so fields are `ID`, `Title`, etc.
  const id = raw?.id ?? raw?.ID ?? '';
  const title = raw?.title ?? raw?.Title ?? '';
  const projectId = raw?.project_id ?? raw?.projectId ?? raw?.ProjectID ?? raw?.ProjectId ?? '';
  const assignedTo = raw?.assigned_to ?? raw?.assignedTo ?? raw?.AssignedTo ?? undefined;
  const due = raw?.due_date ?? raw?.dueDate ?? raw?.DueDate ?? undefined;
  const created = raw?.created_at ?? raw?.createdAt ?? raw?.CreatedAt ?? new Date().toISOString();
  const updated = raw?.updated_at ?? raw?.updatedAt ?? raw?.UpdatedAt ?? new Date().toISOString();

  return {
    id: String(id),
    title: String(title),
    description: raw?.description ?? raw?.Description ?? undefined,
    status: normalizeStatus(raw?.status ?? raw?.Status),
    due_date: due ? new Date(due).toISOString() : undefined,
    priority: raw?.priority ?? raw?.Priority ?? undefined,
    project_id: String(projectId),
    project_name: raw?.project_name ?? raw?.projectName ?? raw?.ProjectName ?? undefined,
    assigned_to: assignedTo ? String(assignedTo) : undefined,
    assignee_name: raw?.assignee_name ?? raw?.assigneeName ?? raw?.AssigneeName ?? undefined,
    created_at: created ? new Date(created).toISOString() : new Date().toISOString(),
    updated_at: updated ? new Date(updated).toISOString() : new Date().toISOString(),
  };
};

export const tasksService = {
  async getTasks(filters?: { project_id?: string; status?: string; assigned_to?: string }): Promise<Task[]> {
    const params = new URLSearchParams();
    if (filters?.project_id) params.append('project_id', filters.project_id);
    if (filters?.status) {
      const backendStatus = toBackendStatus(filters.status);
      if (backendStatus) params.append('status', backendStatus);
    }
    if (filters?.assigned_to) params.append('assigned_to', filters.assigned_to);

    const url = params.toString() 
      ? `${API_ENDPOINTS.TASKS.LIST}?${params.toString()}`
      : API_ENDPOINTS.TASKS.LIST;
    
    const response = await getAxiosInstance().get(url);
    const raw = Array.isArray(response.data) ? response.data : response.data.data || [];
    return Array.isArray(raw) ? raw.map(normalizeTask) : [];
  },

  async getTask(id: string): Promise<Task> {
    const response = await getAxiosInstance().get(API_ENDPOINTS.TASKS.GET(id));
    const raw = response.data.data || response.data;
    return normalizeTask(raw);
  },

  async createTask(data: CreateTaskRequest): Promise<Task> {
    const payload: CreateTaskRequest = {
      ...data,
      due_date: toRFC3339((data as any).due_date),
    };

    const response = await getAxiosInstance().post(API_ENDPOINTS.TASKS.CREATE, payload);
    const raw = response.data.data || response.data;
    // Backend returns only `{ message }` today; still return a valid Task shape.
    return normalizeTask(raw);
  },

  async updateTask(id: string, data: UpdateTaskRequest): Promise<Task> {
    const payload: UpdateTaskRequest = { ...data };
    if (data.status) {
      const backendStatus = toBackendStatus(data.status);
      if (backendStatus) {
        (payload as any).status = backendStatus;
      } else {
        // If an unsupported status is selected, do not send it.
        delete (payload as any).status;
      }
    }
    if ((data as any).due_date) {
      const due = toRFC3339((data as any).due_date);
      if (due) (payload as any).due_date = due;
    }

    const response = await getAxiosInstance().patch(API_ENDPOINTS.TASKS.UPDATE(id), payload);
    const raw = response.data.data || response.data;
    return normalizeTask(raw);
  },

  async deleteTask(id: string): Promise<void> {
    await getAxiosInstance().delete(API_ENDPOINTS.TASKS.DELETE(id));
  },
};
