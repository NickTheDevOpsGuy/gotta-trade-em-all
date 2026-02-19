import { useEffect } from 'react';

interface HelpModalProps {
  onClose: () => void;
  isDark: boolean;
}

const helpContent = [
  'Add cards from the catalog to your collection.',
  'Select cards in Your Collection and trade them for new ones (value-based).',
  'Use Export/Import to back up or share your collection.',
  'Press Esc to clear your trade selection.',
];

export function HelpModal({ onClose, isDark }: HelpModalProps) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-title"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: 24,
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: isDark ? '#1e293b' : '#fff',
          color: isDark ? '#f8fafc' : '#0f172a',
          borderRadius: 12,
          padding: 24,
          maxWidth: 400,
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
        }}
      >
        <h2 id="help-title" style={{ marginBottom: 16 }}>
          How to play
        </h2>
        <ol style={{ paddingLeft: 20, lineHeight: 1.8 }}>
          {helpContent.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ol>
        <button
          onClick={onClose}
          style={{
            marginTop: 20,
            padding: '10px 20px',
            background: isDark ? '#fbbf24' : '#f59e0b',
            color: '#0f172a',
            border: 'none',
            borderRadius: 8,
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          Got it
        </button>
      </div>
    </div>
  );
}
