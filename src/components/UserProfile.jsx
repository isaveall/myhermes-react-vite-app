import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './UserProfile.css';

const UserProfile = () => {
  const { user, logout, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [message, setMessage] = useState({ type: '', text: '' });

  if (!user) {
    return (
      <div className="user-profile">
        <div className="profile-header">
          <h2>用户信息</h2>
        </div>
        <div className="profile-content">
          <p>请先登录查看用户信息</p>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    if (!name.trim()) {
      setMessage({ type: 'error', text: '姓名不能为空' });
      return;
    }

    updateUser({ name, email, phone });
    setMessage({ type: 'success', text: '个人信息更新成功' });
    setIsEditing(false);
    
    // 3秒后清除消息
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleCancel = () => {
    setName(user.name || '');
    setEmail(user.email || '');
    setPhone(user.phone || '');
    setIsEditing(false);
    setMessage({ type: '', text: '' });
  };

  const handleLogout = () => {
    if (window.confirm('确定要退出登录吗？')) {
      logout();
      window.location.href = '/login';
    }
  };

  return (
    <div className="user-profile">
      <div className="profile-header">
        <h2>用户信息</h2>
        <div className="profile-actions">
          {!isEditing ? (
            <button 
              className="edit-btn"
              onClick={() => setIsEditing(true)}
            >
              编辑信息
            </button>
          ) : (
            <>
              <button 
                className="save-btn"
                onClick={handleSave}
              >
                保存
              </button>
              <button 
                className="cancel-btn"
                onClick={handleCancel}
              >
                取消
              </button>
            </>
          )}
          <button 
            className="logout-btn"
            onClick={handleLogout}
          >
            退出登录
          </button>
        </div>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="profile-content">
        <div className="profile-avatar">
          <div className="avatar-circle">
            {user.name?.charAt(0) || 'U'}
          </div>
          <div className="avatar-info">
            <h3>{user.name}</h3>
            <p className="username">@{user.username}</p>
            <p className="role-badge">
              {user.role === 'admin' ? '管理员' : '普通用户'}
            </p>
          </div>
        </div>

        <div className="profile-details">
          <div className="detail-item">
            <span className="detail-label">用户ID：</span>
            <span className="detail-value">{user.id}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">用户名：</span>
            <span className="detail-value">{user.username}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">姓名：</span>
            {isEditing ? (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="edit-input"
                placeholder="请输入姓名"
              />
            ) : (
              <span className="detail-value">{user.name}</span>
            )}
          </div>
          
          <div className="detail-item">
            <span className="detail-label">邮箱：</span>
            {isEditing ? (
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="edit-input"
                placeholder="请输入邮箱"
              />
            ) : (
              <span className="detail-value">{user.email || '未设置'}</span>
            )}
          </div>
          
          <div className="detail-item">
            <span className="detail-label">手机号：</span>
            {isEditing ? (
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="edit-input"
                placeholder="请输入手机号"
              />
            ) : (
              <span className="detail-value">{user.phone || '未设置'}</span>
            )}
          </div>
          
          <div className="detail-item">
            <span className="detail-label">角色：</span>
            <span className="detail-value">
              {user.role === 'admin' ? '管理员' : '普通用户'}
            </span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">注册时间：</span>
            <span className="detail-value">
              {new Date().toLocaleDateString('zh-CN')}
            </span>
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h4>文件上传</h4>
              <p className="stat-number">0</p>
              <p className="stat-desc">已上传文件</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">⏱️</div>
            <div className="stat-content">
              <h4>使用时长</h4>
              <p className="stat-number">0h</p>
              <p className="stat-desc">累计使用</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <h4>活跃度</h4>
              <p className="stat-number">0%</p>
              <p className="stat-desc">本周活跃</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;