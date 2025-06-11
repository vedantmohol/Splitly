import { errorHandler } from "../utils/error.js";
import Expense from "../models/expense.model.js";

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
