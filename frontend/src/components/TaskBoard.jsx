import { useState } from 'react';
import { Card, Tag, Row, Col, Typography, Modal, Form, Input, Select, Button, Avatar, Tooltip, DatePicker } from 'antd';
import { PlusOutlined, CalendarOutlined, UserOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import TaskDetail from './TaskDetail';
import moment from 'moment';

const { Title, Paragraph } = Typography;
const { Option } = Select;

// 样式组件
const BoardContainer = styled.div`
  display: flex;
  gap: 20px;
  overflow-x: auto;
  padding: 20px 0;
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.15) transparent;

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.15);
    border-radius: 20px;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.05);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 16px 0;
  }
`;

const TaskColumn = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  min-width: 300px;
  width: 100%;
  padding: 18px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08), 0 5px 15px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1), 0 8px 20px rgba(0, 0, 0, 0.06);
    transform: translateY(-3px);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 5px;
    background: ${props => {
      if (props.status === 'todo') return 'linear-gradient(90deg, #ff4d4f, #ff7a45)';
      if (props.status === 'inProgress') return 'linear-gradient(90deg, #1890ff, #36cfc9)';
      return 'linear-gradient(90deg, #52c41a, #85a5ff)';
    }};
    border-radius: 8px 8px 0 0;
  }

  @media (max-width: 768px) {
    min-width: 100%;
    margin-bottom: 16px;
  }
`;

const ColumnHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);

  h4 {
    font-weight: 600;
    color: #1a1a1a;
    margin: 0;
    position: relative;
    padding-left: 10px;
    font-size: 15px;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 14px;
      background: ${props => {
        if (props.status === 'todo') return '#ff4d4f';
        if (props.status === 'inProgress') return '#1890ff';
        return '#52c41a';
      }};
      border-radius: 3px;
      box-shadow: 0 2px 4px ${props => {
        if (props.status === 'todo') return 'rgba(255, 77, 79, 0.3)';
        if (props.status === 'inProgress') return 'rgba(24, 144, 255, 0.3)';
        return 'rgba(82, 196, 26, 0.3)';
      }};
    }
  }
`;

const TaskCard = styled(Card)`
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 12px;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02);
  border: none;
  overflow: hidden;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: ${props => {
      if (props.priority === 'high') return '#f5222d';
      if (props.priority === 'medium') return '#fa8c16';
      return '#52c41a';
    }};
    box-shadow: 0 0 8px ${props => {
      if (props.priority === 'high') return 'rgba(245, 34, 45, 0.3)';
      if (props.priority === 'medium') return 'rgba(250, 140, 22, 0.3)';
      return 'rgba(82, 196, 26, 0.3)';
    }};
  }

  .ant-card-body {
    padding: 12px 16px;
  }

  &:hover {
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08), 0 3px 8px rgba(0, 0, 0, 0.04);
    transform: translateY(-2px);
  }

  h5 {
    font-weight: 600;
    margin-bottom: 8px !important;
    color: #262626;
    font-size: 14px;
  }

  .ant-typography {
    color: #595959;
    font-size: 12px;
    line-height: 1.5;
  }
`;

const TaskMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px dashed rgba(0, 0, 0, 0.05);
`;

const TaskMetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #8c8c8c;
  font-size: 11px;
  background: rgba(0, 0, 0, 0.02);
  padding: 3px 6px;
  border-radius: 4px;
  transition: all 0.2s;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);

  &:hover {
    background: rgba(0, 0, 0, 0.04);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  }

  .anticon {
    font-size: 12px;
    color: #1890ff;
  }
`;

const AddTaskButton = styled(Button)`
  width: 100%;
  margin-top: 12px;
  height: 36px;
  border-radius: 10px;
  font-weight: 500;
  font-size: 13px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.03);
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.08), 0 3px 6px rgba(0, 0, 0, 0.05);
  }

  .anticon {
    font-size: 14px;
  }
`;

// 优先级标签颜色
const priorityColors = {
  high: 'red',
  medium: 'orange',
  low: 'green',
};

// 状态显示名称
const statusNames = {
  todo: '待办',
  inProgress: '进行中',
  done: '已完成',
};

const TaskBoard = ({ tasks, onTaskMove, onAddTask, onUpdateTask, onDeleteTask }) => {
  const [draggingTask, setDraggingTask] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [form] = Form.useForm();
  const [targetStatus, setTargetStatus] = useState('todo');

  // 开始拖拽
  const handleDragStart = (e, task, status) => {
    e.dataTransfer.setData('taskId', task.id);
    e.dataTransfer.setData('sourceStatus', status);
    setDraggingTask(task);
  };

  // 允许放置
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // 放置任务
  const handleDrop = (e, destinationStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const sourceStatus = e.dataTransfer.getData('sourceStatus');

    // 找到任务在源列表中的索引
    const sourceIndex = tasks[sourceStatus].findIndex(task => task.id === taskId);

    // 模拟拖拽结束事件
    onTaskMove(
      taskId,
      { droppableId: sourceStatus, index: sourceIndex },
      { droppableId: destinationStatus, index: tasks[destinationStatus].length }
    );

    setDraggingTask(null);
  };

  // 打开添加任务模态框
  const showAddTaskModal = (status) => {
    setTargetStatus(status);
    setIsModalVisible(true);
  };

  // 处理添加任务
  const handleAddTask = () => {
    form.validateFields().then(values => {
      // 处理日期格式
      const formattedValues = {
        ...values,
        dueDate: values.dueDate ? values.dueDate.format('YYYY-MM-DD') : null,
      };
      onAddTask(formattedValues, targetStatus);
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  // 打开任务详情
  const showTaskDetail = (task) => {
    setSelectedTask(task);
    setDetailVisible(true);
  };

  // 关闭任务详情
  const closeTaskDetail = () => {
    setDetailVisible(false);
    setSelectedTask(null);
  };

  // 更新任务
  const handleUpdateTask = (updatedTask) => {
    if (onUpdateTask) {
      onUpdateTask(updatedTask);
    }
  };

  // 删除任务
  const handleDeleteTask = (taskId) => {
    if (onDeleteTask) {
      onDeleteTask(taskId);
    }
  };

  return (
    <>
      <BoardContainer>
        {Object.keys(tasks).map(status => (
          <TaskColumn
            key={status}
            status={status}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, status)}
          >
            <ColumnHeader status={status}>
              <Title level={4}>{statusNames[status]} ({tasks[status].length})</Title>
            </ColumnHeader>

            {tasks[status].map(task => (
              <TaskCard
                key={task.id}
                draggable
                priority={task.priority}
                onDragStart={(e) => handleDragStart(e, task, status)}
                onClick={() => showTaskDetail(task)}
              >
                <Title level={5} style={{ marginBottom: '6px' }}>{task.title}</Title>
                <Paragraph ellipsis={{ rows: 2 }} style={{ marginBottom: '10px', fontSize: '12px' }}>
                  {task.description || '暂无描述'}
                </Paragraph>

                <TaskMeta>
                  <Tag color={priorityColors[task.priority]} style={{ fontSize: '11px', padding: '0 5px', height: '20px', lineHeight: '20px' }}>
                    {task.priority === 'high' ? '高优先级' :
                     task.priority === 'medium' ? '中优先级' : '低优先级'}
                  </Tag>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    {task.dueDate && (
                      <Tooltip title="截止日期">
                        <TaskMetaItem>
                          <CalendarOutlined />
                          {task.dueDate}
                        </TaskMetaItem>
                      </Tooltip>
                    )}

                    {task.assignee && (
                      <Tooltip title={`负责人: ${task.assignee}`}>
                        <Avatar
                          size="small"
                          icon={<UserOutlined />}
                          style={{ backgroundColor: '#1890ff', width: '20px', height: '20px', fontSize: '12px' }}
                        />
                      </Tooltip>
                    )}
                  </div>
                </TaskMeta>
              </TaskCard>
            ))}
          </TaskColumn>
        ))}
      </BoardContainer>

      {/* 添加任务模态框 */}
      <Modal
        title="添加新任务"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={handleAddTask}>
            添加
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="任务标题"
            rules={[{ required: true, message: '请输入任务标题' }]}
          >
            <Input placeholder="请输入任务标题" />
          </Form.Item>

          <Form.Item
            name="description"
            label="任务描述"
          >
            <Input.TextArea rows={4} placeholder="请输入任务描述" />
          </Form.Item>

          <Form.Item
            name="priority"
            label="优先级"
            initialValue="medium"
          >
            <Select>
              <Option value="high">高优先级</Option>
              <Option value="medium">中优先级</Option>
              <Option value="low">低优先级</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="dueDate"
            label="截止日期"
          >
            <DatePicker placeholder="请选择截止日期" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="assignee"
            label="负责人"
          >
            <Select placeholder="请选择负责人">
              <Option value="张三">张三</Option>
              <Option value="李四">李四</Option>
              <Option value="王五">王五</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 任务详情抽屉 */}
      <TaskDetail
        visible={detailVisible}
        onClose={closeTaskDetail}
        task={selectedTask}
        onUpdate={handleUpdateTask}
        onDelete={handleDeleteTask}
      />
    </>
  );
};

export default TaskBoard;
