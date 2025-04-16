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
    // 检查会话存储中的登录状态，如果没有则表示浏览器已关闭过
    const sessionToken = sessionStorage.getItem('token');
    const sessionUser = sessionStorage.getItem('user');
    
    if (sessionToken && sessionUser) {
      try {
        const userData = JSON.parse(sessionUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse session user data:', error);
        // 清除无效的数据
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } else {
      // 浏览器已经关闭过，清除localStorage中的登录信息
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    
    // 设置加载完成
    setIsLoading(false);
  }, []);

  // 登录函数
  const login = useCallback((userData, token) => {
    // 存储到本地存储
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    // 存储到会话存储，关闭浏览器后失效
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('user', JSON.stringify(userData));
    // 清除之前的路径状态，确保登录后始终导航到首页
    sessionStorage.removeItem('lastPath');
    localStorage.removeItem('lastPath');
    
    setUser(userData);
    setIsAuthenticated(true);
  }, []);

  // 登出函数
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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
