import request from 'supertest';
import app from '../../index';
import prisma from '../../utils/prisma';

describe('GET /api/pets/:id', () => {
  let petId: number;

  beforeAll(async () => {
    const pet = await prisma.pet.create({
      data: {
        name: 'Tiger',
        type: 'Cat',
        age: 3,
        breed: 'Siamese'
      }
    });
    petId = pet.id;
  });

  it('should fetch pet by id', async () => {
    const res = await request(app).get(`/api/pets/${petId}`);
    console.log('API response:', res.body);
    expect(res.statusCode).toBe(200);
    expect(res.body?.data?.name).toBe('Tiger');
  });

  afterAll(async () => {
    await prisma.image.deleteMany({ where: { petId } });
    await prisma.pet.delete({ where: { id: petId } });

    await prisma.$disconnect();
  });
});
