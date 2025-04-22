import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Select, Typography, Grid, Table, message, Button, Modal, Checkbox } from 'antd';
import axios from 'axios';
import { API_BASE } from '../utils/api';
import styled from 'styled-components';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const { Title } = Typography;
const { Option } = Select;
const durations = [
  { key: '30', label: '未来30天' },
  { key: '45', label: '未来45天' },
  { key: 'custom', label: '自定义天数' }
];

const PageWrapper = styled.div`
  padding: 0 24px 2px;
  background: var(--bg-primary);
  height: calc(100vh - 64px);
  overflow-y: auto;
  @media (max-width: 576px) {
    padding: 0 16px 1px;
  }
`;

// API 实例
const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')||localStorage.getItem('token')}`, 'Content-Type': 'application/json' }
});
// 卡片类型配置
const cardTypes = [
  { key: 'customer_reass', title: '下次家访日期：(客户)' },
  { key: 'customer_careplan', title: '下次CarePlan：(客户)' },
  { key: 'employee_cpr', title: 'CPR过期日期：(员工)' },
  { key: 'employee_document', title: '证件有效期：(员工)' },
  { key: 'employee_training', title: '下次培训日期：(员工)' },
  { key: 'employee_medical', title: '下次体检日期：(员工)' }
];
// 列定义
const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 120 },
  { title: '姓名', dataIndex: 'name', key: 'name' },
  {
    title: '到期日期',
    dataIndex: 'expireDate',
    key: 'expireDate',
    render: (date) => {
      if (!date) return '-';
      const d = new Date(date);
      if (isNaN(d)) return date;
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const yyyy = d.getFullYear();
      return `${mm}-${dd}-${yyyy}`;
    }
  }
];

const UpcomingExpirations = () => {
  const screens = Grid.useBreakpoint();
  const [filters, setFilters] = useState(() =>
    cardTypes.reduce((acc, c) => ({ ...acc, [c.key]: '30' }), {})
  );
  // 每个卡片的自定义天数
  const [customDays, setCustomDays] = useState(() =>
    cardTypes.reduce((acc, c) => ({ ...acc, [c.key]: 30 }), {})
  );
  const [dataMap, setDataMap] = useState({});
  const [loadingMap, setLoadingMap] = useState({});
  // 导出功能状态
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [selectedExportCards, setSelectedExportCards] = useState([]);

  // 用于按类型和时长拉取数据
  const fetchData = (cardKey, duration) => {
    setLoadingMap(prev => ({ ...prev, [cardKey]: true }));
    api.get('/expirations', { params: { type: cardKey, duration } })
      .then(({ data }) => {
        const raw = data.data || [];
        const processed = raw.map(item => ({
          ...item,
          expireDate: item.expireDate || null,
        }));
        const toDisplay = processed;
        setDataMap(prev => ({ ...prev, [cardKey]: toDisplay }));
      })
      .catch(() => {
        const title = cardTypes.find(c => c.key === cardKey)?.title;
        message.error(`加载${title}失败`);
      })
      .finally(() =>
        setLoadingMap(prev => ({ ...prev, [cardKey]: false }))
      );
  };

  // 首次挂载时初始化数据
  useEffect(() => {
    cardTypes.forEach(card => {
      fetchData(card.key, filters[card.key]);
    });
  }, []);

  // 单独更新指定卡片的过滤值并重新拉取该卡片数据
  const handleFilterChange = (cardKey, value) => {
    setFilters(prev => ({ ...prev, [cardKey]: value }));
    // 如果切换到自定义，不立即 fetch，等输入天数后 fetch
    if (value !== 'custom') {
      fetchData(cardKey, value);
    }
  };

  // 自定义天数输入后刷新
  const handleCustomDaysChange = (cardKey, value) => {
    // 允许空字符串，输入时不强制回退1
    if (value === '') {
      setCustomDays(prev => ({ ...prev, [cardKey]: '' }));
      return;
    }
    const days = Math.max(1, Number(value) || 1);
    setCustomDays(prev => ({ ...prev, [cardKey]: days }));
    fetchData(cardKey, days.toString());
  };

  // 导出 Excel
  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();
    selectedExportCards.forEach(key => {
      // 生成安全的 sheet 名称，移除 Excel 不支持的字符并限制长度
      const card = cardTypes.find(c => c.key === key);
      const sheetName = card.title.replace(/[\\\*\:\?\[\]\/]/g, '').substring(0, 31);
      const sheetData = (dataMap[key] || []).map(item => ({ ID: item.id, 姓名: item.name, 到期日期: dayjs(item.expireDate).format('MM-DD-YYYY') }));
      const worksheet = XLSX.utils.json_to_sheet(sheetData);
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    });
    XLSX.writeFile(workbook, `导出_${dayjs().format('YYYYMMDD_HHmmss')}.xlsx`);
  };

  // 导出 PDF (使用 html2canvas + jsPDF，支持中文)
  const exportToPDF = async () => {
    const doc = new jsPDF('p', 'pt', 'a4');
    for (let i = 0; i < selectedExportCards.length; i++) {
      const key = selectedExportCards[i];
      const elem = document.getElementById(`export-${key}`);
      if (!elem) continue;
      const canvas = await html2canvas(elem, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const imgProps = doc.getImageProperties(imgData);
      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      if (i < selectedExportCards.length - 1) doc.addPage();
    }
    doc.save(`导出_${dayjs().format('YYYYMMDD_HHmmss')}.pdf`);
  };

  const renderCard = (card) => (
    <Card
      style={{ marginBottom: 16, minHeight: 380, display: 'flex', flexDirection: 'column' }}
      loading={loadingMap[card.key]}
      title={
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: screens.xs ? 'flex-start' : 'center',
            flexDirection: screens.xs ? 'column' : 'row',
            gap: screens.xs ? 8 : 0
          }}
        >
          <span style={{ fontWeight: 600 }}>{card.title}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Select
              value={filters[card.key]}
              onChange={(value) => handleFilterChange(card.key, value)}
              style={{ minWidth: 100, width: screens.xs ? '100%' : 90 }}
              size="small"
            >
              {durations.map(d => (
                <Option key={d.key} value={d.key}>{d.label}</Option>
              ))}
            </Select>
            {filters[card.key] === 'custom' && (
              <input
                type="text"
                pattern="[0-9]*"
                inputMode="numeric"
                value={customDays[card.key]}
                onChange={e => {
                  // 只允许数字
                  const val = e.target.value.replace(/[^0-9]/g, '');
                  handleCustomDaysChange(card.key, val);
                }}
                style={{
                  width: 56,
                  marginLeft: 8,
                  border: '1.5px solid #e5e6eb',
                  borderRadius: 8,
                  background: 'var(--ant-color-bg-container, #fafcff)',
                  outline: 'none',
                  fontSize: 16,
                  color: 'var(--ant-color-text, #222)',
                  fontWeight: 500,
                  textAlign: 'center',
                  padding: '2px 0',
                  boxShadow: '0 2px 8px 0 rgba(60,60,60,0.03)',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
                placeholder="天数"
                autoComplete="off"
                onFocus={e => {
                  e.target.style.borderColor = '#1677ff';
                  e.target.style.boxShadow = '0 0 0 2px #1677ff22';
                }}
                onBlur={e => {
                  e.target.style.borderColor = '#e5e6eb';
                  e.target.style.boxShadow = '0 2px 8px 0 rgba(60,60,60,0.03)';
                }}
              />
            )}
          </div>
        </div>
      }
    >

      <div
        style={{
          flex: 1,
          minHeight: 200,
          maxHeight: screens.xs ? 260 : 320,
          overflowY: 'auto',
          background: '#fff',
          borderRadius: 8,
          boxSizing: 'border-box',
        }}
      >
        <Table
          columns={columns}
          dataSource={dataMap[card.key]||[]}
          rowKey="id"
          pagination={false}
          scroll={{ y: screens.xs ? 220 : 280 }}
          style={{ background: 'transparent' }}
          size="small"
          rowClassName={() => 'compact-row'}
        />
      </div>
    </Card>
  );

  return (
    <PageWrapper>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={3}>即将到期</Title>
        <Button
          type="primary"
          onClick={() => { setSelectedExportCards([]); setExportModalVisible(true); }}
        >导出</Button>
      </div>
      <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
        {cardTypes.map(card => (
          <Col key={card.key} xs={24} sm={12} md={8}>
            {renderCard(card)}
          </Col>
        ))}
      </Row>
      <Modal
        title="导出数据"
        visible={exportModalVisible}
        onCancel={() => setExportModalVisible(false)}
        footer={null}
        width={800}
      >
        <Checkbox.Group
          options={cardTypes.map(c => ({ label: c.title, value: c.key }))}
          value={selectedExportCards}
          onChange={list => setSelectedExportCards(list)}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16, marginBottom: 0 }}>
          <Button type="primary" style={{ marginRight: 8 }} onClick={exportToExcel}>下载Excel</Button>
          <Button type="primary" style={{ marginRight: 8 }} onClick={exportToPDF}>下载PDF</Button>
          <Button onClick={() => setExportModalVisible(false)}>取消</Button>
        </div>
        {selectedExportCards.map(key => {
          const card = cardTypes.find(c => c.key === key);
          return (
            <div
              key={key}
              id={`export-${key}`}
              style={{ marginTop: key === 'customer_reass' ? -8 : 0, padding: 16, background: '#fff' }}
            >
              <Title level={5}>{card.title}</Title>
              <Table
                columns={columns}
                dataSource={dataMap[key] || []}
                pagination={false}
                size="small"
                rowKey="id"
              />
            </div>
          );
        })}
      </Modal>
    </PageWrapper>
  );
};

// 紧凑行样式
const style = document.createElement('style');
style.innerHTML = `
  .compact-row td {
    padding-top: 4px !important;
    padding-bottom: 4px !important;
    font-size: 13px;
  }
`;
if (typeof window !== 'undefined' && !document.getElementById('upcoming-expirations-compact-style')) {
  style.id = 'upcoming-expirations-compact-style';
  document.head.appendChild(style);
}

export default UpcomingExpirations;
