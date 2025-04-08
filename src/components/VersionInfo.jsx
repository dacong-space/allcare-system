import React, { useState, useEffect } from 'react';
import { Typography, Tooltip, Badge } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { APP_VERSION, BUILD_TIMESTAMP, formatBuildDate, getScriptVersion } from '../utils/version';

const { Text } = Typography;

const VersionContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
  padding: 8px;
  border-radius: 4px;
  background-color: var(--bg-secondary);
  
  .ant-typography {
    color: var(--text-secondary);
    font-size: 12px;
  }
  
  .version-icon {
    margin-right: 8px;
    cursor: pointer;
  }
`;

const VersionInfo = () => {
  const [scriptVersion, setScriptVersion] = useState('');
  
  useEffect(() => {
    // 在客户端渲染时获取脚本版本
    setScriptVersion(getScriptVersion());
  }, []);
  
  const tooltipContent = (
    <div>
      <p><strong>应用版本:</strong> {APP_VERSION}</p>
      <p><strong>构建时间:</strong> {formatBuildDate(BUILD_TIMESTAMP)}</p>
      <p><strong>脚本版本:</strong> {scriptVersion}</p>
    </div>
  );
  
  return (
    <VersionContainer>
      <Tooltip title={tooltipContent} placement="top">
        <Badge status="processing" />
        <Text className="version-text">
          版本 {APP_VERSION} (构建于 {formatBuildDate(BUILD_TIMESTAMP)})
        </Text>
      </Tooltip>
    </VersionContainer>
  );
};

export default VersionInfo;
