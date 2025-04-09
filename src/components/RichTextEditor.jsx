import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// 使用动态导入来避免SSR问题
const ReactQuill = React.lazy(() => import('react-quill'));
import 'react-quill/dist/quill.snow.css';

const EditorContainer = styled.div`
  .ql-container {
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    background: var(--bg-primary);
  }

  .ql-toolbar {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    background: var(--bg-secondary);
  }

  .ql-editor {
    min-height: 150px;
    max-height: 300px;
    overflow-y: auto;
    color: var(--text-primary);
  }

  .ql-editor.ql-blank::before {
    color: var(--text-secondary);
  }
`;

// 定义Quill编辑器的工具栏选项
const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
    [{ 'color': [] }, { 'background': [] }],
    ['link'],
    ['clean']
  ],
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet', 'check',
  'color', 'background',
  'link'
];

const RichTextEditor = ({ value, onChange, placeholder }) => {
  const [editorValue, setEditorValue] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setEditorValue(value || '');
    setIsClient(true);
  }, [value]);

  const handleChange = (content) => {
    setEditorValue(content);
    if (onChange) {
      onChange(content);
    }
  };

  // 如果不是客户端渲染，则显示加载中的占位内容
  if (!isClient) {
    return (
      <EditorContainer>
        <div style={{
          height: '150px',
          border: '1px solid #d9d9d9',
          borderRadius: '4px',
          padding: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          加载编辑器中...
        </div>
      </EditorContainer>
    );
  }

  return (
    <EditorContainer>
      <React.Suspense fallback={
        <div style={{
          height: '150px',
          border: '1px solid #d9d9d9',
          borderRadius: '4px',
          padding: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          加载编辑器中...
        </div>
      }>
        <ReactQuill
          theme="snow"
          value={editorValue}
          onChange={handleChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder || "请输入备注..."}
        />
      </React.Suspense>
    </EditorContainer>
  );
};

export default RichTextEditor;
