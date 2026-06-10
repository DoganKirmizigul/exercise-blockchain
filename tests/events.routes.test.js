const request = require('supertest');

// Use an in-memory DB for tests
process.env.DB_PATH = ':memory:';
const app = require('../src/index');

describe('GET /events', () => {
  it('returns 200 with empty array', async () => {
    const res = await request(app).get('/events');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('POST /events', () => {
  it('creates an event', async () => {
    const res = await request(app).post('/events').send({
      name: 'Test Concert',
      description:'test_description',
      location:'France',
      event_date: '2026-09-01',
      seller_address: '0x1234567890abcdef',
    });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Test Concert');
  });

  it('returns 400 when fields are missing', async () => {
    const res = await request(app).post('/events').send({ name: 'Oops' });
    expect(res.status).toBe(400);
  });
});