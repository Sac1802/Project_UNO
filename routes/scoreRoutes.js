import { Router } from "express";
import * as scoreController from '../controllers/scoreController.js';
import trackingMiddleware from '../middlewares/trackingMiddleware.js';

const router = Router();
const tracking = new trackingMiddleware();

router.get('/score', tracking.withTracking(scoreController.getScoreAllPlayer));
router.post('/', tracking.withTracking(scoreController.saveScore));
router.get('/', tracking.withTracking(scoreController.getAllScore));
router.get('/:id', tracking.withTracking(scoreController.getById));
router.put('/:id', tracking.withTracking(scoreController.updateAllScore));
router.delete('/:id', tracking.withTracking(scoreController.deleteById));
router.patch('/:id', tracking.withTracking(scoreController.patchScore));

export default router;
