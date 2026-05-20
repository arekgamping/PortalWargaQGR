import { createClient } from '@supabase/supabase-js';

// Ambil kredensial dari environment variable (Vite menggunakan import.meta.env)
// Dilengkapi fallback ke kredensial yang Anda berikan agar langsung berfungsi
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ydinrvnxrznwljsryfsr.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkaW5ydm54cnpud2xqc3J5ZnNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyNDI2MzIsImV4cCI6MjA5NDgxODYzMn0.JyhbqZ1lacNTJPaokdczybNqcR29kozVDx9PVOTjAKg';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Kredensial Supabase belum dikonfigurasi dengan benar di environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
