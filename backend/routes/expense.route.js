import express from 'express';
import { addExpense } from '../controllers/expense.controller.js';

const router = express.Router();

router.post('/addExpense',addExpense);

export default router;