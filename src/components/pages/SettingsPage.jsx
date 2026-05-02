import React, { useState } from 'react';
import './SettingsPage.css';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    // 账户设置
    username: 'admin',
    email: 'admin@hermes.com',
    language: 'zh-CN',
    timezone: 'Asia/Shanghai',
    
    // 安全设置
    twoFactorAuth: true,
    loginNotifications: true,
    sessionTimeout: 30,
    
    // 上传设置
    maxFileSize: 100, // MB
    autoCompressImages: true,
    keepOriginalFiles: false,
    
    // 通知设置
    emailNotifications: {
      uploads: true,
      shares: true,
      comments: false,
      system: true
    },
    pushNotifications: true,
    
    // 外观设置
    theme: 'light',
    fontSize: 'medium',
    compactMode: false,
    
    // 存储设置
    storageQuota: 50, // GB
    autoCleanup: true,
    cleanupDays: 30,
    
    // 协议配置
    ftpConfig: {
      enabled: true,
      host: '',
      port: 21,
      username: '',
      password: '',
      anonymousLogin: false,
      mode: 'passive', // 'active' or 'passive'
      tlsSsl: 'none' // 'none', 'explicit', 'implicit'
    },
    sftpConfig: {
      enabled: false,
      host: '',
      port: 22,
      username: '',
      password: '',
      privateKey: '',
      useKeyAuth: false
    },
    webdavConfig: {
      enabled: false,
      url: '',
      username: '',
      password: '',
      basePath: '/'
    }
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const languages = [
    { value: 'zh-CN', label: '简体中文' },
    { value: 'zh-TW', label: '繁体中文' },
    { value: 'en-US', label: 'English' },
    { value: 'ja-JP', label: '日本語' },
    { value: 'ko-KR', label: '한국어' },
  ];

  const timezones = [
    { value: 'Asia/Shanghai', label: '中国标准时间 (UTC+8)' },
    { value: 'Asia/Tokyo', label: '日本时间 (UTC+9)' },
    { value: 'America/New_York', label: '美国东部时间 (UTC-5)' },
    { value: 'Europe/London', label: '格林威治标准时间 (UTC+0)' },
  ];

  const themes = [
    { value: 'light', label: '浅色主题', icon: '☀️' },
    { value: 'dark', label: '深色主题', icon: '🌙' },
    { value: 'auto', label: '自动切换', icon: '🔄' },
  ];

  const handleChange = (category, field, value) => {
    if (category === 'emailNotifications') {
      setSettings(prev => ({
        ...prev,
        emailNotifications: {
          ...prev.emailNotifications,
          [field]: value
        }
      }));
    } else if (category === 'ftpConfig') {
      setSettings(prev => ({
        ...prev,
        ftpConfig: {
          ...prev.ftpConfig,
          [field]: value
        }
      }));
    } else if (category === 'sftpConfig') {
      setSettings(prev => ({
        ...prev,
        sftpConfig: {
          ...prev.sftpConfig,
          [field]: value
        }
      }));
    } else if (category === 'webdavConfig') {
      setSettings(prev => ({
        ...prev,
        webdavConfig: {
          ...prev.webdavConfig,
          [field]: value
        }
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // 模拟API保存
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSaving(false);
    setSaveMessage('设置已保存成功！');
    
    // 3秒后清除消息
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleReset = () => {
    if (window.confirm('确定要重置所有设置为默认值吗？')) {
      setSettings({
        username: 'admin',
        email: 'admin@hermes.com',
        language: 'zh-CN',
        timezone: 'Asia/Shanghai',
        twoFactorAuth: true,
        loginNotifications: true,
        sessionTimeout: 30,
        maxFileSize: 100,
        autoCompressImages: true,
        keepOriginalFiles: false,
        emailNotifications: {
          uploads: true,
          shares: true,
          comments: false,
          system: true
        },
        pushNotifications: true,
        theme: 'light',
        fontSize: 'medium',
        compactMode: false,
        storageQuota: 50,
        autoCleanup: true,
        cleanupDays: 30,
        ftpConfig: {
          enabled: true,
          host: '',
          port: 21,
          username: '',
          password: '',
          anonymousLogin: false,
          mode: 'passive',
          tlsSsl: 'none'
        },
        sftpConfig: {
          enabled: false,
          host: '',
          port: 22,
          username: '',
          password: '',
          privateKey: '',
          useKeyAuth: false
        },
        webdavConfig: {
          enabled: false,
          url: '',
          username: '',
          password: '',
          basePath: '/'
        }
      });
      setSaveMessage('设置已重置为默认值！');
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <div className="header-left">
          <h1>系统设置</h1>
          <p className="subtitle">自定义您的 Hermes 文件管理系统体验</p>
        </div>
        <div className="header-right">
          <div className="profile-actions">
            <button 
              className="save-btn"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? '保存中...' : '保存设置'}
            </button>
            <button 
              className="reset-btn"
              onClick={handleReset}
            >
              重置设置
            </button>
          </div>
        </div>
      </div>

      {saveMessage && (
        <div className={`message ${saveMessage.includes('成功') ? 'success' : 'error'}`}>
          {saveMessage}
        </div>
      )}

      <div className="settings-content">
        {/* 账户设置 */}
        <div className="settings-section">
          <h2>账户设置</h2>
          <div className="settings-grid">
            <div className="setting-item">
              <span className="detail-label">用户名：</span>
              <input
                type="text"
                value={settings.username}
                onChange={(e) => handleChange('account', 'username', e.target.value)}
                className="edit-input"
                placeholder="请输入用户名"
              />
            </div>
            
            <div className="setting-item">
              <span className="detail-label">邮箱地址：</span>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => handleChange('account', 'email', e.target.value)}
                className="edit-input"
                placeholder="请输入邮箱地址"
              />
            </div>
            
            <div className="setting-item">
              <span className="detail-label">界面语言：</span>
              <select
                value={settings.language}
                onChange={(e) => handleChange('account', 'language', e.target.value)}
                className="edit-input"
              >
                {languages.map(lang => (
                  <option key={lang.value} value={lang.value}>{lang.label}</option>
                ))}
              </select>
            </div>
            
            <div className="setting-item">
              <span className="detail-label">时区设置：</span>
              <select
                value={settings.timezone}
                onChange={(e) => handleChange('account', 'timezone', e.target.value)}
                className="edit-input"
              >
                {timezones.map(tz => (
                  <option key={tz.value} value={tz.value}>{tz.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 安全设置 */}
        <div className="settings-section">
          <h2>安全设置</h2>
          <div className="settings-grid">
            <div className="setting-item toggle">
              <div className="toggle-label">
                <span className="detail-label">双重认证 (2FA)：</span>
                <p className="setting-description">启用后登录时需要验证码</p>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={settings.twoFactorAuth}
                  onChange={(e) => handleChange('security', 'twoFactorAuth', e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
            
            <div className="setting-item toggle">
              <div className="toggle-label">
                <span className="detail-label">登录通知：</span>
                <p className="setting-description">新设备登录时发送邮件通知</p>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={settings.loginNotifications}
                  onChange={(e) => handleChange('security', 'loginNotifications', e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
            
            <div className="setting-item">
              <span className="detail-label">会话超时：</span>
              <div className="range-input">
                <input
                  type="range"
                  min="5"
                  max="120"
                  step="5"
                  value={settings.sessionTimeout}
                  onChange={(e) => handleChange('security', 'sessionTimeout', parseInt(e.target.value))}
                />
                <span className="range-value">{settings.sessionTimeout} 分钟</span>
              </div>
            </div>
          </div>
        </div>

        {/* 上传设置 */}
        <div className="settings-section">
          <h2>上传设置</h2>
          <div className="settings-grid">
            <div className="setting-item">
              <span className="detail-label">最大文件大小：</span>
              <div className="range-input">
                <input
                  type="range"
                  min="10"
                  max="1024"
                  step="10"
                  value={settings.maxFileSize}
                  onChange={(e) => handleChange('upload', 'maxFileSize', parseInt(e.target.value))}
                />
                <span className="range-value">{settings.maxFileSize} MB</span>
              </div>
            </div>
            
            <div className="setting-item toggle">
              <div className="toggle-label">
                <span className="detail-label">自动压缩图片：</span>
                <p className="setting-description">上传时自动优化图片大小</p>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={settings.autoCompressImages}
                  onChange={(e) => handleChange('upload', 'autoCompressImages', e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
            
            <div className="setting-item toggle">
              <div className="toggle-label">
                <span className="detail-label">保留原始文件：</span>
                <p className="setting-description">压缩后保留原始文件副本</p>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={settings.keepOriginalFiles}
                  onChange={(e) => handleChange('upload', 'keepOriginalFiles', e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* 通知设置 */}
        <div className="settings-section">
          <h2>通知设置</h2>
          <div className="settings-grid">
            <div className="setting-item">
              <span className="detail-label">邮件通知：</span>
              <p className="setting-description">通过邮件接收系统通知</p>
              <div className="notification-options">
                {Object.entries(settings.emailNotifications).map(([key, value]) => (
                  <label key={key} className="notification-option">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => handleChange('emailNotifications', key, e.target.checked)}
                    />
                    <span>
                      {key === 'uploads' && '文件上传'}
                      {key === 'shares' && '文件分享'}
                      {key === 'comments' && '评论通知'}
                      {key === 'system' && '系统通知'}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="setting-item toggle">
              <div className="toggle-label">
                <span className="detail-label">推送通知：</span>
                <p className="setting-description">在浏览器中显示桌面通知</p>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={settings.pushNotifications}
                  onChange={(e) => handleChange('notifications', 'pushNotifications', e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* 外观设置 */}
        <div className="settings-section">
          <h2>外观设置</h2>
          <div className="settings-grid">
            <div className="setting-item">
              <span className="detail-label">主题设置：</span>
              <div className="theme-options">
                {themes.map(theme => (
                  <label key={theme.value} className="theme-option">
                    <input
                      type="radio"
                      name="theme"
                      value={theme.value}
                      checked={settings.theme === theme.value}
                      onChange={(e) => handleChange('appearance', 'theme', e.target.value)}
                    />
                    <div className="theme-preview">
                      <span className="theme-icon">{theme.icon}</span>
                      <span className="theme-label">{theme.label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="setting-item">
              <span className="detail-label">字体大小：</span>
              <div className="font-size-options">
                {['small', 'medium', 'large'].map(size => (
                  <label key={size} className="font-size-option">
                    <input
                      type="radio"
                      name="fontSize"
                      value={size}
                      checked={settings.fontSize === size}
                      onChange={(e) => handleChange('appearance', 'fontSize', e.target.value)}
                    />
                    <span className={`font-size-label ${size}`}>
                      {size === 'small' && '小'}
                      {size === 'medium' && '中'}
                      {size === 'large' && '大'}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="setting-item toggle">
              <div className="toggle-label">
                <span className="detail-label">紧凑模式：</span>
                <p className="setting-description">减少界面元素间距</p>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={settings.compactMode}
                  onChange={(e) => handleChange('appearance', 'compactMode', e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* 存储设置 */}
        <div className="settings-section">
          <h2>存储设置</h2>
          <div className="settings-grid">
            <div className="setting-item">
              <span className="detail-label">存储配额：</span>
              <div className="range-input">
                <input
                  type="range"
                  min="5"
                  max="1000"
                  step="5"
                  value={settings.storageQuota}
                  onChange={(e) => handleChange('storage', 'storageQuota', parseInt(e.target.value))}
                />
                <span className="range-value">{settings.storageQuota} GB</span>
              </div>
            </div>
            
            <div className="setting-item toggle">
              <div className="toggle-label">
                <span className="detail-label">自动清理：</span>
                <p className="setting-description">自动删除过期文件</p>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={settings.autoCleanup}
                  onChange={(e) => handleChange('storage', 'autoCleanup', e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
            
            {settings.autoCleanup && (
              <div className="setting-item">
                <span className="detail-label">清理期限：</span>
                <select
                  value={settings.cleanupDays}
                  onChange={(e) => handleChange('storage', 'cleanupDays', parseInt(e.target.value))}
                  className="edit-input"
                >
                  <option value="7">7天</option>
                  <option value="30">30天</option>
                  <option value="90">90天</option>
                  <option value="180">180天</option>
                  <option value="365">365天</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* 高级设置 */}
        <div className="settings-section">
          <h2>高级设置</h2>
          <div className="settings-grid">
            <div className="setting-item">
              <span className="detail-label">API 访问密钥：</span>
              <div className="api-key">
                <code>sk_hermes_****************</code>
                <button className="copy-btn">复制</button>
                <button className="regenerate-btn">重新生成</button>
              </div>
            </div>
            
            <div className="setting-item">
              <span className="detail-label">数据导出：</span>
              <button className="export-btn">导出所有数据</button>
              <p className="setting-description">导出您的所有文件和设置</p>
            </div>
            
            <div className="setting-item">
              <span className="detail-label">账户删除：</span>
              <button className="delete-btn">删除账户</button>
              <p className="setting-description warning">此操作不可撤销，请谨慎操作</p>
            </div>
          </div>
        </div>

        {/* 协议配置 */}
        <div className="settings-section">
          <h2>协议配置</h2>
          <div className="settings-grid">
            {/* FTP配置 */}
            <div className="setting-item toggle">
              <div className="toggle-label">
                <span className="detail-label">FTP：</span>
                <p className="setting-description">启用FTP文件传输协议</p>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={settings.ftpConfig.enabled}
                  onChange={(e) => handleChange('ftpConfig', 'enabled', e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
            
            {settings.ftpConfig.enabled && (
              <>
                <div className="setting-item">
                  <span className="detail-label">主机地址：</span>
                  <input
                    type="text"
                    value={settings.ftpConfig.host}
                    onChange={(e) => handleChange('ftpConfig', 'host', e.target.value)}
                    className="edit-input"
                    placeholder="ftp.example.com"
                  />
                </div>
                
                <div className="setting-item">
                  <span className="detail-label">端口：</span>
                  <input
                    type="number"
                    value={settings.ftpConfig.port}
                    onChange={(e) => handleChange('ftpConfig', 'port', parseInt(e.target.value))}
                    className="edit-input"
                    min="1"
                    max="65535"
                  />
                </div>
                
                <div className="setting-item">
                  <span className="detail-label">用户名：</span>
                  <input
                    type="text"
                    value={settings.ftpConfig.username}
                    onChange={(e) => handleChange('ftpConfig', 'username', e.target.value)}
                    className="edit-input"
                    placeholder="用户名"
                  />
                </div>
                
                <div className="setting-item">
                  <span className="detail-label">密码：</span>
                  <input
                    type="password"
                    value={settings.ftpConfig.password}
                    onChange={(e) => handleChange('ftpConfig', 'password', e.target.value)}
                    className="edit-input"
                    placeholder="密码"
                  />
                </div>
                
                <div className="setting-item toggle">
                  <div className="toggle-label">
                    <span className="detail-label">匿名登录：</span>
                    <p className="setting-description">允许匿名用户登录</p>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={settings.ftpConfig.anonymousLogin}
                      onChange={(e) => handleChange('ftpConfig', 'anonymousLogin', e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
                
                <div className="setting-item">
                  <span className="detail-label">传输模式：</span>
                  <select
                    value={settings.ftpConfig.mode}
                    onChange={(e) => handleChange('ftpConfig', 'mode', e.target.value)}
                    className="edit-input"
                  >
                    <option value="passive">被动模式 (Passive)</option>
                    <option value="active">主动模式 (Active)</option>
                  </select>
                </div>
                
                <div className="setting-item">
                  <span className="detail-label">TLS/SSL：</span>
                  <select
                    value={settings.ftpConfig.tlsSsl}
                    onChange={(e) => handleChange('ftpConfig', 'tlsSsl', e.target.value)}
                    className="edit-input"
                  >
                    <option value="none">无 (None)</option>
                    <option value="explicit">显式 FTPS (Explicit SFTP)</option>
                    <option value="implicit">隐式 FTPS (Implicit SFTP)</option>
                  </select>
                </div>
              </>
            )}
            
            {/* SFTP配置 */}
            <div className="setting-item toggle">
              <div className="toggle-label">
                <span className="detail-label">SFTP：</span>
                <p className="setting-description">启用SSH文件传输协议</p>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={settings.sftpConfig.enabled}
                  onChange={(e) => handleChange('sftpConfig', 'enabled', e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
            
            {settings.sftpConfig.enabled && (
              <>
                <div className="setting-item">
                  <span className="detail-label">主机地址：</span>
                  <input
                    type="text"
                    value={settings.sftpConfig.host}
                    onChange={(e) => handleChange('sftpConfig', 'host', e.target.value)}
                    className="edit-input"
                    placeholder="sftp.example.com"
                  />
                </div>
                
                <div className="setting-item">
                  <span className="detail-label">端口：</span>
                  <input
                    type="number"
                    value={settings.sftpConfig.port}
                    onChange={(e) => handleChange('sftpConfig', 'port', parseInt(e.target.value))}
                    className="edit-input"
                    min="1"
                    max="65535"
                  />
                </div>
                
                <div className="setting-item">
                  <span className="detail-label">用户名：</span>
                  <input
                    type="text"
                    value={settings.sftpConfig.username}
                    onChange={(e) => handleChange('sftpConfig', 'username', e.target.value)}
                    className="edit-input"
                    placeholder="用户名"
                  />
                </div>
                
                <div className="setting-item toggle">
                  <div className="toggle-label">
                    <span className="detail-label">密钥认证：</span>
                    <p className="setting-description">使用SSH密钥进行认证</p>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={settings.sftpConfig.useKeyAuth}
                      onChange={(e) => handleChange('sftpConfig', 'useKeyAuth', e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
                
                {settings.sftpConfig.useKeyAuth ? (
                  <div className="setting-item">
                    <span className="detail-label">私钥内容：</span>
                    <textarea
                      value={settings.sftpConfig.privateKey}
                      onChange={(e) => handleChange('sftpConfig', 'privateKey', e.target.value)}
                      className="edit-input"
                      placeholder="-----BEGIN RSA PRIVATE KEY-----"
                      rows="4"
                    />
                  </div>
                ) : (
                  <div className="setting-item">
                    <span className="detail-label">密码：</span>
                    <input
                      type="password"
                      value={settings.sftpConfig.password}
                      onChange={(e) => handleChange('sftpConfig', 'password', e.target.value)}
                      className="edit-input"
                      placeholder="密码"
                    />
                  </div>
                )}
              </>
            )}
            
            {/* WebDAV配置 */}
            <div className="setting-item toggle">
              <div className="toggle-label">
                <span className="detail-label">WebDAV：</span>
                <p className="setting-description">启用WebDAV文件共享协议</p>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={settings.webdavConfig.enabled}
                  onChange={(e) => handleChange('webdavConfig', 'enabled', e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
            
            {settings.webdavConfig.enabled && (
              <>
                <div className="setting-item">
                  <span className="detail-label">服务器URL：</span>
                  <input
                    type="url"
                    value={settings.webdavConfig.url}
                    onChange={(e) => handleChange('webdavConfig', 'url', e.target.value)}
                    className="edit-input"
                    placeholder="https://webdav.example.com"
                  />
                </div>
                
                <div className="setting-item">
                  <span className="detail-label">用户名：</span>
                  <input
                    type="text"
                    value={settings.webdavConfig.username}
                    onChange={(e) => handleChange('webdavConfig', 'username', e.target.value)}
                    className="edit-input"
                    placeholder="用户名"
                  />
                </div>
                
                <div className="setting-item">
                  <span className="detail-label">密码：</span>
                  <input
                    type="password"
                    value={settings.webdavConfig.password}
                    onChange={(e) => handleChange('webdavConfig', 'password', e.target.value)}
                    className="edit-input"
                    placeholder="密码"
                  />
                </div>
                
                <div className="setting-item">
                  <span className="detail-label">基础路径：</span>
                  <input
                    type="text"
                    value={settings.webdavConfig.basePath}
                    onChange={(e) => handleChange('webdavConfig', 'basePath', e.target.value)}
                    className="edit-input"
                    placeholder="/"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;