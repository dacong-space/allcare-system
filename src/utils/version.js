// 从环境变量中获取版本号
// 如果环境变量不存在，则使用硬编码的版本号
export const APP_VERSION = import.meta.env.APP_VERSION || '1.1.3';

// 打印调试信息
console.log(`当前版本号: ${APP_VERSION}`);
console.log(`环境变量中的版本号: ${import.meta.env.APP_VERSION || '未定义'}`);


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

// 从 version.json 文件中获取版本号
export const fetchVersionInfo = async () => {
  try {
    const response = await fetch('/allcare-system/version.json?t=' + new Date().getTime());
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.error('获取版本信息失败:', error);
  }
  return { version: APP_VERSION, buildTime: new Date().toISOString() };
};
