-- Create the expenses table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.expenses (
    id BIGSERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL DEFAULT 'expenses',
    date DATE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100) DEFAULT '',
    expense_name VARCHAR(200) DEFAULT '',
    remarks TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at_ist VARCHAR(50)
);

-- Enable Row Level Security
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for authenticated and anonymous users
CREATE POLICY "Allow all operations" ON public.expenses
    FOR ALL
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- Grant necessary permissions to public
GRANT ALL ON public.expenses TO anon;
GRANT ALL ON public.expenses TO authenticated;
GRANT USAGE ON SEQUENCE expenses_id_seq TO anon;
GRANT USAGE ON SEQUENCE expenses_id_seq TO authenticated; 