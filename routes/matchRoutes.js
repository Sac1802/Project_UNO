import { Router } from "express";
import * as matchController from '../controllers/matchController.js'
import trackingMiddleware from '../middlewares/trackingMiddleware.js';

const router = Router();
const tracking = new trackingMiddleware();

router.post('/', tracking.withTracking(matchController.saveMatch));
router.patch('/join', tracking.withTracking(matchController.changeStatusUser));
router.patch('/abandon', tracking.withTracking(matchController.abandonmentGame));
router.get('/players', tracking.withTracking(matchController.getPlayerInGame));

export default router;
