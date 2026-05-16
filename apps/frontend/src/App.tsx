import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { MantineProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { useAuthStore } from '@/stores/authStore';
import AppShell from '@/components/layout/AppShell';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import DashboardPage from '@/pages/DashboardPage';
import ProfilePage from '@/pages/ProfilePage';
import { useEffect } from 'react';

// 受保护的路由组件
function ProtectedRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}

// 公共路由组件（已登录用户重定向到dashboard）
function PublicRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <Outlet />;
}

// 主题配置
const theme = createTheme({
  primaryColor: 'blue',
  defaultRadius: 'md'
});

export default function App() {
  const initialize = useAuthStore((state) => state.initialize);
  
  useEffect(() => {
    initialize();
  }, []);
  
  return (
    <MantineProvider theme={theme}>
      <Notifications />
      <BrowserRouter>
        <Routes>
          {/* 公共路由 */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
          
          {/* 受保护路由 */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
          
          {/* 默认重定向 */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}
