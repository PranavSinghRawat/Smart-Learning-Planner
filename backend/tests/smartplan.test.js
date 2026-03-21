const request = require('supertest');
const app = require('../server');

let token;

const setup = async () => {
  await request(app).post('/api/auth/register').send({
    username: 'smartplanuser',
    name: 'SmartPlan User',
    email: 'smartplan@example.com',
    password: 'password123',
  });
  const loginRes = await request(app).post('/api/auth/login').send({
    username: 'smartplanuser',
    password: 'password123',
  });
  token = loginRes.body.token;
};

describe('Resources API (Gemini)', () => {
  beforeEach(async () => {
    await setup();
  });

  describe('GET /api/resources', () => {
    it('should return 400 if topic is missing', async () => {
      const res = await request(app).get('/api/resources');
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should attempt to get resources for a topic (200 or 500 if Gemini offline)', async () => {
      const res = await request(app).get('/api/resources?topic=Arrays');
      expect([200, 500]).toContain(res.statusCode);
      expect(res.headers['content-type']).toMatch(/json/);
    });
  });

  describe('POST /api/resources/plan', () => {
    it('should return 400 if required fields are missing', async () => {
      const res = await request(app).post('/api/resources/plan').send({ subject: 'DSA' });
      expect(res.statusCode).toBe(400);
    });

    it('should attempt to generate a study plan (200 or 500 if Gemini offline)', async () => {
      const res = await request(app).post('/api/resources/plan').send({
        subject: 'DSA', days: 3, hours: 2, level: 'Beginner',
      });
      expect([200, 500]).toContain(res.statusCode);
      expect(res.headers['content-type']).toMatch(/json/);
    });
  });

  describe('POST /api/resources/smartplan', () => {
    it('should return 400 if topics are missing', async () => {
      const res = await request(app).post('/api/resources/smartplan').send({});
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 400 if topics array is empty', async () => {
      const res = await request(app).post('/api/resources/smartplan').send({ topics: [] });
      expect(res.statusCode).toBe(400);
    });

    it('should attempt to generate smart plan (200 or 500 if Gemini offline)', async () => {
      const res = await request(app).post('/api/resources/smartplan').send({
        day: 1,
        subject: 'DSA',
        hours: 2,
        topics: [
          { name: 'Arrays - Two Pointer', hours: 1 },
          { name: 'Binary Search', hours: 1 },
        ],
      });
      expect([200, 500]).toContain(res.statusCode);
      expect(res.headers['content-type']).toMatch(/json/);
    });
  });
});
