const express = require('express');
const { Op, QueryTypes } = require('sequelize');
const sequelize = require('../db');
const Customer = require('../models/Customer');
const Employee = require('../models/Employee');

const router = express.Router();

// GET /api/expirations?type=...&duration=...
router.get('/', async (req, res) => {
  const { type, duration } = req.query;
  let Model;
  let dateColumn;
  switch (type) {
    case 'customer_reass':
      Model = Customer;
      dateColumn = 'lastVisitDate';
      break;
    case 'customer_careplan':
      Model = Customer;
      dateColumn = 'lastCarePlanDate';
      break;
    case 'employee_cpr':
      Model = Employee;
      dateColumn = 'cprExpire';
      break;
    case 'employee_document':
      Model = Employee;
      dateColumn = 'documentExpire';
      break;
    case 'employee_training':
      Model = Employee;
      dateColumn = 'latestTrainingDate';
      break;
    case 'employee_medical':
      Model = Employee;
      dateColumn = 'latestExamDate';
      break;
    default:
      return res.json({ code: 0, data: [] });
  }

  const now = new Date();
  // 本月到期起始和结束边界
  let start;  
  let end = new Date(now);

  if (duration === 'thisMonth') {
    // 本月第一天 0:00
    start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    // 本月最后一天 23:59
    end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  } else {
    start = now;
    const days = parseInt(duration, 10);
    end.setDate(now.getDate() + days);
  }

  try {
    if (type === 'customer_reass') {
      // 下次家访日期 = lastVisitDate + 120 天，使用原始 SQL
      const startDate = start.toISOString().slice(0, 10);
      const endDate = end.toISOString().slice(0, 10);
      const sql = `
        SELECT id, name, ("lastVisitDate"::date + INTERVAL '120 days') AS "expireDate"
        FROM "Customers"
        WHERE (("lastVisitDate"::date + INTERVAL '120 days')::date) BETWEEN :startDate AND :endDate
        ORDER BY "expireDate" ASC
      `;
      const items = await sequelize.query(sql, {
        replacements: { startDate, endDate },
        type: QueryTypes.SELECT
      });
      return res.json({ code: 0, data: items });
    }
    if (type === 'customer_careplan') {
      // 下次CarePlan = lastCarePlanDate + 365 天，使用原始 SQL
      const startDate = start.toISOString().slice(0, 10);
      const endDate = end.toISOString().slice(0, 10);
      const sql = `
        SELECT id, name, ("lastCarePlanDate"::date + INTERVAL '365 days') AS "expireDate"
        FROM "Customers"
        WHERE (("lastCarePlanDate"::date + INTERVAL '365 days')::date) BETWEEN :startDate AND :endDate
        ORDER BY "expireDate" ASC
      `;
      const items = await sequelize.query(sql, {
        replacements: { startDate, endDate },
        type: QueryTypes.SELECT
      });
      return res.json({ code: 0, data: items });
    }
    if (type === 'employee_training') {
      // 下次培训日期 = latestTrainingDate + 365 天，使用原始 SQL
      const startDate = start.toISOString().slice(0, 10);
      const endDate = end.toISOString().slice(0, 10);
      const sql = `
        SELECT id, name, ("latestTrainingDate"::date + INTERVAL '365 days') AS "expireDate"
        FROM "Employees"
        WHERE (("latestTrainingDate"::date + INTERVAL '365 days')::date) BETWEEN :startDate AND :endDate
        ORDER BY "expireDate" ASC
      `;
      const items = await sequelize.query(sql, {
        replacements: { startDate, endDate },
        type: QueryTypes.SELECT
      });
      return res.json({ code: 0, data: items });
    }
    if (type === 'employee_medical') {
      // 下次体检日期 = latestExamDate + 365 天，使用原始 SQL
      const startDate = start.toISOString().slice(0, 10);
      const endDate = end.toISOString().slice(0, 10);
      const sql = `
        SELECT id, name, ("latestExamDate"::date + INTERVAL '365 days') AS "expireDate"
        FROM "Employees"
        WHERE (("latestExamDate"::date + INTERVAL '365 days')::date) BETWEEN :startDate AND :endDate
        ORDER BY "expireDate" ASC
      `;
      const items = await sequelize.query(sql, {
        replacements: { startDate, endDate },
        type: QueryTypes.SELECT
      });
      return res.json({ code: 0, data: items });
    }
    // 其他类型使用 dateColumn 过滤
    const items = await Model.findAll({
      where: { [dateColumn]: { [Op.between]: [start, end] } },
      attributes: ['id', 'name', [dateColumn, 'expireDate']],
      order: [[dateColumn, 'ASC']]
    });
    return res.json({ code: 0, data: items });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ code: 1, msg: '服务器错误' });
  }
});

module.exports = router;
