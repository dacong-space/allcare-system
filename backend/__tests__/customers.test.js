const request = require('supertest');
const app = require('../app');
const Customer = require('../models/Customer');

jest.mock('../models/Customer');

describe('Customers API', () => {
  beforeEach(() => {
    Customer.findAll.mockReset();
  });

  it('GET /api/customers should return empty list', async () => {
    Customer.findAll.mockResolvedValue([]);
    const res = await request(app).get('/api/customers');
    expect(res.status).toBe(200);
    expect(res.body.code).toBe(0);
    expect(res.body.data).toEqual([]);
  });

  it('GET /api/customers should return list of customers', async () => {
    const fakeCustomer = { toJSON: () => ({ id: '1', name: 'Test' }) };
    Customer.findAll.mockResolvedValue([fakeCustomer]);
    const res = await request(app).get('/api/customers');
    expect(res.status).toBe(200);
    expect(res.body.code).toBe(0);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].id).toBe('1');
    expect(res.body.data[0].name).toBe('Test');
  });
});
