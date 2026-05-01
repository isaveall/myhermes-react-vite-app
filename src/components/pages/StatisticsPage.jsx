import React, { useState, useEffect } from 'react';
import './StatisticsPage.css';

const StatisticsPage = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalUploads: 156,
    totalDownloads: 342,
    totalUsers: 48,
    storageUsed: 2.4,
    activeUsers: 12,
    uploadsToday: 8,
  });

  // 模拟数据
  const mockData = {
    week: {
      labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      uploads: [12, 19, 8, 15, 12, 10, 7],
      downloads: [25, 32, 18, 24, 20, 15, 10],
      users: [8, 10, 6, 9, 8, 7, 5],
    },
    month: {
      labels: ['第1周', '第2周', '第3周', '第4周'],
      uploads: [45, 52, 38, 21],
      downloads: [98, 112, 85, 47],
      users: [15, 18, 12, 8],
    },
    year: {
      labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      uploads: [120, 145, 130, 156, 140, 135, 150, 145, 140, 155, 160, 165],
      downloads: [250, 280, 265, 342, 310, 295, 320, 315, 305, 340, 350, 360],
      users: [25, 28, 26, 32, 30, 29, 31, 30, 29, 33, 34, 35],
    },
  };

  const [chartData, setChartData] = useState(mockData.week);

  useEffect(() => {
    setLoading(true);
    // 模拟API调用延迟
    setTimeout(() => {
      setChartData(mockData[timeRange]);
      setLoading(false);
    }, 300);
  }, [timeRange]);

  // 文件类型分布数据
  const fileTypeData = [
    { type: '图片', count: 45, color: '#667eea' },
    { type: '文档', count: 68, color: '#4ecdc4' },
    { type: '视频', count: 23, color: '#ff6b6b' },
    { type: '音频', count: 12, color: '#ffd166' },
    { type: '压缩包', count: 8, color: '#06d6a0' },
  ];

  // 用户活跃度数据
  const userActivityData = [
    { time: '00:00-04:00', active: 2 },
    { time: '04:00-08:00', active: 5 },
    { time: '08:00-12:00', active: 28 },
    { time: '12:00-16:00', active: 35 },
    { time: '16:00-20:00', active: 42 },
    { time: '20:00-24:00', active: 18 },
  ];

  // 热门文件
  const popularFiles = [
    { name: '项目报告.pdf', downloads: 156, size: '2.4 MB' },
    { name: '团队照片.jpg', downloads: 128, size: '4.2 MB' },
    { name: '演示视频.mp4', downloads: 98, size: '45.6 MB' },
    { name: '会议记录.docx', downloads: 87, size: '1.8 MB' },
    { name: '用户手册.pdf', downloads: 76, size: '5.6 MB' },
  ];

  // 计算文件类型百分比
  const totalFiles = fileTypeData.reduce((sum, item) => sum + item.count, 0);
  const fileTypePercentages = fileTypeData.map(item => ({
    ...item,
    percentage: Math.round((item.count / totalFiles) * 100),
  }));

  return (
    <div className="statistics-page">
      <div className="statistics-header">
        <div className="header-left">
          <h1>数据统计</h1>
          <p className="subtitle">系统使用情况和数据分析</p>
        </div>
        <div className="header-right">
          <div className="time-range-selector">
            <button
              className={`time-btn ${timeRange === 'week' ? 'active' : ''}`}
              onClick={() => setTimeRange('week')}
            >
              本周
            </button>
            <button
              className={`time-btn ${timeRange === 'month' ? 'active' : ''}`}
              onClick={() => setTimeRange('month')}
            >
              本月
            </button>
            <button
              className={`time-btn ${timeRange === 'year' ? 'active' : ''}`}
              onClick={() => setTimeRange('year')}
            >
              本年
            </button>
          </div>
          <button className="export-btn">
            <span className="btn-icon">📊</span>
            导出数据
          </button>
        </div>
      </div>

      {/* 概览卡片 */}
      <div className="overview-cards">
        <div className="stat-card">
          <div className="stat-icon upload-icon">📤</div>
          <div className="stat-content">
            <h3>总上传数</h3>
            <p className="stat-number">{stats.totalUploads}</p>
            <p className="stat-change positive">+12% 较上周</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon download-icon">⬇️</div>
          <div className="stat-content">
            <h3>总下载数</h3>
            <p className="stat-number">{stats.totalDownloads}</p>
            <p className="stat-change positive">+8% 较上周</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon user-icon">👥</div>
          <div className="stat-content">
            <h3>总用户数</h3>
            <p className="stat-number">{stats.totalUsers}</p>
            <p className="stat-change positive">+5% 较上周</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon storage-icon">💾</div>
          <div className="stat-content">
            <h3>存储使用</h3>
            <p className="stat-number">{stats.storageUsed} GB</p>
            <p className="stat-change warning">+2.3% 较上周</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon active-icon">⚡</div>
          <div className="stat-content">
            <h3>活跃用户</h3>
            <p className="stat-number">{stats.activeUsers}</p>
            <p className="stat-change positive">+3 较昨日</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon today-icon">📅</div>
          <div className="stat-content">
            <h3>今日上传</h3>
            <p className="stat-number">{stats.uploadsToday}</p>
            <p className="stat-change positive">+2 较昨日</p>
          </div>
        </div>
      </div>

      {/* 图表区域 */}
      <div className="charts-section">
        {/* 上传下载趋势图 */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>上传下载趋势</h3>
            <div className="chart-legend">
              <div className="legend-item">
                <span className="legend-color upload-color"></span>
                <span>上传</span>
              </div>
              <div className="legend-item">
                <span className="legend-color download-color"></span>
                <span>下载</span>
              </div>
            </div>
          </div>
          <div className="chart-body">
            {loading ? (
              <div className="chart-loading">
                <div className="loading-spinner"></div>
                <p>加载图表数据...</p>
              </div>
            ) : (
              <div className="bar-chart">
                {chartData.labels.map((label, index) => (
                  <div key={index} className="chart-column">
                    <div className="column-label">{label}</div>
                    <div className="column-bars">
                      <div 
                        className="bar upload-bar"
                        style={{ height: `${(chartData.uploads[index] / Math.max(...chartData.uploads)) * 100}%` }}
                        title={`上传: ${chartData.uploads[index]}`}
                      ></div>
                      <div 
                        className="bar download-bar"
                        style={{ height: `${(chartData.downloads[index] / Math.max(...chartData.downloads)) * 100}%` }}
                        title={`下载: ${chartData.downloads[index]}`}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 文件类型分布 */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>文件类型分布</h3>
          </div>
          <div className="chart-body">
            <div className="pie-chart">
              <div className="pie-chart-visual">
                <div className="pie-chart-circle">
                  {fileTypePercentages.reduce((prev, item, index) => {
                    const percentage = item.percentage;
                    const startAngle = prev;
                    const endAngle = startAngle + (percentage * 3.6);
                    
                    return (
                      <React.Fragment key={item.type}>
                        <div 
                          className="pie-segment"
                          style={{
                            backgroundColor: item.color,
                            transform: `rotate(${startAngle}deg)`,
                            clipPath: `conic-gradient(${item.color} 0deg ${percentage * 3.6}deg, transparent ${percentage * 3.6}deg)`,
                          }}
                        ></div>
                        {endAngle}
                      </React.Fragment>
                    );
                  }, 0)}
                </div>
                <div className="pie-chart-center">
                  <div className="center-text">{totalFiles}</div>
                  <div className="center-label">总文件数</div>
                </div>
              </div>
              <div className="pie-chart-legend">
                {fileTypePercentages.map(item => (
                  <div key={item.type} className="legend-item">
                    <span 
                      className="legend-color" 
                      style={{ backgroundColor: item.color }}
                    ></span>
                    <span className="legend-label">{item.type}</span>
                    <span className="legend-value">{item.count} ({item.percentage}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 用户活跃时段 */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>用户活跃时段</h3>
          </div>
          <div className="chart-body">
            <div className="line-chart">
              {userActivityData.map((item, index) => (
                <div key={index} className="line-chart-point">
                  <div className="point-label">{item.time}</div>
                  <div className="point-bar">
                    <div 
                      className="bar-fill"
                      style={{ height: `${(item.active / 50) * 100}%` }}
                      title={`活跃用户: ${item.active}`}
                    ></div>
                  </div>
                  <div className="point-value">{item.active}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 热门文件 */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>热门文件</h3>
          </div>
          <div className="chart-body">
            <div className="popular-files">
              <div className="files-header">
                <div className="header-name">文件名</div>
                <div className="header-downloads">下载次数</div>
                <div className="header-size">文件大小</div>
              </div>
              <div className="files-list">
                {popularFiles.map((file, index) => (
                  <div key={index} className="file-item">
                    <div className="file-name">
                      <span className="file-icon">
                        {file.name.endsWith('.pdf') ? '📄' : 
                         file.name.endsWith('.jpg') ? '🖼️' : 
                         file.name.endsWith('.mp4') ? '🎬' : 
                         file.name.endsWith('.docx') ? '📝' : '📄'}
                      </span>
                      <span className="name-text">{file.name}</span>
                    </div>
                    <div className="file-downloads">
                      <span className="download-count">{file.downloads}</span>
                      <span className="download-label">次</span>
                    </div>
                    <div className="file-size">{file.size}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 数据表格 */}
      <div className="data-table-section">
        <div className="section-header">
          <h3>详细数据</h3>
          <button className="refresh-btn">
            <span className="btn-icon">🔄</span>
            刷新数据
          </button>
        </div>
        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>日期</th>
                <th>上传数</th>
                <th>下载数</th>
                <th>新用户</th>
                <th>活跃用户</th>
                <th>存储增长</th>
              </tr>
            </thead>
            <tbody>
              {chartData.labels.map((label, index) => (
                <tr key={index}>
                  <td>{label}</td>
                  <td>{chartData.uploads[index]}</td>
                  <td>{chartData.downloads[index]}</td>
                  <td>{chartData.users[index]}</td>
                  <td>{Math.round(chartData.users[index] * 0.8)}</td>
                  <td>{(chartData.uploads[index] * 0.15).toFixed(1)} MB</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;