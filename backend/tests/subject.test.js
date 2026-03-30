const request = require('supertest');
const app = require('../server');

let token;
let examId;

const setupUserAndExam = async () => {
  await request(app).post('/api/auth/register').send({
    username: 'subjectuser',
    name: 'Subject User',
    email: 'subjectuser@example.com',
    password: 'password123',
  });
  const loginRes = await request(app).post('/api/auth/login').send({
    username: 'subjectuser', password: 'password123',
  });
  const authToken = loginRes.body.token;

  const examRes = await request(app)
    .post('/api/exams')
    .set('Authorization', `Bearer ${authToken}`)
    .send({ examName: 'Chemistry Test', examDate: '2026-08-01' });

  return { authToken, examId: examRes.body.exam._id };
};

describe('Subjects API', () => {

  beforeEach(async () => {
    const setup = await setupUserAndExam();
    token = setup.authToken;
    examId = setup.examId;
  });

  describe('POST /api/subjects', () => {
    it('creates a subject with all valid fields', async () => {
      const res = await request(app)
        .post('/api/subjects')
        .set('Authorization', `Bearer ${token}`)
        .send({ examId, subjectName: 'Organic Chemistry', difficulty: 'hard', isWeak: true });
      expect(res.statusCode).toBe(201);
      expect(res.body.subject).toHaveProperty('subjectName', 'Organic Chemistry');
      expect(res.body.subject).toHaveProperty('difficulty', 'hard');
      expect(res.body.subject).toHaveProperty('isWeak', true);
    });

    it('creates a subject with defaults when optional fields omitted', async () => {
      const res = await request(app)
        .post('/api/subjects')
        .set('Authorization', `Bearer ${token}`)
        .send({ examId, subjectName: 'Physics' });
      expect(res.statusCode).toBe(201);
      expect(res.body.subject.difficulty).toBe('medium');
      expect(res.body.subject.isWeak).toBe(false);
    });

    it('returns 400 if subjectName is missing', async () => {
      const res = await request(app)
        .post('/api/subjects')
        .set('Authorization', `Bearer ${token}`)
        .send({ examId, difficulty: 'easy' });
      expect(res.statusCode).toBe(400);
    });

    it('returns 400 if difficulty is invalid value', async () => {
      const res = await request(app)
        .post('/api/subjects')
        .set('Authorization', `Bearer ${token}`)
        .send({ examId, subjectName: 'Physics', difficulty: 'extreme' });
      expect(res.statusCode).toBe(400);
    });

    it('returns 400 if examId is missing', async () => {
      const res = await request(app)
        .post('/api/subjects')
        .set('Authorization', `Bearer ${token}`)
        .send({ subjectName: 'Maths', difficulty: 'easy' });
      expect(res.statusCode).toBe(400);
    });

    it('returns 404 if examId does not belong to user', async () => {
      const res = await request(app)
        .post('/api/subjects')
        .set('Authorization', `Bearer ${token}`)
        .send({ examId: '507f1f77bcf86cd799439011', subjectName: 'Maths', difficulty: 'easy' });
      expect(res.statusCode).toBe(404);
    });

    it('returns 401 without token', async () => {
      const res = await request(app)
        .post('/api/subjects')
        .send({ examId, subjectName: 'Biology', difficulty: 'medium' });
      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/subjects', () => {
    it('returns subjects for authenticated user', async () => {
      await request(app)
        .post('/api/subjects')
        .set('Authorization', `Bearer ${token}`)
        .send({ examId, subjectName: 'Biology', difficulty: 'medium' });

      const res = await request(app)
        .get('/api/subjects')
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.subjects)).toBe(true);
      expect(res.body.subjects.length).toBeGreaterThan(0);
    });

    it('filters subjects by examId when query param provided', async () => {
      await request(app)
        .post('/api/subjects')
        .set('Authorization', `Bearer ${token}`)
        .send({ examId, subjectName: 'Thermodynamics', difficulty: 'hard' });

      const res = await request(app)
        .get(`/api/subjects?examId=${examId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.subjects.every(s => s.examId._id === examId || s.examId === examId)).toBe(true);
    });

    it('returns 401 without token', async () => {
      const res = await request(app).get('/api/subjects');
      expect(res.statusCode).toBe(401);
    });
  });

});
