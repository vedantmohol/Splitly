import express from "express";
import { getAllPeople, getBalances, getSettlementSummary } from "../controllers/settlement.controller.js";

const router = express.Router();

router.get('/getSettlements', getSettlementSummary);
router.get('/getBalances', getBalances);
router.get('/getPeople', getAllPeople);

export default router;
