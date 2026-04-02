import express from 'express';
import { createTarjeta, updateTarjeta, deleteTarjeta, moveTarjeta } from '../controllers/tarjeta.controller.js';

const router = express.Router({ mergeParams: true });

router.post('/', createTarjeta);
router.put('/:tarjetaId', updateTarjeta);
router.put('/:tarjetaId/move', moveTarjeta); // Endpoint especial para el drag and drop
router.delete('/:tarjetaId', deleteTarjeta);

export default router;
