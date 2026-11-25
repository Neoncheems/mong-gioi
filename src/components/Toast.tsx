import { useToast } from '../store/useToast';
import type { ToastType } from '../store/useToast';

const icons: Record<ToastType, string> = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
};

const colors: Record<ToastType, string> = {
  success: 'bg-success',
  error: 'bg-error',
  warning: 'bg-warning',
  info: 'bg-blue-500',
};

export function ToastContainer() {
  const { toasts, remove } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          onClick={() => remove(t.id)}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-white shadow-lg cursor-pointer animate-slide-in ${colors[t.type]}`}
        >
          <span className="font-bold">{icons[t.type]}</span>
          <span className="text-sm">{t.message}</span>
        </div>
      ))}
    </div>
  );
}