import React, { createContext, useState, useContext, useEffect } from 'react';

// 创建认证上下文
const AuthContext = createContext();

// 模拟用户数据
const mockUsers = [
  { id: 1, username: 'admin', password: 'admin123', name: '管理员', role: 'admin' },
  { id: 2, username: 'user1', password: 'user123', name: '张三', role: 'user' },
  { id: 3, username: 'user2', password: 'user123', name: '李四', role: 'user' }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 初始化时检查本地存储
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('解析用户数据失败:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // 登录函数
  const login = async (username, password) => {
    setLoading(true);
    
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 查找用户
    const foundUser = mockUsers.find(
      u => u.username === username && u.password === password
    );
    
    if (foundUser) {
      // 移除密码后存储用户信息
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      setLoading(false);
      return { success: true, user: userWithoutPassword };
    } else {
      setLoading(false);
      return { success: false, error: '用户名或密码错误' };
    }
  };

  // 注册函数
  const register = async (username, password, name) => {
    setLoading(true);
    
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 检查用户名是否已存在
    const userExists = mockUsers.some(u => u.username === username);
    
    if (userExists) {
      setLoading(false);
      return { success: false, error: '用户名已存在' };
    }
    
    // 创建新用户
    const newUser = {
      id: mockUsers.length + 1,
      username,
      password,
      name,
      role: 'user'
    };
    
    // 模拟添加到数据库
    mockUsers.push(newUser);
    
    // 移除密码后存储用户信息
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    setLoading(false);
    
    return { success: true, user: userWithoutPassword };
  };

  // 登出函数
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // 更新用户信息
  const updateUser = (updatedInfo) => {
    const updatedUser = { ...user, ...updatedInfo };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // 检查用户权限
  const hasRole = (role) => {
    return user?.role === role;
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    hasRole,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 自定义hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth必须在AuthProvider内使用');
  }
  return context;
};