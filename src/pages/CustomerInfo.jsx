import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { setCustomerCount } from '../services/dataService';
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
  DatePicker
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

  // 初始化客户数据
  useEffect(() => {
    // 模拟从API获取数据
    const mockData = generateCustomers();
    setCustomerData(mockData);
    // 更新客户数量
    setCustomerCount(mockData.length);
  }, []);

  // 生成模拟数据
  const generateCustomers = () => {
    // Maryland城市
    const marylandCities = ['Baltimore', 'Annapolis', 'Frederick', 'Rockville', 'Gaithersburg', 'Bethesda', 'Silver Spring', 'Columbia', 'Germantown', 'Waldorf'];

    const languages = ['中文', '英语', '法语', '德语', '日语'];
    const hours = ['20', '30', '40', '25', '35'];
    const statuses = ['active', 'inactive', 'pending'];
    const rnOptions = ['Erin', 'Anna', 'Shulin'];
    const pcaOptions = ['GZJ', 'ZQF', 'RB'];
    const supportPlannerOptions = ['John Smith', 'Mary Johnson', 'David Lee', 'Sarah Wang', 'Michael Chen'];

    // 中文姓名组合
    const firstNames = ['张', '李', '王', '赵', '钱', '孙', '周', '吴', '郑', '陈'];
    const lastNames = ['明', '华', '强', '伟', '英', '文', '军', '杰', '浩', '浩', '文', '文', '文', '文'];

    const customers = [];

    for (let i = 0; i < 30; i++) {
      // 生成MA+3个随机数字的ID
      const randomNum = Math.floor(Math.random() * 900) + 100; // 100-999的随机数
      const id = `MA${randomNum}`;
      const gender = Math.random() > 0.5 ? '男' : '女';

      // 生成随机姓名
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const name = firstName + lastName;

      // 随机选择Maryland城市
      const city = marylandCities[Math.floor(Math.random() * marylandCities.length)];

      // 随机生成状态
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      // 生成最新家访日期，在2025年1月1日至2025年4月8日之间
      // 如果状态为活跃，则没有最新家访日期
      let lastVisitDate = null;
      if (status !== 'active') {
        // 生成在2025年1月1日至2025年4月8日之间的随机日期
        const start = new Date(2025, 0, 1); // 2025年1月1日
        const end = new Date(2025, 3, 8);   // 2025年4月8日
        const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        lastVisitDate = randomDate.toISOString().split('T')[0];
      }

      // 创建客户数据对象
      const customer = {
        id: id,
        name: name,
        gender: gender,
        age: Math.floor(Math.random() * 50) + 18,
        language: languages[Math.floor(Math.random() * languages.length)],
        phone: `(${Math.floor(Math.random() * 900) + 100})-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 10000)}`,
        email: `customer${i + 1}@example.com`,
        city: city,
        address: `${city}, Maryland, ${Math.floor(Math.random() * 100) + 1} ${['Main', 'Oak', 'Pine', 'Maple', 'Cedar'][Math.floor(Math.random() * 5)]} St`,
        hours: hours[Math.floor(Math.random() * hours.length)],
        joinDate: new Date(2022, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
        joinCount: Math.floor(Math.random() * 3) + 1,
        status: status,
        points: Math.floor(Math.random() * 1000),
        preferredDates: ['Mon', 'Wed', 'Fri'].slice(0, Math.floor(Math.random() * 3) + 1),
        rn: rnOptions[Math.floor(Math.random() * rnOptions.length)],
        pca: pcaOptions[Math.floor(Math.random() * pcaOptions.length)],
        supportPlanner: supportPlannerOptions[Math.floor(Math.random() * supportPlannerOptions.length)],
        lastVisitDate: lastVisitDate,
      };

      // 添加紧急联系人信息
      if (Math.random() > 0.3) {
        customer.emergencyContact = {
          name: `联系人${i + 1}`,
          relationship: ['父母', '配偶', '子女', '朋友'][Math.floor(Math.random() * 4)],
          phone: `(${Math.floor(Math.random() * 900) + 100})-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 10000)}`
        };
      }

      customers.push(customer);
    }

    return customers;
  };

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
      emergencyContactPhone: emergencyContact.phone || ''
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
        // 编辑现有客户
        const updatedCustomers = customerData.map(customer => {
          if (customer.id === currentCustomer.id) {
            // 创建新对象，按照指定的顺序添加字段
            // 准备紧急联系人信息
            let emergencyContact = null;
            if (values.emergencyContactName || values.emergencyContactRelationship || values.emergencyContactPhone) {
              emergencyContact = {
                name: values.emergencyContactName,
                relationship: values.emergencyContactRelationship,
                phone: values.emergencyContactPhone
              };
            }

            const updatedCustomer = {
              ...customer,
              name: values.name,
              age: values.age,
              gender: values.gender,
              language: values.language,
              phone: values.phone,
              email: values.email,
              city: values.city,
              address: values.address,
              hours: values.hours,
              joinDate: values.joinDate,
              joinCount: values.joinCount,
              status: values.status,
              points: values.points,
              preferredDates: values.preferredDates,
              rn: values.rn,
              pca: values.pca,
              supportPlanner: values.supportPlanner,
              lastVisitDate: values.lastVisitDate,
              emergencyContact: emergencyContact
            };

            return updatedCustomer;
          }
          return customer;
        });

        setCustomerData(updatedCustomers);
        setEditedRowKey(currentCustomer.id);

        // 显示成功消息
        message.success({
          content: `已更新客户 ${values.name} 的信息`,
          icon: <EditOutlined style={{ color: '#10b981' }} />
        });

        // 3秒后清除高亮效果
        setTimeout(() => {
          setEditedRowKey(null);
        }, 3000);
      } else {
        // 添加新客户
        // 如果用户没有输入ID，自动生成一个符合格式的ID
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
          language: values.language,
          phone: values.phone,
          email: values.email,
          city: values.city,
          address: values.address,
          hours: values.hours,
          joinDate: values.joinDate,
          joinCount: values.joinCount,
          status: values.status,
          points: values.points,
          preferredDates: values.preferredDates,
          rn: values.rn,
          pca: values.pca,
          supportPlanner: values.supportPlanner,
          lastVisitDate: values.lastVisitDate
        };

        // 添加紧急联系人信息（如果有）
        if (values.emergencyContactName) {
          newCustomer.emergencyContact = {
            name: values.emergencyContactName,
            relationship: values.emergencyContactRelationship,
            phone: values.emergencyContactPhone
          };
        }

        setCustomerData([...customerData, newCustomer]);
        setEditedRowKey(newCustomer.id);

        // 显示成功消息
        message.success({
          content: `已添加客户 ${values.name}`,
          icon: <UserAddOutlined style={{ color: '#10b981' }} />
        });

        // 3秒后清除高亮效果
        setTimeout(() => {
          setEditedRowKey(null);
        }, 3000);
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
    // 从数据中删除客户
    const updatedCustomers = customerData.filter(customer => customer.id !== currentCustomer.id);

    // 显示删除动画和成功消息
    message.success({
      content: `已删除客户 ${currentCustomer?.name} 的信息`,
      icon: <DeleteOutlined style={{ color: '#ef4444' }} />
    });

    // 延迟更新数据，以显示动画效果
    setTimeout(() => {
      setCustomerData(updatedCustomers);
      setIsDeleteModalVisible(false);
      setExpandedRowKeys([]);
      // 更新客户数量
      setCustomerCount(updatedCustomers.length);
    }, 300);
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
              <Select>
                <Select.Option value="中文">中文</Select.Option>
                <Select.Option value="英语">英语</Select.Option>
                <Select.Option value="法语">法语</Select.Option>
                <Select.Option value="德语">德语</Select.Option>
                <Select.Option value="日语">日语</Select.Option>
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
