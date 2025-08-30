import { Router } from "express";
import * as playerController from '../controllers/playerController.js';
import trackingMiddleware from '../middlewares/trackingMiddleware.js';

const router = Router();
const tracking = new trackingMiddleware();

router.get('/token', tracking.withTracking(playerController.getPlayerByToken));
router.post('/', tracking.withTracking(playerController.createPlayer));
router.get('/', tracking.withTracking(playerController.getPlayers));
router.get('/:id', tracking.withTracking(playerController.getByIdPlayer));
router.put('/:id', tracking.withTracking(playerController.updateFullPlayer));
router.delete('/:id', tracking.withTracking(playerController.deletePlayer));
router.patch('/:id', tracking.withTracking(playerController.patchPlayer));

export default router;
