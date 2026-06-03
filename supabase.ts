import { createClient } from '@supabase/supabase-js';


// Initialize database client
const supabaseUrl = 'https://imrmcdellzbxgxehawcd.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjQzYTQyYzVmLTQwYzQtNGJjMC1hN2QxLWYwZDY5YWM3Mzk3NCJ9.eyJwcm9qZWN0SWQiOiJpbXJtY2RlbGx6YnhneGVoYXdjZCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzgwNDc1MzgwLCJleHAiOjIwOTU4MzUzODAsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.DCDcBm-iy2oIh_uTQEBZFASHyoZEssTg4bjmZLh87OA';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };