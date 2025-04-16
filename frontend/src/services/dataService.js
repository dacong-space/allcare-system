// 数据服务，用于在不同页面之间共享数据
let employeeCount = 30;
let customerCount = 30;
let documentCount = 0;

// 上个月的数据，用于计算环比
let lastMonthEmployeeCount = 28;
let lastMonthCustomerCount = 25;

// 获取员工数量
export const getEmployeeCount = () => {
  return employeeCount;
};

// 设置员工数量
export const setEmployeeCount = (count) => {
  employeeCount = count;
};

// 获取客户数量
export const getCustomerCount = () => {
  return customerCount;
};

// 设置客户数量
export const setCustomerCount = (count) => {
  customerCount = count;
};

// 获取文档总数
export const getDocumentCount = () => {
  return documentCount;
};

// 设置文档总数
export const setDocumentCount = (count) => {
  documentCount = count;
};

// 获取员工数量环比
export const getEmployeeGrowthRate = () => {
  if (lastMonthEmployeeCount === 0) return 0;
  return ((employeeCount - lastMonthEmployeeCount) / lastMonthEmployeeCount * 100).toFixed(1);
};

// 获取客户数量环比
export const getCustomerGrowthRate = () => {
  if (lastMonthCustomerCount === 0) return 0;
  return ((customerCount - lastMonthCustomerCount) / lastMonthCustomerCount * 100).toFixed(1);
};
