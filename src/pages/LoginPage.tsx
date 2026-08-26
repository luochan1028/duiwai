import { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { Bot, User, Lock, Eye, EyeOff, ShieldCheck, GraduationCap, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useStore((s) => s.login);
  const isAuthenticated = useStore((s) => s.isAuthenticated);
  const user = useStore((s) => s.user);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 已登录则跳转
  if (isAuthenticated && user) {
    const from = (location.state as { from?: string })?.from;
    const home = user.role === 'teacher' ? '/teacher' : '/qa';
    return <Navigate to={from || home} replace />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password) {
      setError('请输入用户名和密码');
      return;
    }

    setLoading(true);
    // 模拟一点延迟，体验更好
    setTimeout(() => {
      const result = login(username, password);
      if (result.success && result.role) {
        const from = (location.state as { from?: string })?.from;
        const home = result.role === 'teacher' ? '/teacher' : '/qa';
        navigate(from || home, { replace: true });
      } else {
        setError(result.message || '登录失败');
      }
      setLoading(false);
    }, 300);
  };

  const fillDemo = (type: 'student' | 'admin') => {
    if (type === 'student') {
      setUsername('student');
      setPassword('123456');
    } else {
      setUsername('admin');
      setPassword('admin');
    }
    setError('');
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] circuit-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* 背景装饰光晕 */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--color-accent-primary)]/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--color-accent-secondary)]/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative w-full max-w-md">
        {/* 顶部 Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)] items-center justify-center shadow-2xl mb-4">
            <Bot className="w-9 h-9 text-white" />
          </div>
          <h1 className="font-tech text-3xl font-bold glow-text mb-1">计组智学</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">AI 教育智能体 · 计算机组成原理</p>
        </div>

        {/* 登录卡片 */}
        <div className="glass-card p-6 md:p-8">
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-1">欢迎登录</h2>
          <p className="text-sm text-[var(--color-text-secondary)] mb-6">请选择身份并输入账号密码</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 用户名 */}
            <div>
              <label className="block text-xs text-[var(--color-text-secondary)] mb-1.5">用户名</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="student 或 admin"
                  autoComplete="username"
                  className="w-full h-11 pl-10 pr-4 bg-[var(--color-bg-primary)]/60 border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)]/60 focus:outline-none focus:border-[var(--color-accent-primary)]/60 focus:ring-2 focus:ring-[var(--color-accent-primary)]/20 transition-all"
                />
              </div>
            </div>

            {/* 密码 */}
            <div>
              <label className="block text-xs text-[var(--color-text-secondary)] mb-1.5">密码</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码"
                  autoComplete="current-password"
                  className="w-full h-11 pl-10 pr-10 bg-[var(--color-bg-primary)]/60 border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)]/60 focus:outline-none focus:border-[var(--color-accent-primary)]/60 focus:ring-2 focus:ring-[var(--color-accent-primary)]/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                  tabIndex={-1}
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* 错误提示 */}
            {error && (
              <div className="flex items-center gap-2 px-3 py-2 bg-[var(--color-accent-pink)]/10 border border-[var(--color-accent-pink)]/30 rounded-lg">
                <AlertCircle className="w-4 h-4 text-[var(--color-accent-pink)] flex-shrink-0" />
                <p className="text-xs text-[var(--color-accent-pink)]">{error}</p>
              </div>
            )}

            {/* 登录按钮 */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-gradient-to-r from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)] text-white font-medium rounded-lg hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? '登录中...' : '登 录'}
            </button>
          </form>

          {/* 快速登录演示账号 */}
          <div className="mt-6 pt-5 border-t border-[var(--color-border)]">
            <p className="text-xs text-[var(--color-text-secondary)] mb-3 text-center">演示账号（点击填充）</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => fillDemo('student')}
                className="flex flex-col items-center gap-1.5 p-3 bg-[var(--color-bg-primary)]/40 border border-[var(--color-border)] rounded-lg hover:border-[var(--color-accent-primary)]/50 hover:bg-[var(--color-accent-primary)]/5 transition-all"
              >
                <GraduationCap className="w-5 h-5 text-[var(--color-accent-primary)]" />
                <span className="text-xs font-medium text-[var(--color-text-primary)]">学生</span>
                <span className="text-[10px] text-[var(--color-text-secondary)]">student / 123456</span>
              </button>
              <button
                type="button"
                onClick={() => fillDemo('admin')}
                className="flex flex-col items-center gap-1.5 p-3 bg-[var(--color-bg-primary)]/40 border border-[var(--color-border)] rounded-lg hover:border-[var(--color-accent-secondary)]/50 hover:bg-[var(--color-accent-secondary)]/5 transition-all"
              >
                <ShieldCheck className="w-5 h-5 text-[var(--color-accent-secondary)]" />
                <span className="text-xs font-medium text-[var(--color-text-primary)]">老师/管理员</span>
                <span className="text-[10px] text-[var(--color-text-secondary)]">admin / admin</span>
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-[var(--color-text-secondary)]/60 mt-6">
          不同身份登录后看到的界面不同 · 数据本地存储
        </p>
      </div>
    </div>
  );
}
