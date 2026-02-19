import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from './types/card';
import { CardGrid } from './components/CardGrid';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { useAuth } from './contexts/AuthContext';
import { useTheme } from './contexts/ThemeContext';
import { useToast } from './contexts/ToastContext';
import { useSound } from './contexts/SoundContext';
import { filterByRarity, sortCards, searchCards, type SortOption, type RarityFilter } from './lib/catalogUtils';

const API = import.meta.env.VITE_API_URL ?? '/api';

const themeStyles = {
  dark: {
    bg: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
    text: '#f8fafc',
    muted: '#94a3b8',
    accent: '#fbbf24',
    inputBg: '#1e293b',
    inputBorder: '#475569',
  },
  light: {
    bg: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
    text: '#0f172a',
    muted: '#475569',
    accent: '#f59e0b',
    inputBg: '#fff',
    inputBorder: '#cbd5e1',
  },
};

interface TradeRecord {
  id: number;
  offered_card_ids: string[];
  received_card_ids: string[];
  offered_value: number;
  created_at: string;
}

export default function App() {
  const { token, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { addToast } = useToast();
  const { playAdd, playTrade, playClick, enabled: soundEnabled, setEnabled: setSoundEnabled } = useSound();
  const [cards, setCards] = useState<Card[]>([]);
  const [inventory, setInventory] = useState<Card[]>([]);
  const [trades, setTrades] = useState<TradeRecord[]>([]);
  const [tradeSelection, setTradeSelection] = useState<Set<string>>(new Set());
  const [trading, setTrading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetching, setFetching] = useState(true);
  const [catalogFilter, setCatalogFilter] = useState<RarityFilter>('all');
  const [catalogSort, setCatalogSort] = useState<SortOption>('name');
  const [catalogSearch, setCatalogSearch] = useState('');

  const styles = themeStyles[theme];
  const inputStyle = {
    padding: '8px 12px',
    background: styles.inputBg,
    border: `1px solid ${styles.inputBorder}`,
    borderRadius: 8,
    color: styles.text,
    fontSize: 14,
  };

  const fetchData = useCallback(() => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    setFetching(true);
    setError(null);
    Promise.all([
      fetch(`${API}/cards`).then((r) => r.json()),
      fetch(`${API}/inventory`, { headers }).then((r) => r.json()),
      token ? fetch(`${API}/trades`, { headers }).then((r) => r.json()).then((d) => d.trades ?? []).catch(() => []) : Promise.resolve([]),
    ])
      .then(([c, inv, tr]) => {
        setCards(c);
        setInventory(inv);
        setTrades(tr);
      })
      .catch((e) => setError(e.message || 'Failed to load data'))
      .finally(() => setFetching(false));
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData, token]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setTradeSelection(new Set());
        playClick();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [playClick]);

  const handleAddCard = useCallback((card: Card) => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    fetch(`${API}/inventory`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ card_id: card.id }),
    })
      .then((r) => {
        if (!r.ok) return r.json().then((e) => { throw new Error(e.error || 'Failed to add'); });
        return r.json();
      })
      .then(() => {
        playAdd();
        addToast(`Added ${card.name} to collection`, 'success');
        fetchData();
      })
      .catch((e) => {
        setError(e.message);
        addToast(e.message, 'error');
      });
  }, [fetchData, token, playAdd, addToast]);

  const handleToggleTradeSelect = useCallback((card: Card) => {
    playClick();
    setTradeSelection((prev) => {
      const next = new Set(prev);
      if (next.has(card.id)) next.delete(card.id);
      else next.add(card.id);
      return next;
    });
  }, [playClick]);

  const handleTrade = useCallback(() => {
    if (tradeSelection.size === 0) {
      addToast('Select at least one card to trade', 'error');
      return;
    }
    setTrading(true);
    setError(null);
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    fetch(`${API}/inventory/trade`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ offer_card_ids: Array.from(tradeSelection) }),
    })
      .then((r) => {
        if (r.status === 429) return r.json().then((e) => { throw new Error(e.error || 'Too many trades'); });
        if (!r.ok) return r.json().then((e) => { throw new Error(e.error || 'Trade failed'); });
        return r.json();
      })
      .then((data) => {
        playTrade();
        const count = data.received?.length ?? 0;
        addToast(`Traded for ${count} new card${count !== 1 ? 's' : ''}!`, 'success');
        setTradeSelection(new Set());
        fetchData();
      })
      .catch((e) => {
        setError(e.message);
        addToast(e.message, 'error');
      })
      .finally(() => setTrading(false));
  }, [tradeSelection, fetchData, token, playTrade, addToast]);

  const catalogFiltered = useMemo(() => {
    const byRarity = filterByRarity(cards, catalogFilter);
    const sorted = sortCards(byRarity, catalogSort);
    return searchCards(sorted, catalogSearch);
  }, [cards, catalogFilter, catalogSort, catalogSearch]);

  const uniqueInInventory = useMemo(() => new Set(inventory.map((c) => c.id)), [inventory]);
  const progressUnique = uniqueInInventory.size;
  const progressTotal = cards.length;
  const progressPercent = progressTotal > 0 ? Math.round((progressUnique / progressTotal) * 100) : 0;

  const tradeValue = useMemo(() => {
    const cardMap = new Map(inventory.map((c) => [c.id, c]));
    return Array.from(tradeSelection).reduce((sum, id) => sum + (cardMap.get(id)?.value ?? 0), 0);
  }, [inventory, tradeSelection]);

  const handleExport = useCallback(() => {
    const data = { exportedAt: new Date().toISOString(), inventory };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'tradedex-collection.json';
    a.click();
    URL.revokeObjectURL(a.href);
    addToast('Collection exported', 'success');
  }, [inventory, addToast]);

  const handleImport = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        const items = Array.isArray(data.inventory) ? data.inventory : [];
        const payload = items.map((c: Card) => ({ card_id: c.id, quantity: c.quantity ?? 1 }));
        if (payload.length === 0) {
          addToast('No valid cards in file', 'error');
          return;
        }
        const headers: Record<string, string> = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
        fetch(`${API}/inventory/import`, { method: 'POST', headers, body: JSON.stringify({ items: payload }) })
          .then((r) => r.ok ? fetchData() : r.json().then((e) => { throw new Error(e.error); }))
          .then(() => addToast(`Imported ${payload.length} card(s)`, 'success'))
          .catch((err) => addToast(err.message, 'error'));
      } catch {
        addToast('Invalid file format', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }, [token, fetchData, addToast]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: styles.bg, color: styles.muted }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🃏</div>
          <p>Loading TradeDex…</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        minHeight: '100vh',
        background: styles.bg,
        color: styles.text,
        padding: 24,
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 32, marginBottom: 8, color: styles.accent }}>TradeDex</h1>
          <p style={{ color: styles.muted }}>Build your collection and trade to complete your set</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button onClick={toggleTheme} style={inputStyle} title="Toggle theme">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button onClick={() => setSoundEnabled(!soundEnabled)} style={inputStyle} title="Toggle sounds">
            {soundEnabled ? '🔊' : '🔇'}
          </button>
          {inventory.length > 0 && (
            <>
              <button onClick={handleExport} style={inputStyle}>Export</button>
              <label style={{ ...inputStyle, cursor: 'pointer', display: 'inline-block' }}>
                Import <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
              </label>
            </>
          )}
        </div>
      </div>

      {progressTotal > 0 && (
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ color: styles.muted, fontSize: 14 }}>Collection progress</span>
            <span style={{ color: styles.accent, fontWeight: 'bold' }}>{progressUnique} / {progressTotal} unique</span>
          </div>
          <div style={{ height: 8, background: theme === 'dark' ? '#334155' : '#cbd5e1', borderRadius: 4, overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3 }}
              style={{ height: '100%', background: theme === 'dark' ? 'linear-gradient(90deg, #fbbf24, #f59e0b)' : 'linear-gradient(90deg, #f59e0b, #d97706)', borderRadius: 4 }}
            />
          </div>
          {progressPercent === 100 && <p style={{ color: '#86efac', marginTop: 8, fontSize: 14 }}>🎉 Complete set!</p>}
        </div>
      )}

      {error && (
        <div style={{ padding: 12, background: '#7f1d1d', borderRadius: 8, marginBottom: 24, color: '#fecaca', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <span>{error}</span>
          <button onClick={() => fetchData()} style={{ padding: '8px 16px', background: '#b91c1c', border: 'none', borderRadius: 6, color: '#fecaca', fontWeight: 'bold', cursor: 'pointer' }}>Retry</button>
        </div>
      )}

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 20, marginBottom: 8, color: styles.text }}>Card Catalog</h2>
        <p style={{ color: styles.muted, marginBottom: 12 }}>Add any card to your collection</p>
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type="search"
            placeholder="Search cards…"
            value={catalogSearch}
            onChange={(e) => setCatalogSearch(e.target.value)}
            style={{ ...inputStyle, width: 180 }}
            aria-label="Search catalog"
          />
          <select value={catalogFilter} onChange={(e) => setCatalogFilter(e.target.value as RarityFilter)} style={inputStyle}>
            <option value="all">All rarities</option>
            <option value="common">Common</option>
            <option value="rare">Rare</option>
            <option value="epic">Epic</option>
          </select>
          <select value={catalogSort} onChange={(e) => setCatalogSort(e.target.value as SortOption)} style={inputStyle}>
            <option value="name">Sort by name</option>
            <option value="value">Sort by value</option>
            <option value="rarity">Sort by rarity</option>
          </select>
        </div>
        {fetching ? <LoadingSkeleton /> : <CardGrid cards={catalogFiltered} mode="add" onAdd={handleAddCard} />}
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 20, marginBottom: 8, color: styles.text }}>Your Collection</h2>
        {fetching && inventory.length === 0 ? (
          <LoadingSkeleton />
        ) : inventory.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', background: theme === 'dark' ? 'rgba(30, 41, 59, 0.5)' : 'rgba(241, 245, 249, 0.8)', borderRadius: 12, border: `2px dashed ${styles.inputBorder}` }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
            <p style={{ color: styles.muted, fontSize: 18, marginBottom: 8 }}>Your collection is empty</p>
            <p style={{ color: styles.muted }}>Add your first card from the catalog above to get started!</p>
          </div>
        ) : (
          <>
            <p style={{ color: styles.muted, marginBottom: 16 }}>
              Select cards to offer in a trade <kbd style={{ marginLeft: 4 }}>Esc</kbd> to clear
              {tradeSelection.size > 0 && <span style={{ marginLeft: 8, color: styles.accent }}>• Offering {tradeValue} value — expect ~1–2 new card{tradeValue >= 6 ? 's' : ''}</span>}
            </p>
            <CardGrid cards={inventory} selected={tradeSelection} mode="trade" onToggleSelect={handleToggleTradeSelect} />
            {tradeSelection.size > 0 && (
              <div style={{ marginTop: 24 }}>
                <button onClick={handleTrade} disabled={trading} style={{ padding: '12px 24px', background: styles.accent, border: 'none', borderRadius: 8, color: theme === 'dark' ? '#0f172a' : '#fff', fontWeight: 'bold', fontSize: 16, cursor: trading ? 'not-allowed' : 'pointer' }}>
                  {trading ? 'Trading...' : `Trade ${tradeSelection.size} card(s)`}
                </button>
                <button onClick={() => setTradeSelection(new Set())} style={{ marginLeft: 12, padding: '12px 24px', background: 'transparent', border: `1px solid ${styles.inputBorder}`, borderRadius: 8, color: styles.muted, cursor: 'pointer' }}>
                  Clear selection
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {trades.length > 0 && (
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, marginBottom: 8, color: styles.text }}>Recent Trades</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {trades.slice(0, 5).map((t) => (
              <div key={t.id} style={{ padding: 12, background: theme === 'dark' ? '#1e293b' : '#f1f5f9', borderRadius: 8, fontSize: 14 }}>
                <span style={{ color: styles.muted }}>Traded {t.offered_value} value for {t.received_card_ids.length} card(s)</span>
                <span style={{ color: styles.muted, marginLeft: 8 }}>— {new Date(t.created_at).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </motion.div>
  );
}
