import { useState, useEffect } from 'react';
import { Button, Typography, message, Modal, Form, Input, Select, DatePicker } from 'antd';
import { PlusOutlined, CalendarOutlined } from '@ant-design/icons';
import TaskBoard from '../components/TaskBoard';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// 初始任务数据
const initialTasks = {
  todo: [
    { id: '1', title: '完成登录页面', description: '实现用户登录功能', priority: 'high' },
    { id: '2', title: '设计数据库', description: '设计任务管理系统的数据库结构', priority: 'medium' },
  ],
  inProgress: [
    { id: '3', title: '开发任务看板', description: '实现拖拽功能的任务看板', priority: 'high' },
  ],
  done: [
    { id: '4', title: '项目初始化', description: '创建项目并安装依赖', priority: 'low' },
  ],
};

const Dashboard = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [taskStatus, setTaskStatus] = useState('todo');

  // 模拟从API获取任务数据
  useEffect(() => {
    // 实际应用中，这里应该是API调用
    setTasks(initialTasks);
  }, []);

  // 处理任务移动
  const handleTaskMove = (_, source, destination) => {
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const newTasks = { ...tasks };
    const sourceList = [...newTasks[source.droppableId]];
    const destinationList = source.droppableId === destination.droppableId
      ? sourceList
      : [...newTasks[destination.droppableId]];

    // 从源列表中移除任务
    const [movedTask] = sourceList.splice(source.index, 1);

    // 添加到目标列表
    destinationList.splice(destination.index, 0, movedTask);

    // 更新状态
    if (source.droppableId === destination.droppableId) {
      newTasks[source.droppableId] = sourceList;
    } else {
      newTasks[source.droppableId] = sourceList;
      newTasks[destination.droppableId] = destinationList;
    }

    setTasks(newTasks);
    message.success(`任务 "${movedTask.title}" 已移动`);
  };

  // 添加新任务
  const handleAddTask = (task, status) => {
    const newTask = {
      id: Date.now().toString(),
      ...task
    };

    setTasks(prev => ({
      ...prev,
      [status]: [...prev[status], newTask]
    }));

    message.success('任务已添加');
  };

  // 打开添加任务模态框
  const showAddTaskModal = (status = 'todo') => {
    setTaskStatus(status);
    form.resetFields();
    setIsModalVisible(true);
  };

  // 关闭模态框
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // 提交表单
  const handleOk = () => {
    form.validateFields().then(values => {
      const { title, description, priority, dueDate } = values;

      const task = {
        title,
        description,
        priority,
        dueDate: dueDate ? dueDate.format('YYYY-MM-DD') : null
      };

      handleAddTask(task, taskStatus);
      setIsModalVisible(false);
      form.resetFields();
    }).catch(info => {
      console.log('Validate Failed:', info);
    });
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
      borderRadius: '16px',
      padding: '20px',
      minHeight: 'calc(100vh - 120px)',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.06), 0 5px 15px rgba(0, 0, 0, 0.04), 0 2px 5px rgba(0, 0, 0, 0.02)',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
        paddingBottom: 20,
        borderBottom: '1px solid rgba(0, 0, 0, 0.06)'
      }}>
        <Title
          level={3}
          style={{
            margin: 0,
            fontWeight: 600,
            color: '#1a1a1a',
            position: 'relative',
            paddingLeft: 16,
            fontSize: '20px'
          }}
        >
          <span
            style={{
              position: 'absolute',
              left: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 4,
              height: 20,
              background: 'linear-gradient(to bottom, #1890ff, #36cfc9)',
              borderRadius: 4,
              boxShadow: '0 2px 6px rgba(24, 144, 255, 0.3)'
            }}
          />
          任务面板
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showAddTaskModal('todo')}
          size="middle"
          style={{
            borderRadius: 10,
            height: 38,
            padding: '0 20px',
            fontWeight: 500,
            fontSize: '13px',
            boxShadow: '0 6px 16px rgba(24, 144, 255, 0.3), 0 3px 6px rgba(24, 144, 255, 0.2)',
            background: 'linear-gradient(90deg, #1890ff, #36cfc9)',
            border: 'none'
          }}
        >
          添加任务
        </Button>
      </div>
      <TaskBoard
        tasks={tasks}
        onTaskMove={handleTaskMove}
        onAddTask={handleAddTask}
      />

      <Modal
        title="添加新任务"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            添加
          </Button>
        ]}
        width={500}
        closeIcon={<span style={{ fontSize: '20px' }}>&times;</span>}
      >
        <Form
          form={form}
          layout="vertical"
          name="task_form"
          style={{ maxWidth: '100%' }}
        >
          <Form.Item
            name="title"
            label={<span style={{ color: '#333' }}><span style={{ color: 'red', marginRight: '4px' }}></span>任务标题</span>}
            rules={[{ required: true, message: '请输入任务标题' }]}
          >
            <Input placeholder="请输入任务标题" style={{ height: '40px', borderRadius: '4px' }} />
          </Form.Item>

          <Form.Item
            name="description"
            label={<span style={{ color: '#333' }}>任务描述</span>}
          >
            <TextArea
              rows={4}
              placeholder="请输入任务描述"
              style={{ borderRadius: '4px' }}
            />
          </Form.Item>

          <Form.Item
            name="priority"
            label={<span style={{ color: '#333' }}>优先级</span>}
            initialValue="medium"
          >
            <Select
              placeholder="中优先级"
              style={{ height: '40px', borderRadius: '4px' }}
              suffixIcon={<span style={{ fontSize: '12px' }}>&#9662;</span>}
            >
              <Option value="high">高优先级</Option>
              <Option value="medium">中优先级</Option>
              <Option value="low">低优先级</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="dueDate"
            label={<span style={{ color: '#333' }}>截止日期</span>}
          >
            <DatePicker
              style={{ width: '100%', height: '40px', borderRadius: '4px' }}
              placeholder="请选择截止日期"
              format="YYYY-MM-DD"
              suffixIcon={<CalendarOutlined />}
            />
          </Form.Item>

          <Form.Item
            name="assignee"
            label={<span style={{ color: '#333' }}>负责人</span>}
          >
            <Select
              placeholder="请选择负责人"
              style={{ height: '40px', borderRadius: '4px' }}
              suffixIcon={<span style={{ fontSize: '12px' }}>&#9662;</span>}
            >
              <Option value="张三">张三</Option>
              <Option value="李四">李四</Option>
              <Option value="王五">王五</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Dashboard;
