import { useState } from 'react';
import {
  Video, Plus, ExternalLink, Trash2, Play, Film, Youtube, FileVideo,
  PlayCircle, FileText, Maximize, X
} from 'lucide-react';

interface VideoItem {
  id: string;
  title: string;
  url: string;
  category: string;
  embedUrl?: string;
  duration?: string;
  views?: string;
  desc?: string;
  tags?: string[];
  color?: string;
}

const defaultVideos: VideoItem[] = [
  {
    id: '1',
    title: '计算机组成原理 - CPU工作原理',
    url: 'https://www.bilibili.com/video/BV1tY411T7jZ',
    category: '课程讲解',
    embedUrl: 'https://player.bilibili.com/player.html?bvid=BV1tY411T7jZ&page=1',
    duration: '18:32',
    views: '2.3万',
    desc: '本视频详细讲解CPU的基本结构和工作原理，包括运算器、控制器、寄存器组等核心部件的功能与协作机制。通过动画演示指令执行的完整流程，帮助学生深入理解计算机系统的核心运作方式。',
    tags: ['CPU结构', '运算器', '控制器', '指令周期', '寄存器'],
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: '2',
    title: '汇编语言程序设计入门',
    url: 'https://www.bilibili.com/video/BV1E64y1X7aS',
    category: '实验指导',
    embedUrl: 'https://player.bilibili.com/player.html?bvid=BV1E64y1X7aS&page=1',
    duration: '24:15',
    views: '1.8万',
    desc: '从零开始学习8086汇编语言程序设计，涵盖基本语法、寄存器操作、内存寻址和常见指令。配合实验项目，动手编写第一个汇编程序。',
    tags: ['8086汇编', '寄存器', '寻址方式', '指令系统'],
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: '3',
    title: '存储系统与Cache原理',
    url: 'https://www.bilibili.com/video/BV1vi4y1g7cP',
    category: '课程讲解',
    embedUrl: 'https://player.bilibili.com/player.html?bvid=BV1vi4y1g7cP&page=1',
    duration: '32:08',
    views: '3.1万',
    desc: '深入解析存储器层次结构、Cache映射方式（直接映射、全相联、组相联）及替换算法。通过实例分析Cache命中率对性能的影响。',
    tags: ['存储器', 'Cache', '映射方式', '替换算法', '命中率'],
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: '4',
    title: '指令系统设计详解',
    url: 'https://www.bilibili.com/video/BV1D44y1v7jL',
    category: '重点难点',
    embedUrl: 'https://player.bilibili.com/player.html?bvid=BV1D44y1v7jL&page=1',
    duration: '28:45',
    views: '4.2万',
    desc: '系统讲解指令格式设计、寻址方式和指令系统优化。涵盖RISC与CISC架构对比，指令编码原理和扩展技术。',
    tags: ['指令格式', '寻址方式', 'RISC', 'CISC', '指令编码'],
    color: 'from-amber-500 to-orange-500',
  },
  {
    id: '5',
    title: '流水线技术与性能分析',
    url: 'https://www.bilibili.com/video/BV1ab4y1z7mK',
    category: '重点难点',
    embedUrl: 'https://player.bilibili.com/player.html?bvid=BV1ab4y1z7mK&page=1',
    duration: '21:20',
    views: '1.5万',
    desc: '讲解流水线基本原理、流水线冲突（结构冲突、数据冲突、控制冲突）及解决方案。通过性能分析公式计算加速比。',
    tags: ['流水线', '数据冲突', '分支预测', '加速比'],
    color: 'from-red-500 to-rose-500',
  },
  {
    id: '6',
    title: 'IO系统与中断机制',
    url: 'https://www.bilibili.com/video/BV1nm4y1p7qR',
    category: '课程讲解',
    embedUrl: 'https://player.bilibili.com/player.html?bvid=BV1nm4y1p7qR&page=1',
    duration: '16:55',
    views: '9.8千',
    desc: '介绍IO系统的基本概念、程序查询方式、程序中断方式和DMA方式。对比三种IO控制方式的效率差异。',
    tags: ['IO系统', '中断', 'DMA', '程序查询'],
    color: 'from-indigo-500 to-blue-500',
  },
];

const categories = ['全部', '课程讲解', '实验指导', '重点难点', '其他'];

function getEmbedUrl(url: string): string | undefined {
  const biliMatch = url.match(/bilibili\.com\/video\/(BV[\w]+)/);
  if (biliMatch) {
    return `https://player.bilibili.com/player.html?bvid=${biliMatch[1]}&page=1`;
  }
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  if (ytMatch) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`;
  }
  if (url.includes('embed') || url.includes('player')) {
    return url;
  }
  return undefined;
}

const colorGradients = [
  'from-blue-500 to-cyan-500',
  'from-green-500 to-emerald-500',
  'from-purple-500 to-pink-500',
  'from-amber-500 to-orange-500',
  'from-red-500 to-rose-500',
  'from-indigo-500 to-blue-500',
];

export default function VideoPage() {
  const [videos, setVideos] = useState<VideoItem[]>(defaultVideos);
  const [activeCategory, setActiveCategory] = useState('全部');
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newCategory, setNewCategory] = useState('其他');
  const [playingVideo, setPlayingVideo] = useState<VideoItem | null>(null);

  const filtered = activeCategory === '全部' ? videos : videos.filter(v => v.category === activeCategory);

  const handleAdd = () => {
    if (!newTitle.trim() || !newUrl.trim()) return;
    const embedUrl = getEmbedUrl(newUrl);
    const colorIdx = videos.length % colorGradients.length;
    const newItem: VideoItem = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      url: newUrl.trim(),
      category: newCategory,
      embedUrl,
      duration: '未知',
      views: '0',
      desc: '用户添加的视频资源',
      tags: [],
      color: colorGradients[colorIdx],
    };
    setVideos([...videos, newItem]);
    setNewTitle('');
    setNewUrl('');
    setShowAdd(false);
  };

  const handleDelete = (id: string) => {
    setVideos(videos.filter(v => v.id !== id));
    if (playingVideo?.id === id) setPlayingVideo(null);
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
    <div className="p-6 space-y-5 animate-fade-in circuit-bg">
      {/* 标题栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <PlayCircle className="w-8 h-8 text-[var(--color-accent-primary)]" />
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">视频资源</h1>
            <p className="text-sm text-[var(--color-text-secondary)]">精选课程视频，助力深度学习</p>
          </div>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="btn-primary flex items-center gap-2 px-4 py-2"
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

      {/* 分类标签 */}
      <div className="flex items-center gap-2">
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
        <div className="ml-auto text-sm text-[var(--color-text-muted)]">共 {filtered.length} 个视频</div>
      </div>

      {/* 播放器视图 */}
      {playingVideo && (
        <div className="flex gap-5 animate-fade-in">
          {/* 主播放器 */}
          <div className="flex-1 flex flex-col">
            {playingVideo.embedUrl ? (
              <div className="relative w-full mb-4" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  src={playingVideo.embedUrl}
                  className="absolute inset-0 w-full h-full rounded-lg"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                />
              </div>
            ) : (
              <div className="relative bg-black rounded-lg overflow-hidden mb-4 flex items-center justify-center" style={{ aspectRatio: '16/9' }}>
                <div className={`absolute inset-0 bg-gradient-to-br ${playingVideo.color || 'from-blue-600 to-purple-600'}/30`} />
                <div className="relative text-center">
                  <PlayCircle className="w-16 h-16 text-white/80 mx-auto mb-2 animate-pulse" />
                  <p className="text-white/70 text-sm">无法嵌入播放</p>
                  <a href={playingVideo.url} target="_blank" rel="noopener noreferrer" className="text-white/50 text-xs mt-1 underline">
                    点击前往原始链接观看
                  </a>
                </div>
              </div>
            )}
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-[var(--color-text-primary)]">{playingVideo.title}</h2>
              <button onClick={() => setPlayingVideo(null)} className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-accent-primary)]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)] mb-4">
              <span className="px-2 py-0.5 rounded bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)]">{playingVideo.category}</span>
              {playingVideo.views && <span>{playingVideo.views}次播放</span>}
              {playingVideo.duration && <span>时长 {playingVideo.duration}</span>}
            </div>
            {playingVideo.desc && (
              <div className="glass-card p-4 mb-4">
                <h3 className="font-bold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[var(--color-accent-primary)]" />
                  视频简介
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  {playingVideo.desc}
                </p>
                {playingVideo.tags && playingVideo.tags.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
                    <h4 className="text-sm font-medium text-[var(--color-text-primary)] mb-2">关联知识点</h4>
                    <div className="flex flex-wrap gap-2">
                      {playingVideo.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 text-xs rounded-full bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)] cursor-pointer hover:bg-[var(--color-accent-primary)]/20">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 右侧推荐视频列表 */}
          <div className="w-72 flex-shrink-0">
            <div className="glass-card p-4 sticky top-0">
              <h3 className="font-bold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
                <Video className="w-4 h-4 text-[var(--color-accent-secondary)]" />
                推荐视频
              </h3>
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {videos.filter(v => v.id !== playingVideo.id).slice(0, 5).map(v => (
                  <div
                    key={v.id}
                    className="flex gap-3 cursor-pointer group"
                    onClick={() => setPlayingVideo(v)}
                  >
                    <div className={`w-24 h-14 rounded bg-gradient-to-br ${v.color || 'from-blue-500 to-cyan-500'} flex-shrink-0 flex items-center justify-center`}>
                      <Play className="w-5 h-5 text-white/70" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[var(--color-text-primary)] line-clamp-2 group-hover:text-[var(--color-accent-primary)] transition-colors">
                        {v.title}
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)] mt-1">{v.duration} · {v.views}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 视频卡片列表 */}
      {!playingVideo && (
        <div className="grid grid-cols-3 gap-5">
          {filtered.map((video, idx) => {
            return (
              <div
                key={video.id}
                className="glass-card overflow-hidden cursor-pointer hover:scale-[1.02] transition-all duration-300 group"
                onClick={() => video.embedUrl && setPlayingVideo(video)}
              >
                {/* 缩略图 */}
                <div className={`relative aspect-video bg-gradient-to-br ${video.color || 'from-blue-500 to-cyan-500'} flex items-center justify-center`}>
                  <Play className="w-12 h-12 text-white/80 group-hover:scale-125 transition-transform" />
                  {video.duration && (
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
                      <Play className="w-7 h-7 text-gray-800 ml-1" />
                    </div>
                  </div>
                </div>
                {/* 信息 */}
                <div className="p-4">
                  <h3 className="font-medium text-[var(--color-text-primary)] mb-2 line-clamp-2 group-hover:text-[var(--color-accent-primary)] transition-colors">
                    {video.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-[var(--color-text-secondary)]">
                    <span className="px-2 py-0.5 rounded bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)]">{video.category}</span>
                    <div className="flex items-center gap-2">
                      {video.views && <span>{video.views}次播放</span>}
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(video.id); }}
                        className="p-1 text-[var(--color-text-muted)] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  {!video.embedUrl && (
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="mt-2 inline-flex items-center gap-1 text-xs text-[var(--color-accent-secondary)] hover:underline"
                    >
                      <ExternalLink className="w-3 h-3" /> 前往原始链接
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 空状态 */}
      {filtered.length === 0 && !playingVideo && (
        <div className="text-center py-12">
          <Video className="w-12 h-12 text-[var(--color-text-muted)] mx-auto mb-3" />
          <p className="text-[var(--color-text-secondary)]">暂无该分类的视频资源</p>
        </div>
      )}
    </div>
  );
}
