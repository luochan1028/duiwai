import { Bell, Settings, Search, Clock, Trophy, LogOut, ShieldCheck, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { useStore } from '@/store/useStore';

export default function TopBar() {
  const user = useStore((s) => s.user);
  const logout = useStore((s) => s.logout);
  const navigate = useNavigate();
  const isTeacher = user?.role === 'teacher';

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="h-16 bg-[var(--color-bg-secondary)]/60 backdrop-blur-xl border-b border-[var(--color-border)] flex items-center justify-between px-4 md:px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4 ml-10 md:ml-0">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" />
          <input
            type="text"
            placeholder="搜索知识点、题目..."
            className="w-48 md:w-72 h-9 pl-9 pr-4 bg-[var(--color-bg-primary)]/50 border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:border-[var(--color-accent-primary)]/50 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        {/* 主题切换 */}
        <ThemeSwitcher />

        {/* 移动端隐藏统计信息（仅学生显示） */}
        {!isTeacher && (
          <>
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-[var(--color-bg-primary)]/50 rounded-lg border border-[var(--color-border)]">
              <Clock className="w-4 h-4 text-[var(--color-accent-primary)]" />
              <span className="text-sm text-[var(--color-text-secondary)]">累计学习</span>
              <span className="text-sm font-semibold text-[var(--color-accent-primary)] font-tech">64h</span>
            </div>

            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-[var(--color-bg-primary)]/50 rounded-lg border border-[var(--color-accent-green)]/20">
              <Trophy className="w-4 h-4 text-[var(--color-accent-green)]" />
              <span className="text-sm text-[var(--color-text-secondary)]">答题数</span>
              <span className="text-sm font-semibold text-[var(--color-accent-green)] font-tech">127</span>
            </div>
          </>
        )}

        {/* 角色标识 */}
        <div className={`hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg border ${
          isTeacher
            ? 'bg-[var(--color-accent-secondary)]/10 border-[var(--color-accent-secondary)]/30 text-[var(--color-accent-secondary)]'
            : 'bg-[var(--color-accent-primary)]/10 border-[var(--color-accent-primary)]/30 text-[var(--color-accent-primary)]'
        }`}>
          {isTeacher ? <ShieldCheck className="w-4 h-4" /> : <GraduationCap className="w-4 h-4" />}
          <span className="text-xs font-medium">{isTeacher ? '管理员' : '学生'}</span>
        </div>

        <button className="relative p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary)]/10 rounded-lg transition-all">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--color-accent-pink)] rounded-full animate-pulse" />
        </button>

        <button className="hidden md:block p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary)]/10 rounded-lg transition-all">
          <Settings className="w-5 h-5" />
        </button>

        {/* 登出按钮 */}
        <button
          onClick={handleLogout}
          title="退出登录"
          className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-accent-pink)] hover:bg-[var(--color-accent-pink)]/10 rounded-lg transition-all"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
