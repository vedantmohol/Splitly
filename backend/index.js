import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import expenseRoutes from './routes/expense.route.js';
import settlementRoutes from'./routes/settlement.route.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_URL)
.then(()=>{
    console.log('Connected to MongoDB!')
}
).catch((err)=>{
    console.log(err);
})

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.use('/api/expense',expenseRoutes);
app.use('/api/settlements',settlementRoutes);

app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});