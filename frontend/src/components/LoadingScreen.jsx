import React from 'react';
import { Spin } from 'antd';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: var(--bg-primary);
`;

const LoadingScreen = () => {
  return (
    <LoadingContainer>
      <Spin size="large" tip="加载中..." />
    </LoadingContainer>
  );
};

export default LoadingScreen;
