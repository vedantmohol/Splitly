import express from 'express';
import { addExpense, getExpenses } from '../controllers/expense.controller.js';

const router = express.Router();

router.post('/addExpense',addExpense);
router.get('/getExpenses',getExpenses);

export default router;