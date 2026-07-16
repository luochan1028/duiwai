import { useState } from 'react';
import {
  Video, Plus, ExternalLink, Trash2, Play, Film, Youtube, FileVideo
} from 'lucide-react';

interface VideoItem {
  id: string;
  title: string;
  url: string;
  category: string;
  embedUrl?: string;
}

const defaultVideos: VideoItem[] = [
  {
    id: '1',
    title: '计算机组成原理 - CPU工作原理',
    url: 'https://www.bilibili.com/video/BV1tY411T7jZ',
    category: '课程讲解',
    embedUrl: 'https://player.bilibili.com/player.html?bvid=BV1tY411T7jZ&page=1',
  },
  {
    id: '2',
    title: '汇编语言程序设计入门',
    url: 'https://www.bilibili.com/video/BV1E64y1X7aS',
    category: '实验指导',
    embedUrl: 'https://player.bilibili.com/player.html?bvid=BV1E64y1X7aS&page=1',
  },
  {
    id: '3',
    title: '存储系统与Cache原理',
    url: 'https://www.bilibili.com/video/BV1vi4y1g7cP',
    category: '课程讲解',
    embedUrl: 'https://player.bilibili.com/player.html?bvid=BV1vi4y1g7cP&page=1',
  },
  {
    id: '4',
    title: '指令系统设计详解',
    url: 'https://www.bilibili.com/video/BV1D44y1v7jL',
    category: '重点难点',
    embedUrl: 'https://player.bilibili.com/player.html?bvid=BV1D44y1v7jL&page=1',
  },
];

const categories = ['全部', '课程讲解', '实验指导', '重点难点', '其他'];

function getEmbedUrl(url: string): string | undefined {
  // Bilibili
  const biliMatch = url.match(/bilibili\.com\/video\/(BV[\w]+)/);
  if (biliMatch) {
    return `https://player.bilibili.com/player.html?bvid=${biliMatch[1]}&page=1`;
  }
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  if (ytMatch) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`;
  }
  // 已经是embed链接
  if (url.includes('embed') || url.includes('player')) {
    return url;
  }
  return undefined;
}

export default function VideoPage() {
  const [videos, setVideos] = useState<VideoItem[]>(() => {
    const saved = localStorage.getItem('jizu-videos');
    return saved ? JSON.parse(saved) : defaultVideos;
  });
  const [activeCategory, setActiveCategory] = useState('全部');
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newCategory, setNewCategory] = useState('其他');
  const [playingId, setPlayingId] = useState<string | null>(null);

  const filtered = activeCategory === '全部' ? videos : videos.filter(v => v.category === activeCategory);

  const handleAdd = () => {
    if (!newTitle.trim() || !newUrl.trim()) return;
    const embedUrl = getEmbedUrl(newUrl);
    const newItem: VideoItem = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      url: newUrl.trim(),
      category: newCategory,
      embedUrl,
    };
    const updated = [...videos, newItem];
    setVideos(updated);
    localStorage.setItem('jizu-videos', JSON.stringify(updated));
    setNewTitle('');
    setNewUrl('');
    setShowAdd(false);
  };

  const handleDelete = (id: string) => {
    const updated = videos.filter(v => v.id !== id);
    setVideos(updated);
    localStorage.setItem('jizu-videos', JSON.stringify(updated));
    if (playingId === id) setPlayingId(null);
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case '课程讲解': return Film;
      case '实验指导': return FileVideo;
      case '重点难点': return Youtube;
      default: return Video;
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in circuit-bg">
      {/* 标题 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Video className="w-8 h-8 text-[var(--color-accent-primary)]" />
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">视频资源</h1>
            <p className="text-sm text-[var(--color-text-secondary)]">课程视频、实验演示与微课资源</p>
          </div>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          添加视频
        </button>
      </div>

      {/* 添加表单 */}
      {showAdd && (
        <div className="glass-card p-5 space-y-4 animate-fade-in-up">
          <h3 className="text-base font-bold text-[var(--color-text-primary)]">添加新视频</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-[var(--color-text-secondary)] mb-1 block">视频标题</label>
              <input
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="输入视频标题"
                className="w-full px-3 py-2 bg-[var(--color-bg-primary)]/50 border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent-primary)]"
              />
            </div>
            <div>
              <label className="text-xs text-[var(--color-text-secondary)] mb-1 block">视频链接</label>
              <input
                value={newUrl}
                onChange={e => setNewUrl(e.target.value)}
                placeholder="Bilibili / YouTube / 其他"
                className="w-full px-3 py-2 bg-[var(--color-bg-primary)]/50 border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent-primary)]"
              />
            </div>
            <div>
              <label className="text-xs text-[var(--color-text-secondary)] mb-1 block">分类</label>
              <select
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--color-bg-primary)]/50 border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent-primary)]"
              >
                <option value="课程讲解">课程讲解</option>
                <option value="实验指导">实验指导</option>
                <option value="重点难点">重点难点</option>
                <option value="其他">其他</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} className="btn-primary text-sm">确认添加</button>
            <button onClick={() => setShowAdd(false)} className="btn-tech text-sm">取消</button>
          </div>
          <p className="text-xs text-[var(--color-text-muted)]">
            支持Bilibili（BV号链接自动解析）、YouTube及直接embed链接
          </p>
        </div>
      )}

      {/* 分类筛选 */}
      <div className="flex gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeCategory === cat
                ? 'bg-[var(--color-accent-primary)]/20 text-[var(--color-accent-primary)] border border-[var(--color-accent-primary)]/30'
                : 'bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-[var(--color-border-hover)]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 视频播放器 */}
      {playingId && (() => {
        const video = videos.find(v => v.id === playingId);
        if (!video || !video.embedUrl) return null;
        return (
          <div className="glass-card p-4 animate-fade-in-up">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-[var(--color-text-primary)]">{video.title}</h3>
              <button onClick={() => setPlayingId(null)} className="text-[var(--color-text-muted)] hover:text-[var(--color-accent-primary)] text-sm">关闭播放</button>
            </div>
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={video.embedUrl}
                className="absolute inset-0 w-full h-full rounded-lg"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              />
            </div>
          </div>
        );
      })()}

      {/* 视频列表 */}
      <div className="grid grid-cols-2 gap-4">
        {filtered.map(video => {
          const CatIcon = getCategoryIcon(video.category);
          return (
            <div key={video.id} className="glass-card p-4 hover:scale-[1.01] transition-all group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-[var(--color-accent-primary)]/10 flex items-center justify-center group-hover:bg-[var(--color-accent-primary)]/20 transition-colors">
                    <CatIcon className="w-6 h-6 text-[var(--color-accent-primary)]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[var(--color-text-primary)] mb-1">{video.title}</h3>
                    <span className="text-xs px-2 py-0.5 bg-[var(--color-accent-secondary)]/10 text-[var(--color-accent-secondary)] rounded-full">
                      {video.category}
                    </span>
                  </div>
                </div>
                <button onClick={() => handleDelete(video.id)} className="p-1.5 text-[var(--color-text-muted)] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex gap-2">
                {video.embedUrl && (
                  <button
                    onClick={() => setPlayingId(video.id)}
                    className="btn-primary text-xs flex items-center gap-1.5 py-1.5 px-3"
                  >
                    <Play className="w-3 h-3" /> 在线播放
                  </button>
                )}
                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-tech text-xs flex items-center gap-1.5 py-1.5 px-3"
                >
                  <ExternalLink className="w-3 h-3" /> 原始链接
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <Video className="w-12 h-12 text-[var(--color-text-muted)] mx-auto mb-3" />
          <p className="text-[var(--color-text-secondary)]">暂无该分类的视频资源</p>
        </div>
      )}
    </div>
  );
}
