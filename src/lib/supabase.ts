import { createClient } from '@supabase/supabase-js';

// Lấy chìa khóa từ file .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

// Khởi tạo kết nối
export const supabase = createClient(supabaseUrl, supabaseKey);