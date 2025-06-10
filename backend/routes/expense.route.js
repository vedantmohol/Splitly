import express from 'express';
import { addExpense, getExpenses, updateExpense } from '../controllers/expense.controller.js';

const router = express.Router();

router.post('/addExpense',addExpense);
router.get('/getExpenses',getExpenses);
router.put('/updateExpense/:id', updateExpense);

export default router;