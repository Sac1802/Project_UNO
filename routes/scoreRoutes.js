import { Router } from "express";

import * as scoreController from '../controllers/scoreController.js';

const router = Router();

router.get('/score', scoreController.getScoreAllPlayer);
router.post('/', scoreController.saveScore);
router.get('/', scoreController.getAllScore);
router.get('/:id', scoreController.getById);
router.put('/:id', scoreController.updateAllScore);
router.delete('/:id', scoreController.deleteById);
router.patch('/:id',  scoreController.patchScore);

export default router;