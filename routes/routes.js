import { Router } from "express";
import * as playerController from '../controllers/playerController.js'


const router = Router();

/**
 * Router for PlayerController
 */
router.post('/player', playerController.createPlayet);
router.get('/player', playerController.getPlayers);
router.get('/player/:id', playerController.getByIdPlayer);
router.put('/player/:id', playerController.updateFullPlayer);
router.delete('/player/:id', playerController.deletePlayer);
router.patch('/player/:id', playerController.patchPlayer);