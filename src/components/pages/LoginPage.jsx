import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './LoginPage.css';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { login, register, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (isLogin) {
      // 登录
      const result = await login(username, password);
      if (result.success) {
        setSuccess('登录成功！正在跳转...');
        // 模拟跳转延迟
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      } else {
        setError(result.error);
      }
    } else {
      // 注册
      if (!name.trim()) {
        setError('请输入姓名');
        return;
      }
      
      const result = await register(username, password, name);
      if (result.success) {
        setSuccess('注册成功！正在跳转...');
        // 模拟跳转延迟
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      } else {
        setError(result.error);
      }
    }
  };

  const handleDemoLogin = async (role) => {
    setError('');
    setSuccess('');
    
    let demoUsername, demoPassword;
    
    if (role === 'admin') {
      demoUsername = 'admin';
      demoPassword = 'admin123';
    } else {
      demoUsername = 'user1';
      demoPassword = 'user123';
    }
    
    const result = await login(demoUsername, demoPassword);
    if (result.success) {
      setSuccess(`${role === 'admin' ? '管理员' : '用户'}演示登录成功！正在跳转...`);
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } else {
      setError('演示登录失败');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>React 管理后台</h1>
          <p>{isLogin ? '欢迎回来，请登录' : '创建新账户'}</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">姓名</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="请输入您的姓名"
                required={!isLogin}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">用户名</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="请输入用户名"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">密码</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? '处理中...' : (isLogin ? '登录' : '注册')}
          </button>
        </form>

        <div className="demo-login">
          <p>快速体验：</p>
          <div className="demo-buttons">
            <button 
              className="demo-btn admin-btn"
              onClick={() => handleDemoLogin('admin')}
              disabled={loading}
            >
              管理员演示
            </button>
            <button 
              className="demo-btn user-btn"
              onClick={() => handleDemoLogin('user')}
              disabled={loading}
            >
              用户演示
            </button>
          </div>
        </div>

        <div className="switch-mode">
          <p>
            {isLogin ? '还没有账户？' : '已有账户？'}
            <button 
              type="button" 
              className="switch-btn"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setSuccess('');
              }}
            >
              {isLogin ? '立即注册' : '立即登录'}
            </button>
          </p>
        </div>

        <div className="login-footer">
          <p>© 2024 React 管理后台系统</p>
          <p>技术支持：hermes-agent</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;