import { useState, useRef, useEffect } from 'react';
import { Play } from 'lucide-react';
import type { VideoItem } from '@/types';

interface VideoThumbnailProps {
  video: VideoItem;
  className?: string;
  playIconSize?: string;
}

/**
 * 视频封面组件
 * 优先级：thumbnail(服务器预生成) > sessionStorage缓存截图 > 视频第一帧截图 > 渐变背景+图标
 * 服务器预生成缩略图走 <img>，毫秒级加载；无预生成时降级到视频截图
 */
export default function VideoThumbnail({ video, className = '', playIconSize = 'w-8 h-8 md:w-10 md:h-10' }: VideoThumbnailProps) {
  // 服务器预生成缩略图优先，直接用 <img> 加载（最快）
  const hasServerThumb = !!video.thumbnail;
  const [frameUrl, setFrameUrl] = useState<string | null>(hasServerThumb ? video.thumbnail : null);
  const [loading, setLoading] = useState(!hasServerThumb);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [attempted, setAttempted] = useState(false);
  const retryCountRef = useRef(0);

  useEffect(() => {
    // 已有服务器缩略图，直接用
    if (video.thumbnail) {
      setFrameUrl(video.thumbnail);
      setLoading(false);
      return;
    }

    // 无 url 无法截图，用渐变背景
    if (!video.url || video.url.startsWith('blob:') === false && !video.url.startsWith('/api/') && !video.url.startsWith('http')) {
      setLoading(false);
      return;
    }

    // 检查 sessionStorage 缓存（视频截图结果）
    const cacheKey = `video-frame-${video.url}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      setFrameUrl(cached);
      setLoading(false);
      return;
    }

    // 需要加载视频截图
    setAttempted(true);
  }, [video.thumbnail, video.url]);

  const handleLoadedData = () => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    try {
      // 跳到视频中段（10%位置）避免开头黑屏
      const duration = videoEl.duration;
      const seekTime = duration && !isNaN(duration) ? duration * 0.1 : 0.5;
      videoEl.currentTime = Math.min(seekTime, 2);
    } catch {
      // 某些浏览器可能不支持设置 currentTime
      captureFrame();
    }
  };

  const handleSeeked = () => {
    captureFrame();
  };

  const captureFrame = () => {
    const videoEl = videoRef.current;
    const canvas = canvasRef.current;
    if (!videoEl || !canvas) return;

    try {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 设置 canvas 尺寸与视频一致
      canvas.width = videoEl.videoWidth || 640;
      canvas.height = videoEl.videoHeight || 360;

      // 绘制视频当前帧
      ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);

      // 检测是否为黑色帧（采样中心区域）
      const sampleSize = 20;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const imageData = ctx.getImageData(centerX - sampleSize/2, centerY - sampleSize/2, sampleSize, sampleSize);
      let totalBrightness = 0;
      for (let i = 0; i < imageData.data.length; i += 4) {
        totalBrightness += imageData.data[i] + imageData.data[i+1] + imageData.data[i+2];
      }
      const avgBrightness = totalBrightness / (sampleSize * sampleSize * 3);

      // 如果是黑色帧且未超过重试次数，跳到更后面的位置重试
      if (avgBrightness < 30 && retryCountRef.current < 3) {
        retryCountRef.current++;
        const duration = videoEl.duration;
        if (duration && !isNaN(duration)) {
          // 依次尝试 25%, 40%, 60% 位置
          videoEl.currentTime = Math.min(duration * (0.25 * retryCountRef.current), duration * 0.6);
          return; // 等待 onSeeked 再次触发
        }
      }

      // 转为 dataURL
      const dataUrl = canvas.toDataURL('image/jpeg', 0.7);

      // 更新状态
      setFrameUrl(dataUrl);
      setLoading(false);

      // 缓存到 sessionStorage
      try {
        const cacheKey = `video-frame-${video.url}`;
        sessionStorage.setItem(cacheKey, dataUrl);
      } catch {
        // sessionStorage 可能满了，忽略
      }
    } catch (err) {
      // 跨域可能导致 canvas 被污染，降级到渐变背景
      setLoading(false);
    }
  };

  const handleError = () => {
    setLoading(false);
  };

  // 渲染：有 frameUrl（服务器缩略图或截图）直接显示图片
  if (frameUrl) {
    return (
      <img
        src={frameUrl}
        alt={video.title}
        loading="eager"
        decoding="async"
        className={`w-full h-full object-cover ${className}`}
      />
    );
  }

  // 需要加载视频截图（无服务器缩略图时的降级路径）
  if (loading && attempted && video.url) {
    return (
      <>
        <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-700 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-white/30 border-t-white/80 rounded-full animate-spin" />
        </div>
        <video
          ref={videoRef}
          src={video.url}
          crossOrigin="anonymous"
          preload="metadata"
          muted
          playsInline
          onLoadedData={handleLoadedData}
          onSeeked={handleSeeked}
          onError={handleError}
          className="hidden"
        />
        <canvas ref={canvasRef} className="hidden" />
      </>
    );
  }

  // 降级：渐变背景 + 播放图标 + 标题
  return (
    <>
      <Play className={`${playIconSize} text-white/80 group-hover:scale-125 transition-transform`} />
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
        <p className="text-[10px] md:text-xs text-white/90 line-clamp-1">{video.title}</p>
      </div>
    </>
  );
}
