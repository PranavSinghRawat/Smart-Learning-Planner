const request = require('supertest');
const app = require('../server');

let token;

const getAuthToken = async () => {
  await request(app).post('/api/auth/register').send({
    name: 'Exam User',
    email: 'examuser@example.com',
    password: 'password123',
  });
  const res = await request(app).post('/api/auth/login').send({
    email: 'examuser@example.com',
    password: 'password123',
  });
  return res.body.token;
};

describe('Exams API', () => {
  beforeEach(async () => {
    token = await getAuthToken();
  });

  describe('POST /api/exams', () => {
    it('should return 401 if no token is provided', async () => {
      const res = await request(app).post('/api/exams').send({
        examName: 'Math Final',
        examDate: '2026-06-01',
      });
      expect(res.statusCode).toBe(401);
    });

    it('should create an exam for authenticated user', async () => {
      const res = await request(app)
        .post('/api/exams')
        .set('Authorization', `Bearer ${token}`)
        .send({ examName: 'Math Final', examDate: '2026-06-01', targetScore: 90 });
      expect(res.statusCode).toBe(201);
      expect(res.body.exam).toHaveProperty('examName', 'Math Final');
    });

    it('should return 400 if examName is missing', async () => {
      const res = await request(app)
        .post('/api/exams')
        .set('Authorization', `Bearer ${token}`)
        .send({ examDate: '2026-06-01' });
      expect(res.statusCode).toBe(400);
    });

    it('should return 400 if examDate is invalid', async () => {
      const res = await request(app)
        .post('/api/exams')
        .set('Authorization', `Bearer ${token}`)
        .send({ examName: 'Test', examDate: 'not-a-date' });
      expect(res.statusCode).toBe(400);
    });
  });

  describe('GET /api/exams', () => {
    it('should return an array of exams for authenticated user', async () => {
      await request(app)
        .post('/api/exams')
        .set('Authorization', `Bearer ${token}`)
        .send({ examName: 'Physics Test', examDate: '2026-07-10' });

      const res = await request(app)
        .get('/api/exams')
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.exams)).toBe(true);
    });
  });
});
