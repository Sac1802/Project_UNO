import { Router } from "express";

import * as cardController from '../controllers/cardController.js'

const router = Router();

router.get('/cardtop', cardController.getTopCard);
router.post('/', cardController.createCard);
router.get('/', cardController.getAllCards);
router.get('/:id', cardController.getByIdCard);
router.put('/:id', cardController.updateAllCard);
router.delete('/:id', cardController.deleteById);
router.patch('/:id', cardController.patchCard);

export default router;