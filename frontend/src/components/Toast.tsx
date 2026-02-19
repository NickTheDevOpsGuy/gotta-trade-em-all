import { useToast } from '../contexts/ToastContext';

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'fixed',
    bottom: 24,
    right: 24,
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    maxWidth: 400,
  },
  toast: {
    padding: '12px 16px',
    borderRadius: 8,
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    color: '#fff',
    fontSize: 14,
    animation: 'slideIn 0.3s ease',
  },
  error: { background: '#b91c1c' },
  success: { background: '#15803d' },
  info: { background: '#1e293b', border: '1px solid #475569' },
};

export function ToastContainer() {
  const { toasts } = useToast();

  return (
    <div style={styles.container}>
      {toasts.map((t) => (
        <div
          key={t.id}
          style={{
            ...styles.toast,
            ...styles[t.type],
          }}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
