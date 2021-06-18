import express from 'express';
const router = express.Router();

import { ledger } from "../controllers";
import { checkAuth } from "../services/auth"

router.get('/history', checkAuth, ledger.getUserLedgerHistory);

module.exports = router
