import getAxiosInstance from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/constants';
import { AuthResponse, LoginRequest, SignupRequest } from '@/types/auth';

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await getAxiosInstance().post(API_ENDPOINTS.AUTH.LOGIN, data);
    return response.data;
  },

  async signup(data: SignupRequest): Promise<AuthResponse> {
    const response = await getAxiosInstance().post(API_ENDPOINTS.AUTH.SIGNUP, data);
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await getAxiosInstance().post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      // Continue logout even if request fails
      console.error('Logout request failed:', error);
    }
  },

  async verifyToken(): Promise<AuthResponse> {
    const response = await getAxiosInstance().post(API_ENDPOINTS.AUTH.VERIFY);
    return response.data;
  },

  async refreshToken(): Promise<AuthResponse> {
    const response = await getAxiosInstance().post(API_ENDPOINTS.AUTH.REFRESH);
    return response.data;
  },
};
