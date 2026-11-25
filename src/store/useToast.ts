import { create } from 'zustand';
import { newId } from '../utils/id';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastStore {
  toasts: ToastItem[];
  show: (type: ToastType, message: string) => void;
  remove: (id: string) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
}

export const useToast = create<ToastStore>((set, get) => ({
  toasts: [],
  
  // Hàm hiển thị thông báo chung
  show: (type, message) => {
    const id = newId();
    set((state) => ({ toasts: [...state.toasts, { id, type, message }] }));
    
    // Tự động xoá sau 4 giây (lỗi thì 6 giây)
    const duration = type === 'error' ? 6000 : 4000;
    setTimeout(() => {
      get().remove(id);
    }, duration);
  },
  
  // Hàm xoá thông báo
  remove: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),

  // Các hàm viết tắt cho nhanh
  success: (msg) => get().show('success', msg),
  error: (msg) => get().show('error', msg),
  warning: (msg) => get().show('warning', msg),
  info: (msg) => get().show('info', msg),
}));