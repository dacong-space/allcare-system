import { useState, useEffect } from 'react';
import {
  Drawer,
  Form,
  Input,
  Select,
  Button,
  Space,
  Divider,
  Typography,
  Tag,
  Avatar,
  List,
  DatePicker,
  message
} from 'antd';
import {
  CloseOutlined,
  SaveOutlined,
  DeleteOutlined,
  PaperClipOutlined,
  UserOutlined,
  CalendarOutlined,
  TagOutlined,
  MessageOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import moment from 'moment';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// 样式组件
const DetailHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const DetailSection = styled.div`
  margin-bottom: 24px;
`;

const DetailMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 24px;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
`;

const CommentList = styled(List)`
  margin-top: 16px;
`;

// 自定义评论组件
const CommentItem = ({ author, avatar, content, datetime }) => {
  return (
    <div style={{ display: 'flex', marginBottom: '16px' }}>
      <div style={{ marginRight: '12px' }}>
        {avatar}
      </div>
      <div style={{ flex: 1 }}>
        <div>
          <Text strong>{author}</Text>
          <Text type="secondary" style={{ marginLeft: '8px' }}>{datetime}</Text>
        </div>
        <div style={{ marginTop: '4px' }}>
          {content}
        </div>
      </div>
    </div>
  );
};

const TaskDetail = ({
  visible,
  onClose,
  task,
  onUpdate,
  onDelete
}) => {
  const [form] = Form.useForm();
  const [editing, setEditing] = useState(false);
  const [comments, setComments] = useState([
    {
      author: '张三',
      avatar: <Avatar icon={<UserOutlined />} />,
      content: <p>这个任务需要尽快完成，客户很着急。</p>,
      datetime: '2023-04-01 10:30',
    },
    {
      author: '李四',
      avatar: <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />,
      content: <p>我已经开始处理了，预计明天可以完成。</p>,
      datetime: '2023-04-01 14:45',
    },
  ]);
  const [commentValue, setCommentValue] = useState('');

  // 当任务变化时重置表单
  useEffect(() => {
    if (task) {
      form.setFieldsValue({
        title: task.title,
        description: task.description,
        priority: task.priority,
        dueDate: task.dueDate ? moment(task.dueDate) : null,
        assignee: task.assignee || null,
      });
    }
  }, [task, form]);

  // 处理表单提交
  const handleSubmit = () => {
    form.validateFields().then(values => {
      const updatedTask = {
        ...task,
        ...values,
        dueDate: values.dueDate ? values.dueDate.format('YYYY-MM-DD') : null,
      };
      onUpdate(updatedTask);
      setEditing(false);
      message.success('任务已更新');
    });
  };

  // 处理删除任务
  const handleDelete = () => {
    onDelete(task.id);
    onClose();
    message.success('任务已删除');
  };

  // 处理添加评论
  const handleAddComment = () => {
    if (!commentValue) return;

    const newComment = {
      author: '当前用户',
      avatar: <Avatar style={{ backgroundColor: '#1890ff' }} icon={<UserOutlined />} />,
      content: <p>{commentValue}</p>,
      datetime: moment().format('YYYY-MM-DD HH:mm'),
    };

    setComments([...comments, newComment]);
    setCommentValue('');
    message.success('评论已添加');
  };

  // 优先级标签颜色
  const priorityColors = {
    high: 'red',
    medium: 'orange',
    low: 'green',
  };

  // 优先级显示文本
  const priorityTexts = {
    high: '高优先级',
    medium: '中优先级',
    low: '低优先级',
  };

  return (
    <Drawer
      title={
        <DetailHeader>
          <div>
            {editing ? '编辑任务' : '任务详情'}
          </div>
          <Space>
            {editing ? (
              <>
                <Button onClick={() => setEditing(false)}>取消</Button>
                <Button type="primary" icon={<SaveOutlined />} onClick={handleSubmit}>
                  保存
                </Button>
              </>
            ) : (
              <>
                <Button type="primary" onClick={() => setEditing(true)}>
                  编辑
                </Button>
                <Button danger icon={<DeleteOutlined />} onClick={handleDelete}>
                  删除
                </Button>
              </>
            )}
            <Button icon={<CloseOutlined />} onClick={onClose} />
          </Space>
        </DetailHeader>
      }
      placement="right"
      closable={false}
      onClose={onClose}
      open={visible}
      width={500}
      styles={{
        body: {
          paddingBottom: 80,
        },
      }}
    >
      {task && (
        <>
          {editing ? (
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
                <TextArea rows={4} placeholder="请输入任务描述" />
              </Form.Item>

              <Form.Item
                name="priority"
                label="优先级"
              >
                <Select placeholder="请选择优先级">
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
          ) : (
            <>
              <DetailSection>
                <Title level={4}>{task.title}</Title>
                <Paragraph>{task.description || '暂无描述'}</Paragraph>
              </DetailSection>

              <DetailMeta>
                <MetaItem>
                  <TagOutlined />
                  <Tag color={priorityColors[task.priority]}>
                    {priorityTexts[task.priority]}
                  </Tag>
                </MetaItem>

                {task.dueDate && (
                  <MetaItem>
                    <CalendarOutlined />
                    <Text>{task.dueDate}</Text>
                  </MetaItem>
                )}

                {task.assignee && (
                  <MetaItem>
                    <UserOutlined />
                    <Text>{task.assignee}</Text>
                  </MetaItem>
                )}
              </DetailMeta>

              <Divider />

              <DetailSection>
                <Title level={5}>
                  <Space>
                    <MessageOutlined />
                    评论 ({comments.length})
                  </Space>
                </Title>

                <CommentList
                  dataSource={comments}
                  header={`${comments.length} 条评论`}
                  itemLayout="horizontal"
                  renderItem={item => (
                    <CommentItem
                      author={item.author}
                      avatar={item.avatar}
                      content={item.content}
                      datetime={item.datetime}
                    />
                  )}
                />

                <div style={{ marginTop: 16 }}>
                  <TextArea
                    rows={3}
                    value={commentValue}
                    onChange={e => setCommentValue(e.target.value)}
                    placeholder="添加评论..."
                  />
                  <Button
                    type="primary"
                    style={{ marginTop: 8 }}
                    onClick={handleAddComment}
                    disabled={!commentValue}
                  >
                    添加评论
                  </Button>
                </div>
              </DetailSection>

              <Divider />

              <DetailSection>
                <Title level={5}>
                  <Space>
                    <PaperClipOutlined />
                    附件
                  </Space>
                </Title>
                <Button type="dashed" style={{ width: '100%' }}>
                  上传附件
                </Button>
              </DetailSection>
            </>
          )}
        </>
      )}
    </Drawer>
  );
};

export default TaskDetail;
