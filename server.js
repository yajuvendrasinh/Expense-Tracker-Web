const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: '*',  // Allow requests from any domain
  credentials: true
}));
app.use(bodyParser.json());
app.use(express.static('./')); // Serve static files from current directory

// Supabase Configuration
const supabaseUrl = process.env.SUPABASE_URL || 'https://wozdvfnnyknyxhrukqlh.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvemR2Zm5ueWtueXhocnVrcWxoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwMDk4MDMsImV4cCI6MjA2NTU4NTgwM30.Ojp7VP6hrD7Vio_1faA3RGh6C1-EaFBANIaaijjm1T4';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('✅ Supabase client initialized');
console.log('Environment:', process.env.NODE_ENV || 'development');

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
        const { type = 'expenses', date, amount, category, subcategory = '', expense_name = '', remarks = '' } = req.body;
        
        // Validate required fields
        if (!expense_name || !expense_name.trim()) {
            return res.status(400).json({ error: 'Expense name is required' });
        }
        
        // Calculate UTC and IST times
        const now = new Date(); // UTC time
        const createdAtUTC = now.toISOString(); // Store UTC time

        // Convert to IST (UTC+5:30)
        const istOffset = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in ms
        const nowIST = new Date(now.getTime() + istOffset);
        const pad = n => n.toString().padStart(2, '0');
        const createdAtIST = `${nowIST.getFullYear()}-${pad(nowIST.getMonth() + 1)}-${pad(nowIST.getDate())} ${pad(nowIST.getHours())}:${pad(nowIST.getMinutes())}:${pad(nowIST.getSeconds())}`;
        
        const expenseData = {
            type,
            date: new Date(date).toISOString().slice(0, 10), // YYYY-MM-DD for DATE column
            amount: parseFloat(amount),
            category,
            subcategory,
            created_at: createdAtUTC,
            created_at_ist: createdAtIST,
            expense_name: expense_name.trim(),
            remarks
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

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app; 
