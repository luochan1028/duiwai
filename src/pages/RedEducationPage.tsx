import { useState, useRef, useEffect } from 'react';
import {
  Flag, Star, Award, BookOpen, Users, Heart, Zap,
  ChevronRight, Target, Lightbulb, GraduationCap, Shield,
  Upload, Play, Trash2, Plus, X, Video, Lock, User,
} from 'lucide-react';
import { saveVideoFile, loadVideoFile, deleteVideoFile, saveVideoMeta, loadVideoMeta, generateThumbnail, fetchServerVideos, uploadServerVideo, deleteServerVideo } from '@/lib/videoStorage';
import type { VideoItem } from '@/types';

interface RedEducationItem {
  id: string;
  title: string;
  category: string;
  icon: typeof Flag;
  color: string;
  bgColor: string;
  borderColor: string;
  content: string;
  keywords: string[];
}

interface VideoCase extends VideoItem {
  description?: string;
  playCount?: number;
}

interface UserRole {
  isAdmin: boolean;
  username: string;
}

const ADMIN_CREDENTIALS = { username: 'admin', password: 'admin' };

const redEducationItems: RedEducationItem[] = [
  {
    id: 'red-1',
    title: '红色课程思政',
    category: '课程育人',
    icon: BookOpen,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    content: '将红色育人元素深度融入计算机组成原理课程教学。通过讲述我国计算机发展史中的科学家精神，如"银河一号"超级计算机的研制历程，激发学生科技报国情怀。在指令系统设计中引入国产龙芯CPU案例分析，培养民族自豪感与工程伦理意识。',
    keywords: ['科学家精神', '银河一号', '龙芯CPU', '工程伦理'],
  },
  {
    id: 'red-2',
    title: '红色文化传承',
    category: '文化育人',
    icon: Flag,
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-300',
    content: '依托成都东软学院所在地四川的红色资源（邓小平故里、川陕革命根据地），开展红色文化主题实践活动。组织学生参观红色教育基地，撰写技术发展与社会进步主题报告，将红色基因传承与专业学习有机结合。',
    keywords: ['邓小平故里', '川陕革命', '红色基因', '主题实践'],
  },
  {
    id: 'red-3',
    title: '红色科技报国',
    category: '实践育人',
    icon: Zap,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    content: '引导学生关注国家"卡脖子"技术攻关领域。在实验辅助模块中设置国产芯片相关实验项目，如基于龙芯指令集的汇编编程实践。鼓励学生参加"挑战杯"、"互联网+"等创新创业大赛，以技术服务国家战略需求。',
    keywords: ['卡脖子技术', '龙芯指令集', '挑战杯', '创新创业'],
  },
  {
    id: 'red-4',
    title: '红色育人评价',
    category: '管理育人',
    icon: Award,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    content: '建立红色育人成效评价体系。在教师端学情分析中增设"思政元素覆盖度"指标，统计课程中融入的红色育人案例数量。学生端学习报告增加"价值观培养"维度，关注学生在科技报国、工匠精神、团队协作等方面的成长。',
    keywords: ['思政覆盖度', '价值观培养', '工匠精神', '成效评价'],
  },
  {
    id: 'red-5',
    title: '红色网络阵地',
    category: '网络育人',
    icon: Shield,
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    content: '结合网络空间安全专业特色，建设红色网络文化传播阵地。在视频资源模块中设立"红色科技"专栏，推送我国科技工作者奋斗故事。通过智能问答模块解答学生关于科技伦理、网络安全法治等问题，构建清朗网络学习空间。',
    keywords: ['网络安全', '科技伦理', '红色专栏', '法治教育'],
  },
  {
    id: 'red-6',
    title: '红色心理育人',
    category: '心理育人',
    icon: Heart,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    content: '关注学生学习心理健康。在学习路径模块中设置"红色激励"机制，当学生遇到学习困难时推送革命先辈攻坚克难的故事激励。建立学习状态预警系统，对长时间未活跃或成绩下滑的学生进行关怀干预，体现育人温度。',
    keywords: ['心理健康', '红色激励', '学习预警', '关怀干预'],
  },
];

const defaultVideos: VideoCase[] = [
  { id: 'red-1', title: '银河一号超级计算机研制历程', category: '课程育人', duration: '25:30', views: '5.2万', desc: '讲述我国第一台亿次超级计算机"银河一号"的研制历程，展现科研工作者攻坚克难的奋斗精神。', tags: ['银河一号', '超级计算机', '科研精神'], color: 'from-red-500 to-rose-500' },
  { id: 'red-2', title: '龙芯CPU自主创新之路', category: '课程育人', duration: '19:45', views: '3.8万', desc: '介绍国产龙芯CPU的发展历程，从"两弹一星"精神到自主可控的芯片研发之路。', tags: ['龙芯', '自主创新', '芯片研发'], color: 'from-amber-500 to-orange-500' },
  { id: 'red-3', title: '邓小平故里红色研学', category: '文化育人', duration: '16:20', views: '2.1万', desc: '跟随镜头探访邓小平故里，了解改革开放总设计师的生平事迹，感受红色文化传承。', tags: ['邓小平', '红色旅游', '文化传承'], color: 'from-green-500 to-emerald-500' },
  { id: 'red-4', title: '川陕革命根据地历史回顾', category: '文化育人', duration: '22:10', views: '1.5万', desc: '回顾川陕革命根据地的光辉历史，学习革命先辈的英勇事迹和崇高精神。', tags: ['川陕革命根据地', '红色历史', '革命精神'], color: 'from-purple-500 to-pink-500' },
  { id: 'red-5', title: '"挑战杯"红色主题竞赛', category: '实践育人', duration: '14:35', views: '9.6千', desc: '展示学生参加"挑战杯"红色主题竞赛的精彩瞬间，科技报国，青春建功。', tags: ['挑战杯', '创新创业', '科技报国'], color: 'from-blue-500 to-cyan-500' },
  { id: 'red-6', title: '网络安全法治教育', category: '网络育人', duration: '18:00', views: '4.2万', desc: '结合网络空间安全专业特色，讲解网络安全法律法规，构建清朗网络空间。', tags: ['网络安全', '法治教育', '网络伦理'], color: 'from-indigo-500 to-blue-500' },
];

const categories = ['全部', '课程育人', '文化育人', '实践育人', '管理育人', '网络育人', '心理育人'];

const stats = [
  { label: '思政案例', value: '48', icon: BookOpen, color: 'text-red-600' },
  { label: '红色视频', value: '12', icon: Star, color: 'text-amber-600' },
  { label: '实践活动', value: '6', icon: Users, color: 'text-orange-600' },
  { label: '覆盖学生', value: '86', icon: GraduationCap, color: 'text-rose-600' },
];

export default function RedEducationPage() {
  const [activeCategory, setActiveCategory] = useState('全部');
  const [selectedItem, setSelectedItem] = useState<RedEducationItem | null>(null);
  const [videos, setVideos] = useState<VideoCase[]>(defaultVideos);
  const [selectedVideo, setSelectedVideo] = useState<VideoCase | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showPermissionDenied, setShowPermissionDenied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [userRole, setUserRole] = useState<UserRole>({
    isAdmin: false,
    username: '普通用户',
  });

  const [loginForm, setLoginForm] = useState({
    username: '',
    password: '',
    error: '',
  });

  const [newVideo, setNewVideo] = useState({
    title: '',
    category: '课程育人',
    url: '',
    description: '',
    tags: '',
  });

  const filtered = activeCategory === '全部'
    ? redEducationItems
    : redEducationItems.filter(item => item.category === activeCategory);

  const filteredVideos = activeCategory === '全部'
    ? videos
    : videos.filter(v => v.category === activeCategory);

  const META_KEY = 'red-education-video-meta';

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
      setUserRole({ isAdmin: true, username: loginForm.username });
      setShowLoginModal(false);
      setLoginForm({ username: '', password: '', error: '' });
      setShowUploadModal(true);
    } else {
      setLoginForm(f => ({ ...f, error: '用户名或密码错误，请输入 admin/admin' }));
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
          setVideos(v => {
            const updated = [...v, serverResult];
            saveVideoMeta(META_KEY, updated);
            return updated;
          });
          setShowUploadModal(false);
          setNewVideo({ title: '', category: '课程育人', url: '', description: '', tags: '' });
          setUploadProgress(0);
          return;
        }

        const videoId = `v${Date.now()}`;
        const url = await saveVideoFile(videoId, file);
        const thumbnail = await generateThumbnail(url);
        const video: VideoCase = {
          id: videoId,
          title: newVideo.title || file.name.replace(/\.[^/.]+$/, ''),
          category: newVideo.category,
          url,
          thumbnail,
          duration: '00:00',
          playCount: 0,
          description: newVideo.description,
          tags: newVideo.tags.split(/[,，\s]+/).filter(Boolean),
        };
        setVideos(v => {
          const updated = [...v, video];
          saveVideoMeta(META_KEY, updated);
          return updated;
        });
        setShowUploadModal(false);
        setNewVideo({ title: '', category: '课程育人', url: '', description: '', tags: '' });
        setUploadProgress(0);
      } catch (err) {
        setUploadProgress(0);
        alert('视频保存失败，请重试');
      }
    }
  };

  const handleDeleteVideo = async (id: string) => {
    setVideos(v => {
      const updated = v.filter(video => video.id !== id);
      saveVideoMeta(META_KEY, updated);
      return updated;
    });
    deleteVideoFile(id).catch(() => {});
    deleteServerVideo(META_KEY, id).catch(() => {});
    if (selectedVideo?.id === id) setSelectedVideo(null);
  };

  const handleUploadClick = () => {
    if (userRole.isAdmin) {
      setShowUploadModal(true);
    } else {
      setShowLoginModal(true);
    }
  };

  const handleVideoAction = (action: 'upload' | 'delete') => {
    if (!userRole.isAdmin) {
      setShowPermissionDenied(true);
      return false;
    }
    return true;
  };

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      {/* 标题栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-red-600 to-rose-600">
            <Flag className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">红色育人</h1>
            <p className="text-sm text-[var(--color-text-secondary)]">将红色基因融入专业教学，培养科技报国时代新人</p>
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

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className="glass-card p-4 flex items-center gap-3">
            <stat.icon className={`w-8 h-8 ${stat.color}`} />
            <div>
              <div className="text-2xl font-bold text-[var(--color-text-primary)]">{stat.value}</div>
              <div className="text-xs text-[var(--color-text-secondary)]">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 分类标签 */}
      <div className="flex items-center gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeCategory === cat
                ? 'bg-red-600 text-white border border-red-600'
                : 'bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-red-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 视频案例区域 */}
      <div>
        <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
          <Video className="w-5 h-5 text-red-600" />
          视频案例库
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVideos.map(video => (
            <div
              key={video.url || video.id}
              onClick={() => setSelectedVideo(video)}
              className="glass-card overflow-hidden cursor-pointer hover:scale-[1.02] transition-all duration-300 group"
            >
              <div className="relative h-36 bg-gradient-to-br from-red-600/20 to-rose-600/20">
                <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                    <Play className="w-6 h-6 text-red-600 ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 rounded text-xs text-white">
                  {video.duration}
                </div>
                {userRole.isAdmin && (
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteVideo(video.id); }}
                    className="absolute top-2 right-2 p-1.5 bg-black/50 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-[var(--color-text-primary)] text-sm mb-1 truncate">{video.title}</h3>
                <div className="flex items-center gap-3 text-xs text-[var(--color-text-secondary)] mb-2">
                  <span>{video.playCount}次播放</span>
                  <span className="px-2 py-0.5 rounded bg-red-50 text-red-600">{video.category}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {video.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="px-2 py-0.5 text-xs rounded bg-[var(--color-bg-primary)] text-[var(--color-text-muted)]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
          {userRole.isAdmin && (
            <div
              onClick={() => setShowUploadModal(true)}
              className="glass-card h-full flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-red-300 transition-colors border-2 border-dashed border-[var(--color-border)]"
            >
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                <Plus className="w-6 h-6 text-red-600" />
              </div>
              <span className="text-sm text-[var(--color-text-secondary)]">上传视频</span>
            </div>
          )}
        </div>
      </div>

      {/* 育人维度区域 */}
      <div>
        <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-red-600" />
          育人维度
        </h2>
        {selectedItem ? (
          <div className="glass-card p-6 animate-fade-in-up">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg ${selectedItem.bgColor}`}>
                  <selectedItem.icon className={`w-6 h-6 ${selectedItem.color}`} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--color-text-primary)]">{selectedItem.title}</h3>
                  <span className={`text-sm px-2 py-0.5 rounded ${selectedItem.bgColor} ${selectedItem.color}`}>
                    {selectedItem.category}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-[var(--color-text-muted)] hover:text-[var(--color-accent-primary)]"
              >
                <ChevronRight className="w-5 h-5 rotate-180" />
              </button>
            </div>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4">
              {selectedItem.content}
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedItem.keywords.map(kw => (
                <span key={kw} className="px-3 py-1 text-xs rounded-full bg-red-50 text-red-700 border border-red-200">
                  {kw}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {filtered.map(item => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`glass-card p-5 cursor-pointer hover:scale-[1.02] transition-all duration-300 border-l-4 ${item.borderColor}`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className={`p-2.5 rounded-lg ${item.bgColor}`}>
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-[var(--color-text-primary)] mb-1">{item.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded ${item.bgColor} ${item.color}`}>
                      {item.category}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[var(--color-text-muted)]" />
                </div>
                <p className="text-sm text-[var(--color-text-secondary)] line-clamp-3 leading-relaxed">
                  {item.content}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {item.keywords.slice(0, 3).map(kw => (
                    <span key={kw} className="px-2 py-0.5 text-xs rounded bg-[var(--color-bg-primary)] text-[var(--color-text-muted)]">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 视频播放弹窗 */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-2 md:p-8">
          <div className="bg-[var(--color-bg-secondary)] rounded-2xl max-w-5xl w-full overflow-hidden">
            <div className="relative bg-black aspect-video">
              <video src={selectedVideo.url} controls className="w-full h-full" />
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-red-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">{selectedVideo.title}</h3>
              <div className="flex items-center gap-4 text-sm text-[var(--color-text-secondary)] mb-3">
                <span className="px-2 py-0.5 rounded bg-red-50 text-red-600">{selectedVideo.category}</span>
                <span>{selectedVideo.playCount}次播放</span>
                <span>{selectedVideo.duration}</span>
              </div>
              <p className="text-sm text-[var(--color-text-secondary)] mb-4">{selectedVideo.description}</p>
              <div className="flex flex-wrap gap-2">
                {selectedVideo.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 text-xs rounded-full bg-red-50 text-red-700 border border-red-200">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
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

      {/* 上传视频弹窗 */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 md:p-8">
          <div className="bg-[var(--color-bg-secondary)] rounded-2xl max-w-2xl w-full overflow-hidden">
            <div className="p-6 border-b border-[var(--color-border)] flex items-center justify-between">
              <h3 className="text-lg font-bold text-[var(--color-text-primary)]">上传视频案例</h3>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setNewVideo({ title: '', category: '课程育人', url: '', description: '', tags: '' });
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
                    <span className="text-[var(--color-accent-primary)]">{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-[var(--color-bg-primary)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-500 to-rose-500 transition-all duration-200"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    {categories.filter(c => c !== '全部').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
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
                  placeholder="如：银河一号, 科学家精神"
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
                    setNewVideo({ title: '', category: '课程育人', url: '', description: '', tags: '' });
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
    </div>
  );
}
