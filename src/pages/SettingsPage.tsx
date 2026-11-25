import { useState } from 'react';
import { useSettings } from '../store/useSettings';
import { useToast } from '../store/useToast';
import { testConnection } from '../ai/client';
import { T } from '../utils/strings';

export function SettingsPage() {
  const settings = useSettings();
  const toast = useToast();
  const [testing, setTesting] = useState(false);
  const [showKey, setShowKey] = useState(false);

  // Xử lý khi bấm nút "Kiểm tra kết nối"
  const handleTest = async () => {
    setTesting(true);
    try {
      const msg = await testConnection(settings);
      toast.success(msg);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold border-b border-border pb-4">{T.settings.title}</h1>

      <div className="bg-bg-2 p-6 rounded-xl border border-border space-y-4">
        <h2 className="text-lg font-semibold text-accent mb-4">Kết nối AI (OpenRouter)</h2>

        <div>
          <label className="block text-sm text-text-2 mb-1">Base URL</label>
          <input
            type="text"
            value={settings.apiBaseUrl}
            onChange={(e) => settings.updateSettings({ apiBaseUrl: e.target.value })}
            className="w-full bg-bg-3 border border-border rounded-lg px-3 py-2 text-text focus:ring-2 focus:ring-accent outline-none"
          />
        </div>

        <div>
          <label className="block text-sm text-text-2 mb-1">API Key (sk-or-v1-...)</label>
          <div className="flex gap-2">
            <input
              type={showKey ? 'text' : 'password'}
              value={settings.apiKey}
              onChange={(e) => settings.updateSettings({ apiKey: e.target.value })}
              className="flex-1 bg-bg-3 border border-border rounded-lg px-3 py-2 text-text focus:ring-2 focus:ring-accent outline-none"
              placeholder="Dán API Key của bạn vào đây..."
            />
            <button
              onClick={() => setShowKey(!showKey)}
              className="px-3 py-2 bg-bg-3 border border-border rounded-lg text-text-2 hover:text-text"
            >
              {showKey ? 'Ẩn' : 'Hiện'}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm text-text-2 mb-1">Tên Model (ví dụ: google/gemma-4-31b-it:free)</label>
          <input
            type="text"
            value={settings.model}
            onChange={(e) => settings.updateSettings({ model: e.target.value })}
            className="w-full bg-bg-3 border border-border rounded-lg px-3 py-2 text-text focus:ring-2 focus:ring-accent outline-none"
          />
        </div>

        <div className="pt-4 border-t border-border mt-4">
          <button
            onClick={handleTest}
            disabled={testing}
            className="bg-accent hover:bg-accent-2 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {testing ? 'Đang kiểm tra...' : 'Kiểm tra kết nối'}
          </button>
        </div>
      </div>
    </div>
  );
}