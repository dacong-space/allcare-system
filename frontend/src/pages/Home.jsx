import React, { useState, useEffect } from 'react';
import {
  getEmployeeCount,
  getCustomerCount,
  getDocumentCount,
  getEmployeeGrowthRate,
  getCustomerGrowthRate
} from '../services/dataService';
import { useState as useLocalState } from 'react';
import {
  Typography,
  Card,
  Row,
  Col,
  Statistic,
  Button,
  List,
  Avatar,
  Tag,
  Divider,
  Progress,
  Badge,
  Tooltip,
  Space
} from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  FileTextOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  BellOutlined,
  SettingOutlined,
  PlusOutlined,
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined,
  DashboardOutlined,
  FileAddOutlined,
  UserAddOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;

// 样式组件
const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  h2 {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
    color: var(--text-primary);
  }

  .actions {
    display: flex;
    gap: 12px;
  }
`;

const DashboardCard = styled(Card)`
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  height: 100%;
  transition: all 0.3s;
  border: 1px solid var(--border-color);
  overflow: hidden;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  .ant-card-head {
    border-bottom: 1px solid var(--border-color);
    padding: 16px 20px;
    min-height: 48px;
    background: var(--bg-secondary);
  }

  .ant-card-head-title {
    font-size: 16px;
    font-weight: 600;
  }

  .ant-card-body {
    padding: 20px;
  }
`;

const StatCard = styled(Card)`
  border-radius: 12px;
  height: 100%;
  border: 1px solid var(--border-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
  overflow: hidden;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  .ant-card-body {
    padding: 24px;
  }

  .ant-statistic-title {
    font-size: 16px;
    margin-bottom: 8px;
    color: var(--text-secondary);
  }

  .ant-statistic-content {
    font-size: 32px;
    font-weight: 600;
    color: ${props => props.valueColor || 'var(--text-primary)'};
  }

  .stat-icon {
    width: 64px;
    height: 64px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
    background: ${props => props.iconBg || 'rgba(59, 130, 246, 0.1)'};

    .anticon {
      font-size: 28px;
      color: ${props => props.iconColor || '#3B82F6'};
    }
  }

  .stat-trend {
    margin-top: 8px;
    font-size: 14px;
    display: flex;
    align-items: center;

    .trend-icon {
      margin-right: 4px;
    }

    &.positive {
      color: #10B981;
    }

    &.negative {
      color: #EF4444;
    }
  }
`;

const ActionCard = styled.div`
  border-radius: 12px;
  background: white;
  padding: 20px;
  height: 100%;
  border: 1px solid var(--border-color);
  transition: all 0.3s;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
    border-color: var(--primary-color);
  }

  .icon-wrapper {
    width: 60px;
    height: 60px;
    border-radius: 12px;
    background: ${props => props.iconBg || 'rgba(59, 130, 246, 0.1)'};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;

    .anticon {
      font-size: 24px;
      color: ${props => props.iconColor || '#3B82F6'};
    }
  }

  .title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 8px;
    color: var(--text-primary);
  }

  .description {
    font-size: 14px;
    color: var(--text-secondary);
  }
`;

const TaskCard = styled(Card)`
  border-radius: 12px;
  height: 100%;
  border: 1px solid var(--border-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
  overflow: hidden;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  .ant-card-head {
    border-bottom: 1px solid var(--border-color);
    padding: 16px 20px;
    min-height: 48px;
    background: var(--bg-secondary);
  }

  .ant-card-head-title {
    font-size: 16px;
    font-weight: 600;
  }

  .ant-card-body {
    padding: 20px;
  }
`;

const TaskItem = styled.div`
  padding: 16px;
  border-radius: 8px;
  background: ${props => props.completed ? 'rgba(16, 185, 129, 0.05)' : 'white'};
  border: 1px solid ${props => props.completed ? 'rgba(16, 185, 129, 0.2)' : 'var(--border-color)'};
  margin-bottom: 12px;
  transition: all 0.2s;
  position: relative;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  &:last-child {
    margin-bottom: 0;
  }

  .task-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  .task-title {
    font-weight: 600;
    font-size: 15px;
    color: var(--text-primary);
    display: flex;
    align-items: center;

    .anticon {
      margin-right: 8px;
      color: ${props => props.completed ? '#10B981' : '#3B82F6'};
    }
  }

  .task-meta {
    display: flex;
    justify-content: space-between;
    margin-top: 12px;
    color: var(--text-secondary);
    font-size: 13px;
  }

  .task-priority {
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: ${props => {
      switch(props.priority) {
        case 'high': return '#EF4444';
        case 'medium': return '#F59E0B';
        case 'low': return '#10B981';
        default: return '#3B82F6';
      }
    }};
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
  }
`;

const ChartCard = styled(Card)`
  border-radius: 12px;
  height: 100%;
  border: 1px solid var(--border-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
  overflow: hidden;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  .ant-card-head {
    border-bottom: 1px solid var(--border-color);
    padding: 16px 20px;
    min-height: 48px;
    background: var(--bg-secondary);
  }

  .ant-card-head-title {
    font-size: 16px;
    font-weight: 600;
  }

  .ant-card-body {
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .chart-placeholder {
    width: 100%;
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    color: var(--text-secondary);

    .anticon {
      font-size: 48px;
      margin-bottom: 16px;
      color: var(--primary-color);
    }
  }
`;

// 模拟数据
const tasks = [
  {
    id: 1,
    title: '完成客户满意度调查',
    dueDate: '2025-04-15',
    priority: 'high',
    status: 'in-progress',
    assignee: '王经理',
    completed: false
  },
  {
    id: 2,
    title: '准备季度报表',
    dueDate: '2025-04-20',
    priority: 'medium',
    status: 'pending',
    assignee: '张经理',
    completed: false
  },
  {
    id: 3,
    title: '新员工入职培训',
    dueDate: '2025-04-12',
    priority: 'medium',
    status: 'completed',
    assignee: '李经理',
    completed: true
  },
  {
    id: 4,
    title: '更新客户资料',
    dueDate: '2025-04-18',
    priority: 'low',
    status: 'pending',
    assignee: '赵经理',
    completed: false
  }
];

const notifications = [
  {
    id: 1,
    title: '系统更新通知',
    content: '系统将于今晚22:00进行维护升级，预计持续2小时',
    time: '10:30',
    type: 'system',
    read: false
  },
  {
    id: 2,
    title: '新客户登记',
    content: '新客户王小明已成功登记，请及时安排服务',
    time: '09:15',
    type: 'customer',
    read: true
  },
  {
    id: 3,
    title: '文档审核提醒',
    content: '有新的文档需要您审核，请尽快处理',
    time: '08:45',
    type: 'document',
    read: false
  }
];

const quickActions = [];

const Home = () => {
  const [employeeCount, setEmployeeCount] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);
  const [documentCount, setDocumentCount] = useState(0);
  const [employeeGrowth, setEmployeeGrowth] = useState(0);
  const [customerGrowth, setCustomerGrowth] = useState(0);

  const [pendingTasks, setPendingTasks] = useState([]);

  useEffect(() => {
    // 获取真实的员工和客户数量
    setEmployeeCount(getEmployeeCount());
    setCustomerCount(getCustomerCount());
    setDocumentCount(getDocumentCount());
    setEmployeeGrowth(getEmployeeGrowthRate());
    setCustomerGrowth(getCustomerGrowthRate());



    // 获取任务面板中的待办任务
    // 从本地存储中获取任务数据，如果没有则使用默认数据
    const storedTasks = localStorage.getItem('tasks');
    const initialTasks = {
      todo: [
        { id: '1', title: '完成客户满意度调查', description: '联系客户并收集反馈', priority: 'high', dueDate: '2025-04-15', assignee: '王经理' },
        { id: '2', title: '准备季度报表', description: '整理第一季度的数据并生成报表', priority: 'medium', dueDate: '2025-04-20', assignee: '张经理' },
      ],
      inProgress: [
        { id: '3', title: '新员工入职培训', description: '为新入职的员工准备培训材料', priority: 'medium', dueDate: '2025-04-12', assignee: '李经理' },
      ],
      done: [
        { id: '4', title: '更新客户资料', description: '更新现有客户的联系信息', priority: 'low', dueDate: '2025-04-10', assignee: '赵经理' },
      ],
    };

    const parsedTasks = storedTasks ? JSON.parse(storedTasks) : initialTasks;

    // 合并待办和进行中的任务，并按优先级排序
    const allPendingTasks = [...parsedTasks.todo, ...parsedTasks.inProgress];
    const sortedTasks = allPendingTasks.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    setPendingTasks(sortedTasks);
  }, []);

  // 获取当前时间
  const now = new Date();
  const hours = now.getHours();

  // 根据时间段显示不同的问候语
  let greeting = '';
  if (hours < 12) {
    greeting = '早上好';
  } else if (hours < 18) {
    greeting = '下午好';
  } else {
    greeting = '晚上好';
  }

  // 获取任务状态标签
  const getStatusTag = (status) => {
    switch (status) {
      case 'completed':
        return <Tag color="success">已完成</Tag>;
      case 'in-progress':
        return <Tag color="processing">进行中</Tag>;
      case 'pending':
        return <Tag color="warning">待处理</Tag>;
      default:
        return <Tag color="default">未开始</Tag>;
    }
  };

  return (
    <div style={{ padding: '0 12px', height: 'auto', overflow: 'auto', maxHeight: '100vh' }}>
      {/* 顶部信息栏 */}
      <DashboardHeader>
        <h2>{greeting}，管理员</h2>
      </DashboardHeader>

      {/* 核心数据统计 */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        {/* 合并 客户总数 和 员工总数 */}
        <Col xs={24} md={12}>
          <StatCard>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '48%' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                  <UserOutlined style={{ fontSize: '20px', color: '#3B82F6' }} />
                </div>
                <Statistic title="客户总数" value={customerCount} style={{ fontSize: '20px', margin: 0 }} />
                <div style={{ fontSize: '12px', marginTop: '4px', color: customerGrowth >= 0 ? '#10B981' : '#EF4444' }}>
                  {customerGrowth >= 0 ? '↑' : '↓'} {Math.abs(customerGrowth)}% 较上月
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', width: '48%' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                  <TeamOutlined style={{ fontSize: '20px', color: '#10B981' }} />
                </div>
                <Statistic title="员工总数" value={employeeCount} style={{ fontSize: '20px', textAlign: 'right', margin: 0 }} />
                <div style={{ fontSize: '12px', marginTop: '4px', color: employeeGrowth >= 0 ? '#10B981' : '#EF4444' }}>
                  {employeeGrowth >= 0 ? '↑' : '↓'} {Math.abs(employeeGrowth)}% 较上月
                </div>
              </div>
            </div>
          </StatCard>
        </Col>
        <Col xs={24} md={8}>
          <StatCard iconBg="rgba(245, 158, 11, 0.1)" iconColor="#F59E0B" valueColor="#F59E0B">
            <div className="stat-icon">
              <FileTextOutlined />
            </div>
            <Statistic
              title="文档总数"
              value={documentCount}
            />
          </StatCard>
        </Col>
      </Row>

      {/* 快速操作区域 */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        {quickActions.map((action, index) => (
          <Col xs={12} md={6} key={index}>
            <Link to={action.path}>
              <ActionCard iconBg={action.bg} iconColor={action.color}>
                <div className="icon-wrapper" style={{ background: action.bg }}>
                  {action.icon}
                </div>
                <div className="title">{action.title}</div>
                <div className="description">{action.description}</div>
              </ActionCard>
            </Link>
          </Col>
        ))}
      </Row>

      {/* 主要内容区 */}
      <Row gutter={[24, 24]}>
        {/* 右侧列 - 图表和系统状态 */}
        <Col xs={24} lg={24}>
          <Row gutter={[0, 24]}>
            {/* 系统状态 */}
            <Col span={24}>
              <DashboardCard
                title="系统状态"
                extra={<Button type="link">查看详情</Button>}
              >
                <List
                  size="small"
                  bordered={false}
                  split={true}
                  dataSource={[
                    { label: '系统运行状态', value: <Tag color="success">正常</Tag> },
                    { label: '数据库状态', value: <Tag color="success">正常</Tag> },
                    { label: '上次备份时间', value: <Text type="secondary">今天 03:00</Text> },
                    { label: '系统版本', value: <Text type="secondary">v1.1.5</Text> },
                    { label: '存储空间使用', value: <Text type="secondary">45% (450GB/1TB)</Text> },
                    { label: '当前在线用户', value: <Text type="secondary">3</Text> },
                  ]}
                  renderItem={item => (
                    <List.Item extra={item.value}>
                      <Text>{item.label}</Text>
                    </List.Item>
                  )}
                />
              </DashboardCard>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
