// 测试环境
process.env.NODE_ENV = 'test';
const request = require('supertest');
const app = require('../../app');
const sequelize = require('../../db');
const Customer = require('../../models/Customer');

beforeAll(async () => {
  // 运行 migrations
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Customers Integration API', () => {
  it('should create and fetch a customer', async () => {
    const payload = { id: '100', name: 'IntTest', spouse: null };
    const createRes = await request(app).post('/api/customers').send(payload);
    expect(createRes.body.code).toBe(0);

    const fetchRes = await request(app).get('/api/customers');
    expect(fetchRes.body.code).toBe(0);
    expect(fetchRes.body.data).toHaveLength(1);
    expect(fetchRes.body.data[0].id).toBe('100');
    expect(fetchRes.body.data[0].name).toBe('IntTest');
  });
});
