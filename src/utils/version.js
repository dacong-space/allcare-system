// 从 package.json 中获取版本号
export const APP_VERSION = '1.0.0';

// 获取构建时间戳
// 这个值会在构建时被替换为实际的时间戳
export const BUILD_TIMESTAMP = '__BUILD_TIMESTAMP__';

// 格式化时间戳为可读的日期时间
export const formatBuildDate = (timestamp) => {
  if (!timestamp || timestamp === '__BUILD_TIMESTAMP__') {
    return '开发环境';
  }
  
  try {
    const date = new Date(parseInt(timestamp));
    return date.toLocaleString();
  } catch (e) {
    return timestamp;
  }
};

// 获取脚本版本号
export const getScriptVersion = () => {
  const scriptElement = document.querySelector('script[src*="main.jsx"]');
  if (scriptElement) {
    const src = scriptElement.getAttribute('src');
    const match = src.match(/v=([^&]+)/);
    return match ? match[1] : '未知';
  }
  return '未知';
};
