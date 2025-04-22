import React, { useState } from 'react';
import { Row, Col, Card, Select, Typography } from 'antd';
import styled from 'styled-components';

const { Title } = Typography;
const { Option } = Select;
const durations = [
  { key: 'thisMonth', label: '本月到期' },
  { key: '30', label: '未来30天' },
  { key: '15', label: '未来15天' }
];

const PageWrapper = styled.div`
  padding: 24px;
  background: var(--bg-primary);
  min-height: calc(100vh - 64px);
`;

const UpcomingExpirations = () => {
  const [filter, setFilter] = useState('30');

  const handleFilterChange = (value) => {
    setFilter(value);
    // TODO: fetch or filter data based on selected duration
  };

  const renderCard = (title) => (
    <Card title={title} style={{ marginBottom: 16 }}>
      <Select value={filter} onChange={handleFilterChange} style={{ width: '100%', marginBottom: 16 }}>
        {durations.map(d => (
          <Option key={d.key} value={d.key}>{d.label}</Option>
        ))}
      </Select>
      {/* TODO: 列表组件 */}
    </Card>
  );

  return (
    <PageWrapper>
      <Title level={2}>即将到期</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>{renderCard('客户 - Reass')}</Col>
        <Col xs={24} sm={12} md={8}>{renderCard('客户 - Re-CarePlan')}</Col>
        <Col xs={24} sm={12} md={8}>{renderCard('员工 - CPR过期')}</Col>
        <Col xs={24} sm={12} md={8}>{renderCard('员工 - 证件过期')}</Col>
        <Col xs={24} sm={12} md={8}>{renderCard('员工 - 培训过期')}</Col>
        <Col xs={24} sm={12} md={8}>{renderCard('员工 - 体检过期')}</Col>
      </Row>
    </PageWrapper>
  );
};

export default UpcomingExpirations;
