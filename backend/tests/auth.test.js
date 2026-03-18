const request = require('supertest');
const app = require('../server');

// Auth controller requires: username, email, password (name is optional)
// Login uses: username (or email as username field), password
const testUser = {
  username: 'testuser',
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
};

describe('Auth API', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user and return a token', async () => {
      const res = await request(app).post('/api/auth/register').send(testUser);
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('email', testUser.email);
    });

    it('should return 400 if email is already registered', async () => {
      await request(app).post('/api/auth/register').send(testUser);
      const res = await request(app).post('/api/auth/register').send({
        ...testUser, username: 'differentuser',
      });
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 400 if username is already taken', async () => {
      await request(app).post('/api/auth/register').send(testUser);
      const res = await request(app).post('/api/auth/register').send({
        ...testUser, email: 'other@example.com',
      });
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toMatch(/username/i);
    });

    it('should return 400 if required fields are missing', async () => {
      const res = await request(app).post('/api/auth/register').send({ email: 'x@x.com' });
      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/auth/register').send(testUser);
    });

    it('should login with valid credentials and return a token', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: testUser.username, password: testUser.password });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should login using email in the username field', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: testUser.email, password: testUser.password });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should return 401 with wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: testUser.username, password: 'wrongpassword' });
      expect(res.statusCode).toBe(401);
    });

    it('should return 401 with non-existing username', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'nobody', password: 'anything' });
      expect(res.statusCode).toBe(401);
    });

    it('should return 400 if username or password is missing', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: testUser.username });
      expect(res.statusCode).toBe(400);
    });
  });
});
