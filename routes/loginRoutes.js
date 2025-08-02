import { Router } from "express";

import * as loginController from '../controllers/loginController.js';

const router = Router();

router.post('/login', loginController.login);
router.post('/logout', loginController.logout);


export default router;