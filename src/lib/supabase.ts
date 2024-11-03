import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qemqgbsrfkfkgtqpvurb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlbXFnYnNyZmtma2d0cXB2dXJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg1OTUxNjIsImV4cCI6MjAzNDE3MTE2Mn0.2RbLOuCDUTAaQ7ZyOMap5vwX2fgnDGk_uJo390P8Q7o';

export const supabase = createClient(supabaseUrl, supabaseKey);