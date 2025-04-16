// 统一管理 API 基础地址
export const API_BASE = import.meta.env.VITE_API_BASE_URL;

// 通用 fetch 封装（可选）
export const apiFetch = (url, options = {}) => {
  return fetch(`${API_BASE}${url.startsWith('/') ? url : '/' + url}`, options);
};
