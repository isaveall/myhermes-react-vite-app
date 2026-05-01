import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// 目录配置
const uploadDir = path.join(__dirname, 'uploads');
const chunkDir = path.join(__dirname, 'chunks');
const dbDir = path.join(__dirname, 'db');

// 确保目录存在
[uploadDir, chunkDir, dbDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// ============ 分片存储配置 ============
// multer 用于普通上传（小文件）
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB
  }
});

// 中间件
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 静态文件服务
app.use('/uploads', express.static(uploadDir));

// ============ 文件元数据存储（简易文件数据库） ============
const DB_FILE = path.join(dbDir, 'files.json');

function loadFileDB() {
  try {
    if (fs.existsSync(DB_FILE)) {
      return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    }
  } catch (e) {
    console.error('加载文件数据库失败:', e.message);
  }
  return [];
}

function saveFileDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// 初始化
if (!fs.existsSync(DB_FILE)) {
  saveFileDB([]);
}

// ============ 健康检查 ============
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '文件上传服务器运行正常' });
});

// ============ 获取文件列表 ============
app.get('/api/files', (req, res) => {
  try {
    const files = fs.readdirSync(uploadDir).filter(f => !f.startsWith('.'));
    const fileList = files.map(file => {
      const filePath = path.join(uploadDir, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        originalName: file.replace(/^.*?-/, '').replace(/-[^-]+(\..+)$/, '$1'),
        size: stats.size,
        uploadedAt: stats.mtime,
        url: `/uploads/${file}`
      };
    });
    res.json(fileList);
  } catch (err) {
    res.status(500).json({ error: '无法读取文件列表' });
  }
});

// ============ 断点续传 - 初始化上传 ============
app.post('/api/upload/init', (req, res) => {
  const { fileName, fileSize, fileType, totalChunks } = req.body;
  if (!fileName) {
    return res.status(400).json({ error: '缺少文件名' });
  }

  const uploadId = uuidv4();
  const chunkFolder = path.join(chunkDir, uploadId);
  fs.mkdirSync(chunkFolder, { recursive: true });

  const uploadRecord = {
    uploadId,
    fileName,
    fileSize: fileSize || 0,
    fileType: fileType || '',
    totalChunks: totalChunks || 0,
    receivedChunks: [],
    createdAt: new Date().toISOString(),
    status: 'initialized'
  };

  // 保存上传记录
  const records = loadFileDB();
  records.push(uploadRecord);
  saveFileDB(records);

  res.json({
    success: true,
    uploadId,
    fileName,
    totalChunks: totalChunks || 0,
    chunkSize: 5 * 1024 * 1024 // 5MB per chunk
  });
});

// ============ 断点续传 - 上传分片 ============
app.post('/api/upload/chunk', async (req, res) => {
  const contentType = req.headers['content-type'] || '';
  if (!contentType.includes('multipart/form-data')) {
    return res.status(400).json({ error: '需要 multipart/form-data 格式' });
  }

  const busboy = (await import('busboy')).default;
  const bb = busboy({ headers: req.headers });

  let uploadId = '';
  let chunkIndex = '';
  let fileName = '';
  let chunkData = null;

  bb.on('field', (fieldname, val) => {
    if (fieldname === 'uploadId') uploadId = val;
    if (fieldname === 'chunkIndex') chunkIndex = parseInt(val);
    if (fieldname === 'fileName') fileName = val;
  });

  bb.on('file', (fieldname, file) => {
    const chunks = [];
    file.on('data', (data) => chunks.push(data));
    file.on('end', () => {
      if (chunks.length > 0) {
        chunkData = Buffer.concat(chunks);
      }
    });
  });

  bb.on('close', () => {
    if (!uploadId || chunkIndex === undefined || !chunkData) {
      return res.status(400).json({ error: '缺少必要参数或分片数据' });
    }

    const chunkFolder = path.join(chunkDir, uploadId);
    if (!fs.existsSync(chunkFolder)) {
      return res.status(404).json({ error: '上传会话不存在或已过期' });
    }

    const chunkPath = path.join(chunkFolder, `chunk-${chunkIndex}`);
    fs.writeFileSync(chunkPath, chunkData);

    const records = loadFileDB();
    const record = records.find(r => r.uploadId === uploadId);
    if (record) {
      if (!record.receivedChunks.includes(chunkIndex)) {
        record.receivedChunks.push(chunkIndex);
      }
      record.status = 'uploading';
      saveFileDB(records);
    }

    res.json({
      success: true,
      uploadId,
      chunkIndex: parseInt(chunkIndex),
      receivedChunks: record?.receivedChunks || [parseInt(chunkIndex)]
    });
  });

  req.pipe(bb);
});

// 使用 express-fileupload 处理分片上传的二进制数据
app.post('/api/upload/chunk-stream', async (req, res) => {
  const contentType = req.headers['content-type'] || '';
  
  if (contentType.includes('multipart/form-data')) {
    const busboy = (await import('busboy')).default;
    const bb = busboy({ headers: req.headers });
    let uploadId = '';
    let chunkIndex = '';
    let chunkData = null;

    bb.on('field', (fieldname, val) => {
      if (fieldname === 'uploadId') uploadId = val;
      if (fieldname === 'chunkIndex') chunkIndex = val;
    });

    bb.on('file', (fieldname, file, info) => {
      const chunks = [];
      file.on('data', (data) => chunks.push(data));
      file.on('end', () => {
        chunkData = Buffer.concat(chunks);
      });
    });

    bb.on('close', () => {
      if (!uploadId || chunkIndex === '' || !chunkData) {
        return res.status(400).json({ error: '缺少必要参数或分片数据' });
      }

      const chunkFolder = path.join(chunkDir, uploadId);
      if (!fs.existsSync(chunkFolder)) {
        return res.status(404).json({ error: '上传会话不存在或已过期' });
      }

      const chunkPath = path.join(chunkFolder, `chunk-${chunkIndex}`);
      fs.writeFileSync(chunkPath, chunkData);

      const records = loadFileDB();
      const record = records.find(r => r.uploadId === uploadId);
      if (record) {
        if (!record.receivedChunks.includes(parseInt(chunkIndex))) {
          record.receivedChunks.push(parseInt(chunkIndex));
        }
        record.status = 'uploading';
        saveFileDB(records);
      }

      res.json({
        success: true,
        uploadId,
        chunkIndex: parseInt(chunkIndex),
        receivedChunks: record?.receivedChunks || [parseInt(chunkIndex)]
      });
    });

    req.pipe(bb);
  } else {
    // JSON 方式（base64 编码的分片）
    const { uploadId, chunkIndex, data } = req.body;
    if (!uploadId || chunkIndex === undefined || !data) {
      return res.status(400).json({ error: '缺少必要参数' });
    }

    const chunkFolder = path.join(chunkDir, uploadId);
    if (!fs.existsSync(chunkFolder)) {
      return res.status(404).json({ error: '上传会话不存在' });
    }

    const chunkPath = path.join(chunkFolder, `chunk-${chunkIndex}`);
    fs.writeFileSync(chunkPath, Buffer.from(data, 'base64'));

    const records = loadFileDB();
    const record = records.find(r => r.uploadId === uploadId);
    if (record) {
      if (!record.receivedChunks.includes(parseInt(chunkIndex))) {
        record.receivedChunks.push(parseInt(chunkIndex));
      }
      record.status = 'uploading';
      saveFileDB(records);
    }

    res.json({
      success: true,
      uploadId,
      chunkIndex: parseInt(chunkIndex)
    });
  }
});

// ============ 断点续传 - 合并分片 ============
app.post('/api/upload/merge', (req, res) => {
  const { uploadId, fileName } = req.body;
  if (!uploadId || !fileName) {
    return res.status(400).json({ error: '缺少必要参数' });
  }

  const chunkFolder = path.join(chunkDir, uploadId);
  if (!fs.existsSync(chunkFolder)) {
    return res.status(404).json({ error: '上传会话不存在' });
  }

  const records = loadFileDB();
  const record = records.find(r => r.uploadId === uploadId);
  if (!record) {
    return res.status(404).json({ error: '上传记录不存在' });
  }

  // 生成最终文件名
  const ext = path.extname(fileName);
  const baseName = path.basename(fileName, ext);
  const finalName = `${baseName}-${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
  const finalPath = path.join(uploadDir, finalName);

  try {
    // 获取所有分片并按索引排序
    const chunkFiles = fs.readdirSync(chunkFolder)
      .filter(f => f.startsWith('chunk-'))
      .sort((a, b) => {
        const numA = parseInt(a.replace('chunk-', ''));
        const numB = parseInt(b.replace('chunk-', ''));
        return numA - numB;
      });

    // 合并分片
    const writeStream = fs.createWriteStream(finalPath);
    for (const chunkFile of chunkFiles) {
      const chunkPath = path.join(chunkFolder, chunkFile);
      const chunkData = fs.readFileSync(chunkPath);
      writeStream.write(chunkData);
    }
    writeStream.end();

    writeStream.on('finish', () => {
      // 删除分片目录
      fs.rmSync(chunkFolder, { recursive: true, force: true });

      // 更新记录状态
      record.status = 'completed';
      record.finalName = finalName;
      record.url = `/uploads/${finalName}`;
      saveFileDB(records);

      const stats = fs.statSync(finalPath);
      res.json({
        success: true,
        message: '文件合并成功',
        file: {
          filename: finalName,
          originalname: fileName,
          size: stats.size,
          url: `/uploads/${finalName}`,
          uploadedAt: new Date().toISOString()
        }
      });
    });

    writeStream.on('error', (err) => {
      res.status(500).json({ error: '合并文件失败: ' + err.message });
    });
  } catch (err) {
    res.status(500).json({ error: '合并文件失败: ' + err.message });
  }
});

// ============ 断点续传 - 查询上传状态 ============
app.get('/api/upload/status/:uploadId', (req, res) => {
  const { uploadId } = req.params;
  const records = loadFileDB();
  const record = records.find(r => r.uploadId === uploadId);

  if (!record) {
    return res.status(404).json({ error: '上传记录不存在' });
  }

  res.json({
    success: true,
    uploadId: record.uploadId,
    fileName: record.fileName,
    fileSize: record.fileSize,
    totalChunks: record.totalChunks,
    receivedChunks: record.receivedChunks,
    status: record.status,
    progress: record.totalChunks > 0 
      ? Math.round((record.receivedChunks.length / record.totalChunks) * 100)
      : 0
  });
});

// ============ 取消上传（清理分片） ============
app.delete('/api/upload/cancel/:uploadId', (req, res) => {
  const { uploadId } = req.params;
  const chunkFolder = path.join(chunkDir, uploadId);

  if (fs.existsSync(chunkFolder)) {
    fs.rmSync(chunkFolder, { recursive: true, force: true });
  }

  const records = loadFileDB();
  const idx = records.findIndex(r => r.uploadId === uploadId);
  if (idx !== -1) {
    records.splice(idx, 1);
    saveFileDB(records);
  }

  res.json({ success: true, message: '上传已取消' });
});

// ============ 多文件上传（普通方式，支持文件夹结构） ============
app.post('/api/upload/multiple', upload.array('files', 100), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: '没有选择文件' });
  }

  const fileInfos = req.files.map(file => ({
    filename: file.filename,
    originalname: file.originalname,
    size: file.size,
    mimetype: file.mimetype,
    url: `/uploads/${file.filename}`,
    uploadedAt: new Date().toISOString()
  }));

  res.json({
    success: true,
    message: `成功上传 ${req.files.length} 个文件`,
    files: fileInfos,
    count: req.files.length
  });
});

// ============ 单文件上传（兼容旧接口） ============
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: '没有选择文件' });
  }

  const fileInfo = {
    filename: req.file.filename,
    originalname: req.file.originalname,
    size: req.file.size,
    mimetype: req.file.mimetype,
    url: `/uploads/${req.file.filename}`,
    uploadedAt: new Date().toISOString()
  };

  res.json({
    success: true,
    message: '文件上传成功',
    file: fileInfo
  });
});

// ============ 删除文件 ============
app.delete('/api/files/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadDir, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: '文件不存在' });
  }

  fs.unlinkSync(filePath);
  res.json({ success: true, message: '文件删除成功' });
});

// ============ 批量删除 ============
app.post('/api/files/batch-delete', (req, res) => {
  const { filenames } = req.body;
  if (!filenames || !Array.isArray(filenames)) {
    return res.status(400).json({ error: '缺少文件名列表' });
  }

  const results = filenames.map(name => {
    const filePath = path.join(uploadDir, name);
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return { name, success: true };
      }
      return { name, success: false, error: '文件不存在' };
    } catch (err) {
      return { name, success: false, error: err.message };
    }
  });

  res.json({ success: true, results });
});

// ============ 错误处理 ============
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: '文件大小超过限制（500MB）' });
    }
    return res.status(400).json({ error: err.message });
  }
  if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
});

app.listen(PORT, () => {
  console.log(`文件上传服务器运行在 http://localhost:${PORT}`);
  console.log(`上传目录: ${uploadDir}`);
  console.log('API 端点:');
  console.log('  GET  /api/health            - 健康检查');
  console.log('  GET  /api/files             - 获取文件列表');
  console.log('  POST /api/upload            - 单文件上传');
  console.log('  POST /api/upload/multiple   - 多文件上传');
  console.log('  POST /api/upload/init       - 初始化分片上传');
  console.log('  POST /api/upload/chunk      - 上传分片');
  console.log('  POST /api/upload/merge      - 合并分片');
  console.log('  GET  /api/upload/status/:id  - 查询上传状态');
  console.log('  DELETE /api/upload/cancel/:id - 取消上传');
  console.log('  DELETE /api/files/:filename  - 删除文件');
  console.log('  POST /api/files/batch-delete - 批量删除');
});
