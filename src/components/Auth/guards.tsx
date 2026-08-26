import { Navigate, useLocation } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import type { UserInfo } from '@/types';
import type { ReactNode } from 'react';

/**
 * 登录守卫：未登录跳转到 /login
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const isAuthenticated = useStore((s) => s.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return <>{children}</>;
}

/**
 * 角色守卫：角色不匹配时跳转到首页
 * @param allowed 允许访问的角色列表
 */
export function RoleGuard({ allowed, children }: { allowed: UserInfo['role'][]; children: ReactNode }) {
  const user = useStore((s) => s.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowed.includes(user.role)) {
    // 跳转到对应角色的首页
    const home = user.role === 'teacher' ? '/teacher' : '/qa';
    return <Navigate to={home} replace />;
  }

  return <>{children}</>;
}
