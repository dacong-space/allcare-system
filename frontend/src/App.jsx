import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import LoadingScreen from './components/LoadingScreen';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';

// 导入页面
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
// NewHome已经重命名为Home
import NotFound from './pages/NotFound';
import DocumentCenter from './pages/DocumentCenter';
import CustomerInfo from './pages/CustomerInfo';
import EmployeeInfo from './pages/EmployeeInfo';
import AboutUs from './pages/AboutUs';
import Reports from './pages/Reports';
import UpcomingExpirations from './pages/UpcomingExpirations';

// 导入布局组件
import MainLayout from './components/layout/MainLayout';

// 导入上下文
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// 导入样式
import './App.css';

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </ConfigProvider>
  );
}

// 路由组件
const AppRoutes = () => {
  // 受保护的路由组件
  const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useContext(AuthContext);

    // 如果还在加载中，返回加载指示器
    if (isLoading) {
      return <LoadingScreen />;
    }

    if (!isAuthenticated) {
      // 不再保存之前的路径，始终重定向到登录页
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* 使用 MainLayout 作为布局 */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/document-center" element={<DocumentCenter />} />
          <Route path="/customer-info" element={<CustomerInfo />} />
          <Route path="/employee-info" element={<EmployeeInfo />} />
          <Route path="/upcoming-expirations" element={<UpcomingExpirations />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/reports" element={<Reports />} />
          {/* 其他页面可以在这里添加 */}
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App
