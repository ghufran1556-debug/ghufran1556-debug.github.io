
import { createClient } from '@supabase/supabase-js';

/**
 * استخدام المفاتيح الفعلية التي زودتنا بها غفران لضمان عمل الربط مباشرة.
 * تم وضع قيم افتراضية مطابقة لملف .env الخاص بكِ لتجنب خطأ Failed to fetch.
 */
const supabaseUrl = (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL) 
  || 'https://yspvimalwsttiuqzgqgk.supabase.co';

const supabaseAnonKey = (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_ANON_KEY) 
  || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzcHZpbWFsd3N0dGl1cXpncWdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxNDU0MjMsImV4cCI6MjA4NTcyMTQyM30.Dm4TeRjvcVRMAwzsFzwx5kw2H1sb_qLlZVz2Ug63lYA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
