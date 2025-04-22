import React, { useState, useContext } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Badge, Breadcrumb, Typography, Grid } from 'antd';
import './MenuAnimation.css';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  LogoutOutlined,
  HomeOutlined,
  DashboardOutlined,
  TeamOutlined,
  FileTextOutlined,
  MedicineBoxOutlined,
  InfoCircleOutlined,
  BellOutlined,
  SettingOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';

const { Header, Sider, Content, Footer } = Layout;
const { Text } = Typography;

// 样式组件
const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

const StyledHeader = styled(Header)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px 0 0;
  background: var(--header-bg);
  color: var(--text-primary);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: fixed;
  top: 0;
  right: 0;
  width: calc(100% - ${props => props.siderCollapsed ? '80px' : '200px'});
  height: 64px;
  line-height: 64px;
  z-index: 1000;
  transition: all 0.3s;
  margin-left: ${props => props.siderCollapsed ? '80px' : '200px'};
  border-bottom: 1px solid var(--border-color);

  @media (max-width: 768px) {
    margin-left: 0;
    width: 100%;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  padding-left: 24px;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const StyledContent = styled(Content)`
  margin-left: ${props => props.siderCollapsed ? '80px' : '200px'};
  padding: 84px 24px 24px;
  background-color: var(--bg-primary);
  min-height: calc(100vh - 64px); /* 减去头部的高度 */
  transition: all 0.3s;
  width: auto;
  color: var(--text-primary);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  animation: fadeIn 0.5s ease-in-out;
  overflow: auto;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const Logo = styled.div`
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: ${props => props.siderCollapsed ? 'center' : 'flex-start'};
  color: var(--primary-color);
  font-weight: 700;
  letter-spacing: -0.5px;
  transition: all 0.3s;
  background: var(--sidebar-bg);
  border-bottom: 1px solid var(--border-color);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  padding: 0 ${props => props.siderCollapsed ? '16px' : '24px'};
  cursor: pointer;

  img {
    height: 42px;
    width: 42px;
    border-radius: 50%;
    object-fit: cover;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  &:hover img {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  .logo-text {
    margin-left: 12px;
    font-size: 22px;
    font-weight: 700;
    transition: color 0.3s ease;
  }

  &:hover .logo-text {
    color: var(--primary-color-light, #40a9ff);
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 20px;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }

  .username {
    margin-left: 8px;
    color: var(--text-primary);
    font-weight: 500;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    transition: color 0.3s ease;
  }

  &:hover .username {
    color: var(--primary-color);
  }

  .ant-avatar {
    background-color: var(--primary-color);
    border: none;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  &:hover .ant-avatar {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

const StyledBreadcrumb = styled(Breadcrumb)`
  margin: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;

  .ant-breadcrumb-link, .ant-breadcrumb-separator {
    color: var(--text-secondary);
  }

  a {
    color: var(--primary-color);

    &:hover {
      color: var(--primary-color);
      opacity: 0.8;
    }
  }
`;

const ThemeToggle = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
  font-size: 18px;
  transition: all 0.3s ease;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: transparent;

  &:hover {
    color: var(--primary-color);
    transform: rotate(30deg);
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

const StyledFooter = styled(Footer)`
  text-align: center;
  background: #f5f5f5;
  color: var(--text-secondary);
  padding: 20px 50px;
  margin-top: 40px;
  font-size: 14px;
  border-top: 1px solid var(--border-color);
  margin-left: 0;
  transition: all 0.3s;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  width: auto;

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 20px 24px;
  }
`;

// 已将折叠按钮移动到菜单中

// 菜单配置
const menuItems = [
  {
    key: 'home',
    icon: <HomeOutlined />,
    label: '首页',
    path: '/'
  },
  {
    key: 'dashboard',
    icon: <DashboardOutlined />,
    label: '任务面板',
    path: '/dashboard'
  },
  {
    key: 'customer',
    icon: <MedicineBoxOutlined />,
    label: '客户信息',
    path: '/customer-info'
  },
  {
    key: 'employee',
    icon: <TeamOutlined />,
    label: '员工信息',
    path: '/employee-info'
  },
  {
    key: 'documentCenter',
    icon: <FileTextOutlined />,
    label: '文档中心',
    path: '/document-center'
  },
  {
    key: 'reports',
    icon: <BarChartOutlined />,
    label: '数据报表',
    path: '/reports'
  },
  {
    key: 'about',
    icon: <InfoCircleOutlined />,
    label: '关于我们',
    path: '/about-us'
  },
  {
    key: 'upcoming',
    icon: <BellOutlined />,
    label: '即将到期',
    path: '/upcoming-expirations'
  }
];

// 路径映射到面包屑
const pathMap = {
  '/': ['首页'],
  '/dashboard': ['首页', '任务看板'],
  '/customer-info': ['首页', '客户信息'],
  '/employee-info': ['首页', '员工信息'],
  '/document-center': ['首页', '文档中心'],
  '/reports': ['首页', '数据报表'],
  '/about-us': ['首页', '关于我们'],
  '/upcoming-expirations': ['首页', '即将到期'],
};

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const location = useLocation();
  const screens = Grid.useBreakpoint();

  // 获取当前路径的面包屑
  const getBreadcrumb = (path) => {
    return pathMap[path] || ['首页', '未知页面'];
  };

  // 获取当前选中的菜单项
  const getSelectedKey = (path) => {
    if (path === '/') return 'home';
    if (path === '/document-center') return 'documentCenter';
    if (path === '/customer-info') return 'customer';
    if (path === '/employee-info') return 'employee';
    if (path === '/about-us') return 'about';
    if (path === '/reports') return 'reports';
    if (path === '/upcoming-expirations') return 'upcoming';
    const item = menuItems.find(item => item.path === path);
    return item ? item.key : '';
  };

  // 用户菜单
  const userMenu = {
    items: [
      {
        key: 'profile',
        icon: <UserOutlined />,
        label: '个人资料',
      },
      {
        key: 'settings',
        icon: <SettingOutlined />,
        label: '设置',
      },
      {
        type: 'divider',
      },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: '退出登录',
      },
    ],
    onClick: ({ key }) => {
      if (key === 'logout') {
        logout();
      }
    },
  };

  return (
    <StyledLayout>
      <Sider
        breakpoint="md"
        collapsedWidth={80}
        onBreakpoint={(broken) => setCollapsed(broken)}
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={200}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 1001,
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--sidebar-bg)',
          boxShadow: '2px 0 8px rgba(0, 0, 0, 0.05)'
        }}
        children={
          <>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <Logo siderCollapsed={collapsed}>
                <img src="/images/logo.jpg" alt="Logo" />
                {!collapsed && <span className="logo-text">Allcare</span>}
              </Logo>
            </Link>
            <Menu
              theme={theme === 'dark' ? 'dark' : 'light'}
              mode="inline"
              inlineCollapsed={collapsed}
              selectedKeys={[getSelectedKey(location.pathname)]}
              style={{
                background: 'var(--sidebar-bg)',
                color: '#ffffff',
                borderRight: 'none',
                flex: '1 0 auto',
                overflow: 'auto',
                marginTop: '8px',
                marginBottom: collapsed ? '0' : '75px'
              }}
              className="sidebar-menu"
              items={menuItems.map(item => ({
                key: item.key,
                icon: item.icon,
                label: item.path ? <Link to={item.path}>{item.label}</Link> : item.label
              }))}
            />
            <div style={{
              padding: '12px 8px',
              textAlign: 'center',
              fontFamily: 'Inter, sans-serif',
              fontSize: '11px',
              color: '#333333',
              borderTop: '1px solid rgba(0, 0, 0, 0.06)',
              background: 'var(--sidebar-bg)',
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              minHeight: '75px',
              display: collapsed ? 'none' : 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              zIndex: 1002
            }}>
              <div style={{ lineHeight: '1.5' }}>Copyright 2025 Allcare Health Care, LLC</div>
              <div style={{ color: '#666666', marginTop: '4px', lineHeight: '1.5' }}>
                Designed and developed by
              </div>
              <div style={{ color: '#666666', lineHeight: '1.5', fontStyle: 'italic' }}>
                Rui Gao
              </div>
            </div>
          </>
        }
      >
      </Sider>

      <Layout>
        <StyledHeader siderCollapsed={collapsed}>
          <HeaderLeft>
            <div
              className="menu-toggle-btn trigger-button"
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '18px',
                cursor: 'pointer',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                paddingLeft: '8px',
                color: 'var(--text-primary)',
                borderRadius: '4px',
                transition: 'all 0.3s ease'
              }}
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </div>
          </HeaderLeft>

          <HeaderRight>
            <ThemeToggle onClick={toggleTheme}>
              {theme === 'light' ? '🌙' : '☀️'}
            </ThemeToggle>

            <Badge count={5} dot>
              <Button
                type="text"
                icon={<BellOutlined />}
                className="notification-button"
                style={{
                  fontSize: '16px',
                  transition: 'all 0.3s ease',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%'
                }}
              />
            </Badge>

            <Dropdown menu={userMenu} placement="bottomRight">
              <UserInfo>
                <Avatar icon={<UserOutlined />} />
                <span className="username">{user?.name || '用户'}</span>
              </UserInfo>
            </Dropdown>
          </HeaderRight>
        </StyledHeader>

        <StyledContent siderCollapsed={collapsed} onClick={() => !screens.md && !collapsed && setCollapsed(true)}>
          <Outlet />
        </StyledContent>
      </Layout>
    </StyledLayout>
  );
};

export default MainLayout;
