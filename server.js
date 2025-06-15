const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('./')); // Serve static files from current directory

// Supabase Configuration
const supabaseUrl = 'https://qrlqxlodzbtiuruwzryc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFybHF4bG9kemJ0aXVydXd6cnljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5Nzg2MzAsImV4cCI6MjA2NTU1NDYzMH0.4TDgQ9_L7Co4mmBS50LrfStEMnPVnENkCiDm0BXQRIQ';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('✅ Supabase client initialized');

// Routes

// Get all expenses
app.get('/api/expenses', async (req, res) => {
    try {
        const { type, startDate, endDate, category } = req.query;
        
        let query = supabase.from('expenses').select('*');
        
        if (type) query = query.eq('type', type);
        if (category) query = query.eq('category', category);
        if (startDate && endDate) {
            query = query.gte('date', startDate).lte('date', endDate);
        }
        
        const { data, error } = await query.order('date', { ascending: false });
        
        if (error) throw error;
        res.json(data || []);
    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).json({ error: error.message });
    }
});

// Create new expense
app.post('/api/expenses', async (req, res) => {
    try {
        const { type = 'expenses', date, amount, category, subcategory = '' } = req.body;
        
        const expenseData = {
            type,
            date: new Date(date).toISOString(),
            amount: parseFloat(amount),
            category,
            subcategory,
            created_at: new Date().toISOString()
        };
        
        const { data, error } = await supabase
            .from('expenses')
            .insert([expenseData])
            .select();
        
        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }
        
        console.log('Expense saved successfully:', data[0]);
        res.status(201).json(data[0]);
    } catch (error) {
        console.error('Error creating expense:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        res.status(400).json({ error: error.message || 'Unknown error occurred', details: error });
    }
});

// Update expense
app.put('/api/expenses/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        const { data, error } = await supabase
            .from('expenses')
            .update(updates)
            .eq('id', id)
            .select();
        
        if (error) throw error;
        
        if (!data || data.length === 0) {
            return res.status(404).json({ error: 'Expense not found' });
        }
        
        res.json(data[0]);
    } catch (error) {
        console.error('Error updating expense:', error);
        res.status(400).json({ error: error.message });
    }
});

// Delete expense
app.delete('/api/expenses/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const { data, error } = await supabase
            .from('expenses')
            .delete()
            .eq('id', id)
            .select();
        
        if (error) throw error;
        
        if (!data || data.length === 0) {
            return res.status(404).json({ error: 'Expense not found' });
        }
        
        res.json({ message: 'Expense deleted successfully' });
    } catch (error) {
        console.error('Error deleting expense:', error);
        res.status(400).json({ error: error.message });
    }
});

// Analytics endpoints
app.get('/api/analytics/summary', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        
        let query = supabase.from('expenses').select('*').eq('type', 'expenses');
        
        if (startDate && endDate) {
            query = query.gte('date', startDate).lte('date', endDate);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        // Process data for analytics
        const categoryBreakdown = {};
        let totalAmount = 0;
        
        data.forEach(expense => {
            totalAmount += expense.amount;
            if (!categoryBreakdown[expense.category]) {
                categoryBreakdown[expense.category] = {
                    _id: expense.category,
                    total: 0,
                    count: 0,
                    avgAmount: 0
                };
            }
            categoryBreakdown[expense.category].total += expense.amount;
            categoryBreakdown[expense.category].count += 1;
        });
        
        // Calculate averages
        Object.keys(categoryBreakdown).forEach(category => {
            const cat = categoryBreakdown[category];
            cat.avgAmount = cat.total / cat.count;
        });
        
        // Convert to array and sort by total
        const summary = Object.values(categoryBreakdown).sort((a, b) => b.total - a.total);
        
        res.json({
            categoryBreakdown: summary,
            totalAmount
        });
    } catch (error) {
        console.error('Error getting analytics summary:', error);
        res.status(500).json({ error: error.message });
    }
});

// Monthly trends
app.get('/api/analytics/monthly', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('expenses')
            .select('*')
            .eq('type', 'expenses')
            .order('date', { ascending: false });
        
        if (error) throw error;
        
        // Process data for monthly trends
        const monthlyData = {};
        
        data.forEach(expense => {
            const date = new Date(expense.date);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const key = `${year}-${month}`;
            
            if (!monthlyData[key]) {
                monthlyData[key] = {
                    _id: { year, month },
                    total: 0,
                    count: 0
                };
            }
            
            monthlyData[key].total += expense.amount;
            monthlyData[key].count += 1;
        });
        
        // Convert to array and sort, limit to 12 months
        const sortedData = Object.values(monthlyData)
            .sort((a, b) => {
                if (a._id.year !== b._id.year) return b._id.year - a._id.year;
                return b._id.month - a._id.month;
            })
            .slice(0, 12);
        
        res.json(sortedData);
    } catch (error) {
        console.error('Error getting monthly trends:', error);
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