export const ROOT_API_URL = process.env.NEXT_PUBLIC_ROOT_API_URL || 'http://localhost:8080';
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const API_ENDPOINTS = {
  // Auth endpoints (at root level)
  AUTH: {
    LOGIN: '/login',
    SIGNUP: '/signup',
    LOGOUT: '/auth/logout',
    VERIFY: '/auth/verify',
    REFRESH: '/auth/refresh',
    // NOTE: `API_BASE_URL` already includes `/api`
    ME: '/me',
  },
  // Dashboard endpoints
  DASHBOARD: {
    STATS: '/dashboard',
    GET: '/dashboard',
  },
  // Projects endpoints
  PROJECTS: {
    LIST: '/projects',
    CREATE: '/projects',
    GET: (id: string) => `/projects/${id}`,
    UPDATE: (id: string) => `/projects/${id}`,
    DELETE: (id: string) => `/projects/${id}`,
    ADD_MEMBER: (id: string) => `/projects/${id}/members`,
    REMOVE_MEMBER: (id: string, memberId: string) => `/projects/${id}/members/${memberId}`,
  },
  // Tasks endpoints
  TASKS: {
    LIST: '/tasks',
    CREATE: '/tasks',
    GET: (id: string) => `/tasks/${id}`,
    UPDATE: (id: string) => `/tasks/${id}`,
    DELETE: (id: string) => `/tasks/${id}`,
  },
};

export const TOKEN_KEY = 'auth_token';
export const USER_KEY = 'auth_user';

export const TASK_STATUSES = ['todo', 'in_progress', 'done', 'overdue'] as const;
export const TASK_PRIORITIES = ['low', 'medium', 'high'] as const;
export const PROJECT_ROLES = ['owner', 'member', 'viewer'] as const;

export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Please log in to continue',
  FORBIDDEN: 'You do not have permission to access this resource',
  NOT_FOUND: 'The requested resource was not found',
  SERVER_ERROR: 'Something went wrong. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  INVALID_CREDENTIALS: 'Invalid email or password',
  EMAIL_EXISTS: 'An account with this email already exists',
  VALIDATION_ERROR: 'Please check your input and try again',
};
