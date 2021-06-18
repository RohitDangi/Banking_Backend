import express from 'express';
const router = express.Router()

import { auth } from "../controllers";
import { checkAuth } from "../services/auth"


router.post('/signin', auth.auth)
router.get('/me', checkAuth, auth.me)

module.exports = router
