import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
    },
    paid_by:{
        type: String,
        required: true,
    },
    participants: [
        {
            type: String,
            required: true,
        }
    ],
    split_type:{
        type: String,
        enum: ['equal','percentage','exact'],
        default: 'equal',
    },
    splits:{
        type: Map,
        of: Number,
        default: {},
    }
}, {timestamps: true});

const Expense = mongoose.model('Expense', expenseSchema);
export default Expense;