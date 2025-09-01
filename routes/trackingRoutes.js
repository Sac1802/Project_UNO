import { Router } from "express";
import TrackingMiddleware from "../middlewares/trackingMiddleware.js";

const tracking = new TrackingMiddleware();


import * as controller from '../controllers/usageTrackingController.js';

const router = Router();

router.get('/requests', tracking.withTracking(controller.getAllUsages));
router.get('/response-times', tracking.withTracking(controller.responseTimes));
router.get('/status-codes', tracking.withTracking(controller.statusCodes));
router.get('/popular-endpoints', tracking.withTracking(controller.topEndpoints));


export default router;