import React, { useState, useCallback, useRef, useEffect } from 'react';
import axios from 'axios';
import './FileUpload.css';

// 生产环境通过 nginx 反向代理访问同域下的 API
// 开发环境可改为 'http://localhost:3001'
const API_BASE = '';
const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB per chunk
const MAX_CONCURRENT = 3; // 最大并发分片数

const FileUpload = () => {
  const [files, setFiles] = useState([]);        // { id, file, name, size, type, path, status, progress, uploadedChunks, totalChunks, uploadId, error }
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('upload'); // upload | history
  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);
  const dropRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const abortControllers = useRef({});

  // 获取已上传文件列表
  const fetchUploadedFiles = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/files`);
      setUploadedFiles(response.data);
    } catch (err) {
      console.error('获取文件列表失败:', err);
    }
  }, []);

  useEffect(() => {
    fetchUploadedFiles();
  }, [fetchUploadedFiles]);

  // 格式化文件大小
  const formatSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // 获取文件扩展名
  const getFileIcon = (name) => {
    const ext = name?.split('.').pop()?.toLowerCase();
    const iconMap = {
      'zip': '📦', 'rar': '📦', '7z': '📦', 'tar': '📦', 'gz': '📦',
      'jpg': '🖼️', 'jpeg': '🖼️', 'png': '🖼️', 'gif': '🖼️', 'svg': '🖼️', 'webp': '🖼️',
      'pdf': '📄', 'doc': '📝', 'docx': '📝', 'xls': '📊', 'xlsx': '📊',
      'mp4': '🎬', 'avi': '🎬', 'mkv': '🎬', 'mov': '🎬',
      'mp3': '🎵', 'wav': '🎵', 'flac': '🎵',
      'js': '📜', 'py': '📜', 'html': '📜', 'css': '📜', 'json': '📜',
      'txt': '📄',
    };
    return iconMap[ext] || '📄';
  };

  // 处理文件选择
  const handleFilesSelected = (fileList) => {
    const newFiles = Array.from(fileList).map((file, idx) => {
      // 提取相对路径
      const fullPath = file.webkitRelativePath || file.name;
      return {
        id: Date.now() + '-' + idx + '-' + Math.random().toString(36).slice(2),
        file,
        name: file.name,
        size: file.size,
        type: file.type || file.name.split('.').pop() || '未知',
        path: fullPath,
        status: 'pending', // pending | uploading | paused | completed | error
        progress: 0,
        uploadedChunks: 0,
        totalChunks: Math.ceil(file.size / CHUNK_SIZE),
        uploadId: null,
        error: ''
      };
    });

    setFiles(prev => [...prev, ...newFiles]);
    setError('');
    setSuccess('');
  };

  const handleFileChange = (e) => {
    if (e.target.files?.length) {
      handleFilesSelected(e.target.files);
    }
    e.target.value = '';
  };

  const handleFolderChange = (e) => {
    if (e.target.files?.length) {
      handleFilesSelected(e.target.files);
    }
    e.target.value = '';
  };

  // 拖放处理
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles?.length) {
      // 检查是否有文件夹（通过 items 判断）
      const items = e.dataTransfer.items;
      let hasFolder = false;
      if (items) {
        for (let i = 0; i < items.length; i++) {
          const item = items[i].webkitGetAsEntry();
          if (item && item.isDirectory) {
            hasFolder = true;
            break;
          }
        }
      }
      handleFilesSelected(droppedFiles);
    }
  }, []);

  // 移除文件
  const removeFile = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    // 如果有上传中的，取消
    if (abortControllers.current[id]) {
      abortControllers.current[id].abort();
      delete abortControllers.current[id];
    }
  };

  // 清空列表
  const clearFiles = () => {
    // 取消所有上传
    files.forEach(f => {
      if (abortControllers.current[f.id]) {
        abortControllers.current[f.id].abort();
        delete abortControllers.current[f.id];
      }
    });
    setFiles([]);
  };

  // ============ 分片上传单个文件 ============
  const uploadFileInChunks = async (fileItem) => {
    const { id, file, name, size, totalChunks } = fileItem;
    
    // 小文件（<5MB）直接上传
    if (size <= CHUNK_SIZE) {
      return await uploadSmallFile(fileItem);
    }

    // 大文件分片上传
    return await uploadLargeFileInChunks(fileItem);
  };

  // 小文件直接上传
  const uploadSmallFile = async (fileItem) => {
    const { id, file, name } = fileItem;
    const formData = new FormData();
    formData.append('files', file);

    try {
      setFiles(prev => prev.map(f => 
        f.id === id ? { ...f, status: 'uploading', progress: 0 } : f
      ));

      const response = await axios.post(`${API_BASE}/api/upload/multiple`, formData, {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setFiles(prev => prev.map(f => 
            f.id === id ? { ...f, progress: percent } : f
          ));
        }
      });

      setFiles(prev => prev.map(f => 
        f.id === id ? { ...f, status: 'completed', progress: 100 } : f
      ));

      return { success: true, file: response.data.files?.[0] };
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || '上传失败';
      setFiles(prev => prev.map(f => 
        f.id === id ? { ...f, status: 'error', error: errorMsg } : f
      ));
      return { success: false, error: errorMsg };
    }
  };

  // 大文件分片上传
  const uploadLargeFileInChunks = async (fileItem) => {
    const { id, file, name, size, totalChunks } = fileItem;

    try {
      // 1. 初始化上传
      setFiles(prev => prev.map(f => 
        f.id === id ? { ...f, status: 'uploading', progress: 0 } : f
      ));

      const initRes = await axios.post(`${API_BASE}/api/upload/init`, {
        fileName: name,
        fileSize: size,
        fileType: file.type,
        totalChunks
      });

      const uploadId = initRes.data.uploadId;
      setFiles(prev => prev.map(f => 
        f.id === id ? { ...f, uploadId } : f
      ));

      // 2. 查询是否已有已上传的分片（断点续传）
      let existingChunks = [];
      try {
        const statusRes = await axios.get(`${API_BASE}/api/upload/status/${uploadId}`);
        existingChunks = statusRes.data.receivedChunks || [];
      } catch (e) {
        // 首次上传，没有状态
      }

      // 3. 并发上传分片
      const chunkPromises = [];
      const abortCtrl = new AbortController();
      abortControllers.current[id] = abortCtrl;

      for (let i = 0; i < totalChunks; i++) {
        // 跳过已上传的分片
        if (existingChunks.includes(i)) {
          setFiles(prev => prev.map(f => 
            f.id === id ? { ...f, uploadedChunks: (f.uploadedChunks || 0) + 1 } : f
          ));
          continue;
        }

        // 等待并发槽位
        if (chunkPromises.length >= MAX_CONCURRENT) {
          await Promise.race(chunkPromises);
          // 移除已完成的
          const results = await Promise.allSettled(chunkPromises);
          chunkPromises.length = 0;
          // 检查是否有失败的
          for (const result of results) {
            if (result.status === 'rejected') {
              throw new Error(result.reason?.message || '分片上传失败');
            }
          }
        }

        const start = i * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, size);
        const chunk = file.slice(start, end);

        const promise = uploadChunk(uploadId, i, chunk, name, abortCtrl.signal)
          .then(() => {
            setFiles(prev => prev.map(f => 
              f.id === id ? { 
                ...f, 
                uploadedChunks: (f.uploadedChunks || 0) + 1,
                progress: Math.round(((f.uploadedChunks || 0) + 1) / totalChunks * 100)
              } : f
            ));
          });

        chunkPromises.push(promise);
      }

      // 等待剩余分片
      await Promise.all(chunkPromises);

      // 4. 合并分片
      const mergeRes = await axios.post(`${API_BASE}/api/upload/merge`, {
        uploadId,
        fileName: name
      });

      setFiles(prev => prev.map(f => 
        f.id === id ? { ...f, status: 'completed', progress: 100 } : f
      ));

      delete abortControllers.current[id];

      return { success: true, file: mergeRes.data.file };
    } catch (err) {
      if (err.name === 'CanceledError' || err.name === 'AbortError') {
        setFiles(prev => prev.map(f => 
          f.id === id ? { ...f, status: 'paused' } : f
        ));
        return { success: false, error: '已暂停' };
      }
      const errorMsg = err.response?.data?.error || err.message || '上传失败';
      setFiles(prev => prev.map(f => 
        f.id === id ? { ...f, status: 'error', error: errorMsg } : f
      ));
      return { success: false, error: errorMsg };
    }
  };

  // 上传单个分片
  const uploadChunk = async (uploadId, chunkIndex, chunk, fileName, signal) => {
    const formData = new FormData();
    formData.append('uploadId', uploadId);
    formData.append('chunkIndex', chunkIndex);
    formData.append('fileName', fileName);
    formData.append('file', new Blob([chunk]));

    await axios.post(`${API_BASE}/api/upload/chunk`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      signal,
      timeout: 120000 // 2分钟超时
    });
  };

  // ============ 开始上传 ============
  const startUpload = async () => {
    const pendingFiles = files.filter(f => f.status === 'pending' || f.status === 'error');
    if (pendingFiles.length === 0) {
      setError('没有待上传的文件');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    let successCount = 0;
    let failCount = 0;

    for (const fileItem of pendingFiles) {
      const result = await uploadFileInChunks(fileItem);
      if (result.success) {
        successCount++;
        // 添加到已上传列表（立即刷新）
        if (result.file) {
          setUploadedFiles(prev => [result.file, ...prev]);
        }
      } else {
        failCount++;
      }
    }

    setUploading(false);

    if (failCount === 0) {
      setSuccess(`全部上传成功！共 ${successCount} 个文件`);
      setTimeout(() => {
        // 刷新已上传列表
        fetchUploadedFiles();
      }, 500);
    } else if (successCount > 0) {
      setSuccess(`${successCount} 个文件上传成功`);
      setError(`${failCount} 个文件上传失败`);
    } else {
      setError('所有文件上传失败');
    }

    setTimeout(() => {
      setSuccess('');
    }, 5000);
  };

  // ============ 恢复暂停的上传 ============
  const resumeUpload = (id) => {
    const fileItem = files.find(f => f.id === id);
    if (!fileItem) return;

    setFiles(prev => prev.map(f => 
      f.id === id ? { ...f, status: 'uploading', error: '' } : f
    ));

    uploadFileInChunks({ ...fileItem, status: 'uploading' });
  };

  // ============ 删除已上传文件 ============
  const deleteUploadedFile = async (name) => {
    try {
      await axios.delete(`${API_BASE}/api/files/${name}`);
      setUploadedFiles(prev => prev.filter(f => f.name !== name));
      setSuccess(`文件 "${name}" 已删除`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('删除失败：' + (err.response?.data?.error || err.message));
    }
  };

  // 下载已上传文件
  const downloadFile = (fileUrl, fileName) => {
    const link = document.createElement('a');
    link.href = `${API_BASE}${fileUrl}`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 计算总进度
  const totalProgress = files.length > 0
    ? Math.round(files.reduce((sum, f) => sum + (f.progress || 0), 0) / files.length)
    : 0;

  return (
    <div className="file-upload-container">
      {/* 标签切换 */}
      <div className="upload-tabs">
        <button 
          className={`tab-btn ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          📤 上传文件
        </button>
        <button 
          className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('history');
            fetchUploadedFiles();
          }}
        >
          📋 上传记录 ({uploadedFiles.length})
        </button>
      </div>

      {activeTab === 'upload' ? (
        <>
          {/* 拖放区域 */}
          <div 
            ref={dropRef}
            className={`drop-zone ${dragOver ? 'drag-over' : ''} ${files.length > 0 ? 'has-files' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !files.length && fileInputRef.current?.click()}
          >
            {files.length === 0 ? (
              <div className="drop-zone-content">
                <div className="upload-icon">📤</div>
                <p className="drop-title">拖放文件到此处</p>
                <p className="drop-hint">支持单个文件、多个文件、整个文件夹</p>
                <div className="drop-actions">
                  <button 
                    className="select-btn select-file-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                  >
                    📄 选择文件
                  </button>
                  <button 
                    className="select-btn select-folder-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      folderInputRef.current?.click();
                    }}
                  >
                    📁 选择文件夹
                  </button>
                </div>
              </div>
            ) : (
              <div className="drop-zone-selected">
                <span className="selected-count">已选择 {files.length} 个文件</span>
                <button 
                  className="add-more-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  + 添加更多
                </button>
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileChange}
              className="file-input"
            />
            <input
              ref={folderInputRef}
              type="file"
              multiple
              webkitdirectory=""
              directory=""
              onChange={handleFolderChange}
              className="file-input"
              style={{ display: 'none' }}
            />
          </div>

          {/* 文件列表 */}
          {files.length > 0 && (
            <div className="upload-file-list">
              <div className="file-list-header">
                <span>待上传文件 ({files.length})</span>
                <div className="file-list-actions">
                  <span className="total-size">共 {formatSize(files.reduce((s, f) => s + f.size, 0))}</span>
                  <button className="clear-btn" onClick={clearFiles}>清空</button>
                </div>
              </div>
              
              {/* 总进度 */}
              {uploading && (
                <div className="global-progress">
                  <div className="global-progress-bar">
                    <div className="global-progress-fill" style={{ width: `${totalProgress}%` }}></div>
                  </div>
                  <span className="global-progress-text">{totalProgress}%</span>
                </div>
              )}

              <div className="file-items">
                {files.map(item => (
                  <div key={item.id} className={`file-item ${item.status}`}>
                    <div className="file-item-icon">{getFileIcon(item.name)}</div>
                    <div className="file-item-info">
                      <div className="file-item-name" title={item.path}>
                        {item.path}
                      </div>
                      <div className="file-item-meta">
                        <span>{formatSize(item.size)}</span>
                        {item.totalChunks > 1 && (
                          <span className="chunk-info">
                            • {item.totalChunks} 分片
                            {item.uploadedChunks > 0 && ` • 已上传 ${item.uploadedChunks}/${item.totalChunks}`}
                          </span>
                        )}
                      </div>
                      {item.status === 'uploading' && (
                        <div className="file-progress-bar">
                          <div className="file-progress-fill" style={{ width: `${item.progress}%` }}></div>
                        </div>
                      )}
                      {item.status === 'error' && (
                        <div className="file-error-msg">{item.error}</div>
                      )}
                    </div>
                    <div className="file-item-status">
                      {item.status === 'pending' && <span className="status-pending">等待</span>}
                      {item.status === 'uploading' && <span className="status-uploading">{item.progress}%</span>}
                      {item.status === 'completed' && <span className="status-completed">✅</span>}
                      {item.status === 'error' && <span className="status-error">❌</span>}
                      {item.status === 'paused' && <span className="status-paused">⏸</span>}
                    </div>
                    <div className="file-item-actions">
                      {item.status === 'error' && (
                        <button className="action-btn resume-btn" onClick={() => resumeUpload(item.id)} title="重试">
                          🔄
                        </button>
                      )}
                      {item.status === 'paused' && (
                        <button className="action-btn resume-btn" onClick={() => resumeUpload(item.id)} title="继续">
                          ▶️
                        </button>
                      )}
                      {(item.status === 'pending' || item.status === 'error') && (
                        <button className="action-btn remove-btn" onClick={() => removeFile(item.id)} title="移除">
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* 操作按钮 */}
              <div className="upload-actions">
                <button 
                  className="upload-btn"
                  onClick={startUpload}
                  disabled={uploading || files.every(f => f.status === 'completed')}
                >
                  {uploading ? `上传中 ${totalProgress}%...` : 
                   files.every(f => f.status === 'completed') ? '全部完成' : 
                   '开始上传'}
                </button>
              </div>
            </div>
          )}

          {/* 消息提示 */}
          {error && <div className="error-message">❌ {error}</div>}
          {success && <div className="success-message">✅ {success}</div>}
        </>
      ) : (
        <>
          {/* 上传历史 */}
          <div className="upload-history">
            <div className="history-header">
              <h3>已上传文件 ({uploadedFiles.length})</h3>
              <button className="refresh-btn" onClick={fetchUploadedFiles}>🔄 刷新</button>
            </div>
            
            {uploadedFiles.length === 0 ? (
              <div className="empty-history">
                <p>暂无已上传文件</p>
              </div>
            ) : (
              <div className="history-list">
                {uploadedFiles.map((file, idx) => (
                  <div key={file.name + idx} className="history-item">
                    <div className="history-item-icon">{getFileIcon(file.name)}</div>
                    <div className="history-item-info">
                      <div className="history-item-name">{file.name}</div>
                      <div className="history-item-meta">
                        <span>{formatSize(file.size)}</span>
                        <span>•</span>
                        <span>{new Date(file.uploadedAt).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="history-item-actions">
                      <button 
                        className="action-btn history-download-btn"
                        onClick={() => downloadFile(file.url, file.name)}
                      >
                        ⬇️ 下载
                      </button>
                      <button 
                        className="action-btn history-delete-btn"
                        onClick={() => deleteUploadedFile(file.name)}
                      >
                        🗑️ 删除
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default FileUpload;
