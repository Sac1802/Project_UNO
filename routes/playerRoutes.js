import { Router } from "express";

import * as playerController from '../controllers/playerController.js';

const router = Router();

router.post('/players', playerController.createPlayet);
router.get('/players', playerController.getPlayers);
router.get('/players/:id', playerController.getByIdPlayer);
router.put('/players/:id', playerController.updateFullPlayer);
router.delete('/players/:id', playerController.deletePlayer);
router.patch('/players/:id', playerController.patchPlayer);

export default router;