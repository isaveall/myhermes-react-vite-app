import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FileManagement.css';

const FileManagement = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [currentFolder, setCurrentFolder] = useState('所有文件');
  const [showUploadModal, setShowUploadModal] = useState(false);

  // 模拟文件夹结构
  const folders = [
    { id: 1, name: '所有文件', count: 24 },
    { id: 2, name: '图片', count: 8 },
    { id: 3, name: '文档', count: 10 },
    { id: 4, name: '视频', count: 3 },
    { id: 5, name: '音频', count: 2 },
    { id: 6, name: '压缩包', count: 1 },
  ];

  // 模拟文件类型
  const fileTypes = [
    { id: 'all', label: '所有类型' },
    { id: 'image', label: '图片' },
    { id: 'document', label: '文档' },
    { id: 'video', label: '视频' },
    { id: 'audio', label: '音频' },
    { id: 'archive', label: '压缩包' },
  ];

  // 模拟文件数据
  const mockFiles = [
    { id: 1, name: '项目报告.pdf', type: 'document', size: '2.4 MB', date: '2024-04-20', owner: '张三', url: '#' },
    { id: 2, name: '团队照片.jpg', type: 'image', size: '4.2 MB', date: '2024-04-19', owner: '李四', url: '#' },
    { id: 3, name: '演示视频.mp4', type: 'video', size: '45.6 MB', date: '2024-04-18', owner: '王五', url: '#' },
    { id: 4, name: '会议记录.docx', type: 'document', size: '1.8 MB', date: '2024-04-17', owner: '赵六', url: '#' },
    { id: 5, name: '背景音乐.mp3', type: 'audio', size: '8.7 MB', date: '2024-04-16', owner: '钱七', url: '#' },
    { id: 6, name: '项目代码.zip', type: 'archive', size: '12.3 MB', date: '2024-04-15', owner: '孙八', url: '#' },
    { id: 7, name: '设计稿.png', type: 'image', size: '3.1 MB', date: '2024-04-14', owner: '周九', url: '#' },
    { id: 8, name: '用户手册.pdf', type: 'document', size: '5.6 MB', date: '2024-04-13', owner: '吴十', url: '#' },
  ];

  useEffect(() => {
    // 模拟API调用
    const fetchFiles = async () => {
      setLoading(true);
      try {
        // 实际项目中这里应该调用API
        // const response = await axios.get('http://localhost:3001/api/files');
        // setFiles(response.data);
        
        // 使用模拟数据
        await new Promise(resolve => setTimeout(resolve, 500));
        setFiles(mockFiles);
      } catch (error) {
        console.error('获取文件列表失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  // 获取文件图标
  const getFileIcon = (type) => {
    switch (type) {
      case 'image': return '🖼️';
      case 'document': return '📄';
      case 'video': return '🎬';
      case 'audio': return '🎵';
      case 'archive': return '📦';
      default: return '📄';
    }
  };

  // 获取文件类型标签
  const getFileTypeLabel = (type) => {
    switch (type) {
      case 'image': return '图片';
      case 'document': return '文档';
      case 'video': return '视频';
      case 'audio': return '音频';
      case 'archive': return '压缩包';
      default: return '文件';
    }
  };

  // 处理文件选择
  const handleFileSelect = (fileId) => {
    if (selectedFiles.includes(fileId)) {
      setSelectedFiles(selectedFiles.filter(id => id !== fileId));
    } else {
      setSelectedFiles([...selectedFiles, fileId]);
    }
  };

  // 处理全选
  const handleSelectAll = () => {
    if (selectedFiles.length === filteredFiles.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(filteredFiles.map(file => file.id));
    }
  };

  // 删除选中的文件
  const handleDeleteSelected = () => {
    if (selectedFiles.length === 0) {
      alert('请先选择要删除的文件');
      return;
    }

    if (window.confirm(`确定要删除选中的 ${selectedFiles.length} 个文件吗？`)) {
      setFiles(files.filter(file => !selectedFiles.includes(file.id)));
      setSelectedFiles([]);
    }
  };

  // 下载选中的文件
  const handleDownloadSelected = () => {
    if (selectedFiles.length === 0) {
      alert('请先选择要下载的文件');
      return;
    }

    alert(`开始下载选中的 ${selectedFiles.length} 个文件...`);
    // 实际项目中这里应该实现批量下载逻辑
  };

  // 分享选中的文件
  const handleShareSelected = () => {
    if (selectedFiles.length === 0) {
      alert('请先选择要分享的文件');
      return;
    }

    alert(`分享选中的 ${selectedFiles.length} 个文件...`);
    // 实际项目中这里应该实现分享逻辑
  };

  // 预览单个文件
  const handlePreviewFile = (file) => {
    alert(`预览文件: ${file.name}`);
    // 实际项目中这里应该打开预览模态框
  };

  // 下载单个文件
  const handleDownloadFile = (file) => {
    alert(`下载文件: ${file.name}`);
    // 实际项目中这里应该触发文件下载
  };

  // 分享单个文件
  const handleShareFile = (file) => {
    alert(`分享文件: ${file.name}`);
    // 实际项目中这里应该打开分享模态框
  };

  // 删除单个文件
  const handleDeleteFile = (file) => {
    if (window.confirm(`确定要删除文件 "${file.name}" 吗？`)) {
      setFiles(files.filter(f => f.id !== file.id));
    }
  };

  // 过滤和排序文件
  const filteredFiles = files
    .filter(file => {
      // 搜索过滤
      if (searchTerm && !file.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      // 类型过滤
      if (filterType !== 'all' && file.type !== filterType) {
        return false;
      }
      // 文件夹过滤（简化版）
      if (currentFolder !== '所有文件' && file.type !== currentFolder.toLowerCase()) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      // 排序
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'size':
          const sizeA = parseFloat(a.size);
          const sizeB = parseFloat(b.size);
          return sizeB - sizeA;
        case 'date':
        default:
          return new Date(b.date) - new Date(a.date);
      }
    });

  // 计算统计信息
  const stats = {
    totalFiles: files.length,
    totalSize: files.reduce((total, file) => {
      const size = parseFloat(file.size);
      return total + size;
    }, 0),
    imageCount: files.filter(f => f.type === 'image').length,
    documentCount: files.filter(f => f.type === 'document').length,
  };

  return (
    <div className="file-management">
      <div className="file-management-header">
        <div className="header-left">
          <h1>文件管理</h1>
          <p className="subtitle">管理您的所有文件和文件夹</p>
        </div>
        <div className="header-right">
          <button 
            className="upload-btn"
            onClick={() => setShowUploadModal(true)}
          >
            <span className="btn-icon">📤</span>
            上传文件
          </button>
        </div>
      </div>

      <div className="file-management-content">
        {/* 文件夹和统计信息区域 */}
        <div className="folders-stats-section">
          {/* 文件夹导航 */}
          <div className="folders-section">
            <h3>文件夹</h3>
            <ul className="folder-list">
              {folders.map(folder => (
                <li 
                  key={folder.id}
                  className={`folder-item ${currentFolder === folder.name ? 'active' : ''}`}
                  onClick={() => setCurrentFolder(folder.name)}
                >
                  <span className="folder-icon">📁</span>
                  <span className="folder-name">{folder.name}</span>
                  <span className="file-count">{folder.count}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 统计信息 */}
          <div className="stats-section">
            <h3>统计信息</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📄</div>
                <div className="stat-content">
                  <h4>总文件数</h4>
                  <p className="stat-number">{stats.totalFiles}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💾</div>
                <div className="stat-content">
                  <h4>总大小</h4>
                  <p className="stat-number">{stats.totalSize.toFixed(1)} MB</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🖼️</div>
                <div className="stat-content">
                  <h4>图片</h4>
                  <p className="stat-number">{stats.imageCount}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📝</div>
                <div className="stat-content">
                  <h4>文档</h4>
                  <p className="stat-number">{stats.documentCount}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 文件操作区域 */}
        <div className="file-operations-section">
          {/* 工具栏 */}
          <div className="toolbar">
            <div className="toolbar-left">
              <div className="search-box">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="搜索文件..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              
              <select 
                className="filter-select"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                {fileTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.label}
                  </option>
                ))}
              </select>
              
              <select 
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="date">按日期排序</option>
                <option value="name">按名称排序</option>
                <option value="size">按大小排序</option>
              </select>
            </div>
            
            <div className="toolbar-right">
              <button 
                className="toolbar-btn"
                onClick={handleSelectAll}
              >
                {selectedFiles.length === filteredFiles.length ? '取消全选' : '全选'}
              </button>
              <button 
                className="toolbar-btn download-btn"
                onClick={handleDownloadSelected}
                disabled={selectedFiles.length === 0}
              >
                <span className="btn-icon">⬇️</span>
                下载
              </button>
              <button 
                className="toolbar-btn share-btn"
                onClick={handleShareSelected}
                disabled={selectedFiles.length === 0}
              >
                <span className="btn-icon">↗️</span>
                分享
              </button>
              <button 
                className="toolbar-btn delete-btn"
                onClick={handleDeleteSelected}
                disabled={selectedFiles.length === 0}
              >
                <span className="btn-icon">🗑️</span>
                删除
              </button>
            </div>
          </div>

          {/* 文件列表 */}
          {loading ? (
            <div className="loading">
              <div className="loading-spinner"></div>
              <p>加载文件中...</p>
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📁</div>
              <h3>没有找到文件</h3>
              <p>尝试调整搜索条件或上传新文件</p>
              <button 
                className="upload-btn"
                onClick={() => setShowUploadModal(true)}
              >
                上传文件
              </button>
            </div>
          ) : (
            <div className="file-list">
              <div className="file-list-header">
                <div className="header-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedFiles.length === filteredFiles.length && filteredFiles.length > 0}
                    onChange={handleSelectAll}
                  />
                </div>
                <div className="header-name">文件名</div>
                <div className="header-type">类型</div>
                <div className="header-size">大小</div>
                <div className="header-date">修改日期</div>
                <div className="header-owner">所有者</div>
                <div className="header-actions">操作</div>
              </div>
              
              <div className="file-list-body">
                {filteredFiles.map(file => (
                  <div 
                    key={file.id} 
                    className={`file-item ${selectedFiles.includes(file.id) ? 'selected' : ''}`}
                  >
                    <div className="file-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedFiles.includes(file.id)}
                        onChange={() => handleFileSelect(file.id)}
                      />
                    </div>
                    <div className="file-name">
                      <span className="file-icon">{getFileIcon(file.type)}</span>
                      <span className="name-text">{file.name}</span>
                    </div>
                    <div className="file-type">
                      <span className="type-badge">{getFileTypeLabel(file.type)}</span>
                    </div>
                    <div className="file-size">{file.size}</div>
                    <div className="file-date">{file.date}</div>
                    <div className="file-owner">{file.owner}</div>
                    <div className="file-actions">
                      <button 
                        className="action-btn preview-btn" 
                        title="预览"
                        onClick={() => handlePreviewFile(file)}
                      >
                        👁️
                      </button>
                      <button 
                        className="action-btn download-btn" 
                        title="下载"
                        onClick={() => handleDownloadFile(file)}
                      >
                        ⬇️
                      </button>
                      <button 
                        className="action-btn share-btn" 
                        title="分享"
                        onClick={() => handleShareFile(file)}
                      >
                        ↗️
                      </button>
                      <button 
                        className="action-btn delete-btn" 
                        title="删除"
                        onClick={() => handleDeleteFile(file)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 分页 */}
          {filteredFiles.length > 0 && (
            <div className="pagination">
              <button className="pagination-btn" disabled>
                ← 上一页
              </button>
              <span className="pagination-info">
                第 1 页，共 1 页
              </span>
              <button className="pagination-btn" disabled>
                下一页 →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 上传模态框 */}
      {showUploadModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>上传文件</h3>
              <button 
                className="modal-close"
                onClick={() => setShowUploadModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="upload-zone">
                <div className="upload-icon">📤</div>
                <p>拖放文件到此处，或点击选择文件</p>
                <p className="upload-hint">支持所有类型文件，最大 10MB</p>
                <button className="select-file-btn">
                  选择文件
                </button>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="modal-btn cancel-btn"
                onClick={() => setShowUploadModal(false)}
              >
                取消
              </button>
              <button className="modal-btn upload-btn">
                开始上传
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileManagement;