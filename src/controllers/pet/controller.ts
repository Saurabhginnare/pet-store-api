import { Request, Response } from 'express';
import prisma from '../../utils/prisma';
import { AuthRequest } from '../../middlewares/auth/middleware';
import { clearCache, getCached, setCache } from '../../utils/cache';

export const createPet = async (req: AuthRequest, res: Response) => {
  try {
    const { name, type, age, breed, images } = req.body;

    const pet = await prisma.pet.create({
      data: {
        name,
        type,
        age,
        breed,
        images: {
          create: (images as { url: string }[])?.map((img: { url: string }) => ({
            url: img.url,
          })) || [],
        },
      },
      include: { images: true },
    });

    clearCache('pets');
    res.status(201).json(pet);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPets = async (req: Request, res: Response) => {
  try {
    const cacheKey = `pets:${JSON.stringify(req.query)}`;
    const cached = await getCached(cacheKey);
    if (cached) return res.json(cached);

    const pets = await prisma.pet.findMany({ where: req.query });
    setCache(cacheKey, pets);
    res.json(pets);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPet = async (req: Request, res: Response) => {
  try {
    const pet = await prisma.pet.findUnique({ where: { id: Number(req.params.id) } });
    if (!pet) return res.status(404).json({ message: 'Pet not found' });
    res.json(pet);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deletePet = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);

    const pet = await prisma.pet.findUnique({ where: { id } });

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    await prisma.image.deleteMany({ where: { petId: id } });
    await prisma.pet.delete({ where: { id } });

    clearCache('pets');

    return res.status(200).json({ message: 'Pet deleted successfully' });
  } catch (err: any) {
    console.error('Error deleting pet:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const updatePet = async (req: AuthRequest, res: Response) => {
  try {
    const petId = Number(req.params.id);
    const { name, type, age, breed } = req.body;

    const existingPet = await prisma.pet.findUnique({ where: { id: petId } });

    if (!existingPet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    const updatedPet = await prisma.pet.update({
      where: { id: petId },
      data: { name, type, age, breed },
    });

    res.status(200).json(updatedPet);
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const uploadImages = async (req: AuthRequest, res: Response) => {
  try {
    const petId = Number(req.params.id);
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const imageData = files.map((file) => ({
      url: file.filename,
      petId,
    }));

    const result = await prisma.image.createMany({
      data: imageData,
      skipDuplicates: true,
    });

    res.status(201).json({
      message: 'Images uploaded successfully',
      uploaded: result.count,
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Upload error' });
  }
};