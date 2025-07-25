import { Router } from "express";
import * as playerController from '../controllers/playerController.js';
import * as gameController from '../services/gameService.js';
import * as scoreController from '../controllers/scoreController.js';
import * as cardController from '../controllers/cardController.js'


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
 * Router for GameController
 */
router.post('/games', gameController.createGame);
router.get('/games', gameController.getAllGames);
router.get('/games/:id', gameController.getById);
router.put('/games/:id', gameController.updateAllGame);
router.delete('/games/:id', gameController.deleteById)
router.patch('/games/:id', gameController.patchGame);

/**
 * Router for  CardController
 */
router.post('/cards', cardController.createCard);
router.get('/cards', cardController.getAllCards);
router.get('/cards/:id', cardController.getByIdCard);
router.put('/cards/:id', cardController.updateAllCard);
router.delete('/cards/id', cardController.deleteById);
router.patch('/cards/:id', cardController.patchCard);

/**
 * Router for ScoreController
 */
router.post('/scores', scoreController.saveScore);
router.get('/scores', scoreController.getAllScore);
router.get('/scores/:id', scoreController.getById);
router.put('/scores/:id', scoreController.updateAllScore);
router.delete('/scores/:id', scoreController.deleteById);
router.patch('/scores/:id',  scoreController.patchScore);
export default router;