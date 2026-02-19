export function LoadingSkeleton() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: 16,
      }}
    >
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          style={{
            borderRadius: 12,
            padding: 16,
            background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
            border: '2px solid #334155',
          }}
        >
          <div
            style={{
              height: 24,
              width: '60%',
              background:
                'linear-gradient(90deg, #334155 25%, #475569 50%, #334155 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
              borderRadius: 4,
              marginBottom: 12,
            }}
          />
          <div
            style={{
              height: 16,
              width: '80%',
              background: '#334155',
              borderRadius: 4,
              marginBottom: 8,
            }}
          />
          <div
            style={{
              height: 14,
              width: '40%',
              background: '#334155',
              borderRadius: 4,
            }}
          />
        </div>
      ))}
    </div>
  );
}
