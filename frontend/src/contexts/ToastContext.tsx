import { createContext, useCallback, useContext, useState } from 'react';

type Toast = { id: number; message: string; type: 'error' | 'success' | 'info'; duration?: number };

const ToastContext = createContext<{
  toasts: Toast[];
  addToast: (message: string, type?: 'error' | 'success' | 'info') => void;
} | null>(null);

let toastId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: 'error' | 'success' | 'info' = 'info') => {
    const id = ++toastId;
    const duration = type === 'error' ? 6000 : 4000;
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
