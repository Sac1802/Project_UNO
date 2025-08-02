import { Router } from "express";

import * as playerController from '../controllers/playerController.js';

const router = Router();

router.get('/token', playerController.getPlayerByToken);
router.post('/', playerController.createPlayet);
router.get('/', playerController.getPlayers);
router.get('/:id', playerController.getByIdPlayer);
router.put('/:id', playerController.updateFullPlayer);
router.delete('/:id', playerController.deletePlayer);
router.patch('/:id', playerController.patchPlayer);

export default router;