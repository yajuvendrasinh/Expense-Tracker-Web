const supabase = require('./supabaseClient');

module.exports = async (req, res) => {
  if (req.method === 'GET') {
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
      res.status(200).json(data || []);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      const { type = 'expenses', date, amount, category, subcategory = '', expense_name = '', remarks = '' } = req.body;
      if (!expense_name || !expense_name.trim()) {
        return res.status(400).json({ error: 'Expense name is required' });
      }
      const now = new Date();
      const createdAtUTC = now.toISOString();
      const pad = n => n.toString().padStart(2, '0');
      const createdAtIST = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
      const expenseData = {
        type,
        date: new Date(date).toISOString().slice(0, 10),
        amount: parseFloat(amount),
        category,
        subcategory,
        created_at: createdAtUTC,
        created_at_ist: createdAtIST,
        expense_name: expense_name.trim(),
        remarks
      };
      const { data, error } = await supabase.from('expenses').insert([expenseData]).select();
      if (error) throw error;
      res.status(201).json(data[0]);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else if (req.method === 'PUT') {
    try {
      const { id, ...updates } = req.body;
      const { data, error } = await supabase.from('expenses').update(updates).eq('id', id).select();
      if (error) throw error;
      if (!data || data.length === 0) {
        return res.status(404).json({ error: 'Expense not found' });
      }
      res.status(200).json(data[0]);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.body;
      const { data, error } = await supabase.from('expenses').delete().eq('id', id).select();
      if (error) throw error;
      if (!data || data.length === 0) {
        return res.status(404).json({ error: 'Expense not found' });
      }
      res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}; 