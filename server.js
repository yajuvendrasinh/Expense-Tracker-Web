const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('./')); // Serve static files from current directory

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/expense-tracker';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((error) => console.error('❌ MongoDB connection error:', error));

// Expense Schema
const expenseSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['expenses', 'analysis'],
        default: 'expenses'
    },
    date: {
        type: Date,
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true
    },
    subcategory: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Expense = mongoose.model('Expense', expenseSchema);

// Routes

// Get all expenses
app.get('/api/expenses', async (req, res) => {
    try {
        const { type, startDate, endDate, category } = req.query;
        
        let filter = {};
        if (type) filter.type = type;
        if (category) filter.category = category;
        if (startDate && endDate) {
            filter.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }
        
        const expenses = await Expense.find(filter).sort({ date: -1 });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new expense
app.post('/api/expenses', async (req, res) => {
    try {
        const { type, date, amount, category, subcategory } = req.body;
        
        const expense = new Expense({
            type,
            date: new Date(date),
            amount: parseFloat(amount),
            category,
            subcategory
        });
        
        const savedExpense = await expense.save();
        res.status(201).json(savedExpense);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update expense
app.put('/api/expenses/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        const expense = await Expense.findByIdAndUpdate(id, updates, { new: true });
        if (!expense) {
            return res.status(404).json({ error: 'Expense not found' });
        }
        
        res.json(expense);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete expense
app.delete('/api/expenses/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const expense = await Expense.findByIdAndDelete(id);
        if (!expense) {
            return res.status(404).json({ error: 'Expense not found' });
        }
        
        res.json({ message: 'Expense deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Analytics endpoints
app.get('/api/analytics/summary', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        
        let matchFilter = { type: 'expenses' };
        if (startDate && endDate) {
            matchFilter.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }
        
        const summary = await Expense.aggregate([
            { $match: matchFilter },
            {
                $group: {
                    _id: '$category',
                    total: { $sum: '$amount' },
                    count: { $sum: 1 },
                    avgAmount: { $avg: '$amount' }
                }
            },
            { $sort: { total: -1 } }
        ]);
        
        const totalExpenses = await Expense.aggregate([
            { $match: matchFilter },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        
        res.json({
            categoryBreakdown: summary,
            totalAmount: totalExpenses[0]?.total || 0
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Monthly trends
app.get('/api/analytics/monthly', async (req, res) => {
    try {
        const monthlyData = await Expense.aggregate([
            { $match: { type: 'expenses' } },
            {
                $group: {
                    _id: {
                        year: { $year: '$date' },
                        month: { $month: '$date' }
                    },
                    total: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': -1, '_id.month': -1 } },
            { $limit: 12 } // Last 12 months
        ]);
        
        res.json(monthlyData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Serve the frontend
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

module.exports = app; 