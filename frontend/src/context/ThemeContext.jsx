import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  // 从本地存储中获取主题设置，如果没有则默认为亮色模式
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  // 切换主题
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // 当主题变化时，更新文档的 data-theme 属性
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);

    // 添加CSS变量 - 使用简约现代高级的配色方案
    if (theme === 'dark') {
      // 深色模式
      document.documentElement.style.setProperty('--bg-primary', '#121212');
      document.documentElement.style.setProperty('--bg-secondary', '#1f1f1f');
      document.documentElement.style.setProperty('--text-primary', '#ffffff');
      document.documentElement.style.setProperty('--text-secondary', '#a0a0a0');
      document.documentElement.style.setProperty('--primary-color', '#4a90e2');
      document.documentElement.style.setProperty('--border-color', '#333333');
      document.documentElement.style.setProperty('--hover-color', '#2c2c2c');
      document.documentElement.style.setProperty('--card-bg', '#1f1f1f');
      document.documentElement.style.setProperty('--header-bg', '#1f1f1f');
      document.documentElement.style.setProperty('--sidebar-bg', '#1f1f1f');
      document.documentElement.style.setProperty('--highlight-blue', '#4a90e2');
      document.documentElement.style.setProperty('--highlight-green', '#27ae60');
      document.documentElement.style.setProperty('--highlight-gold', '#f39c12');
      document.documentElement.style.setProperty('--highlight-purple', '#9b59b6');
    } else {
      // 浅色模式 - 简约现代高级风格
      document.documentElement.style.setProperty('--bg-primary', '#f8f9fa');
      document.documentElement.style.setProperty('--bg-secondary', '#ffffff');
      document.documentElement.style.setProperty('--text-primary', '#2c3e50');
      document.documentElement.style.setProperty('--text-secondary', '#7f8c8d');
      document.documentElement.style.setProperty('--primary-color', '#4a90e2');
      document.documentElement.style.setProperty('--border-color', '#e9ecef');
      document.documentElement.style.setProperty('--hover-color', '#f1f3f5');
      document.documentElement.style.setProperty('--card-bg', '#ffffff');
      document.documentElement.style.setProperty('--header-bg', '#ffffff');
      document.documentElement.style.setProperty('--sidebar-bg', '#ffffff');
      document.documentElement.style.setProperty('--highlight-blue', '#4a90e2');
      document.documentElement.style.setProperty('--highlight-green', '#27ae60');
      document.documentElement.style.setProperty('--highlight-gold', '#f39c12');
      document.documentElement.style.setProperty('--highlight-purple', '#9b59b6');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
