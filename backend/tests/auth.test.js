const request = require('supertest');
const app = require('../server');

const testUser = {
  username: 'testuser',
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
};

describe('Auth API', () => {

  describe('POST /api/auth/register', () => {
    it('registers a new user and returns token + user object', async () => {
      const res = await request(app).post('/api/auth/register').send(testUser);
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('username', testUser.username);
      expect(res.body.user).toHaveProperty('email', testUser.email);
      expect(res.body.user).not.toHaveProperty('passwordHash');
    });

    it('returns 400 if username is already taken', async () => {
      await request(app).post('/api/auth/register').send(testUser);
      const res = await request(app).post('/api/auth/register').send({
        ...testUser, email: 'other@example.com',
      });
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toMatch(/username/i);
    });

    it('returns 400 if email is already registered', async () => {
      await request(app).post('/api/auth/register').send(testUser);
      const res = await request(app).post('/api/auth/register').send({
        ...testUser, username: 'differentuser',
      });
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('returns 400 if required fields are missing', async () => {
      const res = await request(app).post('/api/auth/register').send({ email: 'x@x.com' });
      expect(res.statusCode).toBe(400);
    });

    it('returns 400 if password exceeds 128 characters', async () => {
      const res = await request(app).post('/api/auth/register').send({
        ...testUser, password: 'a'.repeat(129),
      });
      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/auth/register').send(testUser);
    });

    it('logs in with valid username + password and returns token', async () => {
      const res = await request(app).post('/api/auth/login').send({
        username: testUser.username, password: testUser.password,
      });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('username', testUser.username);
    });

    it('logs in using email in the username field', async () => {
      const res = await request(app).post('/api/auth/login').send({
        username: testUser.email, password: testUser.password,
      });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('returns 401 with wrong password', async () => {
      const res = await request(app).post('/api/auth/login').send({
        username: testUser.username, password: 'wrongpassword',
      });
      expect(res.statusCode).toBe(401);
    });

    it('returns 401 with non-existing username', async () => {
      const res = await request(app).post('/api/auth/login').send({
        username: 'nobody', password: 'anything',
      });
      expect(res.statusCode).toBe(401);
    });

    it('returns 400 if password field is missing', async () => {
      const res = await request(app).post('/api/auth/login').send({
        username: testUser.username,
      });
      expect(res.statusCode).toBe(400);
    });

    it('returns 400 if username field is missing', async () => {
      const res = await request(app).post('/api/auth/login').send({
        password: testUser.password,
      });
      expect(res.statusCode).toBe(400);
    });
  });

  describe('Protected route — JWT middleware', () => {
    it('returns 401 on protected route with no token', async () => {
      const res = await request(app).get('/api/exams');
      expect(res.statusCode).toBe(401);
    });

    it('returns 401 on protected route with malformed token', async () => {
      const res = await request(app)
        .get('/api/exams')
        .set('Authorization', 'Bearer not.a.valid.token');
      expect(res.statusCode).toBe(401);
    });

    it('returns 401 when Authorization header is missing Bearer prefix', async () => {
      const res = await request(app)
        .get('/api/exams')
        .set('Authorization', 'sometoken');
      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/health', () => {
    it('returns 200 with status ok', async () => {
      const res = await request(app).get('/api/health');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('status', 'ok');
    });
  });

});
