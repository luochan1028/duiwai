import { useTheme, ThemeMode } from '@/contexts/ThemeContext';
import { Sun, Moon, Palette } from 'lucide-react';

const themes: { key: ThemeMode; label: string; icon: typeof Sun; color: string }[] = [
  { key: 'dark', label: '暗色科技', icon: Moon, color: 'text-accent-cyan' },
  { key: 'light', label: '明亮白色', icon: Sun, color: 'text-yellow-500' },
  { key: 'red', label: '红色主题', icon: Palette, color: 'text-red-500' },
];

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 p-1 rounded-lg bg-[var(--color-glass-bg)] border border-[var(--color-border)]">
      {themes.map((t) => {
        const Icon = t.icon;
        const isActive = theme === t.key;
        return (
          <button
            key={t.key}
            onClick={() => setTheme(t.key)}
            title={t.label}
            className={`p-2 rounded-md transition-all duration-200 ${
              isActive
                ? `bg-[var(--color-accent-primary)]/20 ${t.color}`
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-border)]'
            }`}
          >
            <Icon className="w-4 h-4" />
          </button>
        );
      })}
    </div>
  );
}