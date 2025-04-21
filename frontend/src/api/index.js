// src/api/index.js
import axios from 'axios';
import { message } from 'antd';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  timeout: 10000,
});

// 请求拦截
instance.interceptors.request.use(
  config => {
    // 例如注入 token
    // const token = localStorage.getItem('token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  error => Promise.reject(error)
);

// 响应拦截
instance.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response) {
      const msg = error.response.data.message || '请求失败';
      message.error(msg);
      return Promise.reject(error.response.data);
    } else {
      message.error('网络错误，请稍后再试');
      return Promise.reject(error);
    }
  }
);

export default instance;
