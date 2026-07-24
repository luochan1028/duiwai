const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const uploadsDir = path.join(__dirname, 'uploads');
const videosDir = path.join(uploadsDir, 'videos');
const metadataDir = path.join(uploadsDir, 'metadata');

if (!fs.existsSync(videosDir)) {
  fs.mkdirSync(videosDir, { recursive: true });
}
if (!fs.existsSync(metadataDir)) {
  fs.mkdirSync(metadataDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, videosDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 500 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('只支持视频文件'), false);
    }
  },
});

function loadMetadata(key) {
  const filePath = path.join(metadataDir, `${key}.json`);
  if (fs.existsSync(filePath)) {
    try {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch {
      return [];
    }
  }
  return [];
}

function saveMetadata(key, data) {
  const filePath = path.join(metadataDir, `${key}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

const VIDEO_CATEGORIES = {
  'video-page-meta': {
    prefixes: ['实验'],
    defaultCategory: '实验视频',
  },
  'red-education-video-meta': {
    prefixes: ['赓续红色血脉', '红色', '红旗'],
    defaultCategory: '红色育人',
  },
};

function scanVideosFromDir() {
  const result = {};

  if (!fs.existsSync(videosDir)) return result;

  const files = fs.readdirSync(videosDir).filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.mp4', '.webm', '.ogg', '.mov', '.avi'].includes(ext);
  });

  Object.keys(VIDEO_CATEGORIES).forEach(key => {
    const config = VIDEO_CATEGORIES[key];
    const matchedFiles = files.filter(file =>
      config.prefixes.some(prefix => file.includes(prefix))
    );

    const existing = loadMetadata(key);
    const existingByFilename = {};
    existing.forEach(v => {
      if (v.filename) {
        existingByFilename[v.filename] = v;
      }
    });

    const scannedVideos = [];

    matchedFiles.forEach(filename => {
      const filePath = path.join(videosDir, filename);
      const stats = fs.statSync(filePath);
      const title = filename.replace(/\.[^/.]+$/, '');

      let category = config.defaultCategory;
      if (filename.includes('实验')) {
        if (filename.includes('标志寄存器')) category = '寄存器';
        else if (filename.includes('存储') || filename.includes('显示')) category = '存储系统';
        else if (filename.includes('计算')) category = '运算器';
        else if (filename.includes('分支') || filename.includes('选择')) category = '控制器';
      } else if (filename.includes('红色') || filename.includes('赓续')) {
        if (filename.includes('国歌') || filename.includes('没有共产党')) category = '红色歌曲';
        else if (filename.includes('如愿')) category = '红色故事';
        else if (filename.includes('游击队') || filename.includes('合唱')) category = '红色影音';
      }

      const idHash = crypto.createHash('md5').update(filename).digest('hex');
      const existingVideo = existingByFilename[filename];

      scannedVideos.push({
        id: existingVideo && existingVideo.id && !existingVideo.id.startsWith('dir-mp4') 
          ? existingVideo.id 
          : `dir-${idHash}`,
        title,
        category,
        filename,
        url: `/api/video-files/${filename}`,
        size: stats.size,
        duration: existingVideo?.duration || '未知',
        views: existingVideo?.views || '0',
        desc: `视频文件：${filename}`,
        description: `视频文件：${filename}`,
        tags: existingVideo?.tags || [],
        createdAt: existingVideo?.createdAt || stats.mtime.getTime(),
      });
    });

    existing.forEach(v => {
      if (!v.filename || !matchedFiles.includes(v.filename)) {
        scannedVideos.push(v);
      }
    });

    result[key] = scannedVideos;
    saveMetadata(key, scannedVideos);
  });

  return result;
}

scanVideosFromDir();

app.get('/api/videos/:key', (req, res) => {
  const { key } = req.params;
  let videos = loadMetadata(key);

  if (videos.length === 0) {
    const scanned = scanVideosFromDir();
    videos = scanned[key] || [];
  }

  res.json(videos);
});

app.post('/api/videos/scan', (req, res) => {
  const result = scanVideosFromDir();
  const total = Object.values(result).reduce((sum, arr) => sum + arr.length, 0);
  res.json({ success: true, total, categories: Object.keys(result) });
});

app.post('/api/videos/:key', upload.single('video'), (req, res) => {
  const { key } = req.params;
  const { title, category, description, tags } = req.body;
  
  if (!req.file) {
    return res.status(400).json({ error: '请选择视频文件' });
  }

  const video = {
    id: Date.now().toString(),
    title: title || req.file.originalname.replace(/\.[^/.]+$/, ''),
    category: category || '其他',
    description: description || '',
    tags: tags ? tags.split(/[,，\s]+/).filter(Boolean) : [],
    filename: req.file.filename,
    url: `/api/video-files/${req.file.filename}`,
    size: req.file.size,
    duration: '未知',
    views: '0',
    createdAt: Date.now(),
  };

  const videos = loadMetadata(key);
  videos.push(video);
  saveMetadata(key, videos);

  res.json(video);
});

app.post('/api/videos/:key/add-url', (req, res) => {
  const { key } = req.params;
  const { title, url, category } = req.body;
  
  if (!title || !url) {
    return res.status(400).json({ error: '缺少必要参数' });
  }

  const video = {
    id: Date.now().toString(),
    title,
    url,
    category: category || '其他',
    duration: '未知',
    views: '0',
    desc: '用户添加的视频资源',
    tags: [],
    createdAt: Date.now(),
  };

  const videos = loadMetadata(key);
  videos.push(video);
  saveMetadata(key, videos);

  res.json(video);
});

app.delete('/api/videos/:key/:id', (req, res) => {
  const { key, id } = req.params;
  let videos = loadMetadata(key);
  const video = videos.find(v => v.id === id);
  
  if (video && video.filename) {
    const filePath = path.join(videosDir, video.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  videos = videos.filter(v => v.id !== id);
  saveMetadata(key, videos);

  res.json({ success: true });
});

app.get('/api/video-files/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(videosDir, filename);
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: '文件不存在' });
  }

  res.sendFile(filePath);
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

app.listen(PORT, () => {
  console.log(`Video API server running on http://localhost:${PORT}`);
});
