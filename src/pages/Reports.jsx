import React, { useState, useEffect } from 'react';
import {
  Typography,
  Card,
  Row,
  Col,
  Button,
  Select,
  DatePicker,
  Table,
  Tabs,
  Space,
  Divider,
  Progress,
  Statistic
} from 'antd';
import {
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  DownloadOutlined,
  PrinterOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  UserOutlined,
  TeamOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import { getCustomerCount, getEmployeeCount, getDocumentCount } from '../services/dataService';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

// 样式组件
const PageHeader = styled.div`
  margin-bottom: 24px;

  h2 {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
    color: var(--text-primary);
  }
`;

const ReportCard = styled(Card)`
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

const FilterBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 16px 20px;
  background: white;
  border-radius: 12px;
  border: 1px solid var(--border-color);

  .filters {
    display: flex;
    gap: 16px;
    align-items: center;
  }

  .actions {
    display: flex;
    gap: 12px;
  }
`;

const ChartPlaceholder = styled.div`
  width: 100%;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: var(--text-secondary);
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;

  .anticon {
    font-size: 48px;
    margin-bottom: 16px;
    color: var(--primary-color);
  }
`;

const StatCard = styled(Card)`
  text-align: center;
  border-radius: 12px;

  .ant-statistic-title {
    font-size: 14px;
    color: var(--text-secondary);
  }

  .ant-statistic-content {
    font-size: 24px;
    font-weight: 600;
    color: var(--text-primary);
  }

  .anticon {
    font-size: 24px;
    margin-bottom: 12px;
    color: ${props => props.iconColor || 'var(--primary-color)'};
  }
`;

// 模拟数据
const customerData = [
  { key: '1', id: 'MA001', name: '张三', gender: '男', age: 45, location: '巴尔的摩', status: 'active', lastVisit: '2025-01-15', nextVisit: '2025-05-15' },
  { key: '2', id: 'MA002', name: '李四', gender: '男', age: 62, location: '安纳波利斯', status: 'active', lastVisit: '2025-02-10', nextVisit: '2025-06-10' },
  { key: '3', id: 'MA003', name: '王五', gender: '男', age: 58, location: '巴尔的摩', status: 'inactive', lastVisit: '2025-01-05', nextVisit: '2025-05-05' },
  { key: '4', id: 'MA004', name: '赵六', gender: '男', age: 72, location: '罗克维尔', status: 'pending', lastVisit: '2025-03-20', nextVisit: '2025-07-20' },
  { key: '5', id: 'MA005', name: '钱七', gender: '女', age: 65, location: '银泉', status: 'active', lastVisit: '2025-02-25', nextVisit: '2025-06-25' },
];

const employeeData = [
  { key: '1', id: 'EMP001', name: '张经理', gender: '男', position: 'CEO', status: 'active', joinDate: '2024-08-15' },
  { key: '2', id: 'RN001', name: '谢涵雨', gender: '女', position: 'RN', status: 'active', joinDate: '2024-09-10' },
  { key: '3', id: 'RN002', name: '宋书林', gender: '女', position: 'RN', status: 'active', joinDate: '2024-10-05' },
  { key: '4', id: 'PCA001', name: '李护士', gender: '女', position: 'PCA', status: 'active', joinDate: '2024-11-20' },
  { key: '5', id: 'PCA002', name: '王护士', gender: '男', position: 'PCA', status: 'onleave', joinDate: '2024-12-15' },
];

const Reports = () => {
  const [customerCount, setCustomerCount] = useState(0);
  const [employeeCount, setEmployeeCount] = useState(0);
  const [documentCount, setDocumentCount] = useState(0);
  const [reportType, setReportType] = useState('customer');
  const [dateRange, setDateRange] = useState(null);

  useEffect(() => {
    // 获取真实的员工和客户数量
    setCustomerCount(getCustomerCount());
    setEmployeeCount(getEmployeeCount());
    setDocumentCount(getDocumentCount());
  }, []);

  // 客户表格列
  const customerColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '性别', dataIndex: 'gender', key: 'gender' },
    { title: '年龄', dataIndex: 'age', key: 'age' },
    { title: '地点', dataIndex: 'location', key: 'location' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: status => {
        let color = 'default';
        let text = '未知';
        if (status === 'active') {
          color = 'success';
          text = '活跃';
        } else if (status === 'inactive') {
          color = 'error';
          text = '不活跃';
        } else if (status === 'pending') {
          color = 'warning';
          text = '待定';
        }
        return <span style={{ color: color === 'success' ? '#22C55E' : color === 'error' ? '#EF4444' : '#EAB308' }}>{text}</span>;
      }
    },
    { title: '上次访问', dataIndex: 'lastVisit', key: 'lastVisit' },
    { title: '下次访问', dataIndex: 'nextVisit', key: 'nextVisit' },
  ];

  // 员工表格列
  const employeeColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '性别', dataIndex: 'gender', key: 'gender' },
    { title: '职位', dataIndex: 'position', key: 'position' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: status => {
        let color = 'default';
        let text = '未知';
        if (status === 'active') {
          color = 'success';
          text = '在职';
        } else if (status === 'inactive') {
          color = 'error';
          text = '离职';
        } else if (status === 'onleave') {
          color = 'warning';
          text = '休假';
        }
        return <span style={{ color: color === 'success' ? '#22C55E' : color === 'error' ? '#EF4444' : '#EAB308' }}>{text}</span>;
      }
    },
    { title: '入职日期', dataIndex: 'joinDate', key: 'joinDate' },
  ];

  // 处理报表类型变化
  const handleReportTypeChange = (value) => {
    setReportType(value);
  };

  // 处理日期范围变化
  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  // 处理导出报表
  const handleExport = (format) => {
    console.log(`导出${reportType}报表，格式：${format}`);
    // 这里可以实现导出功能
  };

  // 处理打印报表
  const handlePrint = () => {
    console.log(`打印${reportType}报表`);
    window.print();
  };

  return (
    <div style={{ padding: '0 12px', height: 'auto', overflow: 'auto', maxHeight: '100vh' }}>
      <PageHeader>
        <h2>数据报表</h2>
      </PageHeader>

      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24} md={8}>
          <StatCard iconColor="#3B82F6">
            <UserOutlined />
            <Statistic title="客户总数" value={customerCount} />
          </StatCard>
        </Col>

        <Col xs={24} md={8}>
          <StatCard iconColor="#10B981">
            <TeamOutlined />
            <Statistic title="员工总数" value={employeeCount} />
          </StatCard>
        </Col>

        <Col xs={24} md={8}>
          <StatCard iconColor="#F59E0B">
            <FileTextOutlined />
            <Statistic title="文档总数" value={documentCount} />
          </StatCard>
        </Col>
      </Row>

      <FilterBar>
        <div className="filters">
          <Select
            defaultValue="customer"
            style={{ width: 120 }}
            onChange={handleReportTypeChange}
          >
            <Option value="customer">客户报表</Option>
            <Option value="employee">员工报表</Option>
            <Option value="document">文档报表</Option>
          </Select>

          <RangePicker
            onChange={handleDateRangeChange}
            placeholder={['开始日期', '结束日期']}
          />
        </div>

        <div className="actions">
          <Button
            type="primary"
            icon={<FileExcelOutlined />}
            onClick={() => handleExport('excel')}
          >
            导出Excel
          </Button>

          <Button
            icon={<FilePdfOutlined />}
            onClick={() => handleExport('pdf')}
          >
            导出PDF
          </Button>

          <Button
            icon={<PrinterOutlined />}
            onClick={handlePrint}
          >
            打印
          </Button>
        </div>
      </FilterBar>

      <Tabs defaultActiveKey="table">
        <TabPane tab="表格视图" key="table">
          <ReportCard>
            <Table
              dataSource={reportType === 'customer' ? customerData : employeeData}
              columns={reportType === 'customer' ? customerColumns : employeeColumns}
              pagination={{ pageSize: 10 }}
              bordered
            />
          </ReportCard>
        </TabPane>

        <TabPane tab="图表视图" key="chart">
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <ReportCard title="年龄分布">
                <ChartPlaceholder>
                  <PieChartOutlined />
                  <p>年龄分布饼图</p>
                </ChartPlaceholder>
              </ReportCard>
            </Col>

            <Col xs={24} md={12}>
              <ReportCard title="地区分布">
                <ChartPlaceholder>
                  <PieChartOutlined />
                  <p>地区分布饼图</p>
                </ChartPlaceholder>
              </ReportCard>
            </Col>

            <Col xs={24}>
              <ReportCard title="月度趋势">
                <ChartPlaceholder>
                  <LineChartOutlined />
                  <p>月度趋势线图</p>
                </ChartPlaceholder>
              </ReportCard>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="统计分析" key="analysis">
          <ReportCard>
            <Row gutter={[24, 24]}>
              <Col xs={24} md={12}>
                <Title level={4}>客户状态分布</Title>
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <Text>活跃</Text>
                    <Text>60%</Text>
                  </div>
                  <Progress percent={60} status="success" />
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <Text>不活跃</Text>
                    <Text>20%</Text>
                  </div>
                  <Progress percent={20} status="exception" />
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <Text>待定</Text>
                    <Text>20%</Text>
                  </div>
                  <Progress percent={20} status="normal" />
                </div>
              </Col>

              <Col xs={24} md={12}>
                <Title level={4}>员工职位分布</Title>
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <Text>RN</Text>
                    <Text>40%</Text>
                  </div>
                  <Progress percent={40} strokeColor="#3B82F6" />
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <Text>PCA</Text>
                    <Text>40%</Text>
                  </div>
                  <Progress percent={40} strokeColor="#10B981" />
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <Text>管理层</Text>
                    <Text>20%</Text>
                  </div>
                  <Progress percent={20} strokeColor="#8B5CF6" />
                </div>
              </Col>
            </Row>
          </ReportCard>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Reports;
