import React, { useState, useEffect } from 'react';
import {
  getEmployeeCount,
  getCustomerCount,
  getDocumentCount,
  getEmployeeGrowthRate,
  getCustomerGrowthRate
} from '../services/dataService';
import {
  Typography,
  Card,
  Row,
  Col,
  Statistic,
  Timeline,
  Button,
  List,
  Avatar,
  Tag,
  Divider
} from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  FileTextOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  RightOutlined,
  BellOutlined,
  MedicineBoxOutlined,
  SettingOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;

// 样式组件
const WelcomeBanner = styled.div`
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const StyledCard = styled(Card)`
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  height: 100%;
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }

  .ant-card-head {
    border-bottom: 1px solid #f0f0f0;
  }
`;

const QuickLinkCard = styled(Card)`
  border-radius: 8px;
  margin-bottom: 16px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }
`;

const StyledTimeline = styled(Timeline)`
  .ant-timeline-item-tail {
    border-left: 2px solid #e8e8e8;
  }

  .ant-timeline-item-head-blue {
    color: #1890ff;
    border-color: #1890ff;
  }
`;

const StatisticCard = styled(Card)`
  border-radius: 8px;
  text-align: center;
  height: 100%;

  .ant-statistic-title {
    font-size: 16px;
    margin-bottom: 8px;
  }

  .ant-statistic-content {
    font-size: 24px;
    font-weight: bold;
  }

  .anticon {
    font-size: 24px;
    margin-bottom: 8px;
  }
`;

const IconWrapper = styled.div`
  font-size: 24px;
  margin-bottom: 8px;
  color: ${props => props.color || '#1890ff'};
`;

// 模拟数据
const recentActivities = [
  {
    id: 1,
    content: '张医生更新了客户李明的病历记录',
    timestamp: '10:30',
    type: 'update'
  },
  {
    id: 2,
    content: '系统自动备份了所有数据',
    timestamp: '09:15',
    type: 'system'
  },
  {
    id: 3,
    content: '王护士为3号病房的客户完成了药物配送',
    timestamp: '08:45',
    type: 'task'
  },
  {
    id: 4,
    content: '新客户赵小明已登记入院',
    timestamp: '昨天',
    type: 'new'
  },
  {
    id: 5,
    content: '完成了月度设备维护检查',
    timestamp: '昨天',
    type: 'maintenance'
  }
];

const upcomingAppointments = [
  {
    id: 1,
    customer: '张三',
    doctor: '李医生',
    time: '14:00',
    department: '内科'
  },
  {
    id: 2,
    customer: '李四',
    doctor: '王医生',
    time: '15:30',
    department: '外科'
  },
  {
    id: 3,
    customer: '王五',
    doctor: '赵医生',
    time: '16:45',
    department: '儿科'
  }
];

const quickLinks = [
  {
    title: '客户管理',
    icon: <UserOutlined style={{ color: '#1890ff' }} />,
    path: '/customer-info'
  },
  {
    title: '员工管理',
    icon: <TeamOutlined style={{ color: '#52c41a' }} />,
    path: '/employee-info'
  },
  {
    title: '文档中心',
    icon: <FileTextOutlined style={{ color: '#faad14' }} />,
    path: '/document-center'
  },
  {
    title: '预约管理',
    icon: <CalendarOutlined style={{ color: '#722ed1' }} />,
    path: '/appointments'
  }
];

const Home = () => {
  const [employeeCount, setEmployeeCount] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);
  const [documentCount, setDocumentCount] = useState(0);
  const [employeeGrowth, setEmployeeGrowth] = useState(0);
  const [customerGrowth, setCustomerGrowth] = useState(0);

  useEffect(() => {
    // 获取真实的员工和客户数量
    setEmployeeCount(getEmployeeCount());
    setCustomerCount(getCustomerCount());
    setDocumentCount(getDocumentCount());
    setEmployeeGrowth(getEmployeeGrowthRate());
    setCustomerGrowth(getCustomerGrowthRate());
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

  return (
    <div>
      <WelcomeBanner>
        <Row gutter={[24, 24]} align="middle">
          <Col xs={24} md={16}>
            <Title level={2} style={{ color: 'white', marginBottom: 8 }}>
              {greeting}，管理员
            </Title>
            <Paragraph style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: 16, marginBottom: 16 }}>
              欢迎使用医疗管理系统，今天是 {now.toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </Paragraph>
            <Button type="primary" ghost icon={<BellOutlined />}>
              查看通知
            </Button>
          </Col>
          <Col xs={24} md={8} style={{ textAlign: 'center' }}>
            <img
              src="https://img.icons8.com/color/96/000000/hospital-3.png"
              alt="医院图标"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </Col>
        </Row>
      </WelcomeBanner>

      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} md={6}>
          <StatisticCard>
            <IconWrapper color="#1890ff">
              <UserOutlined />
            </IconWrapper>
            <Statistic title="客户总数" value={customerCount} />
            <div style={{ marginTop: 8, color: customerGrowth > 0 ? '#52c41a' : '#f5222d' }}>
              <span>{customerGrowth > 0 ? '↑' : '↓'} {Math.abs(customerGrowth)}% </span>
              <span style={{ fontSize: 12, color: 'rgba(0, 0, 0, 0.45)' }}>较上月</span>
            </div>
          </StatisticCard>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <StatisticCard>
            <IconWrapper color="#52c41a">
              <TeamOutlined />
            </IconWrapper>
            <Statistic title="员工总数" value={employeeCount} />
            <div style={{ marginTop: 8, color: employeeGrowth > 0 ? '#52c41a' : '#f5222d' }}>
              <span>{employeeGrowth > 0 ? '↑' : '↓'} {Math.abs(employeeGrowth)}% </span>
              <span style={{ fontSize: 12, color: 'rgba(0, 0, 0, 0.45)' }}>较上月</span>
            </div>
          </StatisticCard>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <StatisticCard>
            <IconWrapper color="#faad14">
              <FileTextOutlined />
            </IconWrapper>
            <Statistic title="文档总数" value={documentCount} />
          </StatisticCard>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <StatisticCard>
            <IconWrapper color="#722ed1">
              <CalendarOutlined />
            </IconWrapper>
            <Statistic title="今日预约" value={24} />
            <div style={{ marginTop: 8, color: '#1890ff' }}>
              <span>查看详情 </span>
              <RightOutlined style={{ fontSize: 12 }} />
            </div>
          </StatisticCard>
        </Col>
      </Row>

      <Divider />

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Row gutter={[24, 24]}>
            <Col xs={24}>
              <StyledCard
                title={
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>最近活动</span>
                    <Button type="link" size="small">查看全部</Button>
                  </div>
                }
              >
                <StyledTimeline>
                  {recentActivities.map(activity => {
                    let icon;
                    let color;

                    switch (activity.type) {
                      case 'update':
                        icon = <FileTextOutlined />;
                        color = 'blue';
                        break;
                      case 'system':
                        icon = <CheckCircleOutlined />;
                        color = 'green';
                        break;
                      case 'task':
                        icon = <MedicineBoxOutlined />;
                        color = 'red';
                        break;
                      case 'new':
                        icon = <UserOutlined />;
                        color = 'blue';
                        break;
                      case 'maintenance':
                        icon = <SettingOutlined />;
                        color = 'gray';
                        break;
                      default:
                        icon = <ClockCircleOutlined />;
                        color = 'blue';
                    }

                    return (
                      <Timeline.Item key={activity.id} dot={icon} color={color}>
                        <div>
                          <Text>{activity.content}</Text>
                          <div>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              <ClockCircleOutlined style={{ marginRight: 4 }} />
                              {activity.timestamp}
                            </Text>
                          </div>
                        </div>
                      </Timeline.Item>
                    );
                  })}
                </StyledTimeline>
              </StyledCard>
            </Col>

            <Col xs={24}>
              <StyledCard
                title={
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>今日预约</span>
                    <Button type="link" size="small">查看全部</Button>
                  </div>
                }
              >
                <List
                  itemLayout="horizontal"
                  dataSource={upcomingAppointments}
                  renderItem={item => (
                    <List.Item
                      actions={[
                        <Button type="link" size="small">详情</Button>
                      ]}
                    >
                      <List.Item.Meta
                        avatar={<Avatar icon={<UserOutlined />} />}
                        title={<span>{item.customer} - {item.doctor}</span>}
                        description={
                          <div>
                            <Tag color="blue">{item.time}</Tag>
                            <Tag color="green">{item.department}</Tag>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              </StyledCard>
            </Col>
          </Row>
        </Col>

        <Col xs={24} lg={8}>
          <StyledCard title="快速链接">
            {quickLinks.map((link, index) => (
              <QuickLinkCard key={index} hoverable>
                <Link to={link.path} style={{ display: 'block' }}>
                  <Row align="middle" gutter={16}>
                    <Col>
                      <Avatar size={40} icon={link.icon} style={{ backgroundColor: 'transparent' }} />
                    </Col>
                    <Col>
                      <div style={{ fontWeight: 500 }}>{link.title}</div>
                      <div style={{ fontSize: 12, color: 'rgba(0, 0, 0, 0.45)' }}>快速访问</div>
                    </Col>
                  </Row>
                </Link>
              </QuickLinkCard>
            ))}

            <StyledCard
              style={{ marginTop: 24, padding: '12px 24px' }}
              title="系统状态"
            >
              <Row gutter={[0, 16]}>
                <Col span={24}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text>系统运行状态</Text>
                    <Tag color="success">正常</Tag>
                  </div>
                </Col>
                <Col span={24}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text>数据库状态</Text>
                    <Tag color="success">正常</Tag>
                  </div>
                </Col>
                <Col span={24}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text>上次备份</Text>
                    <Text type="secondary">今天 03:00</Text>
                  </div>
                </Col>
                <Col span={24}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text>系统版本</Text>
                    <Text type="secondary">v1.0.0</Text>
                  </div>
                </Col>
              </Row>
            </StyledCard>
          </StyledCard>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
