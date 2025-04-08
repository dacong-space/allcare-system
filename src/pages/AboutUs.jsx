import React, { useState, useEffect } from 'react';
import { getEmployeeCount, getCustomerCount } from '../services/dataService';
import VersionInfo from '../components/VersionInfo';
import {
  Card,
  Row,
  Col,
  Typography,
  Space,
  Divider,
  Timeline,
  Avatar,
  Statistic,
  List
} from 'antd';
import {
  TeamOutlined,
  HeartOutlined,
  TrophyOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  GlobalOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  UserOutlined
} from '@ant-design/icons';
import styled from 'styled-components';

const { Title, Paragraph, Text } = Typography;

// 样式组件
const PageContainer = styled.div`
  padding: 24px;
  background: var(--bg-primary);
  min-height: calc(100vh - 64px);
  max-height: calc(100vh - 64px);
  overflow-y: auto;
`;

const StyledCard = styled(Card)`
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03);
  margin-bottom: 24px;
  border: 1px solid var(--border-color);
  overflow: hidden;
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02);
    transform: translateY(-2px);
  }

  .ant-card-head {
    border-bottom: 1px solid var(--border-color);
    padding: 16px 24px;

    .ant-card-head-title {
      font-weight: 600;
      font-size: 16px;
      color: var(--text-primary);
    }
  }

  .ant-card-body {
    padding: 24px;
  }
`;

const Banner = styled.div`
  background: linear-gradient(135deg, var(--primary-color) 0%, #60a5fa 100%);
  border-radius: 12px;
  padding: 40px;
  margin-bottom: 24px;
  color: white;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);

  h1 {
    color: white;
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 16px;
    position: relative;
    z-index: 2;
  }

  p {
    font-size: 16px;
    max-width: 600px;
    margin-bottom: 0;
    position: relative;
    z-index: 2;
    opacity: 0.9;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 300px;
    height: 100%;
    background: url('https://cdn-icons-png.flaticon.com/512/4497/4497919.png') no-repeat;
    background-position: right center;
    background-size: contain;
    opacity: 0.2;
    z-index: 1;
  }
`;

const StatCard = styled(Card)`
  border-radius: 12px;
  text-align: center;
  height: 100%;
  border: 1px solid var(--border-color);
  transition: all 0.3s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }

  .ant-card-body {
    padding: 24px;
  }

  .anticon {
    font-size: 28px;
    color: var(--primary-color);
    margin-bottom: 16px;
  }

  .ant-statistic-title {
    color: var(--text-secondary);
    font-size: 14px;
    margin-bottom: 8px;
  }

  .ant-statistic-content {
    color: var(--text-primary);
    font-size: 24px;
    font-weight: 700;
  }
`;

const TimelineItem = styled(Timeline.Item)`
  .ant-timeline-item-tail {
    border-left: 2px solid var(--border-color);
  }

  .ant-timeline-item-head {
    background-color: var(--primary-color);
  }

  .ant-timeline-item-content {
    padding-bottom: 24px;
  }

  h4 {
    font-weight: 600;
    margin-bottom: 8px;
    color: var(--text-primary);
  }

  p {
    color: var(--text-secondary);
    margin-bottom: 0;
  }
`;

const TeamMemberCard = styled(Card)`
  border-radius: 12px;
  text-align: center;
  height: 100%;
  border: 1px solid var(--border-color);
  transition: all 0.3s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }

  .ant-card-body {
    padding: 24px;
  }

  .ant-avatar {
    margin-bottom: 16px;
    background-color: var(--primary-color);
    font-size: 24px;
    width: 80px;
    height: 80px;
    line-height: 80px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  h4 {
    font-weight: 600;
    margin-bottom: 4px;
    color: var(--text-primary);
  }

  .position {
    color: var(--primary-color);
    font-weight: 500;
    margin-bottom: 12px;
    display: block;
  }

  p {
    color: var(--text-secondary);
    font-size: 14px;
  }
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;

  .anticon {
    font-size: 18px;
    color: var(--primary-color);
    margin-right: 12px;
    background: var(--hover-color);
    padding: 10px;
    border-radius: 50%;
  }

  .content {
    flex: 1;

    h4 {
      font-weight: 600;
      margin-bottom: 4px;
      color: var(--text-primary);
    }

    p {
      color: var(--text-secondary);
      margin-bottom: 0;
    }
  }
`;

const ValueItem = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 24px;

  .anticon {
    font-size: 18px;
    color: var(--primary-color);
    margin-right: 16px;
    margin-top: 4px;
  }

  .content {
    flex: 1;

    h4 {
      font-weight: 600;
      margin-bottom: 8px;
      color: var(--text-primary);
    }

    p {
      color: var(--text-secondary);
      margin-bottom: 0;
    }
  }
`;

const AboutUs = () => {
  const [employeeCount, setEmployeeCount] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);

  useEffect(() => {
    // 获取真实的员工和客户数量
    setEmployeeCount(getEmployeeCount());
    setCustomerCount(getCustomerCount());
  }, []);
  // 公司历史数据
  const historyData = [
    {
      year: '2010',
      title: '公司成立',
      description: 'AllCare医疗管理系统公司在北京成立，致力于为医疗机构提供先进的信息化解决方案。'
    },
    {
      year: '2013',
      title: '首个产品发布',
      description: '发布首个医院管理系统产品，获得多家三甲医院的认可和采用。'
    },
    {
      year: '2015',
      title: '业务扩展',
      description: '业务范围扩展至全国，服务客户超过100家医疗机构，成为行业领先的医疗信息化服务提供商。'
    },
    {
      year: '2018',
      title: '技术创新',
      description: '引入人工智能和大数据分析技术，推出新一代智能医疗管理系统，获得行业多项技术专利。'
    },
    {
      year: '2020',
      title: '国际化发展',
      description: '开始国际化布局，产品和服务拓展至东南亚和欧洲市场，成为全球医疗信息化领域的重要参与者。'
    },
    {
      year: '2023',
      title: '持续创新',
      description: '持续投入研发，推出基于云计算的医疗管理平台，为医疗机构提供更加灵活、高效的解决方案。'
    }
  ];

  // 团队成员数据
  const teamData = [
    {
      name: '张医生',
      position: '创始人 & CEO',
      avatar: '张',
      description: '拥有20年医疗行业经验，曾任多家三甲医院信息化负责人，对医疗信息化有深入研究和独到见解。'
    },
    {
      name: '李工程',
      position: '技术总监',
      avatar: '李',
      description: '计算机科学博士，专注于医疗信息系统架构设计和人工智能应用，拥有多项技术专利。'
    },
    {
      name: '王产品',
      position: '产品总监',
      avatar: '王',
      description: '10年产品管理经验，精通医疗流程和用户体验设计，主导开发了多款成功的医疗软件产品。'
    },
    {
      name: '赵市场',
      position: '市场总监',
      avatar: '赵',
      description: '营销专家，擅长医疗行业市场策略制定和品牌建设，带领团队成功开拓国内外市场。'
    }
  ];

  // 核心价值观数据
  const valuesData = [
    {
      title: '以人为本',
      icon: <HeartOutlined />,
      description: '我们始终将用户需求放在首位，致力于开发直观、易用的医疗管理系统，提升医护人员工作效率和客户体验。'
    },
    {
      title: '技术创新',
      icon: <TrophyOutlined />,
      description: '持续投入研发，不断探索新技术在医疗领域的应用，为客户提供最先进、最可靠的解决方案。'
    },
    {
      title: '专业服务',
      icon: <CheckCircleOutlined />,
      description: '拥有专业的实施和服务团队，为客户提供全方位的技术支持和培训，确保系统稳定运行。'
    },
    {
      title: '合作共赢',
      icon: <TeamOutlined />,
      description: '与医疗机构、行业专家和技术伙伴紧密合作，共同推动医疗信息化发展，创造更大的社会价值。'
    }
  ];

  return (
    <PageContainer>
      <Banner>
        <h1>关于 AllCare 医疗管理系统</h1>
        <p>AllCare 是一家专注于医疗信息化的高科技企业，致力于为医疗机构提供全面、高效、智能的管理解决方案，帮助提升医疗服务质量和运营效率。</p>
      </Banner>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={16}>
          <StyledCard title="公司简介">
            <Paragraph>
              AllCare医疗管理系统公司成立于2010年，是一家专注于医疗信息化的高科技企业。我们的使命是通过先进的技术和专业的服务，帮助医疗机构提升管理效率和服务质量，为客户提供更好的医疗体验。
            </Paragraph>
            <Paragraph>
              经过十余年的发展，AllCare已经成为医疗信息化领域的领先企业，产品和服务覆盖全国数百家医疗机构，并逐步拓展至国际市场。我们的团队由医疗专家、技术精英和管理人才组成，拥有丰富的行业经验和专业知识。
            </Paragraph>
            <Paragraph>
              我们始终坚持以客户需求为导向，不断创新和完善产品，提供包括医院管理系统、临床信息系统、医疗大数据分析等全方位的解决方案，助力医疗机构实现数字化转型和智能化管理。
            </Paragraph>
          </StyledCard>

          <StyledCard title="发展历程">
            <Timeline>
              {historyData.map((item, index) => (
                <TimelineItem key={index} color="blue">
                  <h4>{item.year} - {item.title}</h4>
                  <p>{item.description}</p>
                </TimelineItem>
              ))}
            </Timeline>
          </StyledCard>
        </Col>

        <Col xs={24} md={8}>
          <StyledCard title="公司数据">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <StatCard bordered={false}>
                  <TeamOutlined />
                  <Statistic title="员工人数" value={employeeCount} />
                </StatCard>
              </Col>
              <Col span={12}>
                <StatCard bordered={false}>
                  <GlobalOutlined />
                  <Statistic title="服务国家" value={15} />
                </StatCard>
              </Col>
              <Col span={12}>
                <StatCard bordered={false}>
                  <TrophyOutlined />
                  <Statistic title="技术专利" value={45} />
                </StatCard>
              </Col>
              <Col span={12}>
                <StatCard bordered={false}>
                  <UserOutlined />
                  <Statistic title="客户总数" value={customerCount} />
                </StatCard>
              </Col>
            </Row>
          </StyledCard>

          <StyledCard title="联系我们">
            <ContactItem>
              <EnvironmentOutlined />
              <div className="content">
                <h4>公司地址</h4>
                <p>北京市海淀区中关村科技园区8号楼</p>
              </div>
            </ContactItem>
            <ContactItem>
              <PhoneOutlined />
              <div className="content">
                <h4>联系电话</h4>
                <p>400-123-4567</p>
              </div>
            </ContactItem>
            <ContactItem>
              <MailOutlined />
              <div className="content">
                <h4>电子邮箱</h4>
                <p>contact@allcare.com</p>
              </div>
            </ContactItem>
            <ContactItem>
              <ClockCircleOutlined />
              <div className="content">
                <h4>工作时间</h4>
                <p>周一至周五 9:00-18:00</p>
              </div>
            </ContactItem>
          </StyledCard>
        </Col>
      </Row>

      <StyledCard title="核心价值观">
        <Row gutter={[32, 24]}>
          {valuesData.map((item, index) => (
            <Col xs={24} sm={12} md={6} key={index}>
              <ValueItem>
                {item.icon}
                <div className="content">
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                </div>
              </ValueItem>
            </Col>
          ))}
        </Row>
      </StyledCard>

      <StyledCard title="管理团队">
        <Row gutter={[24, 24]}>
          {teamData.map((member, index) => (
            <Col xs={24} sm={12} md={6} key={index}>
              <TeamMemberCard bordered={false}>
                <Avatar size={80}>{member.avatar}</Avatar>
                <h4>{member.name}</h4>
                <span className="position">{member.position}</span>
                <p>{member.description}</p>
              </TeamMemberCard>
            </Col>
          ))}
        </Row>
      </StyledCard>

      <VersionInfo />
    </PageContainer>
  );
};

export default AboutUs;
