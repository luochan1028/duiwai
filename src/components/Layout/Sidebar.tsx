import { NavLink } from 'react-router-dom';
import {
  MessageSquare,
  Network,
  Route,
  Code2,
  FileCheck,
  Bot,
  Zap,
  BarChart3,
  Shield
} from 'lucide-react';

const navItems = [
  { id: 'qa', label: '智能问答', icon: MessageSquare, path: '/qa' },
  { id: 'graph', label: '知识图谱', icon: Network, path: '/graph' },
  { id: 'path', label: '学习路径', icon: Route, path: '/path' },
  { id: 'lab', label: '实验辅助', icon: Code2, path: '/lab' },
  { id: 'quiz', label: '自测系统', icon: FileCheck, path: '/quiz' },
];

const teacherItems = [
  { id: 'teacher', label: '学情分析', icon: BarChart3, path: '/teacher' },
];

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-bg-secondary/80 backdrop-blur-xl border-r border-accent-cyan/10 flex flex-col fixed left-0 top-0 z-50">
      {/* Logo区域 */}
      <div className="p-6 border-b border-accent-cyan/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center shadow-glow-cyan animate-pulse-glow">
            <Bot className="w-6 h-6 text-bg-primary" />
          </div>
          <div>
            <h1 className="font-tech text-lg font-bold text-accent-cyan glow-text">计组智学</h1>
            <p className="text-xs text-text-secondary">AI学习助手</p>
          </div>
        </div>
      </div>
      
      {/* 导航菜单 */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <div className="px-3 space-y-1">
          {navItems.map((item, index) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-item flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group ${
                  isActive
                    ? 'active text-accent-cyan'
                    : 'text-text-secondary hover:text-text-primary hover:bg-accent-cyan/5'
                }`
              }
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
        
        {/* 分隔线 */}
        <div className="mx-4 my-4 border-t border-accent-cyan/10" />

        {/* 教师端入口 */}
        <div className="px-3 space-y-1 mb-4">
          <p className="px-4 text-xs text-text-secondary/60 uppercase tracking-wider mb-1">教师端</p>
          {teacherItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-item flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group ${
                  isActive
                    ? 'active text-accent-purple'
                    : 'text-text-secondary hover:text-text-primary hover:bg-accent-purple/5'
                }`
              }
            >
              <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>

        {/* 学习状态卡片 */}
        <div className="px-4">
          <div className="glass-card p-4 chip-decoration">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-accent-cyan" />
              <span className="text-sm font-medium text-text-primary">今日学习</span>
            </div>
            <div className="text-2xl font-tech font-bold text-accent-cyan glow-text mb-1">
              75<span className="text-sm font-normal text-text-secondary ml-1">分钟</span>
            </div>
            <div className="w-full h-1.5 bg-bg-primary rounded-full overflow-hidden">
              <div
                className="h-full progress-bar-glow"
                style={{ width: '62%' }}
              />
            </div>
            <p className="text-xs text-text-secondary mt-2">目标：120分钟，已完成62%</p>
          </div>
        </div>
      </nav>
      
      {/* 底部用户信息 */}
      <div className="p-4 border-t border-accent-cyan/10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center text-white font-semibold">
            学
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">网安2025级学生</p>
            <p className="text-xs text-text-secondary">学号：2025XXXX</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-1">
          <Shield className="w-3 h-3 text-accent-green flex-shrink-0" />
          <p className="text-xs text-text-secondary/60">数据本地存储，不用于训练</p>
        </div>
      </div>
    </aside>
  );
}
