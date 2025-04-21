import React, { useState, useEffect, useRef } from 'react';
import { API_BASE } from '../utils/api';
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
  FilePdfOutlined,
  FileOutlined,
  FileExcelOutlined,
  CodeOutlined,
  ConsoleSqlOutlined
} from '@ant-design/icons';
import {
  MinimalistManIcon,
  MinimalistWomanIcon
} from '../components/CustomIcons';
// import ScrollIndicator from '../components/ScrollIndicator';
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import axios from 'axios';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Authorization': `Bearer ${sessionStorage.getItem('token') || localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  }
});

const GlobalStyle = createGlobalStyle`
  .edited-row {
    animation: highlightFade 3s forwards;
  }
  @keyframes highlightFade {
    from { background-color: rgba(135, 206, 250, 0.5); }
    to { background-color: transparent; }
  }
`;

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
  const [employees, setEmployees] = useState([]); // Add missing employees state
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [editedRowKey, setEditedRowKey] = useState(null);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [form] = Form.useForm();
  const notesContainerRefs = useRef({});
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewRecord, setPreviewRecord] = useState(null);
  const previewRef = useRef(null);
  const [sortedInfo, setSortedInfo] = useState({ columnKey: 'nextVisitDate', order: 'ascend' });

  useEffect(() => {
    let timer;
    if (editedRowKey) {
      timer = setTimeout(() => setEditedRowKey(null), 3000);
    }
    return () => timer && clearTimeout(timer);
  }, [editedRowKey]);

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
    api.get('/customers')
      .then(({ data }) => {
        if (data.code === 0) {
          // 初始按下次家访日期排序 (120天后)
          const sorted = data.data.sort((a, b) => {
            const aDate = a.lastVisitDate ? new Date(a.lastVisitDate) : new Date(0);
            const bDate = b.lastVisitDate ? new Date(b.lastVisitDate) : new Date(0);
            aDate.setDate(aDate.getDate() + 120);
            bDate.setDate(bDate.getDate() + 120);
            return aDate - bDate;
          });
          setCustomerData(sorted);
          setCustomerCount(sorted.length);
        } else {
          setCustomerData([]);
          setCustomerCount(0);
        }
      })
      .catch(() => {
        setCustomerData([]);
        setCustomerCount(0);
        message.error('加载客户列表失败');
      });
  }, []);

  // 拉取员工列表用于匹配手机号
  useEffect(() => {
    api.get('/employees')
      .then(({ data }) => {
        if (data.code === 0) setEmployees(data.data);
      })
      .catch(() => message.error('加载员工列表失败'));
  }, []);

  // 过滤客户数据
  const filteredCustomers = customerData.filter(customer =>
    searchText === '' ||
    customer.name.toLowerCase().includes(searchText.toLowerCase()) ||
    customer.id.toLowerCase().includes(searchText.toLowerCase()) ||
    (customer.rn && customer.rn.toLowerCase().includes(searchText.toLowerCase())) ||
    (customer.pca && customer.pca.toLowerCase().includes(searchText.toLowerCase())) ||
    customer.city.toLowerCase().includes(searchText.toLowerCase()) ||
    (Array.isArray(customer.language)
      ? customer.language.some(lang => lang.toLowerCase().includes(searchText.toLowerCase()))
      : (customer.language || '').toLowerCase().includes(searchText.toLowerCase())
    ) ||
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
      sorter: (a, b) => a.id.localeCompare(b.id),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ['ascend', 'descend'],
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
      width: 120,
      sorter: (a, b) => {
        const la = Array.isArray(a.language) ? a.language.join(',') : a.language || '';
        const lb = Array.isArray(b.language) ? b.language.join(',') : b.language || '';
        return la.localeCompare(lb);
      },
      sortDirections: ['ascend', 'descend'],
      render: (languages) => {
        if (Array.isArray(languages) && languages.length > 0) {
          if (languages.length === 1) {
            return languages[0];
          } else {
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
      title: '城市',
      dataIndex: 'city',
      key: 'city',
      width: 120,
      sorter: (a, b) => (a.city || '').localeCompare(b.city || ''),
      sortDirections: ['ascend', 'descend'],
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
      sortOrder: sortedInfo.columnKey === 'nextVisitDate' && sortedInfo.order,
      render: (_, record) => record.lastVisitDate
        ? dayjs(record.lastVisitDate).add(120, 'day').format('MM/DD/YYYY')
        : '-',
      sorter: (a, b) => {
        if (!a.lastVisitDate && !b.lastVisitDate) return 0;
        if (!a.lastVisitDate) return 1;
        if (!b.lastVisitDate) return -1;
        const aDate = dayjs(a.lastVisitDate).add(120, 'day').valueOf();
        const bDate = dayjs(b.lastVisitDate).add(120, 'day').valueOf();
        return aDate - bDate;
      },
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: '下次CarePlan',
      dataIndex: 'nextCarePlanDate',
      key: 'nextCarePlanDate',
      width: 140,
      sorter: (a, b) =>
        ((a.lastCarePlanDate ? dayjs(a.lastCarePlanDate).add(365, 'day').valueOf() : 0) -
         (b.lastCarePlanDate ? dayjs(b.lastCarePlanDate).add(365, 'day').valueOf() : 0)),
      sortDirections: ['ascend', 'descend'],
      render: (_, record) => record.lastCarePlanDate
        ? dayjs(record.lastCarePlanDate).add(365, 'day').format('MM/DD/YYYY')
        : '-',
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
                icon: <FilePdfOutlined />,
                label: '导出',
                onClick: () => handleExport(record)
              },
              {
                key: '3',
                icon: <ConsoleSqlOutlined />,
                label: '数据',
                onClick: () => console.log('数据结构:', record)
              },
              {
                key: '4',
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
    form.setFieldsValue({ id: '' });
    setIsModalVisible(true);
  }



  // 显示编辑客户模态框
  const handleEdit = (record) => {
    console.log('handleEdit record:', record);
    console.log('raw language:', record.language, typeof record.language);
    console.log('raw preferredDate:', record.preferredDate, typeof record.preferredDate);
    console.log('raw emergencyContact:', record.emergencyContact, typeof record.emergencyContact);
    setCurrentCustomer(record);
    setExpandedRowKeys([]);

    // 解析语言字段，兼容 JSON 数组或逗号分隔字符串
    const parsedLanguage = (() => {
      const val = record.language;
      if (!val) return [];
      if (Array.isArray(val)) return val;
      if (typeof val === 'string') {
        try {
          const arr = JSON.parse(val);
          return Array.isArray(arr) ? arr : [String(arr)];
        } catch {
          return val.split(',').map(s => s.trim()).filter(Boolean);
        }
      }
      return [];
    })();
    // 解析偏好时间，兼容 JSON 数组或逗号分隔字符串
    const parsedPreferredDate = (() => {
      const val = record.preferredDate;
      if (!val) return [];
      let arr = [];
      if (Array.isArray(val)) arr = val;
      else if (typeof val === 'string') {
        try { arr = JSON.parse(val); }
        catch { arr = val.split(',').map(s => s.trim()).filter(Boolean); }
      }
      // 递归扁平化多层嵌套字符串数组
      while (arr.length === 1 && typeof arr[0] === 'string') {
        try {
          const next = JSON.parse(arr[0]);
          if (Array.isArray(next)) { arr = next; continue; }
        } catch {
          break;
        }
        break;
      }
      return Array.isArray(arr) ? arr : [];
    })();
    // 处理日期格式
    const joinDateValue = record.joinDate ? dayjs(record.joinDate) : null;

    // 解析紧急联系人信息，兼容 JSON 字符串或对象
    const parsedEmergencyContact = (() => {
      const val = record.emergencyContact;
      if (!val) return {};
      if (typeof val === 'object') return val;
      try { return JSON.parse(val); } catch { return {}; }
    })();
    // 统一使用对象形式的紧急联系人
    const emergencyContact = parsedEmergencyContact;

    console.log('parsedLanguage:', parsedLanguage, Array.isArray(parsedLanguage));
    console.log('parsedPreferredDate:', parsedPreferredDate, Array.isArray(parsedPreferredDate));
    console.log('parsedEmergencyContact:', parsedEmergencyContact, typeof parsedEmergencyContact);

    // 在 handleEdit 顶部，添加配偶ID计算（直接或互惠）
    const directSpouseId = record.spouse && record.spouse !== record.id ? record.spouse : null;
    const reciprocalSpouseId = !directSpouseId ? customerData.find(item => item.spouse === record.id)?.id : null;
    const spouseId = directSpouseId || reciprocalSpouseId;

    form.setFieldsValue({
      id: record.id, // 修复：确保PUT请求body中带id字段
      name: record.name,
      age: record.age,
      gender: record.gender,
      language: parsedLanguage,
      phone: record.phone,
      email: record.email,
      city: record.city,
      address: record.address,
      hours: record.hours || '',
      joinDate: joinDateValue,
      joinCount: record.joinCount,
      status: record.status,
      points: record.points,
      preferredDate: parsedPreferredDate,
      rn: record.rn,
      pca: record.pca,
      supportPlanner: record.supportPlanner,
      lastVisitDate: record.lastVisitDate ? dayjs(record.lastVisitDate) : null,
      // 新增字段
      birthday: record.birthday ? dayjs(record.birthday) : null,
      sharedAttemptHours: record.sharedAttemptHours,
      pca_2: record.pca_2,
      pca_3: record.pca_3,
      healthNotes: record.healthNotes || '',
      lastCarePlanDate: record.lastCarePlanDate ? dayjs(record.lastCarePlanDate) : null,
      // 紧急联系人信息对象
      emergencyContact: emergencyContact,
      notes: record.notes || '' // 添加备注字段的初始化
      // 在 form.setFieldsValue 中添加 spouse 初始值
      , spouse: spouseId,
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

      if (values.birthday) values.birthday = values.birthday.format('YYYY-MM-DD');
      if (values.lastCarePlanDate) values.lastCarePlanDate = values.lastCarePlanDate.format('YYYY-MM-DD');
      // 处理 preferredDate 多选
      if (!Array.isArray(values.preferredDate)) values.preferredDate = values.preferredDate ? [values.preferredDate] : [];
      if (currentCustomer) {
        // 编辑现有客户，调用后端接口
        // 处理紧急联系人信息
        let ec = values.emergencyContact;
        if (typeof ec === 'string') {
          try { ec = JSON.parse(ec); } catch { ec = {}; }
        }
        const updatedCustomer = {
          id: values.id, // 修复：确保PUT请求body中带id字段
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
          preferredDate: values.preferredDate || [],
          rn: values.rn,
          pca: values.pca,
          supportPlanner: values.supportPlanner,
          lastVisitDate: values.lastVisitDate,
          emergencyContact: ec || {},
          notes: values.notes,
          // 新增字段
          birthday: values.birthday,
          sharedAttemptHours: values.sharedAttemptHours,
          pca_2: values.pca_2,
          pca_3: values.pca_3,
          healthNotes: values.healthNotes,
          lastCarePlanDate: values.lastCarePlanDate,
          spouse: values.spouse
        };
        api.put(`/customers/${currentCustomer.id}`, updatedCustomer)
          .then(({ data }) => {
            if (data.code === 0) {
              message.success('客户信息已更新');
              setIsModalVisible(false);
              // 重新拉取客户数据
              api.get('/customers')
                .then(({ data }) => {
                  if (data.code === 0) {
                    setCustomerData(data.data);
                    setCustomerCount(data.data.length);
                    setEditedRowKey(currentCustomer.id);
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

        if (values.birthday && typeof values.birthday.format === 'function') {
          values.birthday = values.birthday.format('YYYY-MM-DD');
        } else if (typeof values.birthday === 'string') {
          // 已经是字符串，保留
        } else {
          values.birthday = '';
        }
        if (values.lastCarePlanDate && typeof values.lastCarePlanDate.format === 'function') {
          values.lastCarePlanDate = values.lastCarePlanDate.format('YYYY-MM-DD');
        } else if (typeof values.lastCarePlanDate === 'string') {
          // 已经是字符串，保留
        } else {
          values.lastCarePlanDate = '';
        }
        // 处理 preferredDate 多选
        if (!Array.isArray(values.preferredDate)) values.preferredDate = values.preferredDate ? [values.preferredDate] : [];
        // 处理紧急联系人信息
        let ec = values.emergencyContact;
        if (typeof ec === 'string') {
          try { ec = JSON.parse(ec); } catch { ec = {}; }
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
          preferredDate: values.preferredDate || [],
          rn: values.rn,
          pca: values.pca,
          supportPlanner: values.supportPlanner,
          lastVisitDate: values.lastVisitDate,
          emergencyContact: ec || {},
          notes: values.notes || '',
          // 新增字段
          birthday: values.birthday,
          sharedAttemptHours: values.sharedAttemptHours,
          pca_2: values.pca_2,
          pca_3: values.pca_3,
          healthNotes: values.healthNotes,
          lastCarePlanDate: values.lastCarePlanDate,
          spouse: values.spouse
        };

        console.log('【DEBUG】提交新客户数据:', newCustomer);
        api.post('/customers', newCustomer)
          .then(({ data }) => {
            console.log('【DEBUG】后端返回:', data);
            if (data.code === 0) {
              message.success('客户添加成功');
              setIsModalVisible(false);
              // 重新拉取客户数据
              api.get('/customers')
                .then(({ data }) => {
                  console.log('【DEBUG】拉取客户列表(Post):', data.data);
                  if (data.code === 0) {
                    setCustomerData(data.data);
                    setCustomerCount(data.data.length);
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

  // 弹出导出预览
  const handleExport = (record) => {
    setPreviewRecord(record);
    setPreviewVisible(true);
  };

  // 下载并生成PDF
  const handleDownload = async () => {
    try {
      const record = previewRecord;
      const getPhone = name => employees.find(emp => emp.name === name)?.phone || '';
      const pcaPhone = getPhone(record.pca);
      const pca2Phone = getPhone(record.pca_2);
      const pca3Phone = getPhone(record.pca_3);
      const nextVisitDate = record.lastVisitDate ? dayjs(record.lastVisitDate).add(120, 'day').format('MM/DD/YYYY') : '';
      const nextCarePlanDate = record.lastCarePlanDate ? dayjs(record.lastCarePlanDate).add(365, 'day').format('MM/DD/YYYY') : '';
      const canvas = await html2canvas(previewRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const doc = new jsPDF('p', 'pt', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const props = doc.getImageProperties(imgData);
      const pageHeight = (props.height * pageWidth) / props.width;
      doc.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight);
      doc.save(`客户_${record.id}.pdf`);
      setPreviewVisible(false);
    } catch (err) {
      console.error(err);
      message.error('下载失败');
    }
  };

  // 导出所有客户 JSON 数据
  const exportAllJSON = () => {
    const json = JSON.stringify(customerData, null, 2);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'customers.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 导出所有客户 Excel (CSV 格式)
  const exportAllExcel = () => {
    if (!customerData || customerData.length === 0) return;
    const header = Object.keys(customerData[0]);
    const csvRows = [header.join(',')];
    for (const row of customerData) {
      const values = header.map(field => `"${(row[field] ?? '').toString().replace(/"/g, '""')}"`);
      csvRows.push(values.join(','));
    }
    const csvString = '\uFEFF' + csvRows.join('\r\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'customers.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 渲染预览表格
  const renderPreviewTable = (record) => {
    if (!record) return null;
    const getPhone = name => employees.find(emp => emp.name === name)?.phone || '';
    const pcaPhone = getPhone(record.pca);
    const pca2Phone = getPhone(record.pca_2);
    const pca3Phone = getPhone(record.pca_3);
    const nextVisitDate = record.lastVisitDate ? dayjs(record.lastVisitDate).add(120, 'day').format('MM/DD/YYYY') : '';
    const nextCarePlanDate = record.lastCarePlanDate ? dayjs(record.lastCarePlanDate).add(365, 'day').format('MM/DD/YYYY') : '';
    const rows = [
      ['Client Name', record.name],
      ['Client MA#', record.id],
      ['Phone#', record.phone],
      ['Address', record.address],
      ['Reass', nextVisitDate],
      ['Re-CarePlan', nextCarePlanDate],
      ['RN', record.rn],
      ['PCA', record.pca || ''],
      ['PCA#', pcaPhone],
      ['PCA2', record.pca_2 || ''],
      ['PCA2#', pca2Phone],
      ['PCA3', record.pca_3 || ''],
      ['PCA3#', pca3Phone],
      ['Hours', record.hours || ''],
      ['Shared Atte Hours', record.sharedAttemptHours || ''],
      ['Note', record.healthNotes || ''],
    ];
    return (
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          {rows.map(([label, v]) => (
            <tr key={label}>
              <td style={{ border: '1px solid #000', padding: '8px', fontWeight: 'bold' }}>{label}</td>
              <td style={{ border: '1px solid #000', padding: '8px' }}>{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // 处理删除
  const handleDelete = () => {
    if (!currentCustomer) return;
    api.delete(`/customers/${currentCustomer.id}`)
      .then(({ data }) => {
        if (data.code === 0) {
          message.success({
            content: `已删除客户 ${currentCustomer?.name} 的信息`,
            icon: <DeleteOutlined style={{ color: '#ef4444' }} />
          });
          // 重新拉取客户数据
          api.get('/customers')
            .then(({ data }) => {
              if (data.code === 0) {
                setCustomerData(data.data);
                setCustomerCount(data.data.length);
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
    // 处理配偶关系（直接或互惠）
    const directSpouseId = record.spouse && record.spouse !== record.id ? record.spouse : null;
    const reciprocalSpouseId = !directSpouseId ? customerData.find(item => item.spouse === record.id)?.id : null;
    const spouseId = directSpouseId || reciprocalSpouseId;
    const spouseRec = spouseId ? customerData.find(item => item.id === spouseId) || {} : {};
    const spouseLabel = spouseRec.id || '';
    const spouseName = spouseRec.name || '';
    const spouseReass = spouseRec.lastVisitDate ? dayjs(spouseRec.lastVisitDate).add(120, 'day').format('YYYY-MM-DD') : '无';
    const spouseReCarePlan = spouseRec.lastCarePlanDate ? dayjs(spouseRec.lastCarePlanDate).add(365, 'day').format('YYYY-MM-DD') : '无';
    return (
      <CustomerDetailCard>
        <Row gutter={[24, 16]}>
          <Col span={8}>
            <Title level={5}>基本信息</Title>
            <DetailItem><UserOutlined className="icon" /><span className="label">姓名:</span><span className="value">{record.name}</span></DetailItem>
            <DetailItem><UserOutlined className="icon" /><span className="label">ID:</span><span className="value">{record.id}</span></DetailItem>
            <DetailItem><UserOutlined className="icon" /><span className="label">性别:</span><span className="value">{record.gender}</span></DetailItem>
            <DetailItem><UserOutlined className="icon" /><span className="label">年龄:</span><span className="value">{record.age}</span></DetailItem>
            <DetailItem><CalendarOutlined className="icon" /><span className="label">生日:</span><span className="value">{record.birthday ? dayjs(record.birthday).format('YYYY-MM-DD') : '无'}</span></DetailItem>
            <DetailItem><UserOutlined className="icon" /><span className="label">语言:</span><span className="value">{Array.isArray(record.language) ? record.language.join(', ') : record.language || '无'}</span></DetailItem>
          </Col>
          <Col span={8}>
            <Title level={5}>时间信息</Title>
            <DetailItem><span className="label">Hours:</span><span className="value">{record.hours}</span></DetailItem>
            <DetailItem>
              <span className="label">Shared Att Hours:</span>
              <span className="value">{record.sharedAttemptHours || '无'}</span>
            </DetailItem>
            <DetailItem><span className="label">加入时间:</span><span className="value">{record.joinDate}</span></DetailItem>
            <DetailItem><span className="label">第几次加入:</span><span className="value">{record.joinCount}</span></DetailItem>
            <DetailItem><span className="label">最新家访日期:</span><span className="value">{record.lastVisitDate || '无'}</span></DetailItem>
            <DetailItem><span className="label">最新CarePlan日期:</span><span className="value">{record.lastCarePlanDate ? dayjs(record.lastCarePlanDate).format('YYYY-MM-DD') : '无'}</span></DetailItem>
          </Col>
          <Col span={8}>
            <Title level={5}>联系信息</Title>
            <DetailItem><PhoneOutlined className="icon" /><span className="label">手机:</span><span className="value">{record.phone}</span></DetailItem>
            <DetailItem><MailOutlined className="icon" /><span className="label">邮箱:</span><span className="value">{record.email}</span></DetailItem>
            <DetailItem><EnvironmentOutlined className="icon" /><span className="label">城市:</span><span className="value">{record.city}</span></DetailItem>
            <DetailItem><EnvironmentOutlined className="icon" /><span className="label">地址:</span><span className="value">{record.address}</span></DetailItem>
          </Col>
        </Row>
        <Row gutter={[24, 16]} style={{ marginTop: '16px' }}>
          <Col span={8}>
            <Title level={5}>健康信息</Title>
            <DetailItem><span className="label">RN:</span><span className="value">{record.rn || '无'}</span></DetailItem>
            <DetailItem><span className="label">PCA:</span><span className="value">{record.pca || '无'}</span></DetailItem>
            <DetailItem><span className="label">PCA_2:</span><span className="value">{record.pca_2 || '无'}</span></DetailItem>
            <DetailItem><span className="label">PCA_3:</span><span className="value">{record.pca_3 || '无'}</span></DetailItem>
            <DetailItem><span className="label">Support Planner:</span><span className="value">{record.supportPlanner || '无'}</span></DetailItem>
          </Col>
          <Col span={8}>
            <Title level={5}>紧急联系人</Title>
            <DetailItem><span className="label">姓名:</span><span className="value">{record.emergencyContact?.name || '无'}</span></DetailItem>
            <DetailItem><span className="label">电话:</span><span className="value">{record.emergencyContact?.phone || '无'}</span></DetailItem>
            <DetailItem><span className="label">关系:</span><span className="value">{record.emergencyContact?.relationship || '无'}</span></DetailItem>
            <DetailItem><span className="label">配偶:</span><span className="value">{spouseLabel ? `${spouseLabel} - ${spouseName}` : '无'}</span></DetailItem>
            <DetailItem><span className="label">配偶Reass:</span><span className="value">{spouseReass}</span></DetailItem>
            <DetailItem><span className="label">配偶Re-CarePlan:</span><span className="value">{spouseReCarePlan}</span></DetailItem>
          </Col>
          <Col span={8}>
            <Title level={5}>其他信息</Title>
            <DetailItem><span className="label">状态:</span><StatusTag className={record.status.toLowerCase()}>{record.status}</StatusTag></DetailItem>
            <DetailItem><span className="label">积分:</span><span className="value">{record.points}</span></DetailItem>
            <DetailItem style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <span className="label">偏好时间:</span>
              <div style={{ marginTop: 8 }}>
                {(() => {
                  const arr = record.preferredDate
                    ? (typeof record.preferredDate === 'string' ? JSON.parse(record.preferredDate) : record.preferredDate)
                    : [];
                  if (arr.length === 0) return '无';
                  const weekOrder = ['周一','周二','周三','周四','周五','周六','周日'];
                  arr.sort((a, b) => weekOrder.indexOf(a) - weekOrder.indexOf(b));
                  return arr.map(day => (
                    <StatusTag
                      color={{ 周一:'blue', 周二:'green', 周三:'orange', 周四:'magenta', 周五:'cyan', 周六:'purple', 周日:'volcano' }[day] || 'default'}
                      key={day}
                    >
                      {day}
                    </StatusTag>
                  ));
                })()}
              </div>
            </DetailItem>
          </Col>
        </Row>
        <Row gutter={[24, 16]} style={{ marginTop: '16px' }}>
          <Col span={24} style={{ paddingLeft: 0 }}>
            <Title level={5}>备注</Title>
            <div style={{ whiteSpace: 'pre-wrap', marginBottom: '12px', textAlign: 'left' }}>
              {record.notes || '无'}
            </div>
            <Title level={5}>健康备注</Title>
            <div style={{ whiteSpace: 'pre-wrap', textAlign: 'left' }}>
              {record.healthNotes || '无'}
            </div>
          </Col>
        </Row>
      </CustomerDetailCard>
    );
  };

  return (
    <PageContainer>
      <GlobalStyle />
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
                  onClick: () => exportAllJSON()
                },
                {
                  key: 'excel',
                  label: '导出Excel',
                  icon: <FileExcelOutlined />,
                  onClick: () => exportAllExcel()
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
          onChange={(pagination, filters, sorter) => setSortedInfo(sorter)}
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
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>取消</Button>,
          <Button key="submit" type="primary" onClick={handleSubmit}>{currentCustomer ? "保存" : "添加"}</Button>
        ]}
        width={800}
      >
        <Form form={form} layout="vertical" initialValues={{ status: 'active' }}>
          {/* 基本信息 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item name="name" label="姓名" rules={[{ required: true, message: '请输入姓名' }]}>
              <Input placeholder="请输入姓名" />
            </Form.Item>
            <Form.Item name="id" label="ID (MA#)" rules={[{ required: true, message: '请输入ID' }]}>
              <Input placeholder="请输入ID" />
            </Form.Item>
            <Form.Item name="gender" label="性别">
              <Select><Select.Option value="男">男</Select.Option><Select.Option value="女">女</Select.Option></Select>
            </Form.Item>
            <Form.Item name="language" label="语言">
              <Select mode="multiple" placeholder="请选择语言" style={{ width: '100%' }}>
                <Select.Option value="中文">中文</Select.Option>
                <Select.Option value="粤语">粤语</Select.Option>
                <Select.Option value="福州话">福州话</Select.Option>
                <Select.Option value="英语">英语</Select.Option>
                <Select.Option value="西班牙语">西班牙语</Select.Option>
                <Select.Option value="法语">法语</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="age" label="年龄">
              <Input type="number" min={1} max={120} placeholder="请输入年龄" />
            </Form.Item>
            <Form.Item name="birthday" label="生日">
              <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" placeholder="请选择生日" />
            </Form.Item>
            <Form.Item name="hours" label="Hours">
              <Input placeholder="请输入Hours" />
            </Form.Item>
            <Form.Item name="sharedAttemptHours" label="Shared Attempt Hours">
              <Input placeholder="请输入Shared Attempt Hours" />
            </Form.Item>
            <Form.Item name="phone" label="手机号">
              <Input
                placeholder="请输入手机号"
                maxLength={14}
                onChange={e => {
                  const val = e.target.value;
                  const digits = val.replace(/\D/g, '').slice(0, 10);
                  let formatted = '';
                  if (digits.length <= 3) {
                    formatted = digits;
                  } else if (digits.length <= 6) {
                    formatted = `(${digits.slice(0, 3)})${digits.slice(3)}`;
                  } else {
                    formatted = `(${digits.slice(0, 3)})${digits.slice(3, 6)}-${digits.slice(6)}`;
                  }
                  form.setFieldsValue({ phone: formatted });
                }}
              />
            </Form.Item>
            <Form.Item name="email" label="邮箱" rules={[{ type: 'email', message: '请输入有效邮箱' }]}>
              <Input placeholder="请输入邮箱" />
            </Form.Item>
            <Form.Item name="spouse" label="配偶 (请填入MA#)">
              <Input placeholder="请输入配偶姓名" />
            </Form.Item>
            <Form.Item name="points" label="积分">
              <Input type="number" min={0} placeholder="请输入积分" />
            </Form.Item>
            <Form.Item name="status" label="状态">
              <Select><Select.Option value="active">活跃</Select.Option><Select.Option value="inactive">不活跃</Select.Option><Select.Option value="pending">待定</Select.Option></Select>
            </Form.Item>
            <Form.Item name="rn" label="RN">
              <Input placeholder="请输入RN" />
            </Form.Item>
            <Form.Item name="pca" label="PCA">
              <Input placeholder="请输入PCA" />
            </Form.Item>
            <Form.Item name="pca_2" label="PCA_2">
              <Input placeholder="请输入PCA_2" />
            </Form.Item>
            <Form.Item name="pca_3" label="PCA_3">
              <Input placeholder="请输入PCA_3" />
            </Form.Item>
            <Form.Item name="supportPlanner" label="Support Planner">
              <Input placeholder="请输入Support Planner" />
            </Form.Item>
            <Form.Item name="city" label="城市">
              <Input placeholder="请输入城市" />
            </Form.Item>
            <Form.Item name="address" label="地址" wrapperCol={{ span: 24 }}>
              <Input.TextArea rows={2} placeholder="请输入地址" />
            </Form.Item>
          </div>

          {/* 时间信息 */}
          <div style={{ marginTop: '16px', borderTop: '1px solid #f0f0f0', paddingTop: '16px' }}>
            <h3>时间信息</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Form.Item name="joinDate" label="加入时间">
                <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
              </Form.Item>
              <Form.Item name="joinCount" label="第几次加入">
                <Input type="number" placeholder="请输入次数" />
              </Form.Item>
              <Form.Item name="lastVisitDate" label="最新家访日期">
                <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
              </Form.Item>
              <Form.Item name="lastCarePlanDate" label="最新Care Plan日期">
                <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
              </Form.Item>
            </div>
            <Form.Item name="preferredDate" label="偏好时间">
              <Select mode="multiple" placeholder="请选择偏好时间">
                <Select.Option value="周一">周一</Select.Option>
                <Select.Option value="周二">周二</Select.Option>
                <Select.Option value="周三">周三</Select.Option>
                <Select.Option value="周四">周四</Select.Option>
                <Select.Option value="周五">周五</Select.Option>
                <Select.Option value="周六">周六</Select.Option>
                <Select.Option value="周日">周日</Select.Option>
              </Select>
            </Form.Item>
          </div>

          {/* 紧急联系人信息 */}
          <div style={{ marginTop: '16px', borderTop: '1px solid #f0f0f0', paddingTop: '16px' }}>
            <h3>紧急联系人信息</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Form.Item name={['emergencyContact', 'name']} label="紧急联系人姓名">
                <Input placeholder="请输入姓名" />
              </Form.Item>
              <Form.Item name={['emergencyContact', 'relationship']} label="关系">
                <Select placeholder="请选择关系">
                  <Select.Option value="父亲">父亲</Select.Option>
                  <Select.Option value="母亲">母亲</Select.Option>
                  <Select.Option value="儿子">儿子</Select.Option>
                  <Select.Option value="女儿">女儿</Select.Option>
                  <Select.Option value="配偶">配偶</Select.Option>
                  <Select.Option value="朋友">朋友</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name={['emergencyContact', 'phone']} label="紧急联系人电话">
                <Input placeholder="请输入电话" />
              </Form.Item>
            </div>
          </div>

          {/* 备注信息 */}
          <div style={{ marginTop: '16px', borderTop: '1px solid #f0f0f0', paddingTop: '16px' }}>
            <h3>备注信息</h3>
            <Form.Item name="notes" label="备注">
              <Input.TextArea rows={3} placeholder="请输入备注" />
            </Form.Item>
            <Form.Item name="healthNotes" label="健康备注">
              <Input.TextArea rows={2} placeholder="请输入健康备注" />
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
          <Button key="cancel" onClick={() => setIsDeleteModalVisible(false)}>取消</Button>,
          <Button key="submit" type="primary" danger onClick={handleDelete}>删除</Button>
        ]}
        styles={{ body: { padding: '24px' } }}
      >
        <p>确定要删除客户 <strong>{currentCustomer?.name}</strong> 的信息吗？此操作不可撤销。</p>
      </Modal>

      {/* 导出预览 */}
      {previewVisible && (
        <Modal
          visible={previewVisible}
          title="导出预览"
          width={800}
          onCancel={() => setPreviewVisible(false)}
          footer={[
            <Button key="download" type="primary" onClick={handleDownload}>下载PDF</Button>,
            <Button key="cancel" onClick={() => setPreviewVisible(false)}>取消</Button>
          ]}
        >
          <div ref={previewRef} style={{ padding: '20px', background: '#fff' }}>
            {renderPreviewTable(previewRecord)}
          </div>
        </Modal>
      )}
    </PageContainer>
  );
};

export default CustomerInfo;
