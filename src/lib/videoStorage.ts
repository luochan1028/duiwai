// 视频文件 IndexedDB 持久化存储
const DB_NAME = 'jizu-zhixue-videos';
const DB_VERSION = 1;
const STORE_NAME = 'video-files';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// 保存视频文件 Blob 到 IndexedDB
export async function saveVideoFile(id: string, file: File): Promise<string> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put({ id, file, createdAt: Date.now() });
    tx.oncomplete = () => {
      const url = URL.createObjectURL(file);
      resolve(url);
    };
    tx.onerror = () => reject(tx.error);
  });
}

// 从 IndexedDB 读取视频文件并创建 blob URL
export async function loadVideoFile(id: string): Promise<string | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(id);
    request.onsuccess = () => {
      const result = request.result;
      if (result && result.file) {
        const url = URL.createObjectURL(result.file);
        resolve(url);
      } else {
        resolve(null);
      }
    };
    request.onerror = () => reject(request.error);
  });
}

// 从视频文件生成封面图片（取第一帧）
export async function generateThumbnail(videoUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.src = videoUrl;
    video.preload = 'metadata';

    const cleanup = () => {
      video.pause();
      video.src = '';
      video.removeEventListener('loadeddata', onLoaded);
      video.removeEventListener('error', onError);
    };

    const onLoaded = () => {
      try {
        video.currentTime = 0.5;
        const canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = 360;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          cleanup();
          reject(new Error('无法创建画布上下文'));
          return;
        }
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const thumbnail = canvas.toDataURL('image/jpeg', 0.8);
        cleanup();
        resolve(thumbnail);
      } catch (err) {
        cleanup();
        reject(err);
      }
    };

    const onError = () => {
      cleanup();
      reject(new Error('视频加载失败，无法生成封面'));
    };

    video.addEventListener('loadeddata', onLoaded);
    video.addEventListener('error', onError);
  });
}

// 删除视频文件
export async function deleteVideoFile(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// 保存视频元数据列表到 localStorage（轻量数据）
export function saveVideoMeta(key: string, videos: any[]): void {
  // 不存储 url（blob url 每次会变），只存元数据
  const meta = videos.map(v => {
    const { url, ...rest } = v;
    return rest;
  });
  localStorage.setItem(key, JSON.stringify(meta));
}

// 从 localStorage 读取视频元数据
export function loadVideoMeta(key: string): any[] | null {
  const data = localStorage.getItem(key);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}
