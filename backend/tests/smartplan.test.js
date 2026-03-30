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
    username: 'smartplanuser', password: 'password123',
  });
  token = loginRes.body.token;
};

describe('Resources & Smart Plan API (Groq AI)', () => {

  beforeEach(async () => { await setup(); });

  // ── GET /api/resources ────────────────────────────────────────────────────
  describe('GET /api/resources', () => {
    it('returns 400 if topic query param is missing', async () => {
      const res = await request(app).get('/api/resources');
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('returns 400 if topic is empty string', async () => {
      const res = await request(app).get('/api/resources?topic=');
      expect(res.statusCode).toBe(400);
    });

    it('returns JSON response for valid topic (200 or 500 if Groq offline)', async () => {
      const res = await request(app).get('/api/resources?topic=Arrays&subject=DSA');
      expect([200, 500]).toContain(res.statusCode);
      expect(res.headers['content-type']).toMatch(/json/);
    });
  });

  // ── POST /api/resources/plan ──────────────────────────────────────────────
  describe('POST /api/resources/plan', () => {
    it('returns 400 if subject is missing', async () => {
      const res = await request(app).post('/api/resources/plan').send({
        days: 3, hours: 2, level: 'Beginner',
      });
      expect(res.statusCode).toBe(400);
    });

    it('returns 400 if days is missing', async () => {
      const res = await request(app).post('/api/resources/plan').send({
        subject: 'DSA', hours: 2, level: 'Beginner',
      });
      expect(res.statusCode).toBe(400);
    });

    it('returns 400 if hours is missing', async () => {
      const res = await request(app).post('/api/resources/plan').send({
        subject: 'DSA', days: 3, level: 'Beginner',
      });
      expect(res.statusCode).toBe(400);
    });

    it('returns 400 if level is missing', async () => {
      const res = await request(app).post('/api/resources/plan').send({
        subject: 'DSA', days: 3, hours: 2,
      });
      expect(res.statusCode).toBe(400);
    });

    it('returns JSON for valid plan request (200 or 500 if Groq offline)', async () => {
      const res = await request(app).post('/api/resources/plan').send({
        subject: 'DSA', days: 3, hours: 2, level: 'Beginner',
      });
      expect([200, 500]).toContain(res.statusCode);
      expect(res.headers['content-type']).toMatch(/json/);
    });
  });

  // ── POST /api/resources/smartplan ────────────────────────────────────────
  describe('POST /api/resources/smartplan', () => {
    it('returns 400 if topics field is missing', async () => {
      const res = await request(app).post('/api/resources/smartplan').send({});
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('returns 400 if topics array is empty', async () => {
      const res = await request(app).post('/api/resources/smartplan').send({ topics: [] });
      expect(res.statusCode).toBe(400);
    });

    it('returns JSON for valid smartplan request (200 or 500 if Groq offline)', async () => {
      const res = await request(app).post('/api/resources/smartplan').send({
        day: 1,
        subject: 'Deep Learning',
        hours: 3,
        topics: [
          { name: 'LSTM — sequence modeling', hours: 1.5 },
          { name: 'Backpropagation through time', hours: 1.5 },
        ],
      });
      expect([200, 500]).toContain(res.statusCode);
      expect(res.headers['content-type']).toMatch(/json/);
    });
  });

  // ── POST /api/smartplan/generate (ML-scored session planner) ─────────────
  describe('POST /api/smartplan/generate', () => {
    it('returns 401 without token', async () => {
      const res = await request(app).post('/api/smartplan/generate').send({
        hoursAvailable: 4,
      });
      expect(res.statusCode).toBe(401);
    });

    it('returns 200 with empty sessions when user has no exams or career goal', async () => {
      const res = await request(app)
        .post('/api/smartplan/generate')
        .set('Authorization', `Bearer ${token}`)
        .send({ hoursAvailable: 4 });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('sessions');
      expect(Array.isArray(res.body.sessions)).toBe(true);
    });

    it('returns sessions scored by MLP when career goal is provided', async () => {
      const res = await request(app)
        .post('/api/smartplan/generate')
        .set('Authorization', `Bearer ${token}`)
        .send({
          hoursAvailable: 4,
          careerGoal: 'MERN Developer',
        });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('sessions');
      expect(res.body).toHaveProperty('scoringSource');
      if (res.body.sessions.length > 0) {
        expect(res.body.sessions[0]).toHaveProperty('effectivenessScore');
        expect(res.body.sessions[0]).toHaveProperty('label');
      }
    });
  });

});
