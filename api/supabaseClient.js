const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://wozdvfnnyknyxhrukqlh.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvemR2Zm5ueWtueXhocnVrcWxoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwMDk4MDMsImV4cCI6MjA2NTU4NTgwM30.Ojp7VP6hrD7Vio_1faA3RGh6C1-EaFBANIaaijjm1T4';

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase; 