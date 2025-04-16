const express = require('express');
const Employee = require('../models/Employee');
// const { authMiddleware } = require('../middleware/auth'); // 如需权限控制可启用

const router = express.Router();

// 获取员工列表
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.findAll();
    const result = employees.map(e => ({
      ...e.toJSON(),
      language: e.language ? JSON.parse(e.language) : []
    }));
    res.json({ code: 0, msg: 'success', data: result });
  } catch (err) {
    res.json({ code: 1, msg: err.message });
  }
});

// 新增员工
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const Customer = require('../models/Customer');
    // 检查员工表和客户表ID唯一性
    const employeeExists = await Employee.findByPk(data.id);
    const customerExists = await Customer.findByPk(data.id);
    if (employeeExists || customerExists) {
      return res.json({ code: 1, msg: 'ID已存在于员工或客户表，请更换唯一ID' });
    }
    data.language = JSON.stringify(data.language || []);
    const employee = await Employee.create(data);
    res.json({ code: 0, msg: 'success', data: employee });
  } catch (err) {
    res.json({ code: 1, msg: err.message });
  }
});

// 编辑员工
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const Customer = require('../models/Customer');
    // 支持主键变更时校验唯一性
    if (data.id && data.id !== id) {
      const employeeExists = await Employee.findByPk(data.id);
      const customerExists = await Customer.findByPk(data.id);
      if (employeeExists || customerExists) {
        return res.json({ code: 1, msg: '新ID已存在于员工或客户表，请更换唯一ID' });
      }
    }
    if (data.language) data.language = JSON.stringify(data.language);
    await Employee.update(data, { where: { id } });
    res.json({ code: 0, msg: 'success' });
  } catch (err) {
    res.json({ code: 1, msg: err.message });
  }
});

// 删除员工
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await Employee.destroy({ where: { id } });
    res.json({ code: 0, msg: 'success' });
  } catch (err) {
    res.json({ code: 1, msg: err.message });
  }
});

module.exports = router;
