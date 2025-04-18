const express = require('express');
const Customer = require('../models/Customer');
// const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// 获取客户列表
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.findAll();
    const result = customers.map(c => {
      const data = c.toJSON();
      data.language = data.language ? JSON.parse(data.language) : [];
      data.preferredDates = data.preferredDates ? JSON.parse(data.preferredDates) : [];
      data.emergencyContact = data.emergencyContact ? JSON.parse(data.emergencyContact) : {};
      return data;
    });
    res.json({ code: 0, msg: 'success', data: result });
  } catch (err) {
    res.json({ code: 1, msg: err.message });
  }
});

// 新增客户
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const Employee = require('../models/Employee');
    // 检查客户表和员工表ID唯一性
    const customerExists = await Customer.findByPk(data.id);
    const employeeExists = await Employee.findByPk(data.id);
    if (customerExists || employeeExists) {
      return res.json({ code: 1, msg: 'ID已存在于客户或员工表，请更换唯一ID' });
    }
    if (data.language) data.language = JSON.stringify(data.language);
    if (data.preferredDates) data.preferredDates = JSON.stringify(data.preferredDates);
    if (data.emergencyContact) data.emergencyContact = JSON.stringify(data.emergencyContact);
    const customer = await Customer.create(data);

    res.json({ code: 0, msg: 'success', data: customer });
  } catch (err) {
    res.json({ code: 1, msg: err.message });
  }
});

// 编辑客户（支持主键ID变更，事务安全）
router.put('/:id', async (req, res) => {
  console.log('收到PUT /:id请求', req.params, req.body);
  const oldId = req.params.id;
  const data = req.body;
  const newId = data.id;

  if (data.language) data.language = JSON.stringify(data.language);
  if (data.preferredDates) data.preferredDates = JSON.stringify(data.preferredDates);
  if (data.emergencyContact) data.emergencyContact = JSON.stringify(data.emergencyContact);

  const t = await Customer.sequelize.transaction();
  try {
    console.log(`[客户ID变更] oldId=${oldId}, newId=${newId}`);
    if (newId && newId !== oldId) {
      // 检查新ID在客户和员工表中是否唯一
      const Employee = require('../models/Employee');
      const exists = await Customer.findByPk(newId, { transaction: t });
      const empExists = await Employee.findByPk(newId);
      if (exists || empExists) {
        console.log(`[客户ID变更] 新ID已存在于客户或员工表: ${newId}`);
        await t.rollback();
        return res.json({ code: 1, msg: '新ID已存在于客户或员工表，请更换唯一ID' });
      }
      // 查询原数据
      const oldCustomer = await Customer.findByPk(oldId, { transaction: t });
      if (!oldCustomer) {
        console.log(`[客户ID变更] 原客户不存在: ${oldId}`);
        await t.rollback();
        return res.json({ code: 1, msg: '原客户不存在' });
      }
      // 构造新数据
      const newData = { ...oldCustomer.toJSON(), ...data, id: newId };
      console.log(`[客户ID变更] 新建客户数据:`, newData);
      // 新建一条
      await Customer.create(newData, { transaction: t });
      console.log(`[客户ID变更] 已创建新ID: ${newId}`);
      // 删除原ID
      await Customer.destroy({ where: { id: oldId }, transaction: t });
      console.log(`[客户ID变更] 已删除旧ID: ${oldId}`);
      await t.commit();
      console.log(`[客户ID变更] 事务提交成功`);
      return res.json({ code: 0, msg: 'success', newId });
    } else {
      const updateResult = await Customer.update(data, { where: { id: oldId }, transaction: t });
      console.log(`[客户ID变更] 普通信息更新结果:`, updateResult);
      await t.commit();
      return res.json({ code: 0, msg: 'success' });
    }
  } catch (err) {
    console.error(`[客户ID变更][异常]`, err);
    await t.rollback();
    return res.json({ code: 1, msg: err.message });
  }
});

// 删除客户
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await Customer.destroy({ where: { id } });
    res.json({ code: 0, msg: 'success' });
  } catch (err) {
    res.json({ code: 1, msg: err.message });
  }
});

module.exports = router;
