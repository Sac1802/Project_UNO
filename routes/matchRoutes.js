import { Router } from "express";
import * as matchController from '../controllers/matchController.js'

const router = Router();

router.post('/', matchController.saveMatch);
router.patch('/join', matchController.changeStatusUser);
router.patch('/abandon', matchController.abandonmentGame);
router.get('/players', matchController.getPlayerInGame);


export default router;
