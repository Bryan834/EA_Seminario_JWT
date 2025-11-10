import { Router } from 'express';
import * as usuarioController from '../controller/usuarioController';
import { authenticateToken, authenticateRefreshToken, authorizeAdmin } from '../auth/middleware';

const router = Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Usuario:
 *       type: object
 *       required:
 *         - username
 *         - gmail
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: ID generado por MongoDB
 *         username:
 *           type: string
 *         gmail:
 *           type: string
 *         password:
 *           type: string
 *         birthday:
 *           type: string
 *           format: date
 *         role:
 *           type: string
 *           enum: [user, admin]
 *       example:
 *         username: nombreUsuario
 *         gmail: primeraParteCorreo@example.com
 *         password: 123456
 *         birthday: 2000-05-21
 *         role: user
 */

/**
 * @swagger
 * /user/:
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 */
router.post('/', usuarioController.createUser);

/**
 * @swagger
 * /user/:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 */
router.get('/', usuarioController.getAllUsers);

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Obtener un usuario por su ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 */
router.get('/:id', usuarioController.getUserById);

/**
 * @swagger
 * /user/{username}:
 *   put:
 *     summary: Actualizar un usuario por nombre
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *         description: Nombre de usuario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 */
router.put('/:username', authenticateToken, usuarioController.updateUserByUsername);

/**
 * @swagger
 * /user/{username}:
 *   delete:
 *     summary: Eliminar un usuario por nombre (solo admin)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *         description: Nombre de usuario a eliminar
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       403:
 *         description: Acceso denegado (no admin)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Acceso denegado: se requiere rol de administrador"
 *       401:
 *         description: Token requerido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Token requerido"
 */
router.delete('/:username', authenticateToken, authorizeAdmin, usuarioController.deleteUserByUsername);

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Login de usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: Bryan
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login exitoso, retorna un token JWT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: LOGIN EXITOSO
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 refreshToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/login', usuarioController.login);

/**
 * @swagger
 * /user/refresh:
 *   post:
 *     summary: Refrescar token de acceso
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - refreshToken
 *             properties:
 *               userId:
 *                 type: string
 *                 example: 6912467463bc2a8bcd5060bb
 *               refreshToken:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: Token renovado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Token renovado correctamente
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: No se pudo refrescar el token (token inválido o expirado)
 */
router.post('/refresh', authenticateRefreshToken, usuarioController.refreshAccessToken);

export default router;
