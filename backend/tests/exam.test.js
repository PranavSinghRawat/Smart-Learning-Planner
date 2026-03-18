const request = require('supertest');
const app = require('../server');

let token;

const getAuthToken = async () => {
  await request(app).post('/api/auth/register').send({
    username: 'examuser',
    name: 'Exam User',
    email: 'examuser@example.com',
    password: 'password123',
  });
  const res = await request(app).post('/api/auth/login').send({
    username: 'examuser',
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

    it('should return 400 if targetScore exceeds 100 (boundary)', async () => {
      const res = await request(app)
        .post('/api/exams')
        .set('Authorization', `Bearer ${token}`)
        .send({ examName: 'Boundary Test', examDate: '2026-06-01', targetScore: 101 });
      expect(res.statusCode).toBe(400);
    });

    it('should accept targetScore of 0 (boundary)', async () => {
      const res = await request(app)
        .post('/api/exams')
        .set('Authorization', `Bearer ${token}`)
        .send({ examName: 'Zero Score Test', examDate: '2026-06-01', targetScore: 0 });
      expect(res.statusCode).toBe(201);
      expect(res.body.exam.targetScore).toBe(0);
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
      expect(res.body.exams.length).toBeGreaterThan(0);
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/exams');
      expect(res.statusCode).toBe(401);
    });
  });

  describe('DELETE /api/exams/:id', () => {
    it('should delete an exam belonging to the user', async () => {
      const createRes = await request(app)
        .post('/api/exams')
        .set('Authorization', `Bearer ${token}`)
        .send({ examName: 'To Delete', examDate: '2026-09-01' });
      const examId = createRes.body.exam._id;

      const deleteRes = await request(app)
        .delete(`/api/exams/${examId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(deleteRes.statusCode).toBe(200);
    });
  });
});
