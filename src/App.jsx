import React, { Suspense, lazy } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout.jsx';
import './App.css';

// 使用懒加载导入页面组件
const HomePage = lazy(() => import('./components/pages/HomePage.jsx'));
const AboutPage = lazy(() => import('./components/pages/AboutPage.jsx'));
const FileUpload = lazy(() => import('./components/FileUpload.jsx'));
const ContactPage = lazy(() => import('./components/pages/ContactPage.jsx'));
const SettingsPage = lazy(() => import('./components/pages/SettingsPage.jsx'));
const LoginPage = lazy(() => import('./components/pages/LoginPage.jsx'));
const UserProfile = lazy(() => import('./components/UserProfile.jsx'));
const FileManagement = lazy(() => import('./components/pages/FileManagement.jsx'));
const StatisticsPage = lazy(() => import('./components/pages/StatisticsPage.jsx'));
const HelpCenter = lazy(() => import('./components/pages/HelpCenter.jsx'));

// 加载中组件
const LoadingFallback = () => (
  <div className="loading-container">
    <div className="loading-spinner"></div>
    <p>加载中...</p>
  </div>
);

// 受保护的路由组件
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingFallback />;
  }

  if (!isAuthenticated) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <LoginPage />
      </Suspense>
    );
  }

  return children;
};

// 主应用组件
function AppContent() {
  const { user } = useAuth();

  const renderContent = (activeMenu) => {
    switch (activeMenu) {
      case 'home':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <HomePage />
          </Suspense>
        );
      case 'about':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <AboutPage />
          </Suspense>
        );
      case 'upload':
        return (
          <div className="upload-page" style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%' }}>
            <div className="page-header">
              <h1>文件上传</h1>
              <p className="page-subtitle">安全、快速、便捷的文件上传和管理</p>
              {user && (
                <div className="user-welcome">
                  欢迎回来，<strong>{user.name}</strong>！
                </div>
              )}
            </div>
            <Suspense fallback={<LoadingFallback />}>
              <FileUpload />
            </Suspense>
          </div>
        );
      case 'contact':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <ContactPage />
          </Suspense>
        );
      case 'settings':
        return (
          <div className="settings-page-wrapper" style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%' }}>
            <div className="page-header">
              <h1>系统设置</h1>
              <p className="page-subtitle">管理系统配置和个性化选项</p>
            </div>
            <Suspense fallback={<LoadingFallback />}>
              <SettingsPage />
            </Suspense>
          </div>
        );
      case 'profile':
        return (
          <div className="profile-page" style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%' }}>
            <div className="page-header">
              <h1>个人中心</h1>
              <p className="page-subtitle">管理您的个人信息和账户设置</p>
            </div>
            <Suspense fallback={<LoadingFallback />}>
              <UserProfile />
            </Suspense>
          </div>
        );
      case 'files':
        return (
          <div className="files-page" style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%' }}>
            <div className="page-header">
              <h1>文件管理</h1>
              <p className="page-subtitle">管理您的所有文件和文件夹</p>
            </div>
            <Suspense fallback={<LoadingFallback />}>
              <FileManagement />
            </Suspense>
          </div>
        );
      case 'stats':
        return (
          <div className="stats-page" style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%' }}>
            <div className="page-header">
              <h1>数据统计</h1>
              <p className="page-subtitle">查看系统使用情况和数据分析</p>
            </div>
            <Suspense fallback={<LoadingFallback />}>
              <StatisticsPage />
            </Suspense>
          </div>
        );
      case 'help':
        return (
          <div className="help-page" style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%' }}>
            <div className="page-header">
              <h1>帮助中心</h1>
              <p className="page-subtitle">获取使用帮助和文档</p>
            </div>
            <Suspense fallback={<LoadingFallback />}>
              <HelpCenter />
            </Suspense>
          </div>
        );
      default:
        return (
          <Suspense fallback={<LoadingFallback />}>
            <HomePage />
          </Suspense>
        );
    }
  };

  return (
    <ProtectedRoute>
      <Layout>
        {({ activeMenu }) => (
          <Suspense fallback={<LoadingFallback />}>
            {renderContent(activeMenu)}
          </Suspense>
        )}
      </Layout>
    </ProtectedRoute>
  );
}

// 应用入口
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;