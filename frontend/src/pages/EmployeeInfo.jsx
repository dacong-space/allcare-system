import React, { useState, useEffect, useRef } from 'react';
import { API_BASE } from '../utils/api';
import dayjs from 'dayjs';
import { setEmployeeCount } from '../services/dataService';
import ModernExpandButton from '../components/ModernExpandButton';
import {
  Card,
  Table,
  Button,
  Input,
  Space,
  Tag,
  Modal,
  Form,
  Select,
  message,
  Avatar,
  Tooltip,
  Dropdown,
  DatePicker,
  Row,
  Col,
  Typography
} from 'antd';
const { Title } = Typography;
import {
  SearchOutlined,
  UserAddOutlined,
  EditOutlined,
  DeleteOutlined,
  MailOutlined,
  PhoneOutlined,
  EllipsisOutlined,
  DownloadOutlined,
  FileOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  ConsoleSqlOutlined,
  CodeOutlined,
  UserOutlined,
  CalendarOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import {
  MinimalistManIcon,
  MinimalistWomanIcon
} from '../components/CustomIcons';
// import ScrollIndicator from '../components/ScrollIndicator';
import styled from 'styled-components';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

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
  }

  .ant-table-tbody > tr > td {
    border-bottom: 1px solid var(--border-color);
    padding: 16px;
    transition: background 0.2s;
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

  &.onleave {
    background-color: #fef3c7;
    color: #92400e;
  }
`;

const EmployeeDetailCard = styled(Card)`
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
    margin-right: 8px;
    font-size: 14px;
    min-width: 70px;
  }

  .value {
    color: var(--text-primary);
    font-weight: 500;
    font-size: 14px;
  }
  }
`;

const MaleAvatar = styled(Avatar)`
  background-color: #f0f2f5;
  color: #1890ff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const FemaleAvatar = styled(Avatar)`
  background-color: #f0f2f5;
  color: #eb2f96;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const EmployeeInfo = () => {
  const [employees, setEmployees] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [editedRowKey, setEditedRowKey] = useState(null);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [form] = Form.useForm();
  const notesContainerRefs = useRef({});
  const previewRef = useRef(null);
  const [previewRecord, setPreviewRecord] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  // 导出字段顺序与标签
  const exportFields = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: '姓名' },
    { key: 'age', label: '年龄' },
    { key: 'gender', label: '性别' },
    { key: 'birthday', label: '生日' },
    { key: 'language', label: '语言' },
    { key: 'position', label: '职位' },
    { key: 'status', label: '状态' },
    { key: 'phone', label: '手机号' },
    { key: 'email', label: 'Email' },
    { key: 'joinDate', label: '入职时间' },
    { key: 'cprExpire', label: 'CPR过期日期' },
    { key: 'documentExpire', label: '证件过期日期' },
    { key: 'latestTrainingDate', label: '最新培训日期' },
    { key: 'address', label: '地址' },
    { key: 'emergencyContact', label: '紧急联系人' },
    { key: 'note', label: '备注' }
  ];

  // 初始化员工数据
  // 拉取员工列表
  useEffect(() => {
    fetchEmployees();
  }, []);

  // 从后端获取员工列表
  const fetchEmployees = async () => {
    try {
      const res = await fetch(`${API_BASE}/employees`, {
        headers: { 'Authorization': localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : '' }
      });
      const result = await res.json();
      console.log('fetchEmployees 执行结果:', result.data);
      if (result.code === 0) {
        setEmployees(result.data);
      } else {
        setEmployees([]);
      }
    } catch (err) {
      setEmployees([]);
      message.error('获取员工列表失败');
    }
  };

  // 表格列定义
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 140,
      render: (text, record) => (
        <Space>
          {record.gender === '男' ? (
            <MaleAvatar icon={<MinimalistManIcon />} />
          ) : (
            <FemaleAvatar icon={<MinimalistWomanIcon />} />
          )}
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      width: 80,
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      width: 80,
      sorter: (a, b) => (a.age || 0) - (b.age || 0),
      sortDirections: ['ascend','descend'],
      render: (age) => age != null ? age : '-',
    },
    {
      title: '职位',
      dataIndex: 'position',
      key: 'position',
      width: 140,
    },
    {
      title: 'CPR过期日期',
      dataIndex: 'cprExpire',
      key: 'cprExpire',
      width: 140,
      render: (text) => text ? dayjs(text).format('MM-DD-YYYY') : '-',
      sorter: (a, b) => {
        const aVal = a.cprExpire ? dayjs(a.cprExpire).valueOf() : 0;
        const bVal = b.cprExpire ? dayjs(b.cprExpire).valueOf() : 0;
        return aVal - bVal;
      },
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: '最新培训日期',
      dataIndex: 'latestTrainingDate',
      key: 'latestTrainingDate',
      width: 140,
      render: (text) => text ? dayjs(text).format('MM-DD-YYYY') : '-',
      sorter: (a, b) => {
        const aVal = a.latestTrainingDate ? dayjs(a.latestTrainingDate).valueOf() : 0;
        const bVal = b.latestTrainingDate ? dayjs(b.latestTrainingDate).valueOf() : 0;
        return aVal - bVal;
      },
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: '状态',
      key: 'status',
      dataIndex: 'status',
      width: 100,
      render: (status) => {
        let color = 'active';
        let text = '在职';

        if (status === 'inactive') {
          color = 'inactive';
          text = '离职';
        } else if (status === 'onleave') {
          color = 'onleave';
          text = '休假';
        }

        return <StatusTag className={color}>{text}</StatusTag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
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
                key: '3',
                icon: <FilePdfOutlined />,
                label: '导出',
                onClick: () => handleExportRecord(record)
              },
              {
                key: '4',
                icon: <ConsoleSqlOutlined />,
                label: '数据',
                onClick: () => {
                  console.log('\n\n员工数据：', record);
                  message.success('员工数据已打印到控制台，请按F12查看');
                }
              },
              {
                key: '2',
                icon: <DeleteOutlined />,
                label: '删除',
                danger: true,
                onClick: () => showDeleteConfirm(record)
              }
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

  // 处理搜索
  const handleSearch = (value) => {
    setSearchText(value);

    // 如果搜索框为空，显示所有数据
    if (!value) {
      message.info({
        content: '显示所有员工信息',
        icon: <SearchOutlined style={{ color: 'var(--primary-color)' }} />,
        duration: 1
      });
      return;
    }

    // 如果有搜索结果，显示结果数量
    const filtered = employees.filter(employee =>
      employee.name.toLowerCase().includes(value.toLowerCase()) ||
      employee.id.includes(value) ||

      employee.position.toLowerCase().includes(value.toLowerCase()) ||
      employee.email.toLowerCase().includes(value.toLowerCase()) ||
      employee.phone.includes(value)
    );

    if (filtered.length > 0) {
      message.success({
        content: `找到 ${filtered.length} 条符合条件的记录`,
        icon: <SearchOutlined style={{ color: '#10b981' }} />,
        duration: 2
      });
    } else {
      message.warning({
        content: '未找到符合条件的记录',
        icon: <SearchOutlined style={{ color: '#f59e0b' }} />,
        duration: 2
      });
    }
  };

  // 获取状态标签
  const getStatusTag = (status) => {
    let color = 'active';
    let text = '在职';

    if (status === 'inactive') {
      color = 'inactive';
      text = '离职';
    } else if (status === 'onleave') {
      color = 'onleave';
      text = '休假';
    }

    return <StatusTag className={color}>{text}</StatusTag>;
  };

  // 过滤员工数据
  const filteredEmployees = employees.filter(employee =>
    searchText === '' ||
    employee.name.toLowerCase().includes(searchText.toLowerCase()) ||
    employee.id.includes(searchText) ||

    employee.position.toLowerCase().includes(searchText.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchText.toLowerCase()) ||
    employee.phone.includes(searchText)
  );

  // 显示添加员工模态框
  const showAddModal = () => {
    setCurrentEmployee(null);
    form.resetFields();

    // 不预填员工ID
    form.setFieldsValue({
      id: ''
    });

    setIsModalVisible(true);
  };

  // 显示编辑员工模态框
  const handleEdit = (record) => {
    setCurrentEmployee(record);

    // 处理日期格式
    const birthdayValue = record.birthday ? dayjs(record.birthday) : null;
    const joinDateValue = record.joinDate ? dayjs(record.joinDate) : null;
    const cprExpireValue = record.cprExpire ? dayjs(record.cprExpire) : null;
    const latestTrainingDateValue = record.latestTrainingDate ? dayjs(record.latestTrainingDate) : null;
    const documentExpireValue = record.documentExpire ? dayjs(record.documentExpire) : null;
    const latestExamDateValue = record.latestExamDate ? dayjs(record.latestExamDate) : null;

    form.setFieldsValue({
      id: record.id,
      name: record.name,
      age: record.age,
      gender: record.gender,
      birthday: birthdayValue,
      language: record.language,
      position: record.position,
      status: record.status,
      phone: record.phone,
      email: record.email,
      joinDate: joinDateValue,
      cprExpire: cprExpireValue,
      latestTrainingDate: latestTrainingDateValue,
      documentExpire: documentExpireValue,
      latestExamDate: latestExamDateValue,
      address: record.address,
      emergencyContact: {
        name: record.emergencyContact?.name || '',
        relation: record.emergencyContact?.relation || '',
        phone: record.emergencyContact?.phone || ''
      },
      note: record.note || ''
    });
    setIsModalVisible(true);
  };

  // 显示删除确认
  const showDeleteConfirm = (record) => {
    setCurrentEmployee(record);
    setIsDeleteModalVisible(true);
  };

  // 处理添加/编辑提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      // 处理日期格式
      if (values.joinDate) {
        values.joinDate = values.joinDate.format('YYYY-MM-DD');
      }
      if (values.cprExpire) {
        values.cprExpire = values.cprExpire.format('YYYY-MM-DD');
      }
      if (values.birthday) {
        values.birthday = values.birthday.format('YYYY-MM-DD');
      }
      if (values.latestTrainingDate) {
        values.latestTrainingDate = values.latestTrainingDate.format('YYYY-MM-DD');
      }
      if (values.documentExpire) {
        values.documentExpire = values.documentExpire.format('YYYY-MM-DD');
      }
      if (values.latestExamDate) {
        values.latestExamDate = values.latestExamDate.format('YYYY-MM-DD');
      }
      if (currentEmployee) {
        // 调用后端接口
        const res = await fetch(`/api/employees/${currentEmployee.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : ''
          },
          body: JSON.stringify(values)
        });
        const result = await res.json();
        console.log('PUT /api/employees 返回:', result);
        if (result.code === 0) {
          message.success({
            content: `已更新员工 ${values.name} 的信息`,
            icon: <EditOutlined style={{ color: '#10b981' }} />
          });
          setEditedRowKey(currentEmployee.id);
          setTimeout(() => {
            setEditedRowKey(null);
          }, 3000);
          fetchEmployees();
        } else {
          message.error(result.msg || '更新失败');
        }
        setIsModalVisible(false);
      } else {
        // 添加新员工，调用后端 POST 接口
        const res = await fetch(`${API_BASE}/employees`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : ''
          },
          body: JSON.stringify(values)
        });
        const result = await res.json();
        if (result.code === 0) {
          message.success({
            content: `已添加员工 ${values.name}`,
            icon: <UserAddOutlined style={{ color: '#10b981' }} />
          });
          fetchEmployees();
        } else {
          message.error(result.msg || '添加失败');
        }
        setIsModalVisible(false);
      }
    } catch (err) {
      message.error('提交失败');
    }
  };

  // 处理导出数据
  const handleExport = (type) => {
    try {
      switch (type) {
        case 'json':
          // 导出JSON - 导出完整数据结构
          const jsonData = JSON.stringify(employees, null, 2);
          const jsonBlob = new Blob([jsonData], { type: 'application/json' });
          const jsonUrl = URL.createObjectURL(jsonBlob);
          const jsonLink = document.createElement('a');
          jsonLink.href = jsonUrl;
          jsonLink.download = '员工数据.json';
          jsonLink.click();
          URL.revokeObjectURL(jsonUrl);
          message.success('员工数据已导出为JSON格式');
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
            'address',       // 地址
            'joinDate',      // 加入时间
            'position',      // 职位
            'status'         // 状态
          ];

          // 获取所有存在的字段
          const existingFields = new Set();
          employees.forEach(employee => {
            Object.keys(employee).forEach(key => {
              // 排除嵌套对象
              if (typeof employee[key] !== 'object' || employee[key] === null) {
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
          employees.forEach(employee => {
            const row = fieldArray.map(field => {
              // 处理普通字段
              if (employee[field] === undefined || employee[field] === null) {
                return '';
              } else if (typeof employee[field] === 'object') {
                return `"${JSON.stringify(employee[field]).replace(/"/g, '""')}"`;
              } else {
                // 将字符串包裹在引号中，并将引号转义
                return `"${String(employee[field]).replace(/"/g, '""')}"`;
              }
            }).join(',');
            csvContent += row + '\n';
          });

          const csvBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
          const csvUrl = URL.createObjectURL(csvBlob);
          const csvLink = document.createElement('a');
          csvLink.href = csvUrl;
          csvLink.download = '员工数据.csv';
          csvLink.click();
          URL.revokeObjectURL(csvUrl);
          message.success('员工数据已导出为Excel格式');
          break;

        default:
          message.error('不支持的导出格式');
      }
    } catch (error) {
      console.error('导出数据时出错:', error);
      message.error('导出数据时出错');
    }
  };

  // 导出所有员工 JSON 数据（与客户页面一致）
  const exportAllJSON = () => {
    const json = JSON.stringify(employees, null, 2);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'employees.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 导出所有员工 Excel (CSV 格式，与客户页面一致)
  const exportAllExcel = () => {
    if (!employees || employees.length === 0) return;
    const header = Object.keys(employees[0]);
    const csvRows = [header.join(',')];
    for (const row of employees) {
      const values = header.map(field => `"${(row[field] ?? '').toString().replace(/"/g, '""')}"`);
      csvRows.push(values.join(','));
    }
    const csvString = '\uFEFF' + csvRows.join('\r\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'employees.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 处理删除
  const handleDelete = async () => {
    // 从数据中删除员工
    const updatedEmployees = employees.filter(employee => employee.id !== currentEmployee.id);

    // 调用后端删除接口
    if (!currentEmployee) return;
    const id = currentEmployee.id;
    try {
      const res = await fetch(`/api/employees/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : ''
        }
      });
      const result = await res.json();
      if (result.code === 0) {
        message.success({
          content: `已删除员工 ${currentEmployee?.name} 的信息`,
          icon: <DeleteOutlined style={{ color: '#ef4444' }} />
        });
        fetchEmployees();
      } else {
        message.error(result.msg || '删除失败');
      }
    } catch (err) {
      message.error('删除失败');
    }
    setIsDeleteModalVisible(false);
  };

  // 个人导出预览
  const handleExportRecord = (record) => {
    setPreviewRecord(record);
    setPreviewVisible(true);
  };

  // 下载并生成PDF
  const handleDownloadRecord = async () => {
    try {
      const record = previewRecord;
      const canvas = await html2canvas(previewRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const doc = new jsPDF('p', 'pt', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const props = doc.getImageProperties(imgData);
      const pageHeight = (props.height * pageWidth) / props.width;
      doc.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight);
      doc.save(`Employee_${record.id}.pdf`);
      setPreviewVisible(false);
    } catch (err) {
      console.error(err);
      message.error('下载失败');
    }
  };

  // 下载并生成Excel（CSV）
  const handleDownloadExcelRecord = () => {
    if (!previewRecord) return;
    // 使用 exportFields 定义顺序与标签，并格式化字段值
    const keys = exportFields.map(f => f.key);
    const labels = exportFields.map(f => f.label);
    const csvRows = [labels.join(',')];
    const values = keys.map(k => {
      const v = previewRecord[k];
      let cell = '';
      if (k === 'emergencyContact' && v) {
        cell = `姓名：${v.name} || 关系：${v.relation} || 手机号：${v.phone}`;
      } else if (Array.isArray(v)) {
        cell = v.join(',');
      } else if (typeof v === 'string' && dayjs(v).isValid()) {
        cell = dayjs(v).format('MM-DD-YYYY');
      } else if (v !== null && typeof v === 'object') {
        cell = JSON.stringify(v);
      } else {
        cell = v ?? '';
      }
      return `"${cell.replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(','));
    const csvString = '\uFEFF' + csvRows.join('\r\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Employee_${previewRecord.id}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 渲染个人预览表格
  const renderPreviewTable = (record) => {
    if (!record) return null;
    // 使用 exportFields 定义预览顺序与标签和格式化值
    const rows = exportFields.map(f => {
      const v = record[f.key];
      let display = '';
      if (f.key === 'emergencyContact' && v) {
        display = `姓名：${v.name} || 关系：${v.relation} || 手机号：${v.phone}`;
      } else if (Array.isArray(v)) {
        display = v.join(',');
      } else if (typeof v === 'string' && dayjs(v).isValid()) {
        display = dayjs(v).format('MM-DD-YYYY');
      } else if (v !== null && typeof v === 'object') {
        display = JSON.stringify(v);
      } else {
        display = v;
      }
      return { label: f.label, value: display, key: f.key };
    });
    return (
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          {rows.map(({ key, label, value }) => (
            <tr key={key}>
              <td style={{ border: '1px solid #000', padding: '8px', fontWeight: 'bold' }}>{label}</td>
              <td style={{ border: '1px solid #000', padding: '8px' }}>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <PageContainer>
      <PageHeader>
        <h2>员工信息管理</h2>
        <SearchContainer>
          <Input
            placeholder="搜索 ID, 姓名, 部门, 职位..."
            prefix={<SearchOutlined />}
            onChange={(e) => handleSearch(e.target.value)}
            allowClear
            onPressEnter={(e) => handleSearch(e.target.value)}
          />
          <ActionButton
            type="primary"
            icon={<UserAddOutlined />}
            onClick={showAddModal}
          >
            添加员工
          </ActionButton>

          <Dropdown
            menu={{
              items: [
                {
                  key: 'json',
                  label: '导出JSON',
                  icon: <FileOutlined />,
                  onClick: exportAllJSON
                },
                {
                  key: 'excel',
                  label: '导出Excel',
                  icon: <FileExcelOutlined />,
                  onClick: exportAllExcel
                },
                {
                  key: 'console',
                  label: '在控制台查看',
                  icon: <CodeOutlined />,
                  onClick: () => {
                    console.log('\n\n所有员工数据：', employees);
                    message.success('所有员工数据已打印到控制台，请按F12查看');
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
          dataSource={filteredEmployees}
          rowKey="id"
          rowClassName={(record) => record.id === editedRowKey ? 'edited-row' : ''}
          expandable={{
            expandedRowKeys: expandedRowKeys,
            onExpand: (expanded, record) => {
              setExpandedRowKeys(expanded ? [record.id] : []);
            },
            expandIcon: ({ expanded, onExpand, record }) => (
              <ModernExpandButton
                expanded={expanded}
                onClick={() => onExpand(record, !expanded)}
              />
            ),
            expandedRowRender: (record) => {
              return (
                <EmployeeDetailCard>
                  <Row gutter={[24, 16]}>
                    {/* 基础信息、时间信息、联系信息 三列分组 */}
                    <Col span={8}>
                      <Title level={5}>基础信息</Title>
                      <DetailItem>
                        <span className="label">姓名:</span>
                        <span className="value">{record.name}</span>
                      </DetailItem>
                      <DetailItem>
                        <span className="label">ID:</span>
                        <span className="value">{record.id}</span>
                      </DetailItem>
                      <DetailItem>
                        <span className="label">年龄:</span>
                        <span className="value">{record.age}</span>
                      </DetailItem>
                      <DetailItem>
                        <span className="label">性别:</span>
                        <span className="value">{record.gender}</span>
                      </DetailItem>
                      <DetailItem>
                        <span className="label">生日:</span>
                        <span className="value">{record.birthday ? dayjs(record.birthday).format('MM-DD-YYYY') : '-'}</span>
                      </DetailItem>
                    </Col>
                    <Col span={8}>
                      <Title level={5}>时间信息</Title>
                      <DetailItem>
                        <span className="label">入职时间:</span>
                        <span className="value">{record.joinDate ? dayjs(record.joinDate).format('MM-DD-YYYY') : '-'}</span>
                      </DetailItem>
                      <DetailItem>
                        <span className="label">CPR过期日期:</span>
                        <span className="value">{record.cprExpire ? dayjs(record.cprExpire).format('MM-DD-YYYY') : '-'}</span>
                      </DetailItem>
                      <DetailItem>
                        <span className="label">最新培训日期:</span>
                        <span className="value">{record.latestTrainingDate ? dayjs(record.latestTrainingDate).format('MM-DD-YYYY') : '-'}</span>
                      </DetailItem>
                      <DetailItem>
                        <span className="label">证件有效期:</span>
                        <span className="value">{record.documentExpire ? dayjs(record.documentExpire).format('MM-DD-YYYY') : '-'}</span>
                      </DetailItem>
                      <DetailItem>
                        <span className="label">最新体检日期:</span>
                        <span className="value">{record.latestExamDate ? dayjs(record.latestExamDate).format('MM-DD-YYYY') : '-'}</span>
                      </DetailItem>
                    </Col>
                    <Col span={8}>
                      <Title level={5}>联系信息</Title>
                      <DetailItem>
                        <span className="label">手机:</span>
                        <span className="value">{record.phone}</span>
                      </DetailItem>
                      <DetailItem>
                        <span className="label">邮箱:</span>
                        <span className="value">{record.email}</span>
                      </DetailItem>
                      <DetailItem>
                        <span className="label">地址:</span>
                        <span className="value">{record.address || '-'}</span>
                      </DetailItem>
                    </Col>

                    {/* 紧急联系人信息 */}
                    <Col span={8}>
                      <Title level={5}>紧急联系人</Title>
                      <DetailItem>
                        <span className="label">姓名:</span>
                        <span className="value">{record.emergencyContact?.name || '-'}</span>
                      </DetailItem>
                      <DetailItem>
                        <span className="label">关系:</span>
                        <span className="value">{record.emergencyContact?.relation || '-'}</span>
                      </DetailItem>
                      <DetailItem>
                        <span className="label">电话:</span>
                        <span className="value">{record.emergencyContact?.phone || '-'}</span>
                      </DetailItem>
                    </Col>
                    <Col span={8}>
                      <Title level={5}>其他信息</Title>
                      <DetailItem>
                        <span className="label">语言:</span>
                        <span className="value">{Array.isArray(record.language) ? record.language.join(', ') : record.language || '-'}</span>
                      </DetailItem>
                      <DetailItem>
                        <span className="label">职位:</span>
                        <span className="value">{record.position}</span>
                      </DetailItem>
                      <DetailItem>
                        <span className="label">状态:</span>
                        <span className="value">{getStatusTag(record.status)}</span>
                      </DetailItem>
                    </Col>

                    {/* 备注信息 */}
                    <Col span={24}>
                      <Title level={5}>备注</Title>
                      <div style={{ whiteSpace: 'pre-wrap', marginBottom: '12px', textAlign: 'left' }}>
                        {record.note || '-'}
                      </div>
                    </Col>
                  </Row>
                </EmployeeDetailCard>
              );
            }
          }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
            pageSizeOptions: ['10', '20', '50'],
            position: ['bottomCenter']
          }}
        />
      </TableCard>

      {/* 添加/编辑员工模态框 */}
      <Modal
        title={currentEmployee ? "编辑员工信息" : "添加新员工"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={handleSubmit}>
            {currentEmployee ? "保存" : "添加"}
          </Button>,
        ]}
        width={700}
        styles={{ body: { padding: '24px' } }}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            gender: '男',
            status: 'active'
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item name="name" label="姓名" rules={[{ required: true, message: '请输入姓名' }]}>  
              <Input placeholder="请输入姓名" />  
            </Form.Item>
            <Form.Item name="id" label="ID">  
              <Input placeholder="请输入ID" />  
            </Form.Item>
            <Form.Item name="age" label="年龄">  
              <Input type="number" placeholder="请输入年龄" />  
            </Form.Item>
            <Form.Item name="gender" label="性别">  
              <Select placeholder="请选择性别">  
                <Select.Option value="男">男</Select.Option>  
                <Select.Option value="女">女</Select.Option>  
              </Select>  
            </Form.Item>
            <Form.Item name="birthday" label="生日">
              <DatePicker style={{ width: '100%' }} format="MM-DD-YYYY" placeholder="MM-DD-YYYY" />
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
            <Form.Item name="position" label="职位">  
              <Input placeholder="请输入职位" />  
            </Form.Item>
            <Form.Item name="status" label="状态">  
              <Select placeholder="请选择状态">  
                <Select.Option value="active">在职</Select.Option>  
                <Select.Option value="inactive">离职</Select.Option>  
                <Select.Option value="onleave">休假</Select.Option>  
              </Select>  
            </Form.Item>
            <Form.Item  
              name="phone"  
              label="手机"  
              rules={[  
                { required: true, message: '请输入手机号码' },  
                { pattern: /^\(\d{3}\)\d{3}-\d{4}$/, message: '请按照(xxx)xxx-xxxx的格式输入' }  
              ]}  
            >  
              <Input  
                placeholder="(xxx)xxx-xxxx"  
                maxLength={13}  
                onChange={(e) => {  
                  const value = e.target.value.replace(/\D/g, '');  
                  const trimmed = value.slice(0, 10);  
                  let formatted = '';  
                  if (trimmed.length > 0) {  
                    formatted = `(${trimmed.slice(0, 3)}`;  
                    if (trimmed.length > 3) formatted += `)${trimmed.slice(3, 6)}`;  
                    else formatted += ')';  
                    if (trimmed.length > 6) formatted += `-${trimmed.slice(6)}`;  
                  }  
                  form.setFieldValue('phone', formatted);  
                }}  
              />  
            </Form.Item>
            <Form.Item name="email" label="Email" rules={[
              { type: 'email', message: '请输入有效的邮箱' },
              { required: true, message: '请输入邮箱' }
            ]}>
              <Input placeholder="请输入邮箱" />
            </Form.Item>
            <Form.Item name="joinDate" label="入职时间">
              <DatePicker style={{ width: '100%' }} format="MM-DD-YYYY" placeholder="MM-DD-YYYY" />
            </Form.Item>
            <Form.Item name="cprExpire" label="CPR过期日期">
              <DatePicker style={{ width: '100%' }} format="MM-DD-YYYY" placeholder="MM-DD-YYYY" />
            </Form.Item>
            <Form.Item name="latestTrainingDate" label="最新培训日期">
              <DatePicker style={{ width: '100%' }} format="MM-DD-YYYY" placeholder="MM-DD-YYYY" />
            </Form.Item>
            <Form.Item name="documentExpire" label="证件有效期">
              <DatePicker style={{ width: '100%' }} format="MM-DD-YYYY" placeholder="MM-DD-YYYY" />
            </Form.Item>
            <Form.Item name="latestExamDate" label="最新体检日期">
              <DatePicker style={{ width: '100%' }} format="MM-DD-YYYY" placeholder="MM-DD-YYYY" />
            </Form.Item>
          </div>
          <Form.Item name="address" label="地址" style={{ gridColumn: '1/3' }}>
            <Input.TextArea rows={2} placeholder="请输入地址" />
          </Form.Item>
          {/* 紧急联系人信息 */}
          <div style={{ gridColumn: '1/3', margin: '16px 0', borderBottom: '1px solid #f0f0f0' }} />
          <h3 style={{ gridColumn: '1/3', marginBottom: '16px' }}>紧急联系人信息</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item name={['emergencyContact', 'name']} label="紧急联系人姓名">  
              <Input placeholder="请输入紧急联系人姓名" />  
            </Form.Item>
            <Form.Item name={['emergencyContact', 'relation']} label="关系">  
              <Select placeholder="请选择关系">  
                <Select.Option value="父亲">父亲</Select.Option>  
                <Select.Option value="母亲">母亲</Select.Option>  
                <Select.Option value="儿子">儿子</Select.Option>  
                <Select.Option value="女儿">女儿</Select.Option>  
                <Select.Option value="配偶">配偶</Select.Option>  
                <Select.Option value="朋友">朋友</Select.Option>  
              </Select>  
            </Form.Item>
            <Form.Item
              name={['emergencyContact', 'phone']}
              label="紧急联系人电话"
              rules={[
                { pattern: /^\(\d{3}\)\d{3}-\d{4}$/, message: '请按照(xxx)xxx-xxxx的格式输入' }
              ]}
              style={{ gridColumn: '1/3' }}
            >
              <Input
                placeholder="(xxx)xxx-xxxx"
                maxLength={13}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  const trimmed = val.slice(0, 10);
                  let formatted = '';
                  if (trimmed.length > 0) {
                    formatted = `(${trimmed.slice(0, 3)}`;
                    if (trimmed.length > 3) formatted += `)${trimmed.slice(3, 6)}`;
                    else formatted += ')';
                    if (trimmed.length > 6) formatted += `-${trimmed.slice(6)}`;
                  }
                  form.setFieldValue(['emergencyContact', 'phone'], formatted);
                }}
              />
            </Form.Item>
          </div>
          {/* 备注信息 */}
          <div style={{ gridColumn: '1/3', margin: '16px 0', borderBottom: '1px solid #f0f0f0' }} />
          <h3 style={{ gridColumn: '1/3', marginBottom: '16px' }}>备注信息</h3>
          <Form.Item name="note" label="备注信息" style={{ gridColumn: '1/3' }}>  
            <Input.TextArea rows={4} placeholder="请输入备注信息" />  
          </Form.Item>
        </Form>
      </Modal>

      {/* 删除确认模态框 */}
      <Modal
        title="确认删除"
        visible={isDeleteModalVisible}
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
        <p>确定要删除员工 <strong>{currentEmployee?.name}</strong> 的信息吗？此操作不可撤销。</p>
      </Modal>

      {/* 个人导出预览 */}
      {previewVisible && (
        <Modal
          visible={previewVisible}
          title="导出预览"
          width={800}
          onCancel={() => setPreviewVisible(false)}
          footer={[
            <Button key="excel" type="primary" onClick={handleDownloadExcelRecord}>下载Excel</Button>,
            <Button key="download" type="primary" onClick={handleDownloadRecord}>下载PDF</Button>,
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

export default EmployeeInfo;
