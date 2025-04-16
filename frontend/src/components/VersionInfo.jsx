import React, { useState, useEffect } from 'react';
import { Typography, Tooltip, Badge } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { APP_VERSION, BUILD_TIMESTAMP, formatBuildDate, getScriptVersion, fetchVersionInfo } from '../utils/version';

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
  const [versionInfo, setVersionInfo] = useState({ version: APP_VERSION, buildTime: BUILD_TIMESTAMP });

  useEffect(() => {
    // 在客户端渲染时获取脚本版本
    setScriptVersion(getScriptVersion());

    // 从 version.json 文件中获取版本信息
    const getVersionInfo = async () => {
      const info = await fetchVersionInfo();
      setVersionInfo(info);
    };

    getVersionInfo();
  }, []);

  const tooltipContent = (
    <div>
      <p><strong>应用版本:</strong> {versionInfo.version}</p>
      <p><strong>构建时间:</strong> {formatBuildDate(versionInfo.buildTime)}</p>
      <p><strong>脚本版本:</strong> {scriptVersion}</p>
      <p><strong>环境变量版本:</strong> {APP_VERSION}</p>
    </div>
  );

  return (
    <VersionContainer>
      <Tooltip title={tooltipContent} placement="top">
        <Badge status="processing" />
        <Text className="version-text">
          版本 {versionInfo.version} (构建于 {formatBuildDate(versionInfo.buildTime)})
        </Text>
      </Tooltip>
    </VersionContainer>
  );
};

export default VersionInfo;
