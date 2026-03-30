const request = require('supertest');
const app = require('../server');

let token;

const registerAndLogin = async (suffix = '') => {
  await request(app).post('/api/auth/register').send({
    username: `examuser${suffix}`,
    name: 'Exam User',
    email: `examuser${suffix}@example.com`,
    password: 'password123',
  });
  const res = await request(app).post('/api/auth/login').send({
    username: `examuser${suffix}`, password: 'password123',
  });
  return res.body.token;
};

describe('Exams API', () => {

  beforeEach(async () => {
    token = await registerAndLogin();
  });

  describe('POST /api/exams', () => {
    it('creates an exam with all valid fields', async () => {
      const res = await request(app)
        .post('/api/exams')
        .set('Authorization', `Bearer ${token}`)
        .send({
          examName: 'Deep Learning Final',
          examDate: '2026-12-01',
          targetScore: 85,
          difficulty: 'hard',
          weakTopics: ['LSTM', 'Backpropagation'],
        });
      expect(res.statusCode).toBe(201);
      expect(res.body.exam).toHaveProperty('examName', 'Deep Learning Final');
      expect(res.body.exam).toHaveProperty('difficulty', 'hard');
      expect(res.body.exam.weakTopics).toContain('LSTM');
    });

    it('creates an exam with only required fields (defaults apply)', async () => {
      const res = await request(app)
        .post('/api/exams')
        .set('Authorization', `Bearer ${token}`)
        .send({ examName: 'Math Final', examDate: '2026-06-01' });
      expect(res.statusCode).toBe(201);
      expect(res.body.exam.targetScore).toBe(80);   // default
      expect(res.body.exam.difficulty).toBe('medium'); // default
    });

    it('returns 401 if no token is provided', async () => {
      const res = await request(app).post('/api/exams').send({
        examName: 'Math Final', examDate: '2026-06-01',
      });
      expect(res.statusCode).toBe(401);
    });

    it('returns 400 if examName is missing', async () => {
      const res = await request(app)
        .post('/api/exams')
        .set('Authorization', `Bearer ${token}`)
        .send({ examDate: '2026-06-01' });
      expect(res.statusCode).toBe(400);
    });

    it('returns 400 if examDate is invalid format', async () => {
      const res = await request(app)
        .post('/api/exams')
        .set('Authorization', `Bearer ${token}`)
        .send({ examName: 'Test', examDate: 'not-a-date' });
      expect(res.statusCode).toBe(400);
    });

    it('returns 400 if targetScore exceeds 100 (boundary)', async () => {
      const res = await request(app)
        .post('/api/exams')
        .set('Authorization', `Bearer ${token}`)
        .send({ examName: 'Boundary Test', examDate: '2026-06-01', targetScore: 101 });
      expect(res.statusCode).toBe(400);
    });

    it('accepts targetScore of 0 (lower boundary)', async () => {
      const res = await request(app)
        .post('/api/exams')
        .set('Authorization', `Bearer ${token}`)
        .send({ examName: 'Zero Score Test', examDate: '2026-06-01', targetScore: 0 });
      expect(res.statusCode).toBe(201);
      expect(res.body.exam.targetScore).toBe(0);
    });

    it('returns 400 if difficulty is invalid value', async () => {
      const res = await request(app)
        .post('/api/exams')
        .set('Authorization', `Bearer ${token}`)
        .send({ examName: 'Test', examDate: '2026-06-01', difficulty: 'extreme' });
      expect(res.statusCode).toBe(400);
    });
  });

  describe('GET /api/exams', () => {
    it('returns empty array when user has no exams', async () => {
      const res = await request(app)
        .get('/api/exams')
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.exams).toHaveLength(0);
    });

    it('returns exams belonging to authenticated user', async () => {
      await request(app)
        .post('/api/exams')
        .set('Authorization', `Bearer ${token}`)
        .send({ examName: 'Physics Test', examDate: '2026-07-10' });

      const res = await request(app)
        .get('/api/exams')
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.exams.length).toBeGreaterThan(0);
      expect(res.body).toHaveProperty('count');
    });

    it('does not return another user\'s exams', async () => {
      // Create exam for user1
      await request(app)
        .post('/api/exams')
        .set('Authorization', `Bearer ${token}`)
        .send({ examName: 'Private Exam', examDate: '2026-07-10' });

      // Login as user2
      const token2 = await registerAndLogin('2');
      const res = await request(app)
        .get('/api/exams')
        .set('Authorization', `Bearer ${token2}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.exams).toHaveLength(0);
    });

    it('returns 401 without token', async () => {
      const res = await request(app).get('/api/exams');
      expect(res.statusCode).toBe(401);
    });
  });

  describe('DELETE /api/exams/:id', () => {
    it('deletes an exam belonging to the user', async () => {
      const createRes = await request(app)
        .post('/api/exams')
        .set('Authorization', `Bearer ${token}`)
        .send({ examName: 'To Delete', examDate: '2026-09-01' });
      const examId = createRes.body.exam._id;

      const deleteRes = await request(app)
        .delete(`/api/exams/${examId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(deleteRes.statusCode).toBe(200);

      // Verify it's gone
      const getRes = await request(app)
        .get('/api/exams')
        .set('Authorization', `Bearer ${token}`);
      expect(getRes.body.exams.find(e => e._id === examId)).toBeUndefined();
    });

    it('returns 404 when deleting another user\'s exam', async () => {
      const createRes = await request(app)
        .post('/api/exams')
        .set('Authorization', `Bearer ${token}`)
        .send({ examName: 'User1 Exam', examDate: '2026-09-01' });
      const examId = createRes.body.exam._id;

      const token2 = await registerAndLogin('3');
      const deleteRes = await request(app)
        .delete(`/api/exams/${examId}`)
        .set('Authorization', `Bearer ${token2}`);
      expect(deleteRes.statusCode).toBe(404);
    });

    it('returns 401 without token', async () => {
      const res = await request(app).delete('/api/exams/507f1f77bcf86cd799439011');
      expect(res.statusCode).toBe(401);
    });
  });

});
