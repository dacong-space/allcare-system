// 保留原有的版本工具函数，防止被 update-version.cjs 覆盖

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

// 格式化构建时间
export function formatBuildDate(timestamp) {
  if (!timestamp) return '未知';
  const date = new Date(Number(timestamp));
  return date.toLocaleString();
}

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
  return { version: '未知', buildTime: new Date().toISOString() };
};
