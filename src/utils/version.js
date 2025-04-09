// 从环境变量中获取版本号
// 如果环境变量不存在，则使用硬编码的版本号
export const APP_VERSION = import.meta.env.APP_VERSION || '1.1.3';

// 打印调试信息
console.log(`当前版本号: ${APP_VERSION}`);
console.log(`环境变量中的版本号: ${import.meta.env.APP_VERSION || '未定义'}`);


// 获取构建时间戳
// 这个值会在构建时被替换为实际的时间戳
export const BUILD_TIMESTAMP = '1744218325950';

// 格式化时间戳为可读的日期时间
export const formatBuildDate = (timestamp) => {
  if (!timestamp || timestamp === '__BUILD_TIMESTAMP__') {
    return '开发环境';
  }

  try {
    // 先尝试直接创建 Date 对象（处理 ISO 格式字符串）
    let date = new Date(timestamp);

    // 如果结果无效，尝试将其解析为数字
    if (isNaN(date.getTime())) {
      date = new Date(parseInt(timestamp));
    }

    // 检查日期是否有效
    if (isNaN(date.getTime())) {
      console.error('无效的时间戳:', timestamp);
      return '无效日期';
    }

    // 检查是否是1970年附近的日期（可能是错误的时间戳）
    if (date.getFullYear() < 2000) {
      console.warn('可能是错误的时间戳:', timestamp, '转换结果:', date.toLocaleString());
      return '当前时间';
    }

    return date.toLocaleString();
  } catch (e) {
    console.error('时间戳转换错误:', e);
    return '无法解析的时间';
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
