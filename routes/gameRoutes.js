import { Router } from "express";

import * as gameController from '../controllers/gameController.js';

const router = Router();

router.post('/', gameController.createGame);
router.get('/', gameController.getAllGames);
router.get('/:id', gameController.getById);
router.put('/:id', gameController.updateAllGame);
router.delete('/:id', gameController.deleteById)
router.patch('/:id', gameController.patchGame);

export default router;