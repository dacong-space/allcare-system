import React, { useState, useEffect, useRef } from 'react';
import { API_BASE } from '../utils/api';

import { setDocumentCount } from '../services/dataService';
import {
  Layout,
  Typography,
  Input,
  Button,
  Menu,
  Table,
  Space,
  Tag,
  Upload,
  message,
  Modal,
  Form,
  Select,
  Tooltip,
  Breadcrumb,
  Card,
  Divider,
  Empty,
  Segmented
} from 'antd';
import {
  SearchOutlined,
  UploadOutlined,
  DownloadOutlined,
  FileOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  FileImageOutlined,
  FileZipOutlined,
  DeleteOutlined,
  EyeOutlined,
  FolderOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  InfoCircleOutlined,
  EditOutlined
} from '@ant-design/icons';
import styled from 'styled-components';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

// 样式组件
const StyledLayout = styled(Layout)`
  height: 100%;
  background: #f9fafb;
`;

const StyledHeader = styled(Header)`
  background: white;
  padding: 0 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 72px;
  line-height: 72px;
  z-index: 10;
`;

const StyledSider = styled(Sider)`
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  margin-right: 24px;
  border-radius: 0 12px 12px 0;
  overflow: hidden;

  .ant-menu {
    border-right: none;
    padding: 12px 0;
  }

  .ant-menu-item {
    margin: 8px 12px;
    padding: 0 16px !important;
    border-radius: 8px;
    height: 48px;
    line-height: 48px;
  }

  .ant-menu-item-selected {
    background-color: #f0f7ff;
    font-weight: 500;
  }
`;

const StyledContent = styled(Content)`
  padding: 24px 32px;
  background: #f9fafb;
  min-height: calc(100vh - 72px);
`;

const PageHeader = styled.div`
  margin-bottom: 32px;
`;

const ContentCard = styled(Card)`
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02), 0 1px 2px rgba(0, 0, 0, 0.04);
  background: white;
  overflow: hidden;

  .ant-card-body {
    padding: 0;
  }

  .ant-table {
    background: transparent;
  }

  .ant-table-thead > tr > th {
    background: #f9fafb;
    font-weight: 500;
    color: #374151;
  }

  .ant-table-tbody > tr > td {
    border-bottom: 1px solid #f3f4f6;
  }

  .ant-table-tbody > tr:hover > td {
    background: #f0f7ff;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  margin-bottom: 24px;

  .ant-input-affix-wrapper {
    border-radius: 8px;
    padding: 8px 12px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    border: 1px solid #e5e7eb;

    &:hover, &:focus {
      border-color: #1890ff;
      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
    }
  }
`;

const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 0 16px;
`;

const CategoryTitle = styled.div`
  font-size: 18px;
  font-weight: 500;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ViewToggle = styled(Segmented)`
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const StyledTag = styled(Tag)`
  border-radius: 4px;
  padding: 2px 8px;
  font-size: 12px;
  border: none;
  background: #f3f4f6;
  color: #4b5563;
`;

const FileTypeIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  background: ${props => {
    switch(props.type) {
      case 'pdf': return '#FEE2E2';
      case 'word': return '#E0F2FE';
      case 'excel': return '#DCFCE7';
      case 'image': return '#FEF3C7';
      case 'zip': return '#F3E8FF';
      default: return '#F3F4F6';
    }
  }};
  color: ${props => {
    switch(props.type) {
      case 'pdf': return '#EF4444';
      case 'word': return '#0EA5E9';
      case 'excel': return '#22C55E';
      case 'image': return '#F59E0B';
      case 'zip': return '#8B5CF6';
      default: return '#6B7280';
    }
  }};
  font-size: 20px;
`;

const ActionButton = styled(Button)`
  border-radius: 8px;

  &.ant-btn-primary {
    background: #1890ff;
    box-shadow: 0 2px 0 rgba(0, 0, 0, 0.05);
  }

  &.ant-btn-text:hover {
    background: rgba(0, 0, 0, 0.04);
  }
`;

// 后端文件数据将通过 API 获取

// 文件类型图标映射
const fileTypeIcons = {
  pdf: <FilePdfOutlined style={{ color: '#ff4d4f' }} />,
  word: <FileWordOutlined style={{ color: '#1890ff' }} />,
  excel: <FileExcelOutlined style={{ color: '#52c41a' }} />,
  image: <FileImageOutlined style={{ color: '#faad14' }} />,
  zip: <FileZipOutlined style={{ color: '#722ed1' }} />,
  default: <FileOutlined style={{ color: '#8c8c8c' }} />,
};

// 文件分类映射
const categoryNames = {
  company: '公司文件',
  government: '政府文件',
  employee: '员工文件',
  client: '客户文件',
  medical: '医疗文件',
  contract: '合同文件',
  others: '其他文件',
};

// 是否是管理员（实际应用中应该从用户认证系统获取）
const isAdmin = true;

const DocumentCenter = () => {
  // 编辑弹窗 state
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editFile, setEditFile] = useState(null);
  const [editForm] = Form.useForm();
  const [files, setFiles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('company');
  const [searchText, setSearchText] = useState('');
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [uploadForm] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [viewMode, setViewMode] = useState('table');
  // 新增预览相关 state
  const [previewFile, setPreviewFile] = useState(null);
  const [isPreviewModalVisible, setIsPreviewModalVisible] = useState(false);


  // 拉取文件列表
  useEffect(() => {
    fetchFiles();
  }, []);

  

const fetchFiles = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/documents`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.code === 0) {
        // 映射后端字段到前端
        setFiles(data.data.map(doc => ({
          key: doc.id,
          name: doc.title,
          uploadDate: doc.createdAt ? doc.createdAt.slice(0, 10) : '',
          // 你可以根据后端表结构补充 category/subcategory/size/type
          ...doc
        })));
      }
    } catch (err) {
      message.error('文件列表加载失败');
    }
  };

  // 更新文档总数
  useEffect(() => {
    setDocumentCount(files.length);
  }, [files]);

  // 上传文件
  const handleUpload = async (values) => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      // 兼容 file 字段为数组或对象
      const fileObj = Array.isArray(values.file) ? values.file[0]?.originFileObj : values.file?.file?.originFileObj;
      if (!fileObj) {
        message.error('请选择文件');
        return;
      }
      formData.append('file', fileObj);
      formData.append('category', values.category || '');
      formData.append('subcategory', values.subcategory || '');
      formData.append('uploadBy', localStorage.getItem('username') || 'Admin');
      const res = await fetch(`${API_BASE}/documents/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (data.code === 0) {
        message.success('上传成功');
        setIsUploadModalVisible(false);
        uploadForm.resetFields();
        fetchFiles();
      } else {
        message.error(data.msg || '上传失败');
      }
    } catch (err) {
      message.error('上传失败');
    }
  };

  // 下载文件
  const handleDownload = async (record) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/documents/${record.key}/download`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('下载失败');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = record.name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      message.error('下载失败');
    }
  };

  // 根据选择的分类筛选文件
  // 恢复：按分类和搜索筛选文件
  const filteredFiles = files.filter(file =>
    file.category === selectedCategory &&
    (searchText === '' || file.name.toLowerCase().includes(searchText.toLowerCase()))
  );

  // 处理分类菜单点击
  const handleCategoryClick = (e) => {
    setSelectedCategory(e.key);
    setSelectedRowKeys([]);
  };

  // 处理文件上传
  const handleUploadFile = (values) => {
    const newFile = {
      key: Date.now().toString(),
      name: values.fileName,
      category: values.category,
      subcategory: values.subcategory,
      size: '1.0 MB', // 模拟文件大小
      type: values.fileName.split('.').pop().toLowerCase(),
      uploadDate: new Date().toISOString().split('T')[0],
      uploadBy: 'Admin',
    };

    setFiles([...files, newFile]);
    setIsUploadModalVisible(false);
    uploadForm.resetFields();
    message.success('文件上传成功');
  };

  // 处理批量下载
  const handleBatchDownload = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要下载的文件');
      return;
    }

    const selectedFileNames = selectedRowKeys.map(key => {
      const file = files.find(f => f.key === key);
      return file ? file.name : '';
    }).filter(Boolean);

    message.success(`开始下载选中的 ${selectedRowKeys.length} 个文件`);
    console.log('下载文件:', selectedFileNames);
    // 实际应用中，这里应该调用API批量下载文件
  };

  // 处理文件删除（仅管理员）
  const handleDelete = (key) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个文件吗？此操作不可撤销。',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          const token = localStorage.getItem('token');
          await fetch(`/api/documents/${key}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
          });
          setFiles(files.filter(file => file.key !== key));
          setSelectedRowKeys(selectedRowKeys.filter(k => k !== key));
          message.success('文件已删除');
        } catch (err) {
          message.error('删除失败');
        }
      },
    });
  };

  // 切换视图模式
  const handleViewModeChange = (value) => {
    setViewMode(value);
  };

  // 表格列定义
  const columns = [
    {
      title: '文件名',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <FileTypeIcon type={record.type}>
            {fileTypeIcons[record.type] || fileTypeIcons.default}
          </FileTypeIcon>
          <div>
            <div style={{ fontWeight: 500, color: '#111827', marginBottom: '4px' }}>{text}</div>
            <div style={{ fontSize: '12px', color: '#6B7280' }}>
              {record.size} · {record.uploadDate}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: '子分类',
      dataIndex: 'subcategory',
      key: 'subcategory',
      render: (text) => <StyledTag>{text || '-'}</StyledTag>,
    },
    {
      title: '上传者',
      dataIndex: 'uploadBy',
      key: 'uploadBy',
      render: (text) => (
        <div style={{ color: '#4B5563' }}>{text || '-'}</div>
      ),
    },
    {
      title: '上传时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (text) => (
        <div style={{ color: '#4B5563' }}>{text ? text.slice(0, 10) : '-'}</div>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="预览">
            <ActionButton
              type="text"
              icon={<EyeOutlined />}
              onClick={() => {
                setPreviewFile(record);
                setIsPreviewModalVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title="下载">
            <ActionButton
              type="text"
              icon={<DownloadOutlined />}
              onClick={() => handleDownload(record)}
            />
          </Tooltip>
          {isAdmin && (
            <>
              <Tooltip title="编辑分类">
                <ActionButton
                  type="text"
                  icon={<EditOutlined />}
                  onClick={() => handleEditCategory(record)}
                />
              </Tooltip>
              <Tooltip title="删除">
                <ActionButton
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDelete(record.key)}
                />
              </Tooltip>
            </>
          )}
        </Space>
      ),
    },
  ];

  // 编辑分类弹窗逻辑
  const handleEditCategory = (file) => {
    setEditFile(file);
    editForm.setFieldsValue({
      category: file.category,
      subcategory: file.subcategory,
    });
    setEditModalVisible(true);
  };

  const handleEditCategorySubmit = async (values) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/documents/${editFile.key}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          category: values.category,
          subcategory: values.subcategory,
        }),
      });
      const data = await res.json();
      if (data.code === 0) {
        message.success('分类修改成功');
        setEditModalVisible(false);
        setEditFile(null);
        fetchFiles();
      } else {
        message.error(data.msg || '分类修改失败');
      }
    } catch (err) {
      message.error('分类修改失败');
    }
  };

  // 表格行选择配置
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  return (
    <StyledLayout>
      <StyledHeader>
        <div>
          <Title level={3} style={{ margin: 0, fontWeight: 600 }}>文档中心</Title>

        </div>
        <Space>
          {isAdmin && (
            <ActionButton
              type="primary"
              icon={<UploadOutlined />}
              onClick={() => setIsUploadModalVisible(true)}
              size="large"
            >
              上传文件
            </ActionButton>
          )}
        </Space>
      </StyledHeader>

      <Layout>
        <StyledSider width={220}>
          <Menu
            mode="inline"
            selectedKeys={[selectedCategory]}
            style={{ height: '100%' }}
            onClick={handleCategoryClick}
          >
            <Menu.Item key="company" icon={<FolderOutlined style={{ color: '#1890ff' }} />}>
              公司文件
            </Menu.Item>
            <Menu.Item key="government" icon={<FolderOutlined style={{ color: '#52c41a' }} />}>
              政府文件
            </Menu.Item>
            <Menu.Item key="employee" icon={<FolderOutlined style={{ color: '#fa8c16' }} />}>
              员工文件
            </Menu.Item>
            <Menu.Item key="client" icon={<FolderOutlined style={{ color: '#722ed1' }} />}>
              客户文件
            </Menu.Item>
            <Menu.Item key="medical" icon={<FolderOutlined style={{ color: '#eb2f96' }} />}>
              医疗文件
            </Menu.Item>
            <Menu.Item key="contract" icon={<FolderOutlined style={{ color: '#f5222d' }} />}>
              合同文件
            </Menu.Item>
            <Menu.Item key="others" icon={<FolderOutlined style={{ color: '#8c8c8c' }} />}>
              其他文件
            </Menu.Item>
          </Menu>
        </StyledSider>

        <StyledContent>
          <PageHeader>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <CategoryTitle>
                <FolderOutlined style={{ color: '#3B82F6', fontSize: '20px' }} />
                {categoryNames[selectedCategory]}
                <Text style={{ fontSize: '14px', color: '#6B7280', fontWeight: 'normal', marginLeft: '8px' }}>
                  ({filteredFiles.length} 个文件)
                </Text>
              </CategoryTitle>

              <ViewToggle
                options={[
                  {
                    value: 'table',
                    icon: <UnorderedListOutlined />,
                  },
                  {
                    value: 'grid',
                    icon: <AppstoreOutlined />,
                  },
                ]}
                value={viewMode}
                onChange={handleViewModeChange}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <SearchContainer>
                <Input
                  placeholder="搜索文件..."
                  prefix={<SearchOutlined />}
                  onChange={(e) => handleSearch(e.target.value)}
                  style={{ width: 300 }}
                  allowClear
                />
              </SearchContainer>

              <Space>
                {selectedRowKeys.length > 0 && (
                  <ActionButton
                    icon={<DownloadOutlined />}
                    onClick={handleBatchDownload}
                    type="primary"
                  >
                    批量下载 ({selectedRowKeys.length})
                  </ActionButton>
                )}
              </Space>
            </div>
          </PageHeader>

          <ContentCard>
            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={filteredFiles}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `共 ${total} 条记录`,
                size: 'default',
                showQuickJumper: true,
              }}
              bordered={false}
              size="middle"
            />
          </ContentCard>
        </StyledContent>
      </Layout>

      {/* 上传文件模态框 */}
      <Modal
        title="上传文件"
        open={isUploadModalVisible}
        onCancel={() => setIsUploadModalVisible(false)}
        footer={null}
        width={520}
        bodyStyle={{ padding: '24px' }}
      >
        <Form
          form={uploadForm}
          layout="vertical"
          onFinish={handleUpload}
        >

          <Form.Item
            name="category"
            label="文件分类"
            rules={[{ required: true, message: '请选择文件分类' }]}
            initialValue="company"
          >
            <Select>
              <Option value="company">公司文件</Option>
              <Option value="government">政府文件</Option>
              <Option value="employee">员工文件</Option>
              <Option value="client">客户文件</Option>
              <Option value="medical">医疗文件</Option>
              <Option value="contract">合同文件</Option>
              <Option value="others">其他文件</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="subcategory"
            label="子分类"
          >
            <Input placeholder="请输入子分类，如：规章制度、人事文件等" />
          </Form.Item>

          <Form.Item
            name="file"
            label="选择文件"
            rules={[{ required: true, message: '请选择要上传的文件' }]}
            valuePropName="fileList"
            getValueFromEvent={e => Array.isArray(e) ? e : e && e.fileList}
          >
            <Upload
              beforeUpload={() => false}
              maxCount={1}
              listType="picture"
            >
              <ActionButton icon={<UploadOutlined />}>选择文件</ActionButton>
            </Upload>
          </Form.Item>

          <Divider style={{ margin: '24px 0 16px' }} />

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setIsUploadModalVisible(false)}>
                取消
              </Button>
              <ActionButton type="primary" htmlType="submit">
                上传
              </ActionButton>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    {/* 编辑分类弹窗 */}
    <Modal
      title={editFile ? `编辑分类：${editFile.name}` : '编辑文件分类'}
      open={editModalVisible}
      onCancel={() => { setEditModalVisible(false); setEditFile(null); }}
      footer={null}
      destroyOnClose
    >
      <Form
        form={editForm}
        layout="vertical"
        onFinish={handleEditCategorySubmit}
      >
        <Form.Item
          name="category"
          label="文件分类"
          rules={[{ required: true, message: '请选择文件分类' }]}
        >
          <Select>
            <Option value="company">公司文件</Option>
            <Option value="government">政府文件</Option>
            <Option value="employee">员工文件</Option>
            <Option value="client">客户文件</Option>
            <Option value="medical">医疗文件</Option>
            <Option value="contract">合同文件</Option>
            <Option value="others">其他文件</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="subcategory"
          label="子分类"
        >
          <Input placeholder="请输入子分类，如：规章制度、人事文件等" />
        </Form.Item>
        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
          <Space>
            <Button onClick={() => { setEditModalVisible(false); setEditFile(null); }}>取消</Button>
            <ActionButton type="primary" htmlType="submit">保存</ActionButton>
          </Space>
        </Form.Item>
      </Form>
    </Modal>

    {/* 文件预览弹窗 */}
    <Modal
      title={previewFile ? `预览：${previewFile.name}` : '文件预览'}
      open={isPreviewModalVisible}
      onCancel={() => {
        setIsPreviewModalVisible(false);
        setPreviewFile(null);
      }}
      footer={null}
      width={previewFile && previewFile.type && previewFile.type.match(/(pdf|doc|xls|ppt|image)/i) ? 900 : 400}
      bodyStyle={{ padding: 0, minHeight: 480, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      destroyOnClose
    >
      {previewFile ? (
        (() => {
          const token = localStorage.getItem('token');
          const previewUrl = `/api/documents/${previewFile.key}/preview?token=${encodeURIComponent(token)}`;
          // 图片
          if (previewFile.mimetype && previewFile.mimetype.startsWith('image/')) {
            return <img src={previewUrl} alt={previewFile.name} style={{ maxWidth: '100%', maxHeight: 600, display: 'block', margin: '0 auto' }} />;
          }
          // PDF
          if (previewFile.mimetype === 'application/pdf') {
            return <iframe src={previewUrl} title={previewFile.name} style={{ width: '100%', height: 600, border: 'none' }} />;
          }
          // Office 文档（doc/xls/ppt）等浏览器支持的类型
          if (previewFile.mimetype && previewFile.mimetype.match(/(word|excel|powerpoint|officedocument)/i)) {
            return <iframe src={previewUrl} title={previewFile.name} style={{ width: '100%', height: 600, border: 'none' }} />;
          }
          // 其他类型
          return <div style={{ padding: 32, textAlign: 'center', color: '#888' }}>暂不支持该类型文件的在线预览</div>;
        })()
      ) : null}
    </Modal>
  </StyledLayout>
  );
};

export default DocumentCenter;
