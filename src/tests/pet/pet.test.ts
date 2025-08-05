import request from 'supertest';
import app from '../../index';
import prisma from '../../utils/prisma';

let token: string;
let petId: string;

beforeAll(async () => {
  await prisma.user.deleteMany();
  await prisma.pet.deleteMany();

  // Register a new user
  await request(app).post('/api/auth/register').send({
    email: 'testpet@example.com',
    password: 'Test@1234',
    role: 'ADMIN'
  });

  // Login to get token
  const loginRes = await request(app).post('/api/auth/login').send({
    email: 'testpet@example.com',
    password: 'Test@1234'
  });

  token = loginRes.body.token;
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('Pet Routes', () => {
  it('should create a new pet', async () => {
    const res = await request(app)
      .post('/api/pets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Buddy',
        type: 'Dog',
        age: 2,
        breed: 'Beagle'
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('name', 'Buddy');
    petId = res.body.id;
  });

  it('should fetch a specific pet', async () => {
    const res = await request(app)
      .get(`/api/pets/${petId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('name', 'Buddy');
  });

  it('should update a pet', async () => {
    const res = await request(app)
      .put(`/api/pets/${petId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Bruno',
        type: 'Dog',
        age: 3,
        breed: 'Pug'
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('name', 'Bruno');
  });

  it('should delete a pet', async () => {
    const res = await request(app)
      .delete(`/api/pets/${petId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Pet deleted successfully');
  });

  it('should return 404 for deleted pet', async () => {
    const res = await request(app)
      .get(`/api/pets/${petId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
  });
});
