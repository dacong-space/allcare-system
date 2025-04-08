import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { setEmployeeCount } from '../services/dataService';
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
  DatePicker
} from 'antd';
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
  CodeOutlined
} from '@ant-design/icons';
import { MinimalistManIcon, MinimalistWomanIcon } from '../components/CustomIcons';
import styled from 'styled-components';

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
    background: #fef3c7;
    color: #d97706;
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
  const [form] = Form.useForm();

  // 初始化员工数据
  useEffect(() => {
    // 生成30个员工数据
    const departments = ['内科', '外科', '儿科', '妇产科', '急诊科', '护理部', '药剂科', '检验科', '放射科', '麻醉科'];
    const positions = ['主任医师', '副主任医师', '主治医师', '住院医师', '护士长', '护士', '药剂师', '检验师', '技师', '行政人员'];
    const statuses = ['active', 'inactive', 'onleave'];
    const cities = ['北京', '上海', '广州', '深圳', '成都', '杭州', '南京', '武汉', '西安', '重庆'];

    // 生成随机日期
    const getRandomDate = () => {
      const start = new Date(2015, 0, 1);
      const end = new Date();
      const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    // 生成随机年龄
    const getRandomAge = () => {
      return Math.floor(Math.random() * 40) + 22; // 22-61岁
    };

    // 生成随机加入次数
    const getRandomJoinTimes = () => {
      return Math.floor(Math.random() * 2) + 1; // 1-2次
    };

    // 生成随机语言
    const languages = ['中文', '英语', '法语', '德语', '日语'];

    // 生成30个员工数据
    const mockData = Array.from({ length: 30 }, (_, i) => {
      const id = `EMP${String(i + 1).padStart(3, '0')}`;
      const gender = Math.random() > 0.5 ? '男' : '女';
      const age = getRandomAge();
      const language = languages[Math.floor(Math.random() * languages.length)];
      const department = departments[Math.floor(Math.random() * departments.length)];
      const position = positions[Math.floor(Math.random() * positions.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const city = cities[Math.floor(Math.random() * cities.length)];
      const joinTimes = getRandomJoinTimes();
      const hireDate = getRandomDate();

      // 离职时间可能为空（如果是在职员工）
      const leaveDate = status === 'active' ? null : getRandomDate();

      // 创建员工数据对象，按照指定的顺序排列字段
      const employee = {};

      // 生成姓名
      const name = ['张', '李', '王', '赵', '钱', '孙', '周', '吴', '郑', '陈'][i % 10] +
                  ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'][Math.floor(i / 10)] +
                  (gender === '男' ? '男' : '女');

      // 生成地址
      const address = `${city}市${['东', '西', '南', '北', '中'][Math.floor(Math.random() * 5)]}区`;

      // 按照指定的顺序添加字段
      employee.id = id;
      employee.name = name;
      employee.age = age;
      employee.gender = gender;
      employee.language = language;
      employee.phone = `(${Math.floor(Math.random() * 900) + 100})-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 10000)}`;
      employee.email = `employee${i + 1}@example.com`;
      employee.city = city;
      employee.address = address;
      employee.hireDate = hireDate;
      employee.leaveDate = leaveDate;
      employee.joinTimes = joinTimes;
      employee.department = department;
      employee.position = position;
      employee.status = status;

      return employee;
    });

    setEmployees(mockData);
    // 更新员工数量
    setEmployeeCount(mockData.length);
  }, []);

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
      title: '部门',
      dataIndex: 'department',
      key: 'department',
      width: 140,
    },
    {
      title: '职位',
      dataIndex: 'position',
      key: 'position',
      width: 140,
    },
    {
      title: '地点',
      dataIndex: 'city',
      key: 'city',
      width: 100,
    },
    {
      title: '联系方式',
      key: 'contact',
      width: 100,
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title={record.email}>
            <MailOutlined style={{ color: 'var(--primary-color)' }} />
          </Tooltip>
          <Tooltip title={record.phone}>
            <PhoneOutlined style={{ color: 'var(--primary-color)' }} />
          </Tooltip>
        </Space>
      ),
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
      employee.department.toLowerCase().includes(value.toLowerCase()) ||
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

  // 过滤员工数据
  const filteredEmployees = employees.filter(employee =>
    searchText === '' ||
    employee.name.toLowerCase().includes(searchText.toLowerCase()) ||
    employee.id.includes(searchText) ||
    employee.department.toLowerCase().includes(searchText.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchText.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchText.toLowerCase()) ||
    employee.phone.includes(searchText)
  );

  // 显示添加员工模态框
  const showAddModal = () => {
    setCurrentEmployee(null);
    form.resetFields();

    // 生成新的员工ID
    const maxId = employees.length > 0
      ? Math.max(...employees.map(emp => parseInt(emp.id.replace('EMP', ''))))
      : 0;
    const newId = `EMP${String(maxId + 1).padStart(3, '0')}`;

    form.setFieldsValue({
      id: newId
    });

    setIsModalVisible(true);
  };

  // 显示编辑员工模态框
  const handleEdit = (record) => {
    setCurrentEmployee(record);

    // 处理日期格式
    const hireDateValue = record.hireDate ? dayjs(record.hireDate) : null;
    const leaveDateValue = record.leaveDate ? dayjs(record.leaveDate) : null;

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
      hireDate: hireDateValue,
      leaveDate: leaveDateValue,
      joinTimes: record.joinTimes,
      department: record.department,
      position: record.position,
      status: record.status,
    });
    setIsModalVisible(true);
  };

  // 显示删除确认
  const showDeleteConfirm = (record) => {
    setCurrentEmployee(record);
    setIsDeleteModalVisible(true);
  };

  // 处理添加/编辑提交
  const handleSubmit = () => {
    form.validateFields().then(values => {
      // 处理日期格式
      if (values.hireDate) {
        values.hireDate = values.hireDate.format('YYYY-MM-DD');
      }
      if (values.leaveDate) {
        values.leaveDate = values.leaveDate.format('YYYY-MM-DD');
      }
      if (currentEmployee) {
        // 编辑现有员工，按照指定的顺序排列字段
        const updatedEmployees = employees.map(employee => {
          if (employee.id === currentEmployee.id) {
            // 创建新对象，按照指定的顺序添加字段
            const updatedEmployee = {};

            // 按照指定的顺序添加字段
            updatedEmployee.id = values.id || employee.id;
            updatedEmployee.name = values.name || employee.name;
            updatedEmployee.age = values.age !== undefined ? values.age : employee.age;
            updatedEmployee.gender = values.gender || employee.gender;
            updatedEmployee.language = values.language || employee.language;
            updatedEmployee.phone = values.phone || employee.phone;
            updatedEmployee.email = values.email || employee.email;
            updatedEmployee.city = values.city || employee.city;
            updatedEmployee.address = values.address || employee.address;
            updatedEmployee.hireDate = values.hireDate || employee.hireDate;
            updatedEmployee.leaveDate = values.leaveDate || employee.leaveDate;
            updatedEmployee.joinTimes = values.joinTimes !== undefined ? values.joinTimes : employee.joinTimes;
            updatedEmployee.department = values.department || employee.department;
            updatedEmployee.position = values.position || employee.position;
            updatedEmployee.status = values.status || employee.status;

            return updatedEmployee;
          }
          return employee;
        });

        setEmployees(updatedEmployees);
        setEditedRowKey(currentEmployee.id);

        // 显示成功消息
        message.success({
          content: `已更新员工 ${values.name} 的信息`,
          icon: <EditOutlined style={{ color: '#10b981' }} />
        });

        // 3秒后清除高亮效果
        setTimeout(() => {
          setEditedRowKey(null);
        }, 3000);
      } else {
        // 添加新员工，按照指定的顺序排列字段
        const newEmployee = {};

        // 生成新的员工ID
        const newId = values.id || `EMP${String(employees.length + 1).padStart(3, '0')}`;

        // 按照指定的顺序添加字段
        newEmployee.id = newId;
        newEmployee.name = values.name;
        newEmployee.age = values.age;
        newEmployee.gender = values.gender;
        newEmployee.language = values.language;
        newEmployee.phone = values.phone;
        newEmployee.email = values.email;
        newEmployee.city = values.city;
        newEmployee.address = values.address;
        newEmployee.hireDate = values.hireDate;
        newEmployee.leaveDate = values.leaveDate;
        newEmployee.joinTimes = values.joinTimes;
        newEmployee.department = values.department;
        newEmployee.position = values.position;
        newEmployee.status = values.status;

        setEmployees([...employees, newEmployee]);
        setEditedRowKey(newEmployee.id);

        // 显示成功消息
        message.success({
          content: `已添加员工 ${values.name}`,
          icon: <UserAddOutlined style={{ color: '#10b981' }} />
        });

        // 3秒后清除高亮效果
        setTimeout(() => {
          setEditedRowKey(null);
        }, 3000);
      }

      setIsModalVisible(false);
    });
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
            'city',          // 城市
            'address',       // 地址
            'hireDate',      // 加入时间
            'leaveDate',     // 离开时间
            'joinTimes',     // 加入次数
            'department',    // 部门
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

  // 处理删除
  const handleDelete = () => {
    // 从数据中删除员工
    const updatedEmployees = employees.filter(employee => employee.key !== currentEmployee.key);

    // 显示删除动画和成功消息
    message.success({
      content: `已删除员工 ${currentEmployee?.name} 的信息`,
      icon: <DeleteOutlined style={{ color: '#ef4444' }} />
    });

    // 延迟更新数据，以显示动画效果
    setTimeout(() => {
      setEmployees(updatedEmployees);
      setIsDeleteModalVisible(false);
    }, 300);
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
                    console.log('\n\n员工数据结构示例：', employees[0]);
                    message.success('员工数据结构已打印到控制台，请按F12查看');
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
          rowClassName={(record) => record.key === editedRowKey ? 'edited-row' : ''}
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
        open={isModalVisible}
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
            status: 'active',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item
              name="id"
              label="ID"
              rules={[{ required: true, message: '请输入ID' }]}
            >
              <Input placeholder="请输入ID" disabled={!!currentEmployee} />
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
              <Input type="number" min={18} max={80} placeholder="请输入年龄" />
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
              rules={[
                { required: true, message: '请输入电话' },
                {
                  pattern: /^\(\d{3}\)-\d{3}-\d{4}$/,
                  message: '请按照(xxx)-xxx-xxxx的格式输入'
                }
              ]}
            >
              <Input
                placeholder="请输入电话号码"
                maxLength={14}
                onChange={(e) => {
                  // 去除所有非数字字符
                  const value = e.target.value.replace(/\D/g, '');

                  // 限制最多10位数字
                  const trimmedValue = value.slice(0, 10);

                  // 根据输入长度格式化
                  let formattedValue = '';
                  if (trimmedValue.length > 0) {
                    // 前3位
                    formattedValue = `(${trimmedValue.slice(0, 3)}`;

                    // 中间3位
                    if (trimmedValue.length > 3) {
                      formattedValue += `)-${trimmedValue.slice(3, 6)}`;
                    } else {
                      formattedValue += ')';
                    }

                    // 后4位
                    if (trimmedValue.length > 6) {
                      formattedValue += `-${trimmedValue.slice(6)}`;
                    }
                  }

                  // 更新表单字段值
                  form.setFieldValue('phone', formattedValue);
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
              name="hireDate"
              label="入职日期"
            >
              <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" placeholder="请选择入职日期" />
            </Form.Item>

            <Form.Item
              name="leaveDate"
              label="离职日期"
            >
              <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" placeholder="请选择离职日期（可选）" />
            </Form.Item>

            <Form.Item
              name="joinTimes"
              label="加入次数"
            >
              <Input type="number" min={1} max={10} placeholder="请输入加入次数" />
            </Form.Item>

            <Form.Item
              name="department"
              label="部门"
              rules={[{ required: true, message: '请输入部门' }]}
            >
              <Input placeholder="请输入部门" />
            </Form.Item>

            <Form.Item
              name="position"
              label="职位"
              rules={[{ required: true, message: '请输入职位' }]}
            >
              <Input placeholder="请输入职位" />
            </Form.Item>

            <Form.Item
              name="status"
              label="状态"
              rules={[{ required: true, message: '请选择状态' }]}
            >
              <Select>
                <Select.Option value="active">在职</Select.Option>
                <Select.Option value="inactive">离职</Select.Option>
                <Select.Option value="onleave">休假</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            name="address"
            label="地址"
          >
            <Input.TextArea rows={2} placeholder="请输入地址" />
          </Form.Item>
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
        <p>确定要删除员工 <strong>{currentEmployee?.name}</strong> 的信息吗？此操作不可撤销。</p>
      </Modal>
    </PageContainer>
  );
};

export default EmployeeInfo;
