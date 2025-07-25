import { Router } from "express";

import * as gameController from '../services/gameService.js';

const router = Router();

router.post('/games', gameController.createGame);
router.get('/games', gameController.getAllGames);
router.get('/games/:id', gameController.getById);
router.put('/games/:id', gameController.updateAllGame);
router.delete('/games/:id', gameController.deleteById)
router.patch('/games/:id', gameController.patchGame);

export default router;