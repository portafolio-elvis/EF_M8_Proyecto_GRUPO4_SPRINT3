import express from 'express';
import { getTableros, createTablero, updateTablero, deleteTablero } from '../controllers/tablero.controller.js';

const router = express.Router();

router.get('/', getTableros);
router.post('/', createTablero);
router.put('/:id', updateTablero);
router.delete('/:id', deleteTablero);

export default router;
