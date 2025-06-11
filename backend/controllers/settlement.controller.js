import { errorHandler } from "../utils/error.js";
import Expense from "../models/expense.model.js";

const calculateNetBalances = (expenses) => {
  const balances = {};

  expenses.forEach(exp => {
    const { amount, paid_by, splits } = exp;

    balances[paid_by] = (balances[paid_by] || 0) + amount;

    const entries = (splits instanceof Map) ? splits.entries() : Object.entries(splits);
    for (const [person, splitAmount] of entries) {
      balances[person] = (balances[person] || 0) - splitAmount;
    }
  });

  return balances;
};

// Greedy algorithm to minimize transactions
const simplifyDebts = (balances) => {
  const creditors = [];
  const debtors = [];

  for (const person in balances) {
    const balance = parseFloat(balances[person].toFixed(2));
    if (balance > 0) creditors.push({ person, amount: balance });
    else if (balance < 0) debtors.push({ person, amount: -balance });
  }

  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  const settlements = [];

  let i = 0, j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];

    const minAmount = Math.min(debtor.amount, creditor.amount);
    settlements.push({
      from: debtor.person,
      to: creditor.person,
      amount: parseFloat(minAmount.toFixed(2))
    });

    debtor.amount -= minAmount;
    creditor.amount -= minAmount;

    if (debtor.amount === 0) i++;
    if (creditor.amount === 0) j++;
  }

  return settlements;
};

export const getSettlementSummary = async (req, res, next) => {
  try {
    const expenses = await Expense.find();

    if (!expenses || expenses.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "No expenses found yet. Nothing to settle.",
      });
    }

    const balances = calculateNetBalances(expenses);
    const settlements = simplifyDebts(balances);

    res.status(200).json({
      success: true,
      data: settlements,
      message: "Settlement summary calculated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getBalances = async (req, res, next) => {
  try {
    const expenses = await Expense.find().lean();

    if (expenses.length === 0) {
      return res.status(200).json({ success: true, data: {}, message: "No expenses found yet." });
    }

    const rawBalances = calculateNetBalances(expenses);
    const balances = {};

    for (const person in rawBalances) {
        const value = parseFloat(rawBalances[person].toFixed(2));
        if (value > 0) {
          balances[person] = `is owed ₹${value}`;
        } else if (value < 0) {
          balances[person] = `owes ₹${Math.abs(value)}`;
        } else {
          balances[person] = `settled up`;
        }
    }

    res.status(200).json({
      success: true,
      data: balances,
      message: "Balances calculated successfully"
    });

  } catch (error) {
    next(error);
  }
};

export const getAllPeople = async (req, res, next) => {
  try {
    const expenses = await Expense.find();

    if (!expenses || expenses.length === 0) {
      return next(errorHandler(404, "No expenses found. No people to list."));
    }

    const peopleSet = new Set();

    expenses.forEach(exp => {
      peopleSet.add(exp.paid_by);
      exp.participants.forEach(person => peopleSet.add(person));
    });

    const people = Array.from(peopleSet);

    if (people.length === 0) {
      return next(errorHandler(404, "No people found in the recorded expenses."));
    }

    res.status(200).json({
      success: true,
      data: people,
      message: "People retrieved successfully"
    });

  } catch (error) {
    next(error);
  }
};
