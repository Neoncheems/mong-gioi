import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  initAuth: () => void;
}

export const useAuth = create<AuthStore>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  
  // Hàm này tự động chạy khi mở app để kiểm tra xem đã đăng nhập chưa
  initAuth: () => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      set({ user: session?.user ?? null, isLoading: false });
    });

    // Lắng nghe sự kiện đăng nhập/đăng xuất
    supabase.auth.onAuthStateChange((_event, session) => {
      set({ user: session?.user ?? null, isLoading: false });
    });
  },
}));