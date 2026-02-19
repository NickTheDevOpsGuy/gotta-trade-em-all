export function OfflineBanner() {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 12,
        background: '#7f1d1d',
        color: '#fecaca',
        textAlign: 'center',
        fontSize: 14,
        zIndex: 9998,
      }}
    >
      You're offline. Some features may not work.
    </div>
  );
}
