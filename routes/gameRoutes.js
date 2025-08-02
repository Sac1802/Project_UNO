import { Router } from "express";

import * as gameController from '../controllers/gameController.js';

const router = Router();

router.patch('/start', gameController.startGame);
router.patch('/end', gameController.endGame);
router.get('/current', gameController.currentPlayer);
router.get('/status', gameController.getStatusGame);
router.post('/', gameController.createGame);
router.get('/', gameController.getAllGames);
router.get('/:id', gameController.getById);
router.put('/:id', gameController.updateAllGame);
router.delete('/:id', gameController.deleteById)
router.patch('/:id', gameController.patchGame);

export default router;