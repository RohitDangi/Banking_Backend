import express from 'express';
const router = express.Router();

import { user } from "../controllers";
import { checkAuth } from "../services/auth"

router.post('/signup', user.signup);
router.get('/list',checkAuth, user.listUser);
router.post('/transfer',checkAuth, user.transferMoney);

module.exports = router
