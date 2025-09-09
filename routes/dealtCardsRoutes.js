import { Router } from "express";
import TrackingMiddleware from "../middlewares/trackingMiddleware.js";

const trackingMiddleware = new TrackingMiddleware();

import * as dealtCardsController from '../controllers/dealtCardsController.js';

const router = Router();

router.post('/', trackingMiddleware.withTracking(dealtCardsController.dealtCards));
router.post('/play', trackingMiddleware.withTracking(dealtCardsController.playCard));
router.patch('/draw', trackingMiddleware.withTracking(dealtCardsController.drawCard));
router.get('/sayuno', trackingMiddleware.withTracking(dealtCardsController.sayUno));
router.patch('/challenger', trackingMiddleware.withTracking(dealtCardsController.challengerSayUno));
router.patch('/finishgame', trackingMiddleware.withTracking(dealtCardsController.finishGame));
router.get('/status', trackingMiddleware.withTracking(dealtCardsController.getStatusGame));
router.get('/hand', trackingMiddleware.withTracking(dealtCardsController.getPlayerCards));
router.get('/history', trackingMiddleware.withTracking(dealtCardsController.getHistoryTurns));

export default router;


