import { Router } from "express";
import {trackingMiddleware} from "../middlewares/trackingMiddleware.js";

import * as controller from '../controllers/usageTrackingController.js';

const router = Router();
const tracking = new trackingMiddleware();

router.get('/requests', tracking.withTracking(controller.getAllUsages));
router.get('/response-times', tracking.withTracking(controller.responseTimes));
router.get('/status-codes', tracking.withTracking(controller.statusCodes));
router.get('/popular-endpoints', tracking.withTracking(controller.topEndpoints));


export default router;