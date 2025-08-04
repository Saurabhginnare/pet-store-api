import { Router } from 'express';
import {
  createPet,
  getPets,
  getPet,
  deletePet,
  uploadImages,
} from '../../controllers/pet/controller';
import { authenticateToken } from '../../middlewares/auth/middleware';
import { authorizeRole } from '../../middlewares/role/middleware';
import { upload } from '../../middlewares/upload/middleware';
import { validatePet } from '../../validators/pet/dto';
import { updatePet } from '../../controllers/pet/controller';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Pets
 *   description: Pet management
 */

/**
 * @swagger
 * /pets:
 *   post:
 *     summary: Create a new pet
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pet'
 *     responses:
 *       201:
 *         description: Pet created successfully
 *       500:
 *         description: Server error
 */
router.post('/', authenticateToken, validatePet, createPet);

/**
 * @swagger
 * /pets:
 *   get:
 *     summary: Get all pets
 *     tags: [Pets]
 *     responses:
 *       200:
 *         description: List of pets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pet'
 */
router.get('/', getPets);

/**
 * @swagger
 * /pets/{id}:
 *   get:
 *     summary: Get pet by ID
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the pet
 *     responses:
 *       200:
 *         description: Pet found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pet'
 *       404:
 *         description: Pet not found
 */
router.get('/:id', getPet);

/**
 * @swagger
 * /pets/{id}:
 *   delete:
 *     summary: Delete a pet
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Pet ID
 *     responses:
 *       200:
 *         description: Pet deleted
 *       404:
 *         description: Pet not found
 */
router.delete('/:id', authenticateToken, authorizeRole('ADMIN'), deletePet);
/**
 * @swagger
 * /pets/{id}:
 *   patch:
 *     summary: Update a pet's data
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Pet ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pet'
 *     responses:
 *       200:
 *         description: Pet updated
 *       404:
 *         description: Pet not found
 *       500:
 *         description: Server error
 */
router.patch('/:id', authenticateToken, validatePet, updatePet);

/**
 * @swagger
 * /pets/{id}:
 *   put:
 *     summary: Update a pet
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Pet ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pet'
 *     responses:
 *       200:
 *         description: Pet updated successfully
 *       404:
 *         description: Pet not found
 *       500:
 *         description: Server error
 */

router.put('/:id', authenticateToken, validatePet, updatePet);

/**
 * @swagger
 * /pets/{id}/upload:
 *   post:
 *     summary: Upload images for a pet
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Pet ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Images uploaded
 *       500:
 *         description: Upload error
 */
router.post(
  '/:id/upload',
  authenticateToken,
  authorizeRole('ADMIN'),
  upload.array('images', 5),
  uploadImages
);

export default router;
