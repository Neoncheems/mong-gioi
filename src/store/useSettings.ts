import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Settings } from '../types';

interface SettingsStore extends Settings {
  updateSettings: (newSettings: Partial<Settings>) => void;
}

// Khởi tạo "bộ não" lưu cài đặt, tự động lưu vào LocalStorage của trình duyệt
export const useSettings = create<SettingsStore>()(
  persist(
    (set) => ({
      // Các giá trị mặc định (bạn có thể sửa trực tiếp ở đây hoặc vào trang Cài đặt của app)
      apiBaseUrl: 'https://openrouter.ai/api/v1',
      apiKey: '', // Sẽ được điền vào ở Giai đoạn sau
      model: 'z-ai/glm-4.5-air:free',
      temperature: 0.8,
      maxTokens: 800,
      contextWindow: 20,
      ttsEnabled: false,
      ttsVoiceURI: '',
      ttsRate: 1.0,
      theme: 'dark',

      // Hàm để cập nhật cài đặt
      updateSettings: (newSettings) =>
        set((state) => ({ ...state, ...newSettings })),
    }),
    {
      name: 'mong-gioi-settings', // Tên file lưu trong trình duyệt
    }
  )
);