import { useState, useRef, useEffect } from 'react';
import {
  Video, Plus, ExternalLink, Trash2, Play, Film, Youtube, FileVideo,
  PlayCircle, FileText, Maximize, X, Lock, User, Upload,
} from 'lucide-react';
import { saveVideoFile, loadVideoFile, deleteVideoFile, saveVideoMeta, loadVideoMeta, generateThumbnail, fetchServerVideos, uploadServerVideo, addServerVideoUrl, deleteServerVideo } from '@/lib/videoStorage';
import type { VideoItem } from '@/types';

interface UserRole {
  isAdmin: boolean;
  username: string;
}

const ADMIN_CREDENTIALS = { username: 'admin', password: 'admin' };

const defaultVideos: VideoItem[] = [
  { id: '1', title: '计算机组成原理 - CPU工作原理', category: '课程讲解', duration: '18:32', views: '2.3万', desc: '本视频详细讲解CPU的基本结构和工作原理，包括运算器、控制器、寄存器组等核心部件的功能与协作机制。', tags: ['CPU结构', '运算器', '控制器', '指令周期'], color: 'from-blue-500 to-cyan-500' },
  { id: '2', title: '汇编语言程序设计入门', category: '实验指导', duration: '24:15', views: '1.8万', desc: '从零开始学习8086汇编语言，掌握基本指令和程序结构，配合实验案例加深理解。', tags: ['汇编语言', '8086', '程序设计'], color: 'from-green-500 to-emerald-500' },
  { id: '3', title: '存储系统与Cache原理', category: '课程讲解', duration: '32:08', views: '3.1万', desc: '深入讲解存储器层次结构，Cache工作原理和地址映射方式，理解存储系统性能优化。', tags: ['存储系统', 'Cache', '地址映射'], color: 'from-purple-500 to-pink-500' },
  { id: '4', title: '指令系统设计详解', category: '重点难点', duration: '28:45', views: '4.2万', desc: '全面解析指令系统的设计原则、指令格式和寻址方式，重点突破指令编码难点。', tags: ['指令系统', '寻址方式', '指令编码'], color: 'from-amber-500 to-orange-500' },
  { id: '5', title: '流水线技术与性能分析', category: '重点难点', duration: '21:20', views: '1.5万', desc: '讲解流水线工作原理、性能指标计算和相关冒险处理，提升对高性能计算的理解。', tags: ['流水线', '性能分析', '冒险处理'], color: 'from-red-500 to-rose-500' },
  { id: '6', title: 'IO系统与中断机制', category: '课程讲解', duration: '16:55', views: '9.8千', desc: '介绍IO系统的组成和工作方式，中断机制的实现和应用场景。', tags: ['IO系统', '中断', 'DMA'], color: 'from-indigo-500 to-blue-500' },
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
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newCategory, setNewCategory] = useState('其他');
  const [playingVideo, setPlayingVideo] = useState<VideoItem | null>(null);
  const [showPermissionDenied, setShowPermissionDenied] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newVideo, setNewVideo] = useState({
    title: '',
    category: '课程讲解',
    description: '',
    tags: '',
  });

  const [userRole, setUserRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem('video-page-user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return { isAdmin: false, username: '普通用户' };
      }
    }
    return { isAdmin: false, username: '普通用户' };
  });

  const [loginForm, setLoginForm] = useState({
    username: '',
    password: '',
    error: '',
  });

  const filtered = activeCategory === '全部' ? videos : videos.filter(v => v.category === activeCategory);

  const META_KEY = 'video-page-meta';

  // 页面加载时从 IndexedDB 恢复视频
  useEffect(() => {
    const loadVideos = async () => {
      const serverVideos = await fetchServerVideos(META_KEY);
      if (serverVideos.length > 0) {
        setVideos(serverVideos);
        return;
      }

      const meta = loadVideoMeta(META_KEY);
      if (meta && meta.length > 0) {
        const loaded = await Promise.all(
          meta.map(async (m) => {
            const url = await loadVideoFile(m.id);
            return { ...m, url: url || '' };
          })
        );
        const validVideos = loaded.filter(v => v.url);
        if (validVideos.length > 0) {
          setVideos(validVideos);
        }
      }
    };
    loadVideos();
  }, []);

  const handleLogin = () => {
    if (loginForm.username === ADMIN_CREDENTIALS.username &&
        loginForm.password === ADMIN_CREDENTIALS.password) {
      const role = { isAdmin: true, username: loginForm.username };
      setUserRole(role);
      localStorage.setItem('video-page-user', JSON.stringify(role));
      setShowLoginModal(false);
      setLoginForm({ username: '', password: '', error: '' });
      setShowAdd(true);
    } else {
      setLoginForm(f => ({ ...f, error: '用户名或密码错误，请输入 admin/admin' }));
    }
  };

  const handleAdd = async () => {
    if (!newTitle.trim() || !newUrl.trim()) return;
    const embedUrl = getEmbedUrl(newUrl);
    const colorIdx = videos.length % colorGradients.length;
    
    const serverResult = await addServerVideoUrl(META_KEY, newTitle.trim(), newUrl.trim(), newCategory);
    if (serverResult) {
      serverResult.embedUrl = embedUrl;
      serverResult.color = colorGradients[colorIdx];
      setVideos([...videos, serverResult]);
      setNewTitle('');
      setNewUrl('');
      setShowAdd(false);
    } else {
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
    }
  };

  const handleDelete = async (id: string) => {
    if (!userRole.isAdmin) {
      setShowPermissionDenied(true);
      return;
    }
    const updated = videos.filter(v => v.id !== id);
    setVideos(updated);
    saveVideoMeta(META_KEY, updated);
    deleteVideoFile(id).catch(() => {});
    deleteServerVideo(META_KEY, id).catch(() => {});
    if (playingVideo?.id === id) setPlayingVideo(null);
  };

  const handleAddClick = () => {
    if (userRole.isAdmin) {
      setShowAdd(!showAdd);
    } else {
      setShowLoginModal(true);
    }
  };

  const handleUploadClick = () => {
    if (userRole.isAdmin) {
      setShowUploadModal(true);
    } else {
      setShowLoginModal(true);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress(p => {
          if (p >= 100) {
            clearInterval(interval);
            return 100;
          }
          return p + 10;
        });
      }, 200);

      try {
        const serverResult = await uploadServerVideo(
          META_KEY,
          file,
          newVideo.title || file.name.replace(/\.[^/.]+$/, ''),
          newVideo.category,
          newVideo.description || '',
          newVideo.tags
        );

        if (serverResult) {
          const colorIdx = videos.length % colorGradients.length;
          serverResult.color = colorGradients[colorIdx];
          const updated = [...videos, serverResult];
          setVideos(updated);
          saveVideoMeta(META_KEY, updated);
          setShowUploadModal(false);
          setNewVideo({ title: '', category: '课程讲解', description: '', tags: '' });
          setUploadProgress(0);
          return;
        }

        const videoId = Date.now().toString();
        const url = await saveVideoFile(videoId, file);
        const thumbnail = await generateThumbnail(url);
        const colorIdx = videos.length % colorGradients.length;
        const newItem: VideoItem = {
          id: videoId,
          title: newVideo.title || file.name.replace(/\.[^/.]+$/, ''),
          url,
          category: newVideo.category,
          embedUrl: undefined,
          duration: '未知',
          views: '0',
          desc: newVideo.description || '用户上传的视频资源',
          tags: newVideo.tags.split(/[,，\s]+/).filter(Boolean),
          color: colorGradients[colorIdx],
          thumbnail,
        };
        const updated = [...videos, newItem];
        setVideos(updated);
        saveVideoMeta(META_KEY, updated);
        setShowUploadModal(false);
        setNewVideo({ title: '', category: '课程讲解', description: '', tags: '' });
        setUploadProgress(0);
      } catch (err) {
        setUploadProgress(0);
        alert('视频保存失败，请重试');
      }
    }
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
    <div className="p-3 md:p-6 space-y-4 md:space-y-5 animate-fade-in circuit-bg">
      {/* 标题栏 */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 md:p-2.5 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600">
            <PlayCircle className="w-6 h-6 md:w-7 md:h-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-[var(--color-text-primary)]">视频资源</h1>
            <p className="text-xs md:text-sm text-[var(--color-text-secondary)]">精选课程视频，助力深度学习</p>
          </div>
        </div>
        <div className="flex items-center gap-3 md:gap-4">
          <div className="flex items-center gap-2 text-xs md:text-sm text-[var(--color-text-secondary)]">
            <User className="w-4 h-4" />
            <span className="truncate max-w-[80px] md:max-w-none">{userRole.username}</span>
            {userRole.isAdmin && (
              <span className="px-2 py-0.5 text-xs rounded bg-red-500 text-white">管理员</span>
            )}
          </div>
          <button
            onClick={handleUploadClick}
            className="flex items-center gap-2 px-3 md:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
          >
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">上传视频案例</span>
            <span className="sm:hidden">上传</span>
          </button>
        </div>
      </div>

      {/* 分类标签 */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex-shrink-0 px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all ${
              activeCategory === cat
                ? 'bg-[var(--color-accent-primary)]/20 text-[var(--color-accent-primary)] border border-[var(--color-accent-primary)]/30'
                : 'bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-[var(--color-border-hover)]'
            }`}
          >
            {cat}
          </button>
        ))}
        <div className="flex-shrink-0 ml-auto text-xs md:text-sm text-[var(--color-text-muted)]">共 {filtered.length} 个</div>
      </div>

      {/* 播放器模态框 */}
      {playingVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 animate-fade-in">
          {/* 背景遮罩 */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setPlayingVideo(null)}
          />

          {/* 播放器内容 */}
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto glass-card rounded-xl md:rounded-2xl animate-scale-in">
            {/* 关闭按钮 */}
            <button
              onClick={() => setPlayingVideo(null)}
              className="absolute top-2 right-2 z-10 p-1.5 bg-black/60 hover:bg-black/70 text-white rounded-full transition-all hover:scale-110"
              aria-label="关闭"
            >
              <X className="w-4 h-4" />
            </button>

            {/* 视频区域 */}
            <div className="relative bg-black h-[30vh] md:h-auto md:aspect-video">
              {playingVideo.embedUrl ? (
                <iframe
                  src={playingVideo.embedUrl}
                  className="w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                />
              ) : playingVideo.url ? (
                <video
                  src={playingVideo.url}
                  controls
                  className="w-full h-full"
                  poster={playingVideo.thumbnail || playingVideo.url}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className={`absolute inset-0 bg-gradient-to-br ${playingVideo.color || 'from-blue-600 to-purple-600'}/30`} />
                  <div className="relative text-center">
                    <PlayCircle className="w-12 h-12 text-white/80 mx-auto mb-2 animate-pulse" />
                    <p className="text-white/70 text-xs">无法播放</p>
                  </div>
                </div>
              )}
            </div>

            {/* 视频信息 */}
            <div className="p-3 md:p-4">
              <h2 className="text-base md:text-lg font-bold text-[var(--color-text-primary)] mb-2">{playingVideo.title}</h2>
              <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--color-text-secondary)] mb-2">
                <span className="px-2 py-0.5 rounded bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)]">{playingVideo.category}</span>
                {playingVideo.views && <span>{playingVideo.views}次播放</span>}
                {playingVideo.duration && <span>时长 {playingVideo.duration}</span>}
              </div>
              {playingVideo.desc && (
                <div className="mb-3">
                  <h3 className="font-bold text-[var(--color-text-primary)] mb-1.5 flex items-center gap-2 text-sm">
                    <FileText className="w-3.5 h-3.5 text-[var(--color-accent-primary)]" />
                    视频简介
                  </h3>
                  <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed line-clamp-2">
                    {playingVideo.desc}
                  </p>
                </div>
              )}
              {playingVideo.tags && playingVideo.tags.length > 0 && (
                <div>
                  <h4 className="text-xs font-medium text-[var(--color-text-primary)] mb-1.5">关联知识点</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {playingVideo.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 text-xs rounded-full bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)] cursor-pointer hover:bg-[var(--color-accent-primary)]/20">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 推荐视频 */}
            <div className="px-3 md:px-4 pb-3 md:pb-4">
              <h3 className="font-bold text-[var(--color-text-primary)] mb-2 flex items-center gap-2 text-sm">
                <Video className="w-3.5 h-3.5 text-[var(--color-accent-secondary)]" />
                推荐视频
              </h3>
              <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 -mx-1 px-1">
                {videos.filter(v => (v.url || v.id) !== (playingVideo.url || playingVideo.id)).slice(0, 6).map(v => (
                  <div
                    key={v.url || v.id}
                    className="flex-shrink-0 w-28 md:w-36 cursor-pointer group"
                    onClick={() => setPlayingVideo(v)}
                  >
                    <div className={`relative aspect-video rounded-lg overflow-hidden ${v.thumbnail ? '' : `bg-gradient-to-br ${v.color || 'from-blue-500 to-cyan-500'}`}`}>
                      {v.thumbnail ? (
                        <img src={v.thumbnail} alt={v.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Play className="w-5 h-5 md:w-6 md:h-6 text-white/70" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/90 flex items-center justify-center">
                          <Play className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-800 ml-0.5" />
                        </div>
                      </div>
                      {v.duration && (
                        <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] px-1 py-0.5 rounded">
                          {v.duration}
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-[var(--color-text-primary)] mt-1.5 line-clamp-2 group-hover:text-[var(--color-accent-primary)] transition-colors">
                      {v.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 视频卡片列表 */}
      {!playingVideo && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-5">
          {filtered.map((video, idx) => {
            return (
              <div
                key={video.url || video.id}
                className="glass-card overflow-hidden cursor-pointer hover:scale-[1.02] transition-all duration-300 group"
                onClick={() => setPlayingVideo(video)}
              >
                {/* 缩略图 */}
                <div className={`relative aspect-video ${video.url && !video.embedUrl ? 'bg-black' : `bg-gradient-to-br ${video.color || 'from-blue-500 to-cyan-500'}`} flex items-center justify-center`}>
                  {video.thumbnail ? (
                    <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                  ) : video.url && !video.embedUrl ? (
                    <img src={video.url} alt={video.title} className="w-full h-full object-cover" />
                  ) : (
                    <Play className="w-8 h-8 md:w-10 md:h-10 text-white/80 group-hover:scale-125 transition-transform" />
                  )}
                  {video.duration && (
                    <div className="absolute bottom-1.5 right-1.5 bg-black/70 text-white text-[10px] md:text-xs px-1.5 py-0.5 rounded">
                      {video.duration}
                    </div>
                  )}
                  {userRole.isAdmin && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(video.id); }}
                      className="absolute top-1.5 right-1.5 p-1.5 bg-black/50 rounded opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-white" />
                    </button>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 flex items-center justify-center">
                      <Play className="w-5 h-5 md:w-6 md:h-6 text-gray-800 ml-0.5" />
                    </div>
                  </div>
                </div>
                {/* 信息 */}
                <div className="p-2.5 md:p-3">
                  <h3 className="font-medium text-xs md:text-sm text-[var(--color-text-primary)] mb-1.5 line-clamp-2 group-hover:text-[var(--color-accent-primary)] transition-colors">
                    {video.title}
                  </h3>
                  <div className="flex items-center justify-between text-[10px] md:text-xs text-[var(--color-text-secondary)]">
                    <span className="px-1.5 py-0.5 rounded bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)] truncate max-w-[60px]">{video.category}</span>
                    <div className="flex items-center gap-1">
                      {video.views && <span className="truncate">{video.views}</span>}
                    </div>
                  </div>
                  {!video.embedUrl && video.url && !video.url.startsWith('blob:') && (
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="mt-1.5 inline-flex items-center gap-1 text-[10px] md:text-xs text-[var(--color-accent-secondary)] hover:underline"
                    >
                      <ExternalLink className="w-3 h-3" /> 原始链接
                    </a>
                  )}
                </div>
              </div>
            );
          })}
          {/* 管理员上传卡片 */}
          {userRole.isAdmin && (
            <div
              onClick={() => setShowUploadModal(true)}
              className="glass-card h-full flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-red-300 transition-colors border-2 border-dashed border-[var(--color-border)] min-h-[150px] md:min-h-[200px]"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-red-50 flex items-center justify-center">
                <Plus className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
              </div>
              <span className="text-xs md:text-sm text-[var(--color-text-secondary)]">上传视频</span>
            </div>
          )}
        </div>
      )}

      {/* 空状态 */}
      {filtered.length === 0 && !playingVideo && !userRole.isAdmin && (
        <div className="text-center py-12">
          <Video className="w-12 h-12 text-[var(--color-text-muted)] mx-auto mb-3" />
          <p className="text-[var(--color-text-secondary)]">暂无视频资源，请联系管理员添加</p>
        </div>
      )}

      {/* 登录弹窗 */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 md:p-8">
          <div className="bg-[var(--color-bg-secondary)] rounded-2xl max-w-md w-full overflow-hidden">
            <div className="p-6 border-b border-[var(--color-border)] flex items-center justify-between">
              <h3 className="text-lg font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                <Lock className="w-5 h-5 text-red-600" />
                管理员登录
              </h3>
              <button
                onClick={() => setShowLoginModal(false)}
                className="text-[var(--color-text-muted)] hover:text-[var(--color-accent-primary)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">用户名</label>
                <input
                  type="text"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm(f => ({ ...f, username: e.target.value, error: '' }))}
                  className="w-full px-3 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-red-400"
                  placeholder="输入管理员用户名"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">密码</label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm(f => ({ ...f, password: e.target.value, error: '' }))}
                  className="w-full px-3 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-red-400"
                  placeholder="输入管理员密码"
                />
              </div>
              {loginForm.error && (
                <div className="p-3 bg-red-50 rounded-lg text-red-600 text-sm">
                  {loginForm.error}
                </div>
              )}
              <div className="text-xs text-[var(--color-text-secondary)] bg-[var(--color-bg-primary)] p-3 rounded-lg">
                默认管理员账号：admin / admin
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="px-4 py-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleLogin}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  登录
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 权限提示弹窗 */}
      {showPermissionDenied && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 md:p-8">
          <div className="bg-[var(--color-bg-secondary)] rounded-2xl max-w-md w-full overflow-hidden">
            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
                <Lock className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">权限不足</h3>
              <p className="text-[var(--color-text-secondary)] mb-6">普通用户不允许修改视频，请联系管理员。</p>
              <button
                onClick={() => setShowPermissionDenied(false)}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 上传视频文件弹窗 */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 md:p-8">
          <div className="bg-[var(--color-bg-secondary)] rounded-2xl max-w-2xl w-full overflow-hidden">
            <div className="p-6 border-b border-[var(--color-border)] flex items-center justify-between">
              <h3 className="text-lg font-bold text-[var(--color-text-primary)]">上传视频文件</h3>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setNewVideo({ title: '', category: '课程讲解', description: '', tags: '' });
                }}
                className="text-[var(--color-text-muted)] hover:text-[var(--color-accent-primary)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-text-secondary)]">上传进度</span>
                    <span className="text-red-600">{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-[var(--color-bg-primary)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-500 to-rose-500 transition-all duration-200"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">视频标题</label>
                  <input
                    type="text"
                    value={newVideo.title}
                    onChange={(e) => setNewVideo(v => ({ ...v, title: e.target.value }))}
                    className="w-full px-3 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-red-400"
                    placeholder="输入视频标题"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">分类</label>
                  <select
                    value={newVideo.category}
                    onChange={(e) => setNewVideo(v => ({ ...v, category: e.target.value }))}
                    className="w-full px-3 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-red-400"
                  >
                    <option value="课程讲解">课程讲解</option>
                    <option value="实验指导">实验指导</option>
                    <option value="重点难点">重点难点</option>
                    <option value="其他">其他</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">视频描述</label>
                <textarea
                  value={newVideo.description}
                  onChange={(e) => setNewVideo(v => ({ ...v, description: e.target.value }))}
                  className="w-full px-3 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-red-400"
                  rows={3}
                  placeholder="输入视频描述"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">标签（用逗号或空格分隔）</label>
                <input
                  type="text"
                  value={newVideo.tags}
                  onChange={(e) => setNewVideo(v => ({ ...v, tags: e.target.value }))}
                  className="w-full px-3 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-red-400"
                  placeholder="如：CPU结构, 运算器"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">选择视频文件</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-4 border-2 border-dashed border-[var(--color-border)] rounded-lg hover:border-red-400 transition-colors flex items-center justify-center gap-2 text-[var(--color-text-secondary)]"
                >
                  <Upload className="w-5 h-5" />
                  点击选择视频文件或拖拽到此处
                </button>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setNewVideo({ title: '', category: '课程讲解', description: '', tags: '' });
                  }}
                  className="px-4 py-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  上传视频
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
