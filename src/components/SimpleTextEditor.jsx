import React, { useState, useEffect } from 'react';
import { Input, Button } from 'antd';
import { UnorderedListOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const { TextArea } = Input;

const EditorContainer = styled.div`
  .editor-toolbar {
    margin-bottom: 8px;
    padding: 8px;
    background: var(--bg-secondary);
    border: 1px solid #d9d9d9;
    border-radius: 4px 4px 0 0;
    display: flex;
    justify-content: flex-start;
  }

  .editor-content {
    border: 1px solid #d9d9d9;
    border-radius: 0 0 4px 4px;
  }

  .ant-input {
    min-height: 150px;
    max-height: 300px;
    color: var(--text-primary);
    background: var(--bg-primary);
    white-space: pre-wrap;
  }
`;

const SimpleTextEditor = ({ value, onChange, placeholder }) => {
  const [editorValue, setEditorValue] = useState('');

  useEffect(() => {
    setEditorValue(value || '');
  }, [value]);

  const handleChange = (e) => {
    const content = e.target.value;
    setEditorValue(content);
    if (onChange) {
      onChange(content);
    }
  };

  const handleBulletPoint = () => {
    // 获取光标位置
    const textarea = document.querySelector('.editor-content .ant-input');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    // 在光标位置插入项目符号
    const newValue = editorValue.substring(0, start) + '\n• ' + editorValue.substring(end);

    setEditorValue(newValue);
    if (onChange) {
      onChange(newValue);
    }

    // 设置光标位置到项目符号后
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + 3; // '\n• ' 的长度是3
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  return (
    <EditorContainer>
      <div className="editor-toolbar">
        <Button
          icon={<UnorderedListOutlined />}
          onClick={handleBulletPoint}
          title="添加项目符号"
        >
          项目符号
        </Button>
      </div>
      <div className="editor-content">
        <TextArea
          value={editorValue}
          onChange={handleChange}
          placeholder={placeholder || "请输入备注..."}
          autoSize={{ minRows: 6, maxRows: 12 }}
        />
      </div>
    </EditorContainer>
  );
};

export default SimpleTextEditor;
