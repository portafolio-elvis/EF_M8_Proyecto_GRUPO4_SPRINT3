import express from 'express';
import { createLista, updateLista, deleteLista } from '../controllers/lista.controller.js';

// mergeParams: true permite a este router acceso a los parámetros definidos en el padre (es decir: :tableroId)
const router = express.Router({ mergeParams: true }); 

router.post('/', createLista);
router.put('/:listaId', updateLista);
router.delete('/:listaId', deleteLista);

export default router;
