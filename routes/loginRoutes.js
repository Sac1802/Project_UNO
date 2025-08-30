import { Router } from "express";
import { trackingMiddleware } from "../middlewares/trackingMiddleware.js";
import * as loginController from '../controllers/loginController.js';

const router = Router();

router.post('/login', trackingMiddleware.withTracking(loginController.login));
router.post('/logout', trackingMiddleware.withTracking(loginController.logout));

export default router;
