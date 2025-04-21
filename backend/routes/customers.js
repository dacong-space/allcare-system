const express = require('express');
const Customer = require('../models/Customer');

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: Customer management and operations
 */
const router = express.Router();

// 获取客户列表
/**
 * @swagger
 * /customers:
 *   get:
 *     summary: Get list of all customers
 *     tags: [Customers]
 *     responses:
 *       200:
 *         description: Success, returns list of customers
 */
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.findAll();
    const result = customers.map(c => {
      const data = c.toJSON();
      data.language = data.language ? JSON.parse(data.language) : [];
      // 解析 preferredDate 字段
      data.preferredDate = data.preferredDate ? JSON.parse(data.preferredDate) : [];
      data.emergencyContact = data.emergencyContact ? JSON.parse(data.emergencyContact) : {};
      data.birthday = data.birthday || null;
      data.lastCarePlanDate = data.lastCarePlanDate || null;
      data.spouse = data.spouse || null;
      return data;
    });
    res.json({ code: 0, msg: 'success', data: result });
  } catch (err) {
    res.json({ code: 1, msg: err.message });
  }
});

// 新增客户
/**
 * @swagger
 * /customers:
 *   post:
 *     summary: Create a new customer
 *     tags: [Customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Created customer object
 */
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    // 序列化 language、preferredDate、emergencyContact 为 JSON 字符串
    data.language = typeof data.language === 'string' ? data.language : JSON.stringify(data.language || []);
    data.preferredDate = typeof data.preferredDate === 'string' ? data.preferredDate : JSON.stringify(data.preferredDate || []);
    data.emergencyContact = typeof data.emergencyContact === 'string' ? data.emergencyContact : JSON.stringify(data.emergencyContact || {});
    // 保证所有新增字段都传递到模型
    data.birthday = data.birthday || null;
    data.sharedAttemptHours = data.sharedAttemptHours || null;
    data.pca_2 = data.pca_2 || null;
    data.pca_3 = data.pca_3 || null;
    data.healthNotes = data.healthNotes || null;
    data.lastCarePlanDate = data.lastCarePlanDate || null;
    data.spouse = data.spouse || null;  // 新增配偶字段
    const Employee = require('../models/Employee');
    // 检查客户表和员工表ID唯一性
    const customerExists = await Customer.findByPk(data.id);
    const employeeExists = await Employee.findByPk(data.id);
    if (customerExists || employeeExists) {
      return res.json({ code: 1, msg: 'ID已存在于客户或员工表，请更换唯一ID' });
    }
    // 直接用 req.body 字段写入，不做多余处理
    const customer = await Customer.create(data);
    const rec = customer.toJSON();
    rec.language = rec.language ? JSON.parse(rec.language) : [];
    rec.preferredDate = rec.preferredDate ? JSON.parse(rec.preferredDate) : [];
    rec.emergencyContact = rec.emergencyContact ? JSON.parse(rec.emergencyContact) : {};
    rec.birthday = rec.birthday || null;
    rec.lastCarePlanDate = rec.lastCarePlanDate || null;
    rec.spouse = rec.spouse || null;
    res.json({ code: 0, msg: 'success', data: rec });
  } catch (err) {
    console.error('【DEBUG 后端异常】', err);
    res.json({ code: 1, msg: err.message });
  }
});

// 编辑客户（支持主键ID变更，事务安全）
/**
 * @swagger
 * /customers/{id}:
 *   put:
 *     summary: Update a customer by ID
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Customer ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Updated customer
 */
router.put('/:id', async (req, res) => {
  const oldId = req.params.id;
  const data = req.body;
  const newId = data.id;

  // 序列化 language：数组 stringify，字符串保留，否则 null
  if (Array.isArray(data.language)) {
    data.language = JSON.stringify(data.language);
  } else if (typeof data.language === 'string') {
    // assume it's already a JSON string, do nothing
  } else {
    data.language = null;
  }
  // 序列化 preferredDate 字段：数组 stringify，字符串保持原样，否则 null
  if (Array.isArray(data.preferredDate)) {
    data.preferredDate = JSON.stringify(data.preferredDate);
  } else if (typeof data.preferredDate === 'string') {
    // assume valid JSON array string
    // optionally you can validate with JSON.parse
  } else {
    data.preferredDate = null;
  }
  // 序列化 emergencyContact：对象 stringify，字符串保留，否则 null
  if (data.emergencyContact && typeof data.emergencyContact === 'object') {
    data.emergencyContact = JSON.stringify(data.emergencyContact);
  } else if (typeof data.emergencyContact === 'string') {
    // assume it's already a JSON string, do nothing
  } else {
    data.emergencyContact = null;
  }
  // 保证所有新增字段都传递到模型
  data.birthday = data.birthday || null;
  data.sharedAttemptHours = data.sharedAttemptHours || null;
  data.pca_2 = data.pca_2 || null;
  data.pca_3 = data.pca_3 || null;
  data.healthNotes = data.healthNotes || null;
  data.lastCarePlanDate = data.lastCarePlanDate || null;
  data.spouse = data.spouse || null;  // 新增配偶字段

  const t = await Customer.sequelize.transaction();
  try {
    if (newId && newId !== oldId) {
      // 检查新ID在客户和员工表中是否唯一
      const Employee = require('../models/Employee');
      const exists = await Customer.findByPk(newId, { transaction: t });
      const empExists = await Employee.findByPk(newId);
      if (exists || empExists) {
        await t.rollback();
        return res.json({ code: 1, msg: '新ID已存在于客户或员工表，请更换唯一ID' });
      }
      // 查询原数据
      const oldCustomer = await Customer.findByPk(oldId, { transaction: t });
      if (!oldCustomer) {
        await t.rollback();
        return res.json({ code: 1, msg: '原客户不存在' });
      }
      // 构造新数据
      const newData = { ...oldCustomer.toJSON(), ...data, id: newId };
      // 新建一条
      await Customer.create(newData, { transaction: t });
      // 删除原ID
      await Customer.destroy({ where: { id: oldId }, transaction: t });
      await t.commit();
      return res.json({ code: 0, msg: 'success', newId });
    } else {
      const updateResult = await Customer.update(data, { where: { id: oldId }, transaction: t });
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
/**
 * @swagger
 * /customers/{id}:
 *   delete:
 *     summary: Delete a customer by ID
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Customer ID
 *     responses:
 *       200:
 *         description: Deletion successful
 */
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
