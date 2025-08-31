import { Router } from "express";
import TrackingMiddleware from "../middlewares/trackingMiddleware.js";

const trackingMiddleware = new TrackingMiddleware();

import * as gameController from '../controllers/gameController.js';

const router = Router();

router.patch('/start', trackingMiddleware.withTracking(gameController.startGame));
router.patch('/end', trackingMiddleware.withTracking(gameController.endGame));
router.get('/current', trackingMiddleware.withTracking(gameController.currentPlayer));
router.get('/status', trackingMiddleware.withTracking(gameController.getStatusGame));
router.post('/', trackingMiddleware.withTracking(gameController.createGame));
router.get('/', trackingMiddleware.withTracking(gameController.getAllGames));
router.get('/:id', trackingMiddleware.withTracking(gameController.getById));
router.put('/:id', trackingMiddleware.withTracking(gameController.updateAllGame));
router.delete('/:id', trackingMiddleware.withTracking(gameController.deleteById));
router.patch('/:id', trackingMiddleware.withTracking(gameController.patchGame));

export default router;
