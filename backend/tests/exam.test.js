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

  describe('GET /api/exams', () => {
    it('returns empty array when user has no exams', async () => {
      const res = await request(app)
        .get('/api/exams')
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.exams).toHaveLength(0);
      expect(res.body).toHaveProperty('count', 0);
    });

    it('does not return another user\'s exams', async () => {
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

    it('returns 401 with invalid token', async () => {
      const res = await request(app)
        .get('/api/exams')
        .set('Authorization', 'Bearer invalidtoken');
      expect(res.statusCode).toBe(401);
    });
  });

});
