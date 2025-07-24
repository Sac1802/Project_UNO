import { Router } from "express";
import * as playerController from '../controllers/playerController.js'
import * as gameController from '../services/gameService.js'


const router = Router();

/**
 * Router for PlayerController
 */
router.post('/players', playerController.createPlayet);
router.get('/players', playerController.getPlayers);
router.get('/players/:id', playerController.getByIdPlayer);
router.put('/players/:id', playerController.updateFullPlayer);
router.delete('/players/:id', playerController.deletePlayer);
router.patch('/players/:id', playerController.patchPlayer);

/**
 * Router fro GameController
 */
router.post('/games', gameController.createGame);
router.get('/games', gameController.getAllGames);
router.get('/games/:id', gameController.getById);
router.put('/games/:id', gameController.updateAllGame);
router.delete('/games/:id', gameController.deleteById)
router.patch('/games/:id', gameController.patchGame);

export default router;