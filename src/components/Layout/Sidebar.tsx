import { NavLink, useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  Network,
  Route,
  Code2,
  FileCheck,
  Bot,
  Zap,
  BarChart3,
  Shield,
  BookOpen,
  Video,
  Flag,
  GraduationCap,
  Menu,
  X,
  LogOut,
  UserCircle,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import { useStore } from '@/store/useStore';

// 学生端导航项
const studentItems = [
  { id: 'red-education', label: '红色育人', icon: Flag, path: '/red-education' },
  { id: 'qa', label: '智能问答', icon: MessageSquare, path: '/qa' },
  { id: 'graph', label: '知识图谱', icon: Network, path: '/graph' },
  { id: 'path', label: '学习路径', icon: Route, path: '/path' },
  { id: 'lab', label: '实验辅助', icon: Code2, path: '/lab' },
  { id: 'video', label: '视频资源', icon: Video, path: '/video' },
  { id: 'quiz', label: '自测系统', icon: FileCheck, path: '/quiz' },
];

// 教师端导航项
const teacherItems = [
  { id: 'philosophy', label: '教育理念', icon: BookOpen, path: '/philosophy' },
  { id: 'teacher', label: '学情分析', icon: BarChart3, path: '/teacher' },
  { id: 'users', label: '用户管理', icon: Users, path: '/users' },
];

// 通用导航项（所有角色可见）
const commonItems = [
  { id: 'profile', label: '个人中心', icon: UserCircle, path: '/profile' },
];

export default function Sidebar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const user = useStore((s) => s.user);
  const logout = useStore((s) => s.logout);
  const navigate = useNavigate();

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const isTeacher = user?.role === 'teacher';

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  // 根据角色决定显示哪些导航
  // 学生：只看学生端
  // 老师：学生端 + 教师端都可见
  const showStudentNav = true;
  const showTeacherNav = isTeacher;

  return (
    <>
      {/* 移动端汉堡菜单按钮 */}
      <button
        onClick={toggleMobileMenu}
        className="md:hidden fixed top-4 left-4 z-[60] p-2 bg-[var(--color-bg-secondary)]/90 backdrop-blur-xl border border-[var(--color-border)] rounded-lg shadow-lg"
        aria-label="切换菜单"
      >
        {mobileMenuOpen ? (
          <X className="w-5 h-5 text-[var(--color-text-primary)]" />
        ) : (
          <Menu className="w-5 h-5 text-[var(--color-text-primary)]" />
        )}
      </button>

      {/* 遮罩层 */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={closeMobileMenu}
        />
      )}

      <aside
        className={`w-64 h-screen bg-[var(--color-bg-secondary)]/80 backdrop-blur-xl border-r border-[var(--color-border)] flex flex-col fixed left-0 top-0 z-50 transition-transform duration-300 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Logo区域 */}
        <div className="p-6 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)] flex items-center justify-center shadow-lg">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-tech text-lg font-bold glow-text">计组智学</h1>
              <p className="text-xs text-[var(--color-text-secondary)]">AI学习助手</p>
            </div>
          </div>
        </div>

        {/* 导航菜单 */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {/* 学生端分组 */}
          {showStudentNav && (
            <div className="px-3 space-y-1">
              <p className="px-4 text-xs text-[var(--color-text-secondary)]/60 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <GraduationCap className="w-3 h-3" />
                学生端
              </p>
              {studentItems.map((item, index) => (
                <NavLink
                  key={item.id}
                  to={item.path}
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `sidebar-item flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group ${
                      isActive
                        ? 'active text-[var(--color-accent-primary)]'
                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-accent-primary)]/5'
                    }`
                  }
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              ))}
            </div>
          )}

          {/* 分隔线 */}
          {showStudentNav && showTeacherNav && (
            <div className="mx-4 my-4 border-t border-[var(--color-border)]" />
          )}

          {/* 教师端分组（仅老师可见） */}
          {showTeacherNav && (
            <div className="px-3 space-y-1 mb-4">
              <p className="px-4 text-xs text-[var(--color-text-secondary)]/60 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <BarChart3 className="w-3 h-3" />
                教师端
              </p>
              {teacherItems.map((item) => (
                <NavLink
                  key={item.id}
                  to={item.path}
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `sidebar-item flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group ${
                      isActive
                        ? 'active text-[var(--color-accent-secondary)]'
                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-accent-secondary)]/5'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              ))}
            </div>
          )}

          {/* 分隔线 */}
          <div className="mx-4 my-2 border-t border-[var(--color-border)]" />

          {/* 通用导航（个人中心，所有角色可见） */}
          <div className="px-3 space-y-1">
            <p className="px-4 text-xs text-[var(--color-text-secondary)]/60 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <UserCircle className="w-3 h-3" />
              账号
            </p>
            {commonItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `sidebar-item flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group ${
                    isActive
                      ? 'active text-[var(--color-accent-primary)]'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-accent-primary)]/5'
                  }`
                }
              >
                <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </div>

          {/* 分隔线 */}
          <div className="mx-4 my-2 border-t border-[var(--color-border)]" />

          {/* 学习状态卡片（仅学生显示） */}
          {!isTeacher && (
            <div className="px-4">
              <div className="glass-card p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4 text-[var(--color-accent-primary)]" />
                  <span className="text-sm font-medium text-[var(--color-text-primary)]">今日学习</span>
                </div>
                <div className="text-2xl font-tech font-bold glow-text mb-1">
                  75<span className="text-sm font-normal text-[var(--color-text-secondary)] ml-1">分钟</span>
                </div>
                <div className="w-full h-1.5 bg-[var(--color-bg-primary)] rounded-full overflow-hidden">
                  <div
                    className="h-full progress-bar-glow"
                    style={{ width: '62%' }}
                  />
                </div>
                <p className="text-xs text-[var(--color-text-secondary)] mt-2">目标：120分钟，已完成62%</p>
              </div>
            </div>
          )}
        </nav>

        {/* 底部用户信息 */}
        <div className="p-4 border-t border-[var(--color-border)]">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
              isTeacher
                ? 'bg-gradient-to-br from-[var(--color-accent-secondary)] to-[var(--color-accent-pink)]'
                : 'bg-gradient-to-br from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)]'
            }`}>
              {user?.avatar || (isTeacher ? '管' : '学')}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                {user?.username || '未登录'}
              </p>
              <p className="text-xs text-[var(--color-text-secondary)]">
                {isTeacher ? '老师 / 管理员' : '学生'}
              </p>
            </div>
            <button
              onClick={handleLogout}
              title="退出登录"
              className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-accent-pink)] hover:bg-[var(--color-accent-pink)]/10 rounded-lg transition-all"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-1.5 px-1">
            <Shield className="w-3 h-3 text-[var(--color-accent-green)] flex-shrink-0" />
            <p className="text-xs text-[var(--color-text-secondary)]/60">数据本地存储，不用于训练</p>
          </div>
        </div>
      </aside>
    </>
  );
}
