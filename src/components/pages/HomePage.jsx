import React from 'react';
import './HomePage.css';

const HomePage = () => {
  const stats = [
    { label: '总文件数', value: '1,245', icon: '📁', color: '#4a6cf7', change: '+12%' },
    { label: '总存储空间', value: '2.4 GB', icon: '💾', color: '#10b981', change: '+5%' },
    { label: '今日上传', value: '45', icon: '📤', color: '#f59e0b', change: '+8%' },
    { label: '活跃用户', value: '12', icon: '👥', color: '#8b5cf6', change: '+3%' },
  ];

  const recentActivities = [
    { user: '张三', action: '上传了文件', file: '项目报告.pdf', time: '10分钟前', icon: '📄' },
    { user: '李四', action: '创建了文件夹', file: '设计资源', time: '30分钟前', icon: '📁' },
    { user: '王五', action: '分享了文件', file: '会议记录.docx', time: '1小时前', icon: '🔗' },
    { user: '赵六', action: '删除了文件', file: '旧版本.zip', time: '2小时前', icon: '🗑️' },
    { user: '钱七', action: '更新了设置', file: '系统配置', time: '3小时前', icon: '⚙️' },
  ];

  const quickActions = [
    { label: '上传文件', icon: '📤', color: '#4a6cf7', path: 'upload' },
    { label: '新建文件夹', icon: '📁', color: '#10b981', path: 'files' },
    { label: '分享文件', icon: '🔗', color: '#f59e0b', path: 'files' },
    { label: '查看统计', icon: '📊', color: '#8b5cf6', path: 'stats' },
  ];

  return (
    <div className="home-page">
      {/* 欢迎横幅 */}
      <div className="welcome-banner">
        <div className="welcome-content">
          <h1>欢迎回来，管理员！</h1>
          <p>今天是 2024年4月22日，周一。您有 3 个待处理任务。</p>
        </div>
        <div className="welcome-actions">
          <button className="primary-btn">查看任务</button>
          <button className="secondary-btn">快速导览</button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-header">
              <div className="stat-icon" style={{ backgroundColor: stat.color + '20', color: stat.color }}>
                {stat.icon}
              </div>
              <div className="stat-change" style={{ color: stat.change.startsWith('+') ? '#10b981' : '#f56565' }}>
                {stat.change}
              </div>
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="content-grid">
        {/* 快速操作 */}
        <div className="quick-actions-card">
          <h3>快速操作</h3>
          <div className="quick-actions-grid">
            {quickActions.map((action, index) => (
              <button key={index} className="quick-action-btn" style={{ borderColor: action.color }}>
                <span className="action-icon" style={{ color: action.color }}>{action.icon}</span>
                <span className="action-label">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 最近活动 */}
        <div className="recent-activities-card">
          <div className="card-header">
            <h3>最近活动</h3>
            <button className="view-all-btn">查看全部</button>
          </div>
          <div className="activities-list">
            {recentActivities.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-icon">{activity.icon}</div>
                <div className="activity-content">
                  <div className="activity-text">
                    <span className="activity-user">{activity.user}</span>
                    <span className="activity-action">{activity.action}</span>
                    <span className="activity-file">{activity.file}</span>
                  </div>
                  <div className="activity-time">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 系统信息 */}
      <div className="system-info-card">
        <h3>系统信息</h3>
        <div className="system-info-grid">
          <div className="info-item">
            <div className="info-label">系统版本</div>
            <div className="info-value">Hermes v2.0.0</div>
          </div>
          <div className="info-item">
            <div className="info-label">最后备份</div>
            <div className="info-value">2024-04-21 23:00</div>
          </div>
          <div className="info-item">
            <div className="info-label">存储状态</div>
            <div className="info-value">
              <div className="storage-bar">
                <div className="storage-fill" style={{ width: '85%' }}></div>
              </div>
              <span>85% 已使用</span>
            </div>
          </div>
          <div className="info-item">
            <div className="info-label">系统状态</div>
            <div className="info-value status-online">● 运行正常</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;