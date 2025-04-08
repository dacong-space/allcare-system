import React from 'react';
import { Typography, Card } from 'antd';

const { Title } = Typography;

const PatientInfoSimple = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>患者信息页面</Title>
      <Card>
        <p>这是一个简化版的患者信息页面，用于测试路由是否正常工作。</p>
      </Card>
    </div>
  );
};

export default PatientInfoSimple;
