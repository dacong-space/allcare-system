import { useState, useEffect } from 'react';
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
  InfoCircleOutlined
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

// 模拟文件数据
const initialFiles = [
  // 公司文件
  {
    key: '1',
    name: '公司规章制度.pdf',
    category: 'company',
    subcategory: '规章制度',
    size: '2.5 MB',
    type: 'pdf',
    uploadDate: '2023-04-15',
    uploadBy: 'Admin',
  },
  {
    key: '2',
    name: '公司组织架构.docx',
    category: 'company',
    subcategory: '组织架构',
    size: '1.8 MB',
    type: 'word',
    uploadDate: '2023-04-10',
    uploadBy: 'Admin',
  },
  {
    key: '3',
    name: '会议记录.pdf',
    category: 'company',
    subcategory: '会议文件',
    size: '0.8 MB',
    type: 'pdf',
    uploadDate: '2023-03-10',
    uploadBy: 'Admin',
  },

  // 政府文件
  {
    key: '4',
    name: '税务申报表.xlsx',
    category: 'government',
    subcategory: '税务文件',
    size: '0.5 MB',
    type: 'excel',
    uploadDate: '2023-04-05',
    uploadBy: 'Admin',
  },
  {
    key: '5',
    name: '营业执照.jpg',
    category: 'government',
    subcategory: '证照文件',
    size: '1.2 MB',
    type: 'image',
    uploadDate: '2023-03-20',
    uploadBy: 'Admin',
  },
  {
    key: '6',
    name: '卫生许可证.pdf',
    category: 'government',
    subcategory: '许可证件',
    size: '1.5 MB',
    type: 'pdf',
    uploadDate: '2023-02-15',
    uploadBy: 'Admin',
  },

  // 员工文件
  {
    key: '7',
    name: '员工手册.docx',
    category: 'employee',
    subcategory: '入职文件',
    size: '1.8 MB',
    type: 'word',
    uploadDate: '2023-04-12',
    uploadBy: 'Admin',
  },
  {
    key: '8',
    name: '员工培训计划.xlsx',
    category: 'employee',
    subcategory: '培训文件',
    size: '0.7 MB',
    type: 'excel',
    uploadDate: '2023-03-25',
    uploadBy: 'Admin',
  },
  {
    key: '9',
    name: '绩效考核表格.xlsx',
    category: 'employee',
    subcategory: '绩效文件',
    size: '0.6 MB',
    type: 'excel',
    uploadDate: '2023-03-18',
    uploadBy: 'Admin',
  },

  // 客户文件
  {
    key: '10',
    name: '客户资料收集表.docx',
    category: 'client',
    subcategory: '客户资料',
    size: '1.3 MB',
    type: 'word',
    uploadDate: '2023-04-08',
    uploadBy: 'Admin',
  },
  {
    key: '11',
    name: '客户满意度调查.pdf',
    category: 'client',
    subcategory: '调查问卷',
    size: '0.9 MB',
    type: 'pdf',
    uploadDate: '2023-03-22',
    uploadBy: 'Admin',
  },

  // 医疗文件
  {
    key: '12',
    name: '医疗记录模板.docx',
    category: 'medical',
    subcategory: '记录模板',
    size: '1.1 MB',
    type: 'word',
    uploadDate: '2023-04-02',
    uploadBy: 'Admin',
  },
  {
    key: '13',
    name: '药品清单.xlsx',
    category: 'medical',
    subcategory: '药品文件',
    size: '0.8 MB',
    type: 'excel',
    uploadDate: '2023-03-15',
    uploadBy: 'Admin',
  },

  // 合同文件
  {
    key: '14',
    name: '服务合同模板.docx',
    category: 'contract',
    subcategory: '合同模板',
    size: '1.4 MB',
    type: 'word',
    uploadDate: '2023-04-05',
    uploadBy: 'Admin',
  },
  {
    key: '15',
    name: '采购协议.pdf',
    category: 'contract',
    subcategory: '采购合同',
    size: '2.1 MB',
    type: 'pdf',
    uploadDate: '2023-03-28',
    uploadBy: 'Admin',
  },

  // 其他文件
  {
    key: '16',
    name: '项目方案.zip',
    category: 'others',
    subcategory: '项目文件',
    size: '5.0 MB',
    type: 'zip',
    uploadDate: '2023-03-15',
    uploadBy: 'Admin',
  },
  {
    key: '17',
    name: '市场调研报告.pdf',
    category: 'others',
    subcategory: '调研报告',
    size: '3.2 MB',
    type: 'pdf',
    uploadDate: '2023-02-20',
    uploadBy: 'Admin',
  },
];

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
  const [files, setFiles] = useState(initialFiles);
  const [selectedCategory, setSelectedCategory] = useState('company');

  // 更新文档总数
  useEffect(() => {
    setDocumentCount(files.length);
  }, [files]);
  const [searchText, setSearchText] = useState('');
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [uploadForm] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [viewMode, setViewMode] = useState('table');

  // 根据选择的分类筛选文件
  const filteredFiles = files.filter(file =>
    file.category === selectedCategory &&
    (searchText === '' || file.name.toLowerCase().includes(searchText.toLowerCase()))
  );

  // 处理分类菜单点击
  const handleCategoryClick = (e) => {
    setSelectedCategory(e.key);
    setSelectedRowKeys([]);
  };

  // 处理搜索
  const handleSearch = (value) => {
    setSearchText(value);
  };

  // 处理文件上传
  const handleUpload = (values) => {
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

  // 处理文件下载
  const handleDownload = (record) => {
    message.success(`开始下载文件: ${record.name}`);
    // 实际应用中，这里应该调用API下载文件
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
      onOk: () => {
        setFiles(files.filter(file => file.key !== key));
        setSelectedRowKeys(selectedRowKeys.filter(k => k !== key));
        message.success('文件已删除');
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
      title: '分类',
      dataIndex: 'subcategory',
      key: 'subcategory',
      render: (text) => <StyledTag>{text}</StyledTag>,
    },
    {
      title: '上传者',
      dataIndex: 'uploadBy',
      key: 'uploadBy',
      render: (text) => (
        <div style={{ color: '#4B5563' }}>{text}</div>
      ),
    },
    {
      title: '上传日期',
      dataIndex: 'uploadDate',
      key: 'uploadDate',
      sorter: (a, b) => new Date(a.uploadDate) - new Date(b.uploadDate),
      render: (text) => (
        <div style={{ color: '#4B5563' }}>{text}</div>
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
              onClick={() => message.info('文件预览功能开发中')}
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
            <Tooltip title="删除">
              <ActionButton
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(record.key)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

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
          <Breadcrumb style={{ margin: '8px 0' }}>
            <Breadcrumb.Item>首页</Breadcrumb.Item>
            <Breadcrumb.Item>文档中心</Breadcrumb.Item>
            <Breadcrumb.Item>{categoryNames[selectedCategory]}</Breadcrumb.Item>
          </Breadcrumb>
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
            name="fileName"
            label="文件名称"
            rules={[{ required: true, message: '请输入文件名称' }]}
          >
            <Input placeholder="请输入文件名称（包含扩展名）" />
          </Form.Item>

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
            rules={[{ required: true, message: '请输入子分类' }]}
          >
            <Input placeholder="请输入子分类，如：规章制度、人事文件等" />
          </Form.Item>

          <Form.Item
            name="file"
            label="选择文件"
            rules={[{ required: true, message: '请选择要上传的文件' }]}
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
    </StyledLayout>
  );
};

export default DocumentCenter;
