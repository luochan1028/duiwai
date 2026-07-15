import { Bell, Settings, Search, Clock, Trophy } from 'lucide-react';

export default function TopBar() {
  return (
    <header className="h-16 bg-bg-secondary/60 backdrop-blur-xl border-b border-accent-cyan/10 flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            placeholder="搜索知识点、题目..."
            className="w-72 h-9 pl-9 pr-4 bg-bg-primary/50 border border-accent-cyan/20 rounded-lg text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent-cyan/50 focus:shadow-glow-cyan transition-all"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-4 py-2 bg-bg-primary/50 rounded-lg border border-accent-cyan/10">
          <Clock className="w-4 h-4 text-accent-cyan" />
          <span className="text-sm text-text-secondary">累计学习</span>
          <span className="text-sm font-semibold text-accent-cyan font-tech">64h</span>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 bg-bg-primary/50 rounded-lg border border-accent-green/20">
          <Trophy className="w-4 h-4 text-accent-green" />
          <span className="text-sm text-text-secondary">答题数</span>
          <span className="text-sm font-semibold text-accent-green font-tech">127</span>
        </div>
        
        <button className="relative p-2 text-text-secondary hover:text-accent-cyan hover:bg-accent-cyan/10 rounded-lg transition-all">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-pink rounded-full animate-pulse" />
        </button>
        
        <button className="p-2 text-text-secondary hover:text-accent-cyan hover:bg-accent-cyan/10 rounded-lg transition-all">
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
