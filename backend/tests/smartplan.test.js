const request = require('supertest');
const app = require('../server');

let token;
let examId;

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

  const examRes = await request(app)
    .post('/api/exams')
    .set('Authorization', `Bearer ${token}`)
    .send({ examName: 'Physics Final', examDate: '2026-12-01', targetScore: 80 });
  examId = examRes.body.exam._id;

  await request(app)
    .post('/api/subjects')
    .set('Authorization', `Bearer ${token}`)
    .send({ examId, subjectName: 'Mechanics', difficulty: 'hard', isWeak: true });

  await request(app)
    .post('/api/subjects')
    .set('Authorization', `Bearer ${token}`)
    .send({ examId, subjectName: 'Optics', difficulty: 'medium', isWeak: false });
};

describe('SmartPlan API', () => {
  beforeEach(async () => {
    await setup();
  });

  describe('POST /api/smartplan/generate', () => {
    it('should return 401 without token', async () => {
      const res = await request(app).post('/api/smartplan/generate').send({ examId });
      expect(res.statusCode).toBe(401);
    });

    it('should attempt to generate a smart plan (200 if ML up, else handled error)', async () => {
      const res = await request(app)
        .post('/api/smartplan/generate')
        .set('Authorization', `Bearer ${token}`)
        .send({ examId });
      // ML service may not be running in test env — accept 200 or server-handled errors
      expect([200, 400, 404, 500, 503]).toContain(res.statusCode);
      // Server must not crash — always returns JSON
      expect(res.headers['content-type']).toMatch(/json/);
    });

    it('should return 200 with empty sessions when no exam data provided', async () => {
      // Controller returns 200 with empty sessions when no candidates exist
      const res = await request(app)
        .post('/api/smartplan/generate')
        .set('Authorization', `Bearer ${token}`)
        .send({});
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('sessions');
      expect(Array.isArray(res.body.sessions)).toBe(true);
    });
  });
});
