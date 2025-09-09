import { Router } from 'express'
import TrackingMiddleware from "../middlewares/trackingMiddleware.js";

const trackingMiddleware = new TrackingMiddleware();

import * as rulesController from '../controllers/rulesController.js';

const router = Router();

router.patch('/', trackingMiddleware.withTracking(rulesController.nextTurn));
router.patch('/skip', trackingMiddleware.withTracking(rulesController.skipPlayer));
router.patch('/reverse', trackingMiddleware.withTracking(rulesController.reverseOrder));

export default router;