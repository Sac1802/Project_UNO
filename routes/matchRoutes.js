import { Router } from "express";
import * as matchController from '../controllers/matchController.js'
import TrackingMiddleware from "../middlewares/trackingMiddleware.js";

const tracking = new TrackingMiddleware();


const router = Router();

router.post('/', tracking.withTracking(matchController.saveMatch));
router.patch('/join', tracking.withTracking(matchController.changeStatusUser));
router.patch('/abandon', tracking.withTracking(matchController.abandonmentGame));
router.get('/players', tracking.withTracking(matchController.getPlayerInGame));

export default router;
