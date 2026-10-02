import request from 'supertest';
import app from '../../src/app';

describe('1. Authentication & Session Revocation Tests', () => {
  const testUser = {
    name: 'Alice Johnson',
    email: 'alice.test@example.com',
    password: 'Password123!',
  };

  it('should successfully register a new user and return token and profile', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toMatchObject({
      name: testUser.name,
      email: testUser.email,
    });
    expect(res.body.user).not.toHaveProperty('password');
  });

  it('should reject duplicate email registration with 409', async () => {
    await request(app).post('/api/auth/register').send(testUser);

    const res = await request(app).post('/api/auth/register').send(testUser);
    expect(res.status).toBe(409);
    expect(res.body.message).toContain('already exists');
  });

  it('should authenticate user via login with valid credentials', async () => {
    await request(app).post('/api/auth/register').send(testUser);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe(testUser.email);
  });

  it('should reject login with incorrect password', async () => {
    await request(app).post('/api/auth/register').send(testUser);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: 'WrongPassword!' });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid email or password');
  });

  it('should fetch the current authenticated user profile via /api/auth/me', async () => {
    const registerRes = await request(app).post('/api/auth/register').send(testUser);
    const token = registerRes.body.token;

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(testUser.email);
  });

  it('REASONING CHECK: Rejection of requests after logout (prevent reuse of authenticated session)', async () => {
    // 1. Register and get token
    const registerRes = await request(app).post('/api/auth/register').send(testUser);
    const token = registerRes.body.token;

    // 2. Verify token works prior to logout
    const validRes = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);
    expect(validRes.status).toBe(200);

    // 3. Perform logout
    const logoutRes = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${token}`);
    expect(logoutRes.status).toBe(200);
    expect(logoutRes.body.message).toContain('Logged out successfully');

    // 4. Attempt to reuse the token after logout - MUST BE REJECTED with 401
    const postLogoutRes = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(postLogoutRes.status).toBe(401);
    expect(postLogoutRes.body.message).toContain('Session has been invalidated or logged out');
  });
});
