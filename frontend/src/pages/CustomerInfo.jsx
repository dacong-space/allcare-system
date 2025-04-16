import React, { useState, useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import { setCustomerCount } from '../services/dataService';
import ModernExpandButton from '../components/ModernExpandButton';
import {
  Card,
  Table,
  Button,
  Input,
  Space,
  Tag,
  Avatar,
  Dropdown,
  Typography,
  Row,
  Col,
  Modal,
  Form,
  Select,
  message,
  DatePicker,
  Tooltip
} from 'antd';
import {
  SearchOutlined,
  UserOutlined,
  UserAddOutlined,
  EditOutlined,
  DeleteOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  EllipsisOutlined,
  DownloadOutlined,
  FileOutlined,
  FileExcelOutlined,
  CodeOutlined
} from '@ant-design/icons';
import { MinimalistManIcon, MinimalistWomanIcon } from '../components/CustomIcons';
// import ScrollIndicator from '../components/ScrollIndicator';
import styled from 'styled-components';

const { Title } = Typography;

// 样式组件
const PageContainer = styled.div`
  padding: 20px 24px 24px;
  background: var(--bg-primary);
  min-height: calc(100vh - 64px);
  max-height: calc(100vh - 64px);
  overflow-y: auto;
`;

const PageHeader = styled.div`
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    font-size: 20px;
    font-weight: 600;
    margin: 0;
    color: var(--text-primary);
  }
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 16px;

  .ant-input-affix-wrapper {
    border-radius: 8px;
    width: 300px;
  }
`;

const TableCard = styled(Card)`
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03);
  overflow: hidden;

  .ant-card-body {
    padding: 0;
  }

  .ant-table {
    background: transparent;
  }

  .ant-table-thead > tr > th {
    background: var(--bg-secondary);
    font-weight: 600;
    color: var(--text-primary);
    padding: 16px;
    border-bottom: 1px solid var(--border-color);
    text-align: center;
  }

  .ant-table-tbody > tr > td {
    border-bottom: 1px solid var(--border-color);
    padding: 16px;
    transition: background 0.2s;
    text-align: center;
  }

  .ant-table-tbody > tr:hover > td {
    background: var(--hover-color);
  }

  .ant-table-tbody > tr.edited-row > td {
    background: #ecfdf5;
    animation: highlight-fade 3s ease-in-out;
  }

  .ant-pagination {
    margin: 16px;
    padding: 0;
  }

  @keyframes highlight-fade {
    0%, 70% { background-color: #d1fae5; }
    100% { background-color: #ecfdf5; }
  }
`;

const ActionButton = styled(Button)`
  border-radius: 6px;
  height: 32px;
  padding: 0 16px;
  font-size: 14px;
  font-weight: 500;

  &.ant-btn-primary {
    background: var(--primary-color);
    border-color: var(--primary-color);
  }

  .anticon {
    font-size: 14px;
    margin-right: 6px;
  }
`;

const StatusTag = styled(Tag)`
  border-radius: 12px;
  padding: 2px 12px;
  font-size: 12px;
  border: none;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 24px;

  &.active {
    background: #dcfce7;
    color: #16a34a;
  }

  &.inactive {
    background: #fee2e2;
    color: #dc2626;
  }

  &.pending {
    background: #fef3c7;
    color: #d97706;
  }
`;

const CustomerDetailCard = styled(Card)`
  border-radius: 8px;
  margin-bottom: 0;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);

  .ant-card-body {
    padding: 16px 20px;
  }

  h5 {
    color: var(--text-primary);
    font-weight: 600;
    font-size: 15px;
    margin-bottom: 16px;
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 8px;
    display: block;
    text-align: left;
  }
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;

  .icon {
    margin-right: 10px;
    color: var(--primary-color);
    font-size: 14px;
  }

  .label {
    color: var(--text-secondary);
    margin-right: 6px;
    font-size: 14px;
  }

  .value {
    color: var(--text-primary);
    font-weight: 500;
    font-size: 14px;
  }
`;

const CustomerInfo = () => {
  const [searchText, setSearchText] = useState('');
  const [customerData, setCustomerData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [editedRowKey, setEditedRowKey] = useState(null);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [form] = Form.useForm();
  const notesContainerRefs = useRef({});

  import { API_BASE } from '../utils/api';

// 处理行展开/收起
  const handleExpand = (expanded, record) => {
    if (expanded) {
      // 展开当前行，自动收起其他行
      setExpandedRowKeys([record.id]);
    } else {
      // 收起当前行
      setExpandedRowKeys([]);
    }
  };

  // 初始化客户数据（仅从后端接口获取）
  useEffect(() => {
    fetch(`${API_BASE}/customers`, {
  headers: {
    'Authorization': `Bearer ${sessionStorage.getItem('token') || localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  }
})
      .then(res => res.json())
      .then(result => {
        if (result && result.code === 0) {
          setCustomerData(result.data);
          setCustomerCount(result.data.length);
        } else {
          setCustomerData([]);
          setCustomerCount(0);
        }
      })
      .catch(() => {
        setCustomerData([]);
        setCustomerCount(0);
      });
  }, []);


  // 过滤客户数据
  const filteredCustomers = customerData.filter(customer =>
    searchText === '' ||
    customer.name.toLowerCase().includes(searchText.toLowerCase()) ||
    customer.id.toLowerCase().includes(searchText.toLowerCase()) ||
    (customer.rn && customer.rn.toLowerCase().includes(searchText.toLowerCase())) ||
    (customer.pca && customer.pca.toLowerCase().includes(searchText.toLowerCase())) ||
    customer.city.toLowerCase().includes(searchText.toLowerCase()) ||
    (customer.hours && customer.hours.toLowerCase().includes(searchText.toLowerCase())) ||
    (customer.status && customer.status.toLowerCase().includes(searchText.toLowerCase()))
  );

  // 获取状态标签
  const getStatusTag = (status) => {
    let color = '';
    let text = '';

    switch (status) {
      case 'active':
        color = 'active';
        text = '活跃';
        break;
      case 'inactive':
        color = 'inactive';
        text = '不活跃';
        break;
      case 'pending':
        color = 'pending';
        text = '待定';
        break;
      default:
        color = '';
        text = status;
    }

    return <StatusTag className={color}>{text}</StatusTag>;
  };

  // 表格列定义
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 120,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      render: (text, record) => (
        <Space>
          {record.gender === '男' ? (
            <Avatar style={{ backgroundColor: '#f0f2f5', color: '#1890ff' }} icon={<MinimalistManIcon />} />
          ) : (
            <Avatar style={{ backgroundColor: '#f0f2f5', color: '#eb2f96' }} icon={<MinimalistWomanIcon />} />
          )}
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: '语言',
      dataIndex: 'language',
      key: 'language',
      width: 100,
      render: (languages) => {
        if (Array.isArray(languages) && languages.length > 0) {
          if (languages.length === 1) {
            return languages[0];
          } else {
            // 如果有多种语言，显示第一种，并在悬停时显示所有语言
            return (
              <Tooltip title={languages.join(', ')}>
                <span style={{ cursor: 'pointer' }}>
                  {languages[0]} <small style={{ color: '#999', fontSize: '12px', verticalAlign: 'middle' }}>..</small>
                </span>
              </Tooltip>
            );
          }
        }
        return '-';
      },
    },
    {
      title: 'Hr/week',
      dataIndex: 'hours',
      key: 'hours',
      width: 130,
      sorter: (a, b) => {
        // 直接比较数字
        const hoursA = parseInt(a.hours);
        const hoursB = parseInt(b.hours);
        return hoursA - hoursB;
      },
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: '积分',
      dataIndex: 'points',
      key: 'points',
      width: 100,
      sorter: (a, b) => a.points - b.points,
      sortDirections: ['ascend', 'descend'],
    },

    {
      title: '地点',
      dataIndex: 'city',
      key: 'city',
      width: 120,
    },
    {
      title: 'RN',
      dataIndex: 'rn',
      key: 'rn',
      width: 110,
      sorter: (a, b) => {
        // 处理空值情况
        if (!a.rn && !b.rn) return 0;
        if (!a.rn) return 1;
        if (!b.rn) return -1;
        return a.rn.localeCompare(b.rn);
      },
      sortDirections: ['ascend', 'descend'],
      render: (text) => text || '-',
    },
    {
      title: 'PCA',
      dataIndex: 'pca',
      key: 'pca',
      width: 110,
      sorter: (a, b) => {
        // 处理空值情况
        if (!a.pca && !b.pca) return 0;
        if (!a.pca) return 1;
        if (!b.pca) return -1;
        return a.pca.localeCompare(b.pca);
      },
      sortDirections: ['ascend', 'descend'],
      render: (text) => text || '-',
    },
    {
      title: '下次家访日期',
      key: 'nextVisitDate',
      width: 140,
      render: (_, record) => {
        // 如果有最新家访日期，计算下次家访日期（4个月后）
        if (record.lastVisitDate) {
          const lastVisitDate = new Date(record.lastVisitDate);
          const nextVisitDate = new Date(lastVisitDate);
          nextVisitDate.setMonth(nextVisitDate.getMonth() + 4);

          // 格式化为 MM/DD/YYYY
          const month = (nextVisitDate.getMonth() + 1).toString().padStart(2, '0');
          const day = nextVisitDate.getDate().toString().padStart(2, '0');
          const year = nextVisitDate.getFullYear();

          return `${month}/${day}/${year}`;
        }
        return '-';
      },
      sorter: (a, b) => {
        if (!a.lastVisitDate && !b.lastVisitDate) return 0;
        if (!a.lastVisitDate) return 1;
        if (!b.lastVisitDate) return -1;

        const aDate = new Date(a.lastVisitDate);
        const bDate = new Date(b.lastVisitDate);
        aDate.setMonth(aDate.getMonth() + 4);
        bDate.setMonth(bDate.getMonth() + 4);

        return aDate - bDate;
      },
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: '状态',
      key: 'status',
      dataIndex: 'status',
      width: 110,
      render: (status) => getStatusTag(status),
      filters: [
        { text: '活跃', value: 'active' },
        { text: '待定', value: 'pending' },
        { text: '不活跃', value: 'inactive' },
      ],
      onFilter: (value, record) => record.status === value,
      filterMultiple: false,
    },
    {
      title: '操作',
      key: 'action',
      width: 90,
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              {
                key: '1',
                icon: <EditOutlined />,
                label: '编辑',
                onClick: () => handleEdit(record)
              },
              {
                key: '2',
                icon: <DeleteOutlined />,
                label: '删除',
                danger: true,
                onClick: () => showDeleteConfirm(record)
              },
            ],
          }}
          placement="bottomRight"
          trigger={['click']}
        >
          <Button type="text" icon={<EllipsisOutlined />} />
        </Dropdown>
      ),
    },
  ];

  // 显示添加客户模态框
  const showAddModal = () => {
    setCurrentCustomer(null);
    form.resetFields();
    setExpandedRowKeys([]);

    // 不预填客户ID
    form.setFieldsValue({
      id: ''
    });

    setIsModalVisible(true);
  };

  // 显示编辑客户模态框
  const handleEdit = (record) => {
    setCurrentCustomer(record);
    setExpandedRowKeys([]);

    // 处理日期格式
    const joinDateValue = record.joinDate ? dayjs(record.joinDate) : null;

    // 准备紧急联系人信息
    const emergencyContact = record.emergencyContact || {};

    form.setFieldsValue({
      id: record.id,
      name: record.name,
      age: record.age,
      gender: record.gender,
      language: record.language,
      phone: record.phone,
      email: record.email,
      city: record.city,
      address: record.address,
      hours: record.hours || '',
      joinDate: joinDateValue,
      joinCount: record.joinCount,
      status: record.status,
      points: record.points,
      preferredDates: record.preferredDates,
      rn: record.rn,
      pca: record.pca,
      supportPlanner: record.supportPlanner,
      lastVisitDate: record.lastVisitDate ? dayjs(record.lastVisitDate) : null,
      // 紧急联系人信息
      emergencyContactName: emergencyContact.name || '',
      emergencyContactRelationship: emergencyContact.relationship || '',
      emergencyContactPhone: emergencyContact.phone || '',
      notes: record.notes || '' // 添加备注字段的初始化
    });
    setIsModalVisible(true);
  };

  // 显示删除确认
  const showDeleteConfirm = (record) => {
    setCurrentCustomer(record);
    setExpandedRowKeys([]);
    setIsDeleteModalVisible(true);
  };

  // 处理添加/编辑提交
  const handleSubmit = () => {
    form.validateFields().then(values => {
      // 处理日期格式
      if (values.joinDate) {
        values.joinDate = values.joinDate.format('YYYY-MM-DD');
      }
      if (values.lastVisitDate) {
        values.lastVisitDate = values.lastVisitDate.format('YYYY-MM-DD');
      }

      // 处理工时格式 - 只保留数字
      if (values.hours) {
        values.hours = values.hours.replace(/[^0-9]/g, '');
      }

      if (currentCustomer) {
        // 编辑现有客户，调用后端接口
        let emergencyContact = null;
        if (values.emergencyContactName || values.emergencyContactRelationship || values.emergencyContactPhone) {
          emergencyContact = {
            name: values.emergencyContactName,
            relationship: values.emergencyContactRelationship,
            phone: values.emergencyContactPhone
          };
        }
        const updatedCustomer = {
          name: values.name,
          age: values.age,
          gender: values.gender,
          language: values.language || [],
          phone: values.phone,
          email: values.email,
          city: values.city,
          address: values.address,
          hours: values.hours,
          joinDate: values.joinDate,
          joinCount: values.joinCount,
          status: values.status,
          points: values.points,
          preferredDates: values.preferredDates || [],
          rn: values.rn,
          pca: values.pca,
          supportPlanner: values.supportPlanner,
          lastVisitDate: values.lastVisitDate,
          emergencyContact: emergencyContact,
          notes: values.notes
        };
        fetch(`${API_BASE}/customers/${currentCustomer.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionStorage.getItem('token') || localStorage.getItem('token')}`
          },
          body: JSON.stringify(updatedCustomer)
        })
          .then(res => res.json())
          .then(result => {
            if (result && result.code === 0) {
              message.success('客户信息已更新');
              setIsModalVisible(false);
              // 重新拉取客户数据
              fetch(`${API_BASE}/customers`, {
                headers: {
                  Authorization: `Bearer ${sessionStorage.getItem('token') || localStorage.getItem('token')}`,
                  'Content-Type': 'application/json'
                }
              })
                .then(res => res.json())
                .then(result => {
                  if (result && result.code === 0) {
                    setCustomerData(result.data);
                    setCustomerCount(result.data.length);
                  }
                });
            } else {
              message.error('更新失败');
            }
          })
          .catch(() => {
            message.error('网络错误，更新失败');
          });
      } else {
        // 添加新客户，调用后端接口
        let customerId = values.id;
        if (!customerId || customerId.trim() === '') {
          const randomNum = Math.floor(Math.random() * 900) + 100; // 100-999的随机数
          customerId = `MA${randomNum}`;
        }

        const newCustomer = {
          id: customerId,
          name: values.name,
          age: values.age,
          gender: values.gender,
          language: values.language || [],
          phone: values.phone,
          email: values.email,
          city: values.city,
          address: values.address,
          hours: values.hours,
          joinDate: values.joinDate,
          joinCount: values.joinCount,
          status: values.status,
          points: values.points,
          preferredDates: values.preferredDates || [],
          rn: values.rn,
          pca: values.pca,
          supportPlanner: values.supportPlanner,
          lastVisitDate: values.lastVisitDate,
          notes: values.notes || ''
        };

        // 添加紧急联系人信息（如果有）
        if (values.emergencyContactName || values.emergencyContactRelationship || values.emergencyContactPhone) {
          newCustomer.emergencyContact = {
            name: values.emergencyContactName,
            relationship: values.emergencyContactRelationship,
            phone: values.emergencyContactPhone
          };
        }

        fetch(`${API_BASE}/customers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionStorage.getItem('token') || localStorage.getItem('token')}`
          },
          body: JSON.stringify(newCustomer)
        })
          .then(res => res.json())
          .then(result => {
            if (result && result.code === 0) {
              message.success('客户添加成功');
              setIsModalVisible(false);
              // 重新拉取客户数据
              fetch(`${API_BASE}/customers`, {
                headers: {
                  Authorization: `Bearer ${sessionStorage.getItem('token') || localStorage.getItem('token')}`,
                  'Content-Type': 'application/json'
                }
              })
                .then(res => res.json())
                .then(result => {
                  if (result && result.code === 0) {
                    setCustomerData(result.data);
                    setCustomerCount(result.data.length);
                  }
                });
            } else {
              message.error('添加失败');
            }
          })
          .catch(() => {
            message.error('网络错误，添加失败');
          });
      }

      // 更新客户数量
      setCustomerCount(customerData.length + (currentCustomer ? 0 : 1));
      setIsModalVisible(false);
      setExpandedRowKeys([]);
    });
  };

  // 处理导出数据
  const handleExport = (type) => {
    try {
      switch (type) {
        case 'json':
          // 导出JSON - 导出完整数据结构
          const jsonData = JSON.stringify(customerData, null, 2);
          const jsonBlob = new Blob([jsonData], { type: 'application/json' });
          const jsonUrl = URL.createObjectURL(jsonBlob);
          const jsonLink = document.createElement('a');
          jsonLink.href = jsonUrl;
          jsonLink.download = '客户数据.json';
          jsonLink.click();
          URL.revokeObjectURL(jsonUrl);
          message.success('客户数据已导出为JSON格式');
          break;

        case 'excel':
          // 导出Excel (CSV) - 导出完整数据结构
          // 添加BOM头解决中文乱码问题
          const BOM = '\uFEFF';

          // 按照指定的顺序排列字段
          const fieldOrder = [
            'id',            // ID
            'name',          // 姓名
            'age',           // 年龄
            'gender',        // 性别
            'language',      // 语言
            'phone',         // 电话
            'email',         // 邮箱
            'city',          // 城市
            'address',       // 地址
            'hours',         // 工时
            'joinDate',      // 加入时间
            'joinCount',     // 第几次加入
            'status',        // 状态
            'points',        // 积分
            'preferredDates', // 偏好日期
            'rn',            // RN
            'pca',           // PCA
            'supportPlanner', // Support Planner
            'lastVisitDate'  // 最新家访日期
          ];

          // 获取所有存在的字段
          const existingFields = new Set();
          customerData.forEach(customer => {
            Object.keys(customer).forEach(key => {
              // 排除嵌套对象
              if (typeof customer[key] !== 'object' || customer[key] === null) {
                existingFields.add(key);
              }
            });
          });

          // 按照指定的顺序过滤字段，只保留存在的字段
          const fieldArray = fieldOrder.filter(field => existingFields.has(field));

          // 添加可能存在但未在指定顺序中的字段
          Array.from(existingFields)
            .filter(field => !fieldOrder.includes(field))
            .forEach(field => fieldArray.push(field));

          // 创建CSV头
          let csvContent = BOM + fieldArray.join(',') + '\n';

          // 添加数据行
          customerData.forEach(customer => {
            const row = fieldArray.map(field => {
              // 处理普通字段
              if (customer[field] === undefined || customer[field] === null) {
                return '';
              } else if (typeof customer[field] === 'object') {
                return `"${JSON.stringify(customer[field]).replace(/"/g, '""')}"`;
              } else {
                // 将字符串包裹在引号中，并将引号转义
                return `"${String(customer[field]).replace(/"/g, '""')}"`;
              }
            }).join(',');
            csvContent += row + '\n';
          });

          const csvBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
          const csvUrl = URL.createObjectURL(csvBlob);
          const csvLink = document.createElement('a');
          csvLink.href = csvUrl;
          csvLink.download = '客户数据.csv';
          csvLink.click();
          URL.revokeObjectURL(csvUrl);
          message.success('客户数据已导出为Excel格式');
          break;

        default:
          message.error('不支持的导出格式');
      }
    } catch (error) {
      console.error('导出数据时出错:', error);
      message.error('导出数据时出错');
    }
  };

  // 处理删除
  const handleDelete = () => {
    if (!currentCustomer) return;
    fetch(`${API_BASE}/customers/${currentCustomer.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token') || localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(result => {
        if (result && result.code === 0) {
          message.success({
            content: `已删除客户 ${currentCustomer?.name} 的信息`,
            icon: <DeleteOutlined style={{ color: '#ef4444' }} />
          });
          // 重新拉取客户数据
          fetch(`${API_BASE}/customers`, {
  headers: {
    'Authorization': `Bearer ${sessionStorage.getItem('token') || localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  },
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem('token') || localStorage.getItem('token')}`
            }
          })
            .then(res => res.json())
            .then(result => {
              if (result && result.code === 0) {
                setCustomerData(result.data);
                setCustomerCount(result.data.length);
              }
            });
          setIsDeleteModalVisible(false);
          setExpandedRowKeys([]);
        } else {
          message.error('删除失败');
        }
      })
      .catch(() => {
        message.error('网络错误，删除失败');
      });
  };

  // 展开行渲染
  const expandedRowRender = (record) => {
    return (
      <CustomerDetailCard>
        <Row gutter={[24, 16]}>
          {/* 第一行 */}
          <Col span={8}>
            <Title level={5}>基本信息</Title>
            <DetailItem>
              <UserOutlined className="icon" />
              <span className="label">ID:</span>
              <span className="value">{record.id}</span>
            </DetailItem>
            <DetailItem>
              <UserOutlined className="icon" />
              <span className="label">姓名:</span>
              <span className="value">{record.name}</span>
            </DetailItem>
            <DetailItem>
              <UserOutlined className="icon" />
              <span className="label">性别:</span>
              <span className="value">{record.gender}</span>
            </DetailItem>
            <DetailItem>
              <UserOutlined className="icon" />
              <span className="label">年龄:</span>
              <span className="value">{record.age}</span>
            </DetailItem>
          </Col>

          <Col span={8}>
            <Title level={5}>时间信息</Title>
            <DetailItem>
              <CalendarOutlined className="icon" />
              <span className="label">Hr/week:</span>
              <span className="value">{record.hours}</span>
            </DetailItem>
            <DetailItem>
              <CalendarOutlined className="icon" />
              <span className="label">首次加入时间:</span>
              <span className="value">{record.joinDate}</span>
            </DetailItem>
            <DetailItem>
              <CalendarOutlined className="icon" />
              <span className="label">结束时间:</span>
              <span className="value">{record.endDate || '无'}</span>
            </DetailItem>
            <DetailItem>
              <CalendarOutlined className="icon" />
              <span className="label">第几次加入:</span>
              <span className="value">{record.joinCount}</span>
            </DetailItem>
          </Col>

          <Col span={8}>
            <Title level={5}>其他信息</Title>
            <DetailItem>
              <UserOutlined className="icon" />
              <span className="label">积分:</span>
              <span className="value">{record.points}</span>
            </DetailItem>
            <DetailItem>
              <CalendarOutlined className="icon" />
              <span className="label">偏好日期:</span>
              <span className="value">{record.preferredDates ? record.preferredDates.join(', ') : '无'}</span>
            </DetailItem>
            <DetailItem>
              <UserOutlined className="icon" />
              <span className="label">RN:</span>
              <span className="value">{record.rn || '无'}</span>
            </DetailItem>
            <DetailItem>
              <UserOutlined className="icon" />
              <span className="label">PCA:</span>
              <span className="value">{record.pca || '无'}</span>
            </DetailItem>
            <DetailItem>
              <UserOutlined className="icon" />
              <span className="label">Support Planner:</span>
              <span className="value">{record.supportPlanner || '无'}</span>
            </DetailItem>
            <DetailItem>
              <CalendarOutlined className="icon" />
              <span className="label">最新家访日期:</span>
              <span className="value">{record.lastVisitDate || '无'}</span>
            </DetailItem>
          </Col>

          {/* 第二行 */}
          <Col span={8}>
            <Title level={5}>联系信息</Title>
            <DetailItem>
              <PhoneOutlined className="icon" />
              <span className="label">电话:</span>
              <span className="value">{record.phone}</span>
            </DetailItem>
            <DetailItem>
              <MailOutlined className="icon" />
              <span className="label">邮箱:</span>
              <span className="value">{record.email}</span>
            </DetailItem>
            <DetailItem>
              <UserOutlined className="icon" />
              <span className="label">语言:</span>
              <span className="value">
                {Array.isArray(record.language)
                  ? record.language.join(', ')
                  : record.language || '-'}
              </span>
            </DetailItem>
          </Col>

          <Col span={8}>
            <Title level={5}>地址信息</Title>
            <DetailItem>
              <EnvironmentOutlined className="icon" />
              <span className="label">城市:</span>
              <span className="value">{record.city}</span>
            </DetailItem>
            <DetailItem>
              <EnvironmentOutlined className="icon" />
              <span className="label">地址:</span>
              <span className="value">{record.address}</span>
            </DetailItem>
          </Col>

          <Col span={8}>
            <Title level={5}>紧急联系人</Title>
            {record.emergencyContact ? (
              <>
                <DetailItem>
                  <UserOutlined className="icon" />
                  <span className="label">姓名:</span>
                  <span className="value">{record.emergencyContact.name}</span>
                </DetailItem>
                <DetailItem>
                  <UserOutlined className="icon" />
                  <span className="label">关系:</span>
                  <span className="value">{record.emergencyContact.relationship}</span>
                </DetailItem>
                <DetailItem>
                  <PhoneOutlined className="icon" />
                  <span className="label">电话:</span>
                  <span className="value">{record.emergencyContact.phone}</span>
                </DetailItem>
              </>
            ) : (
              <DetailItem>
                <span className="value">暂无紧急联系人信息</span>
              </DetailItem>
            )}
          </Col>

          {/* 备注区域 */}
          <Col span={24} style={{ marginTop: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Title level={5} style={{ margin: 0, marginBottom: '8px' }}>备注</Title>
              {record.notes && (
                <span style={{
                  fontSize: '0.7rem',
                  color: 'rgba(0, 0, 0, 0.45)',
                  marginLeft: '8px',
                  marginBottom: '8px'
                }}>
                  ({record.notes.split('\n').length}行备注)
                </span>
              )}
            </div>
            <div
              ref={el => notesContainerRefs.current[record.id] = el}
              className="notes-display"
              style={{
                height: '100px',
                padding: '12px',
                border: '1px solid var(--border-color)',
                borderRadius: '4px',
                background: 'var(--bg-secondary)',
                textAlign: 'left',
                overflowY: 'scroll', // 强制始终显示竖向滚动条
                scrollbarGutter: 'stable', // 保留滚动条空间，防止内容跳动
                resize: 'vertical',
                maxHeight: '300px',
                position: 'relative', // 添加相对定位以确保滚动条正确显示
                paddingRight: '15px' // 为滚动条留出空间
              }}
            >
              {record.notes ? (
                <div
                  style={{
                    whiteSpace: 'pre-wrap',
                    textAlign: 'left',
                    width: '100%',
                    paddingRight: '10px', // 留出空间给滚动条
                    minHeight: '80px' // 确保内容高度足够，使滚动条始终显示
                  }}
                >
                  {record.notes}
                </div>
              ) : (
                <p style={{ textAlign: 'left' }}>暂无备注</p>
              )}

            </div>
          </Col>
        </Row>
      </CustomerDetailCard>
    );
  };

  return (
    <PageContainer>
      <PageHeader>
        <h2>客户信息管理</h2>
        <SearchContainer>
          <Input
            placeholder="搜索 ID, 姓名, RN, PCA, Hr/week, 地点, 状态..."
            prefix={<SearchOutlined style={{ color: 'var(--text-secondary)' }} />}
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
          />
          <ActionButton type="primary" icon={<UserAddOutlined />} onClick={showAddModal}>
            添加客户
          </ActionButton>
          <Dropdown
            menu={{
              items: [
                {
                  key: 'json',
                  label: '导出JSON',
                  icon: <FileOutlined />,
                  onClick: () => handleExport('json')
                },
                {
                  key: 'excel',
                  label: '导出Excel',
                  icon: <FileExcelOutlined />,
                  onClick: () => handleExport('excel')
                },
                {
                  key: 'console',
                  label: '在控制台查看',
                  icon: <CodeOutlined />,
                  onClick: () => {
                    console.log('\n\n客户数据结构示例：', customerData[0]);
                    message.success('客户数据结构已打印到控制台，请按F12查看');
                  }
                }
              ]
            }}
            trigger={['click']}
          >
            <Button icon={<DownloadOutlined />} style={{ marginLeft: 8 }} />
          </Dropdown>
        </SearchContainer>
      </PageHeader>

      <TableCard>
        <Table
          columns={columns}
          dataSource={filteredCustomers}
          rowKey="id"
          rowClassName={(record) => record.id === editedRowKey ? 'edited-row' : ''}
          expandable={{
            expandedRowRender,
            expandedRowKeys: expandedRowKeys,
            onExpand: handleExpand,
            rowExpandable: () => true,
            expandIcon: ({ expanded, onExpand, record }) => (
              <ModernExpandButton
                expanded={expanded}
                onClick={() => onExpand(record, !expanded)}
              />
            )
          }}
          pagination={{
            position: ['bottomCenter'],
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
            showTotal: (total) => `共 ${total} 条记录`,
            style: { marginTop: '16px', marginBottom: '16px' }
          }}
        />
      </TableCard>

      {/* 添加/编辑客户模态框 */}
      <Modal
        title={currentCustomer ? "编辑客户信息" : "添加新客户"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={handleSubmit}>
            {currentCustomer ? "保存" : "添加"}
          </Button>,
        ]}
        styles={{ body: { padding: '24px' } }}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ status: 'active' }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item
              name="id"
              label="ID (MA#)"
              rules={[{ required: false }]}
            >
              <Input placeholder="请输入ID（格式：MA+数字）" disabled={!!currentCustomer} />
            </Form.Item>

            <Form.Item
              name="name"
              label="姓名"
              rules={[{ required: true, message: '请输入姓名' }]}
            >
              <Input placeholder="请输入姓名" />
            </Form.Item>

            <Form.Item
              name="age"
              label="年龄"
              rules={[{ required: true, message: '请输入年龄' }]}
            >
              <Input type="number" min={1} max={120} placeholder="请输入年龄" />
            </Form.Item>

            <Form.Item
              name="gender"
              label="性别"
              rules={[{ required: true, message: '请选择性别' }]}
            >
              <Select>
                <Select.Option value="男">男</Select.Option>
                <Select.Option value="女">女</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="language"
              label="语言"
              rules={[{ required: true, message: '请选择语言' }]}
            >
              <Select
                mode="multiple"
                placeholder="请选择语言"
                style={{ width: '100%' }}
              >
                <Select.Option value="中文">中文</Select.Option>
                <Select.Option value="粤语">粤语</Select.Option>
                <Select.Option value="福州话">福州话</Select.Option>
                <Select.Option value="英语">英语</Select.Option>
                <Select.Option value="西班牙语">西班牙语</Select.Option>
                <Select.Option value="法语">法语</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="phone"
              label="电话"
              rules={[{ required: true, message: '请输入电话' }]}
            >
              <Input
                placeholder="请输入电话"
                maxLength={14} // (XXX)-XXX-XXXX 格式的最大长度
                onChange={(e) => {
                  // 去除非数字字符
                  const value = e.target.value.replace(/\D/g, '');
                  if (value.length <= 10) {
                    // 格式化为 (XXX)-XXX-XXXX
                    let formattedValue = value;
                    if (value.length > 3 && value.length <= 6) {
                      formattedValue = `(${value.slice(0, 3)})-${value.slice(3)}`;
                    } else if (value.length > 6) {
                      formattedValue = `(${value.slice(0, 3)})-${value.slice(3, 6)}-${value.slice(6)}`;
                    } else if (value.length > 0) {
                      formattedValue = `(${value}`;
                    }
                    form.setFieldValue('phone', formattedValue);
                  }
                }}
              />
            </Form.Item>

            <Form.Item
              name="email"
              label="邮箱"
              rules={[
                { type: 'email', message: '请输入有效的邮箱地址' }
              ]}
            >
              <Input placeholder="请输入邮箱" />
            </Form.Item>

            <Form.Item
              name="city"
              label="城市"
            >
              <Input placeholder="请输入城市" />
            </Form.Item>

            <Form.Item
              name="hours"
              label="Hr/week"
              rules={[{ required: true, message: '请输入Hr/week' }]}
            >
              <Input
                placeholder="请输入小时数"
                maxLength={3} // 限制最多输入三位数字
                onChange={(e) => {
                  // 去除非数字字符
                  const value = e.target.value.replace(/\D/g, '');
                  if (value || value === '') {
                    form.setFieldValue('hours', value);
                  }
                }}
              />
            </Form.Item>

            <Form.Item
              name="joinDate"
              label="加入时间"
            >
              <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" placeholder="请选择加入时间" />
            </Form.Item>

            <Form.Item
              name="joinCount"
              label="第几次加入"
            >
              <Input type="number" min={1} max={10} placeholder="请输入加入次数" />
            </Form.Item>

            <Form.Item
              name="points"
              label="积分"
            >
              <Input type="number" min={0} placeholder="请输入积分" />
            </Form.Item>

            <Form.Item
              name="status"
              label="状态"
              rules={[{ required: true, message: '请选择状态' }]}
            >
              <Select>
                <Select.Option value="active">活跃</Select.Option>
                <Select.Option value="inactive">不活跃</Select.Option>
                <Select.Option value="pending">待定</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="preferredDates"
              label="偏好日期"
            >
              <Select mode="multiple" placeholder="请选择偏好日期">
                <Select.Option value="Mon">周一</Select.Option>
                <Select.Option value="Tue">周二</Select.Option>
                <Select.Option value="Wed">周三</Select.Option>
                <Select.Option value="Thu">周四</Select.Option>
                <Select.Option value="Fri">周五</Select.Option>
                <Select.Option value="Sat">周六</Select.Option>
                <Select.Option value="Sun">周日</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="rn"
              label="RN"
            >
              <Input placeholder="请输入RN编号" />
            </Form.Item>

            <Form.Item
              name="pca"
              label="PCA"
            >
              <Input placeholder="请输入PCA编号" />
            </Form.Item>

            <Form.Item
              name="supportPlanner"
              label="Support Planner"
            >
              <Input placeholder="请输入Support Planner" />
            </Form.Item>

            <Form.Item
              name="lastVisitDate"
              label="最新家访日期"
            >
              <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" placeholder="请选择最新家访日期" />
            </Form.Item>
          </div>

          <Form.Item
            name="address"
            label="地址"
          >
            <Input.TextArea rows={2} placeholder="请输入地址" />
          </Form.Item>

          <div style={{ marginTop: '16px', borderTop: '1px solid #f0f0f0', paddingTop: '16px' }}>
            <h3 style={{ marginBottom: '16px' }}>紧急联系人信息</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Form.Item
                name="emergencyContactName"
                label="紧急联系人姓名"
              >
                <Input placeholder="请输入紧急联系人姓名" />
              </Form.Item>

              <Form.Item
                name="emergencyContactRelationship"
                label="关系"
              >
                <Select placeholder="请选择关系">
                  <Select.Option value="父母">父母</Select.Option>
                  <Select.Option value="配偶">配偶</Select.Option>
                  <Select.Option value="子女">子女</Select.Option>
                  <Select.Option value="朋友">朋友</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="emergencyContactPhone"
                label="紧急联系人电话"
              >
                <Input
                  placeholder="请输入紧急联系人电话"
                  maxLength={14} // (XXX)-XXX-XXXX 格式的最大长度
                  onChange={(e) => {
                    // 去除非数字字符
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 10) {
                      // 格式化为 (XXX)-XXX-XXXX
                      let formattedValue = value;
                      if (value.length > 3 && value.length <= 6) {
                        formattedValue = `(${value.slice(0, 3)})-${value.slice(3)}`;
                      } else if (value.length > 6) {
                        formattedValue = `(${value.slice(0, 3)})-${value.slice(3, 6)}-${value.slice(6)}`;
                      } else if (value.length > 0) {
                        formattedValue = `(${value}`;
                      }
                      form.setFieldValue('emergencyContactPhone', formattedValue);
                    }
                  }}
                />
              </Form.Item>
            </div>
          </div>

          <div style={{ marginTop: '16px', borderTop: '1px solid #f0f0f0', paddingTop: '16px' }}>
            <h3 style={{ marginBottom: '16px' }}>备注信息</h3>
            <Form.Item
              name="notes"
              label="备注"
            >
              <Input.TextArea rows={4} placeholder="请输入备注信息" />
            </Form.Item>
          </div>
        </Form>
      </Modal>

      {/* 删除确认模态框 */}
      <Modal
        title="确认删除"
        open={isDeleteModalVisible}
        onCancel={() => setIsDeleteModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsDeleteModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" danger onClick={handleDelete}>
            删除
          </Button>,
        ]}
        styles={{ body: { padding: '24px' } }}
      >
        <p>确定要删除客户 <strong>{currentCustomer?.name}</strong> 的信息吗？此操作不可撤销。</p>
      </Modal>
    </PageContainer>
  );
};

export default CustomerInfo;
