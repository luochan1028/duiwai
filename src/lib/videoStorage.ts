import type { VideoItem } from '@/types';

const DB_NAME = 'jizu-zhixue-videos';
const DB_VERSION = 2;
const STORE_NAME = 'video-files';

let dbInstance: IDBDatabase | null = null;

const API_BASE = '/api';

export async function fetchServerVideos(key: string): Promise<VideoItem[]> {
  try {
    const response = await fetch(`${API_BASE}/videos/${key}`);
    if (!response.ok) {
      throw new Error('Failed to fetch videos');
    }
    return await response.json();
  } catch {
    return [];
  }
}

export async function uploadServerVideo(
  key: string,
  file: File,
  title: string,
  category: string,
  description: string,
  tags: string
): Promise<VideoItem | null> {
  try {
    const formData = new FormData();
    formData.append('video', file);
    formData.append('title', title);
    formData.append('category', category);
    formData.append('description', description);
    formData.append('tags', tags);

    const response = await fetch(`${API_BASE}/videos/${key}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }
    return await response.json();
  } catch {
    return null;
  }
}

export async function addServerVideoUrl(
  key: string,
  title: string,
  url: string,
  category: string
): Promise<VideoItem | null> {
  try {
    const response = await fetch(`${API_BASE}/videos/${key}/add-url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, url, category }),
    });

    if (!response.ok) {
      throw new Error('Add failed');
    }
    return await response.json();
  } catch {
    return null;
  }
}

export async function deleteServerVideo(key: string, id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/videos/${key}/${id}`, {
      method: 'DELETE',
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function openDB(): Promise<IDBDatabase> {
  if (dbInstance) return dbInstance;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(request.result);
    };

    request.onerror = () => {
      console.error('IndexedDB open error:', request.error);
      reject(request.error);
    };
  });
}

export async function saveVideoFile(id: string, file: File): Promise<string> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put({ id, file, createdAt: Date.now() });

      tx.oncomplete = () => {
        const url = URL.createObjectURL(file);
        resolve(url);
      };

      tx.onerror = () => {
        console.error('IndexedDB transaction error:', tx.error);
        reject(tx.error);
      };
    });
  } catch (error) {
    console.error('Failed to save video file:', error);
    throw error;
  }
}

export async function loadVideoFile(id: string): Promise<string | null> {
  try {
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

      request.onerror = () => {
        console.error('IndexedDB get error:', request.error);
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('Failed to load video file:', error);
    return null;
  }
}

export async function generateThumbnail(videoUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.src = videoUrl;
    video.preload = 'auto';

    const cleanup = () => {
      video.pause();
      video.src = '';
      video.removeEventListener('loadeddata', onLoaded);
      video.removeEventListener('error', onError);
      video.removeEventListener('seeked', onSeeked);
    };

    const onSeeked = () => {
      try {
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

    const onLoaded = () => {
      video.currentTime = 0.5;
    };

    const onError = () => {
      cleanup();
      reject(new Error('视频加载失败，无法生成封面'));
    };

    video.addEventListener('loadeddata', onLoaded);
    video.addEventListener('seeked', onSeeked);
    video.addEventListener('error', onError);
  });
}

export async function deleteVideoFile(id: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.delete(id);

      tx.oncomplete = () => resolve();
      tx.onerror = () => {
        console.error('IndexedDB delete error:', tx.error);
        reject(tx.error);
      };
    });
  } catch (error) {
    console.error('Failed to delete video file:', error);
    throw error;
  }
}

export function saveVideoMeta(key: string, videos: VideoItem[]): void {
  try {
    const meta = videos.map(v => {
      const { url, ...rest } = v;
      return rest;
    });
    localStorage.setItem(key, JSON.stringify(meta));
  } catch (error) {
    console.error('Failed to save video meta:', error);
  }
}

export function loadVideoMeta(key: string): VideoItem[] | null {
  try {
    const data = localStorage.getItem(key);
    if (!data) return null;
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to load video meta:', error);
    return null;
  }
}
