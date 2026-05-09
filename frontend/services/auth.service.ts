import getAxiosInstance, { getRootAxiosInstance } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/constants';
import { AuthResponse, LoginRequest, SignupRequest, User } from '@/types/auth';

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const rootInstance = getRootAxiosInstance();
    const response = await rootInstance.post(API_ENDPOINTS.AUTH.LOGIN, data);
    
    // Backend returns: { success: true, message: "login successful", data: { token: "..." } }
    const token = response.data.data.token;
    
    // Fetch user data using the token
    const apiInstance = getAxiosInstance();
    const userResponse = await apiInstance.get(API_ENDPOINTS.AUTH.ME, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    // Extract user from response
    const user: User = {
      id: userResponse.data.user_id,
      email: userResponse.data.email,
      name: userResponse.data.email.split('@')[0], // Fallback name from email
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    return { token, user };
  },

  async signup(data: SignupRequest): Promise<AuthResponse> {
    const rootInstance = getRootAxiosInstance();
    await rootInstance.post(API_ENDPOINTS.AUTH.SIGNUP, data);
    
    // After signup, auto-login the user
    return this.login({ email: data.email, password: data.password });
  },

  async logout(): Promise<void> {
    try {
      const rootInstance = getRootAxiosInstance();
      await rootInstance.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      // Continue logout even if request fails
      console.error('Logout request failed:', error);
    }
  },

  async verifyToken(): Promise<AuthResponse> {
    try {
      const apiInstance = getAxiosInstance();
      const response = await apiInstance.get(API_ENDPOINTS.AUTH.ME);
      
      // Construct user from me endpoint response
      const user: User = {
        id: response.data.user_id,
        email: response.data.email,
        name: response.data.email.split('@')[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const token = localStorage.getItem('auth_token') || '';
      return { token, user };
    } catch (error) {
      throw error;
    }
  },

  async refreshToken(): Promise<AuthResponse> {
    const rootInstance = getRootAxiosInstance();
    const response = await rootInstance.post(API_ENDPOINTS.AUTH.REFRESH);
    const token = response.data.data.token;
    
    // Verify with the new token
    return this.verifyToken();
  },
};
