import express from "express";
import { getAllPeople, getBalances } from "../controllers/settlement.controller.js";

const router = express.Router();

router.get('/getBalances', getBalances);
router.get('/getPeople', getAllPeople);

export default router;
