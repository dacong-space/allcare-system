import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  :root {
    /* 亮色模式变量 */
    --bg-primary: #FFFFFF;
    --bg-secondary: #F8F9FA;
    --text-primary: #333333;
    --text-secondary: #666666;
    --primary-color: #3498DB;
    --border-color: #E0E0E0;
    --card-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    --header-height: 64px;
    --sidebar-width: 250px;
    --sidebar-collapsed-width: 80px;
  }

  [data-theme='dark'] {
    /* 深色模式变量 */
    --bg-primary: #1E1E1E;
    --bg-secondary: #252525;
    --text-primary: #E0E0E0;
    --text-secondary: #A0A0A0;
    --primary-color: #5DADE2;
    --border-color: #3A3A3A;
    --card-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: var(--bg-primary);
    color: var(--text-primary);
    transition: background-color 0.3s, color 0.3s;
  }

  a {
    text-decoration: none;
    color: var(--primary-color);
  }

  /* 滚动条样式 */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-track {
    background: var(--bg-secondary);
  }

  ::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  /* 页面过渡动画 */
  .page-transition-enter {
    opacity: 0;
  }

  .page-transition-enter-active {
    opacity: 1;
    transition: opacity 0.2s;
  }

  .page-transition-exit {
    opacity: 1;
  }

  .page-transition-exit-active {
    opacity: 0;
    transition: opacity 0.2s;
  }
`;

export default GlobalStyles;
