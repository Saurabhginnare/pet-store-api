# 🐾 Pet Store API

A RESTful API for managing pets, built with **Node.js**, **TypeScript**, **Express**, **Prisma ORM**, **MYSQL** Includes features like authentication image uploads and Swagger documentation.

## 🚀 Features

- ✅ **Pet CRUD operations** (Create, Read, Update, Delete)
- 🔐 **JWT-based authentication**
- 🧑‍💼 **Access control** (admin, user)
- 🖼️ **Image upload**
- 📚 **Swagger API documentation**
- 🎯 **Input validation** with `class-validator`
- 🧪 **Unit testing** with`Supertest`
- 🗃️ **MySQL** with `Prisma ORM`
- 📦 **Clean layered architecture**


---

## 🛠️ Installation

### 1. Clone the repo
step-1
git clone https://github.com/your-username/pet-store-api.git

step-2
cd pet-store-api

step-3
npm install

step-4
.env file code

PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/petstore
JWT_SECRET=your_jwt_secret
REDIS_URL=redis://localhost:6379

step-5
npx prisma migrate dev --name init
npx prisma generate

step-6
npm run dev
