import { Router } from "express";

import * as scoreController from '../controllers/scoreController.js';

const router = Router();

router.post('/scores', scoreController.saveScore);
router.get('/scores', scoreController.getAllScore);
router.get('/scores/:id', scoreController.getById);
router.put('/scores/:id', scoreController.updateAllScore);
router.delete('/scores/:id', scoreController.deleteById);
router.patch('/scores/:id',  scoreController.patchScore);

export default router;