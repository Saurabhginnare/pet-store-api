import request from 'supertest';
import app from '../../index';
import prisma from '../../utils/prisma';

beforeAll(async () => {
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('Auth Routes', () => {
  const testUser = {
    email: 'testuser@example.com',
    password: 'Test@1234',
    role: 'ADMIN'
  };

  it('should register a new user', async () => {
    const res = await request(app).post('/api/auth/register').send(testUser);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('message', 'User registered');
    expect(res.body.user).toHaveProperty('email', testUser.email);
    expect(res.body.user).toHaveProperty('role', testUser.role);
  });

  it('should not allow duplicate registration', async () => {
    const res = await request(app).post('/api/auth/register').send(testUser);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Email already exists');
  });

  it('should login an existing user', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: testUser.password
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should fail login with wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: 'wrongpassword'
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Invalid credentials');
  });

  it('should fail login with non-existent user', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'fake@example.com',
      password: 'doesnotmatter'
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Invalid credentials');
  });
});
