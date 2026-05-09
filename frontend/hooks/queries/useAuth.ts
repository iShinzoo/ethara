import { useMutation, useQuery } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';
import { LoginRequest, SignupRequest, AuthResponse } from '@/types/auth';
import { TOKEN_KEY, USER_KEY } from '@/lib/constants';

export const useLogin = () => {
  return useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const response = await authService.login(credentials);
      // Store token and user
      localStorage.setItem(TOKEN_KEY, response.token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));
      return response;
    },
  });
};

export const useSignup = () => {
  return useMutation({
    mutationFn: async (data: SignupRequest) => {
      const response = await authService.signup(data);
      // Store token and user
      localStorage.setItem(TOKEN_KEY, response.token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));
      return response;
    },
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: async () => {
      await authService.logout();
      // Clear stored data
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    },
  });
};

export const useVerifyToken = () => {
  return useQuery({
    queryKey: ['auth', 'verify'],
    queryFn: () => authService.verifyToken(),
    retry: false,
    enabled: typeof window !== 'undefined' && !!localStorage.getItem(TOKEN_KEY),
  });
};
