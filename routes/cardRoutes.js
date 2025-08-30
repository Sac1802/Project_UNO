import { Router } from "express";
import {trackingMiddleware} from "../middlewares/trackingMiddleware.js";

import * as cardController from '../controllers/cardController.js'

const router = Router();

router.get('/cardtop', trackingMiddleware.withTracking(cardController.getTopCard));
router.post('/', trackingMiddleware.withTracking(cardController.createCard));
router.get('/', trackingMiddleware.withTracking(cardController.getAllCards));
router.get('/:id', trackingMiddleware.withTracking(cardController.getByIdCard));
router.put('/:id', trackingMiddleware.withTracking(cardController.updateAllCard));
router.delete('/:id', trackingMiddleware.withTracking(cardController.deleteById));
router.patch('/:id', trackingMiddleware.withTracking(cardController.patchCard));


export default router;