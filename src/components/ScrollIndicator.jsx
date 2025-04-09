import React, { useState, useEffect, useRef } from 'react';
import { DownOutlined } from '@ant-design/icons';
import styled from 'styled-components';

// 滚动提示样式
const ScrollIndicatorContainer = styled.div`
  position: absolute;
  bottom: 10px;
  right: 20px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  animation: bounce 1.5s infinite;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
    transform: scale(1.1);
  }

  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-5px);
    }
    60% {
      transform: translateY(-3px);
    }
  }
`;

const ScrollIndicator = ({ containerRef = { current: null } }) => {
  const [showIndicator, setShowIndicator] = useState(false);

  // 检查是否需要显示滚动提示
  useEffect(() => {
    // 安全检查，确保 containerRef 和 containerRef.current 存在
    if (!containerRef || !containerRef.current) return;

    const checkScrollable = () => {
      // 再次检查，因为在异步操作中可能变为 null
      if (!containerRef || !containerRef.current) return;

      const container = containerRef.current;
      // 如果内容高度大于容器高度，显示滚动提示
      const isScrollable = container.scrollHeight > container.clientHeight;
      // 如果已经滚动到底部，不显示提示
      const isScrolledToBottom = Math.abs(container.scrollHeight - container.clientHeight - container.scrollTop) < 5;

      setShowIndicator(isScrollable && !isScrolledToBottom);
    };

    // 初始检查
    checkScrollable();

    // 监听滚动事件
    const container = containerRef.current;
    container.addEventListener('scroll', checkScrollable);

    // 安全地使用 ResizeObserver
    let resizeObserver;
    try {
      resizeObserver = new ResizeObserver(checkScrollable);
      resizeObserver.observe(container);
    } catch (error) {
      console.error('ResizeObserver error:', error);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', checkScrollable);
      }
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [containerRef]);

  // 点击滚动提示时，滚动到底部
  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  if (!showIndicator) return null;

  return (
    <ScrollIndicatorContainer onClick={scrollToBottom} title="点击滚动到底部">
      <DownOutlined style={{ fontSize: '16px' }} />
    </ScrollIndicatorContainer>
  );
};

export default ScrollIndicator;
