import { useState, useRef, useEffect } from 'react';
import {
  Video, Plus, ExternalLink, Trash2, Play, Film, Youtube, FileVideo,
  PlayCircle, FileText, Maximize, X, Lock, User, Upload,
} from 'lucide-react';
import { saveVideoFile, loadVideoFile, deleteVideoFile, saveVideoMeta, loadVideoMeta, generateThumbnail } from '@/lib/videoStorage';

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
  thumbnail?: string;
}

interface UserRole {
  isAdmin: boolean;
  username: string;
}

const ADMIN_CREDENTIALS = { username: 'admin', password: 'admin' };

const defaultVideos: VideoItem[] = [];

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
    const meta = loadVideoMeta(META_KEY);
    if (meta && meta.length > 0) {
      Promise.all(
        meta.map(async (m) => {
          const url = await loadVideoFile(m.id);
          return { ...m, url: url || '' };
        })
      ).then(loaded => {
        setVideos(loaded.filter(v => v.url));
      });
    }
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
    if (!userRole.isAdmin) {
      setShowPermissionDenied(true);
      return;
    }
    const updated = videos.filter(v => v.id !== id);
    setVideos(updated);
    saveVideoMeta(META_KEY, updated);
    deleteVideoFile(id).catch(() => {});
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
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
            <User className="w-4 h-4" />
            <span>{userRole.username}</span>
            {userRole.isAdmin && (
              <span className="px-2 py-0.5 text-xs rounded bg-red-500 text-white">管理员</span>
            )}
          </div>
          <button
            onClick={handleUploadClick}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Upload className="w-4 h-4" />
            上传视频案例
          </button>
        </div>
      </div>

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
            ) : playingVideo.url ? (
              <div className="relative w-full mb-4 bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
                <video
                  src={playingVideo.url}
                  controls
                  className="w-full h-full"
                  poster={playingVideo.url}
                />
              </div>
            ) : (
              <div className="relative bg-black rounded-lg overflow-hidden mb-4 flex items-center justify-center" style={{ aspectRatio: '16/9' }}>
                <div className={`absolute inset-0 bg-gradient-to-br ${playingVideo.color || 'from-blue-600 to-purple-600'}/30`} />
                <div className="relative text-center">
                  <PlayCircle className="w-16 h-16 text-white/80 mx-auto mb-2 animate-pulse" />
                  <p className="text-white/70 text-sm">无法播放</p>
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
                onClick={() => setPlayingVideo(video)}
              >
                {/* 缩略图 */}
                <div className={`relative aspect-video ${video.url && !video.embedUrl ? 'bg-black' : `bg-gradient-to-br ${video.color || 'from-blue-500 to-cyan-500'}`} flex items-center justify-center`}>
                  {video.thumbnail ? (
                    <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                  ) : video.url && !video.embedUrl ? (
                    <img src={video.url} alt={video.title} className="w-full h-full object-cover" />
                  ) : (
                    <Play className="w-12 h-12 text-white/80 group-hover:scale-125 transition-transform" />
                  )}
                  {video.duration && (
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                  )}
                  {userRole.isAdmin && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(video.id); }}
                      className="absolute top-2 right-2 p-2 bg-black/50 rounded opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600"
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </button>
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
                    </div>
                  </div>
                  {!video.embedUrl && video.url && !video.url.startsWith('blob:') && (
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
          {/* 管理员上传卡片 */}
          {userRole.isAdmin && (
            <div
              onClick={() => setShowUploadModal(true)}
              className="glass-card h-full flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-red-300 transition-colors border-2 border-dashed border-[var(--color-border)] min-h-[200px]"
            >
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                <Plus className="w-6 h-6 text-red-600" />
              </div>
              <span className="text-sm text-[var(--color-text-secondary)]">上传视频</span>
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-8">
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-8">
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-8">
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
