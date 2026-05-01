import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

const Layout = ({ children }) => {
  const [activeMenu, setActiveMenu] = useState('home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const { user, logout } = useAuth();

  const menuItems = [
    { id: 'home', label: '首页', icon: '🏠' },
    { id: 'about', label: '关于我们', icon: 'ℹ️' },
    { id: 'upload', label: '文件上传', icon: '📤' },
    { id: 'contact', label: '联系我们', icon: '📞' },
    { id: 'profile', label: '个人中心', icon: '👤' },
    { id: 'settings', label: '系统设置', icon: '⚙️' },
    { id: 'files', label: '文件管理', icon: '📁' },
    { id: 'stats', label: '数据统计', icon: '📊' },
    { id: 'help', label: '帮助中心', icon: '❓' },
  ];

  const handleMenuClick = (menuId) => {
    setActiveMenu(menuId);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.log(`全屏请求失败: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  // 监听全屏变化
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <div className="layout-container">
      {/* 侧边栏 */}
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          {!sidebarCollapsed && (
            <>
              <div className="logo">
                <span className="logo-icon">📁</span>
                <span className="logo-text">Hermes</span>
              </div>
              <div className="app-subtitle">文件管理系统</div>
            </>
          )}
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            {sidebarCollapsed ? '→' : '←'}
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul className="menu-list">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  className={`menu-item ${activeMenu === item.id ? 'active' : ''}`}
                  onClick={() => handleMenuClick(item.id)}
                  title={sidebarCollapsed ? item.label : ''}
                >
                  <span className="menu-icon">{item.icon}</span>
                  {!sidebarCollapsed && (
                    <span className="menu-label">{item.label}</span>
                  )}
                  {activeMenu === item.id && !sidebarCollapsed && (
                    <span className="active-indicator"></span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {!sidebarCollapsed && (
          <div className="sidebar-footer">
            <div className="user-info">
              <div className="user-avatar">
                {user ? user.name?.charAt(0) || 'U' : '👤'}
              </div>
              <div className="user-details">
                <div className="user-name">{user ? user.name : '访客'}</div>
                <div className="user-role">{user ? (user.role === 'admin' ? '管理员' : '普通用户') : '请登录'}</div>
              </div>
            </div>
            <div className="system-status">
              <div className="status-item">
                <span className="status-label">系统状态:</span>
                <span className="status-value online">在线</span>
              </div>
              <div className="status-item">
                <span className="status-label">存储空间:</span>
                <span className="status-value">85%</span>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* 主内容区 */}
      <main className="main-content">
        <header className="content-header">
          <div className="breadcrumb">
            <span className="breadcrumb-item">Hermes</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item active">{menuItems.find(item => item.id === activeMenu)?.label || '首页'}</span>
          </div>
          <div className="header-actions">
            <button className="header-btn" title="通知">
              <span className="btn-icon">🔔</span>
              <span className="btn-badge">3</span>
            </button>
            <button className="header-btn" title="搜索">
              <span className="btn-icon">🔍</span>
            </button>
            <button className="header-btn" title="全屏" onClick={toggleFullscreen}>
              <span className="btn-icon">{isFullscreen ? '⛶' : '⛶'}</span>
            </button>
          </div>
        </header>

        <div className="content-area">
          {typeof children === 'function' ? children({ activeMenu }) : children}
        </div>

        <footer className="content-footer">
          <div className="footer-info">
            <span>© 2024 Hermes 文件管理系统</span>
            <span className="footer-separator">|</span>
            <span>版本 2.0.0</span>
            <span className="footer-separator">|</span>
            <span>最后更新: 2024-04-22</span>
          </div>
          <div className="footer-stats">
            <span>在线用户: 12</span>
            <span className="footer-separator">|</span>
            <span>今日上传: 45 文件</span>
            <span className="footer-separator">|</span>
            <span>总存储: 2.4 GB</span>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Layout;