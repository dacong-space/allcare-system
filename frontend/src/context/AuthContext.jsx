import { createContext, useState, useEffect, useCallback } from 'react';

// 创建认证上下文
export const AuthContext = createContext();

// 认证提供者组件
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // 添加加载状态
  
  // 检查本地存储中的登录状态
  useEffect(() => {
    // 只检查sessionStorage，刷新页面不会丢失登录状态，关闭标签页或浏览器自动退出
    const token = sessionStorage.getItem('token');
    const userStr = sessionStorage.getItem('user');
    if (token && userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse user data:', error);
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  // 登录函数
  const login = useCallback((userData, token) => {
    // 只存储到sessionStorage，刷新页面不会丢失登录状态，关闭标签页/浏览器自动退出
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  }, []);

  // 登出函数
  const logout = useCallback(() => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
