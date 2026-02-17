import { useCallback, useEffect, useState } from 'react';
import { Card } from './types/card';
import { CardGrid } from './components/CardGrid';
import { useAuth } from './contexts/AuthContext';

const API = import.meta.env.VITE_API_URL ?? '/api';

export default function App() {
  const { token, loading } = useAuth();
  const [cards, setCards] = useState<Card[]>([]);
  const [inventory, setInventory] = useState<Card[]>([]);
  const [tradeSelection, setTradeSelection] = useState<Set<string>>(new Set());
  const [trading, setTrading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(() => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    fetch(`${API}/cards`).then((r) => r.json()).then(setCards);
    fetch(`${API}/inventory`, { headers }).then((r) => r.json()).then(setInventory);
    setError(null);
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData, token]);

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
      .then(() => fetchData())
      .catch((e) => setError(e.message));
  }, [fetchData, token]);

  const handleToggleTradeSelect = useCallback((card: Card) => {
    setTradeSelection((prev) => {
      const next = new Set(prev);
      if (next.has(card.id)) next.delete(card.id);
      else next.add(card.id);
      return next;
    });
  }, []);

  const handleTrade = useCallback(() => {
    if (tradeSelection.size === 0) {
      setError('Select at least one card to trade');
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
        if (!r.ok) return r.json().then((e) => { throw new Error(e.error || 'Trade failed'); });
        return r.json();
      })
      .then(() => {
        setTradeSelection(new Set());
        fetchData();
      })
      .catch((e) => setError(e.message))
      .finally(() => setTrading(false));
  }, [tradeSelection, fetchData, token]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: '#94a3b8' }}>
        Loading…
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
      color: '#f8fafc',
      padding: 24,
      fontFamily: "'Segoe UI', system-ui, sans-serif",
    }}>
      <h1 style={{ fontSize: 32, marginBottom: 8, color: '#fbbf24' }}>TradeDex</h1>
      <p style={{ color: '#94a3b8', marginBottom: 32 }}>Build your collection and trade to complete your set</p>

      {error && (
        <div style={{
          padding: 12,
          background: '#7f1d1d',
          borderRadius: 8,
          marginBottom: 24,
          color: '#fecaca',
        }}>
          {error}
        </div>
      )}

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 20, marginBottom: 16, color: '#e2e8f0' }}>Card Catalog</h2>
        <p style={{ color: '#64748b', marginBottom: 16 }}>Add any card to your collection</p>
        <CardGrid cards={cards} mode="add" onAdd={handleAddCard} />
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 20, marginBottom: 16, color: '#e2e8f0' }}>Your Collection</h2>
        {inventory.length === 0 ? (
          <p style={{ color: '#64748b' }}>No cards yet. Add some from the catalog above.</p>
        ) : (
          <>
            <p style={{ color: '#64748b', marginBottom: 16 }}>
              Select cards to offer in a trade
            </p>
            <CardGrid
              cards={inventory}
              selected={tradeSelection}
              mode="trade"
              onToggleSelect={handleToggleTradeSelect}
            />
            {tradeSelection.size > 0 && (
              <div style={{ marginTop: 24 }}>
                <button
                  onClick={handleTrade}
                  disabled={trading}
                  style={{
                    padding: '12px 24px',
                    background: '#fbbf24',
                    border: 'none',
                    borderRadius: 8,
                    color: '#0f172a',
                    fontWeight: 'bold',
                    fontSize: 16,
                    cursor: trading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {trading ? 'Trading...' : `Trade ${tradeSelection.size} card(s)`}
                </button>
                <button
                  onClick={() => setTradeSelection(new Set())}
                  style={{
                    marginLeft: 12,
                    padding: '12px 24px',
                    background: 'transparent',
                    border: '1px solid #475569',
                    borderRadius: 8,
                    color: '#94a3b8',
                    cursor: 'pointer',
                  }}
                >
                  Clear selection
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
