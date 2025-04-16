import React from 'react';
import styled, { keyframes } from 'styled-components';

// 定义简单的动画
const fadeIn = keyframes`
  from { opacity: 0.7; }
  to { opacity: 1; }
`;

// 按钮容器
const MinimalistButtonContainer = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
  opacity: 0.85;

  &:hover {
    opacity: 1;
  }
`;

// 简约的加号/减号图标
const PlusMinusIcon = styled.div`
  position: relative;
  width: 14px;
  height: 14px;

  &::before,
  &::after {
    content: '';
    position: absolute;
    background-color: #9da6a3;
    border-radius: 1px;
    transition: all 0.2s ease;
  }

  /* 水平线 */
  &::before {
    top: 6px;
    left: 2px;
    width: 10px;
    height: 2px;
  }

  /* 垂直线 (只在非展开状态显示) */
  &::after {
    top: 2px;
    left: 6px;
    width: 2px;
    height: 10px;
    transform: ${props => props.expanded ? 'scaleY(0)' : 'scaleY(1)'};
  }
`;

// 简约的展开按钮组件
const ModernExpandButton = ({ expanded, onClick }) => {
  return (
    <MinimalistButtonContainer
      onClick={e => {
        e.stopPropagation();
        onClick();
      }}
    >
      <PlusMinusIcon expanded={expanded} />
    </MinimalistButtonContainer>
  );
};

export default ModernExpandButton;
