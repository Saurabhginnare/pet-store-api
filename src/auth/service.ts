import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma';
import { RegisterDTO, LoginDTO } from '../validators/auth/dto';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const registerUser = async (data: RegisterDTO) => {
  const { email, password, role } = data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error('Email already registered');

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hashedPassword, role },
    select: { id: true, email: true, role: true }
  });

  return { message: 'User registered', user };
};

export const loginUser = async (data: LoginDTO) => {
  const { email, password } = data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Invalid credentials');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid credentials');

  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
  return { token };
};