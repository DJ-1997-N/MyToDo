import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as authService from '@/services/authService';
import { useAuthStore } from '@/stores/authStore';
import type { RegisterInput, LoginInput } from '@/types/user';

// 获取当前用户
export const useCurrentUser = () => {
  const initialize = useAuthStore((state) => state.initialize);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      initialize();
      return await authService.getCurrentUser();
    },
    enabled: isAuthenticated,
    retry: false
  });
};

// 注册
export const useRegister = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  
  return useMutation({
    mutationFn: (data: RegisterInput) => authService.register(data),
    onSuccess: (data) => {
      setAuth(data.user, data.token);
    }
  });
};

// 登录
export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  
  return useMutation({
    mutationFn: (data: LoginInput) => authService.login(data),
    onSuccess: (data) => {
      setAuth(data.user, data.token);
    }
  });
};

// 登出
export const useLogout = () => {
  const logout = useAuthStore((state) => state.logout);
  
  return useMutation({
    mutationFn: () => {
      authService.logout();
      return Promise.resolve();
    },
    onSuccess: () => {
      logout();
    }
  });
};

// 更新个人资料
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const updateUser = useAuthStore((state) => state.updateUser);
  
  return useMutation({
    mutationFn: (data: Partial<Parameters<typeof authService.updateProfile>[0]>) => 
      authService.updateProfile(data),
    onSuccess: (data) => {
      updateUser(data);
      queryClient.setQueryData(['currentUser'], data);
    }
  });
};
