import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL, TOKEN_KEY, ROOT_API_URL } from '@/lib/constants';
import { toast } from 'sonner';

let axiosInstance: AxiosInstance | null = null;
let rootAxiosInstance: AxiosInstance | null = null;

const setupInterceptors = (instance: AxiosInstance) => {
  // Request interceptor
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Unauthorized - clear token and redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem(TOKEN_KEY);
          window.location.href = '/login';
        }
        toast.error('Your session has expired. Please log in again.');
      } else if (error.response?.status === 403) {
        toast.error('You do not have permission to perform this action.');
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else if (error.message === 'Network Error') {
        toast.error('Network error. Please check your connection.');
      }
      return Promise.reject(error);
    }
  );
};

export const getAxiosInstance = (): AxiosInstance => {
  if (!axiosInstance) {
    axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    setupInterceptors(axiosInstance);
  }

  return axiosInstance;
};

export const getRootAxiosInstance = (): AxiosInstance => {
  if (!rootAxiosInstance) {
    rootAxiosInstance = axios.create({
      baseURL: ROOT_API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    setupInterceptors(rootAxiosInstance);
  }

  return rootAxiosInstance;
};

export default getAxiosInstance;
