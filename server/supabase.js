const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://lahusjjoetgtlrlrchdq.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhaHVzampvZXRndGxybHJjaGRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5NTY4NTAsImV4cCI6MjA4OTUzMjg1MH0.aEWyxz_Wr9Zy6YiIyCwKkknI_D-dKQa7oTAlBvfDCuA';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

module.exports = supabase;
