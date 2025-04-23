import axios from 'axios';

// 获取所有任务
export const getTasks = async () => {
  const res = await axios.get('/api/tasks');
  return res.data;
};

// 创建任务
export const createTask = async (task) => {
  const res = await axios.post('/api/tasks', task);
  return res.data;
};

// 更新任务
export const updateTask = async (id, updates) => {
  const res = await axios.put(`/api/tasks/${id}`, updates);
  return res.data;
};
