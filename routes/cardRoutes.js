import { Router } from "express";

import * as cardController from '../controllers/cardController.js'

const router = Router();

router.post('/cards', cardController.createCard);
router.get('/cards', cardController.getAllCards);
router.get('/cards/:id', cardController.getByIdCard);
router.put('/cards/:id', cardController.updateAllCard);
router.delete('/cards/id', cardController.deleteById);
router.patch('/cards/:id', cardController.patchCard);

export default router;