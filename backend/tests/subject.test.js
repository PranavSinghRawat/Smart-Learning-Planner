const request = require('supertest');
const app = require('../server');

let token;
let examId;

const setupUserAndExam = async () => {
  await request(app).post('/api/auth/register').send({
    name: 'Subject User',
    email: 'subjectuser@example.com',
    password: 'password123',
  });
  const loginRes = await request(app).post('/api/auth/login').send({
    email: 'subjectuser@example.com',
    password: 'password123',
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
    it('should create a subject for authenticated user', async () => {
      const res = await request(app)
        .post('/api/subjects')
        .set('Authorization', `Bearer ${token}`)
        .send({ examId, subjectName: 'Organic Chemistry', difficulty: 'hard', isWeak: true });
      expect(res.statusCode).toBe(201);
      expect(res.body.subject).toHaveProperty('subjectName', 'Organic Chemistry');
    });

    it('should return 404 if examId does not belong to user', async () => {
      const res = await request(app)
        .post('/api/subjects')
        .set('Authorization', `Bearer ${token}`)
        .send({ examId: '507f1f77bcf86cd799439011', subjectName: 'Maths', difficulty: 'easy' });
      expect(res.statusCode).toBe(404);
    });
  });

  describe('GET /api/subjects', () => {
    it('should return subjects for authenticated user', async () => {
      await request(app)
        .post('/api/subjects')
        .set('Authorization', `Bearer ${token}`)
        .send({ examId, subjectName: 'Biology', difficulty: 'medium' });

      const res = await request(app)
        .get('/api/subjects')
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.subjects)).toBe(true);
    });
  });
});
