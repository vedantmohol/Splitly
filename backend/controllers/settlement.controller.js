import { errorHandler } from "../utils/error.js";
import Expense from "../models/expense.model.js";

const calculateNetBalances = (expenses) => {
  const balances = {};

  expenses.forEach(exp => {
    const { amount, paid_by, splits } = exp;

    balances[paid_by] = (balances[paid_by] || 0) + amount;

    for (let person in splits) {
      balances[person] = (balances[person] || 0) - splits[person];
    }
  });

  return balances;
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
