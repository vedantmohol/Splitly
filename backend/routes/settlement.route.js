import express from "express";
import { getAllPeople } from "../controllers/settlement.controller.js";

const router = express.Router();

router.get('/getPeople', getAllPeople);

export default router;
