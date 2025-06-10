import { errorHandler } from "../utils/error.js";
import Expense from "../models/expense.model.js";

export const addExpense = async (req, res, next) => {
  try {
    const { amount, description, paid_by, participants, split_type, splits } = req.body;

    if (!amount || amount <= 0) {
      return next(errorHandler(400, 'Amount must be a positive number'));
    }
    if (!description || description === "") {
      return next(errorHandler(400, 'Description is required'));
    }
    if (!paid_by || paid_by === "") {
      return next(errorHandler(400, 'The name of the person who paid must be provided.'));
    }
    if (!Array.isArray(participants) || participants.length === 0) {
      return next(errorHandler(400, 'Participants must be a non-empty array'));
    }
    if (!split_type || !['equal', 'percentage', 'exact'].includes(split_type)) {
      return next(errorHandler(400, 'Invalid split_type. Must be "equal", "percentage", or "exact".'));
    }

    const formattedSplits = {};

    if (split_type === 'equal') {
      const equalAmount = parseFloat((amount / participants.length).toFixed(2));
      participants.forEach(p => {
        formattedSplits[p] = equalAmount;
      });

    } else if (split_type === 'percentage') {
      if (!splits || Object.keys(splits).length !== participants.length) {
        return next(errorHandler(400, 'Splits must be provided for all participants when using percentage split.'));
      }

      const totalPercent = Object.values(splits).reduce((sum, val) => sum + val, 0);
      if (totalPercent !== 100) {
        return next(errorHandler(400, 'Total percentage must add up to 100%.'));
      }

      participants.forEach(p => {
        if (!splits[p]) {
            return next(errorHandler(400, `Missing percentage for participant ${p}`));
        }
        formattedSplits[p] = parseFloat(((splits[p] / 100) * amount).toFixed(2));
      });

    } else if (split_type === 'exact') {
      if (!splits || Object.keys(splits).length !== participants.length) {
        return next(errorHandler(400, 'Splits must be provided for all participants when using exact split.'));
      }

      const totalExact = Object.values(splits).reduce((sum, val) => sum + val, 0);
      if (parseFloat(totalExact.toFixed(2)) !== amount) {
        return next(errorHandler(400, 'Total exact amounts must equal the expense amount.'));
      }

      participants.forEach(p => {
        if (splits[p] == null) { 
            return next(errorHandler(400, `Missing exact amount for participant ${p}`));
        }
        formattedSplits[p] = parseFloat(splits[p].toFixed(2));
      });
    }

    const newExpense = new Expense({
      amount,
      description,
      paid_by,
      participants,
      split_type,
      splits: formattedSplits,
    });

    const savedExpense = await newExpense.save();

    res.status(201).json({
      success: true,
      data: savedExpense,
      message: 'Expense added successfully',
    });

  } catch (err) {
    next(err);
  }
};

export const getExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: expenses,
      message: "All expenses fetched successfully",
    });
  } catch (err) {
    next(errorHandler(500, "Failed to fetch expenses"));
  }
};

export const updateExpense = async (req, res, next) => {
  try {
    const { id } = req.params;

    let expense = await Expense.findById(id);
    if (!expense){
      return next(errorHandler(404, "Expense not found or Invalid expense ID"));  
    } 

    const {
      amount = expense.amount,
      description = expense.description,
      paid_by = expense.paid_by,
      participants = expense.participants,
      split_type = expense.split_type,
      splits = expense.splits
    } = req.body;

    if (!amount || amount <= 0) {
      return next(errorHandler(400, 'Amount must be a positive number'));
    }

    if (!description || description.trim() === "") {
      return next(errorHandler(400, 'Description is required'));
    }

    if (!paid_by || paid_by.trim() === "") {
      return next(errorHandler(400, 'The name of the person who paid must be provided.'));
    }

    if (!Array.isArray(participants) || participants.length === 0) {
      return next(errorHandler(400, 'Participants must be a non-empty array'));
    }

    if (!split_type || !['equal', 'percentage', 'exact'].includes(split_type)) {
      return next(errorHandler(400, 'Invalid split_type. Must be "equal", "percentage", or "exact".'));
    }

    let newSplits = {};

    if (split_type === 'equal') {
      const share = parseFloat((amount / participants.length).toFixed(2));
      participants.forEach(p => {
        newSplits[p] = share;
      });

    } else if (split_type === 'percentage') {
      const totalPercent = Object.values(splits).reduce((sum, val) => sum + Number(val), 0);
      if (totalPercent !== 100){
        return next(errorHandler(400, "Percentage must sum to 100"));
      }

      for (let person in splits) {
        newSplits[person] = parseFloat(((splits[person] / 100) * amount).toFixed(2));
      }

    } else if (split_type === 'exact') {
      const totalExact = Object.values(splits).reduce((sum, val) => sum + Number(val), 0);
      if (totalExact !== amount){
        return next(errorHandler(400, "Exact splits must sum to the total amount"));
      }
        
      for (let person in splits) {
        newSplits[person] = Number(splits[person]);
      }

    } else {
      return next(errorHandler(400, "Invalid split_type"));
    }

    const updatedExpense = await Expense.findByIdAndUpdate(
      id,
      {
        amount,
        description,
        paid_by,
        participants,
        split_type,
        splits: newSplits
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: updatedExpense,
      message: "Expense updated successfully"
    });

  } catch (error) {
    next(error);
  }
};