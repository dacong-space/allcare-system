import React, { useState, useContext } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Badge, Breadcrumb } from 'antd';
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
  SettingOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';

const { Header, Sider, Content } = Layout;

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
  min-height: 100vh;
  transition: all 0.3s;
  width: auto;
  color: var(--text-primary);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;

  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const Logo = styled.div`
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-color);
  font-size: ${props => props.siderCollapsed ? '24px' : '18px'};
  font-weight: 600;
  letter-spacing: -0.5px;
  transition: all 0.3s;
  background: var(--sidebar-bg);
  border-bottom: 1px solid var(--border-color);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;

  .logo-text {
    margin-left: ${props => props.siderCollapsed ? '0' : '12px'};
    display: ${props => props.siderCollapsed ? 'none' : 'inline-block'};
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;

  .username {
    margin-left: 8px;
    color: var(--text-primary);
    font-weight: 500;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  }

  .ant-avatar {
    background-color: var(--primary-color);
    border: none;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
  color: var(--text-primary);
  font-size: 18px;
  transition: all 0.3s;

  &:hover {
    color: var(--primary-color);
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
    key: 'about',
    icon: <InfoCircleOutlined />,
    label: '关于我们',
    path: '/about-us'
  }
];

// 路径映射到面包屑
const pathMap = {
  '/': ['首页'],
  '/dashboard': ['首页', '任务看板'],
  '/customer-info': ['首页', '客户信息'],
  '/employee-info': ['首页', '员工信息'],
  '/document-center': ['首页', '文档中心'],
  '/about-us': ['首页', '关于我们']
};

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const location = useLocation();

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
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={200}
        style={{
          overflow: 'hidden',
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
      >
        <Logo siderCollapsed={collapsed}>
          {collapsed ? 'AC' : <><img src="./images/new-logo.svg" alt="Logo" height="32" /> <span className="logo-text">AllCare</span></>}
        </Logo>
        <Menu
          theme={theme === 'dark' ? 'dark' : 'light'}
          mode="inline"
          selectedKeys={[getSelectedKey(location.pathname)]}
          style={{
            background: 'var(--sidebar-bg)',
            color: '#ffffff',
            borderRight: 'none',
            flex: 1,
            overflow: 'auto',
            marginTop: '8px'
          }}
          className="sidebar-menu"
          items={menuItems.map(item => ({
            key: item.key,
            icon: item.icon,
            label: item.path ? <Link to={item.path}>{item.label}</Link> : item.label
          }))}
        />
      </Sider>

      <Layout>
        <StyledHeader siderCollapsed={collapsed}>
          <HeaderLeft>
            <div
              className="menu-toggle-btn"
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '18px',
                cursor: 'pointer',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-primary)'
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
                style={{ fontSize: '16px' }}
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

        <StyledContent siderCollapsed={collapsed}>
          <Outlet />
        </StyledContent>
      </Layout>
    </StyledLayout>
  );
};

export default MainLayout;
