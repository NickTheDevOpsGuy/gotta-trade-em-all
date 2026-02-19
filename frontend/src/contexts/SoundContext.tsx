import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

const SoundContext = createContext<{
  enabled: boolean;
  setEnabled: (v: boolean) => void;
  playAdd: () => void;
  playTrade: () => void;
  playClick: () => void;
} | null>(null);

const STORAGE_KEY = 'tradedex-sound';

function useBeep() {
  return useCallback((freq: number, duration: number) => {
    if (typeof window === 'undefined') return;
    try {
      const ctx = new (
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext
      )();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Ignore if AudioContext not supported
    }
  }, []);
}

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(STORAGE_KEY) !== 'false';
  });
  const beep = useBeep();

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(enabled));
  }, [enabled]);

  const playAdd = useCallback(() => {
    if (!enabled) return;
    beep(440, 0.1);
  }, [enabled, beep]);

  const playTrade = useCallback(() => {
    if (!enabled) return;
    beep(523, 0.08);
    setTimeout(() => beep(659, 0.12), 100);
  }, [enabled, beep]);

  const playClick = useCallback(() => {
    if (!enabled) return;
    beep(300, 0.05);
  }, [enabled, beep]);

  return (
    <SoundContext.Provider
      value={{ enabled, setEnabled, playAdd, playTrade, playClick }}
    >
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error('useSound must be used within SoundProvider');
  return ctx;
}
