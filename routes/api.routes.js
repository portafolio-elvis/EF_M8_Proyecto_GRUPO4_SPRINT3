import express from 'express';
import { verificarToken } from '../middlewares/auth.middleware.js';
import authRoutes from './auth.route.js';
import tableroRoutes from './tablero.routes.js';
import listaRoutes from './lista.routes.js';
import tarjetaRoutes from './tarjeta.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);

// Proteger todas las rutas de recursos con el middleware de JWT
router.use('/tableros', verificarToken, tableroRoutes);
router.use('/tableros/:tableroId/listas', verificarToken, listaRoutes);
router.use('/listas/:listaId/tarjetas', verificarToken, tarjetaRoutes);

export default router;
