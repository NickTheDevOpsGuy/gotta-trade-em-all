// i18n prep: extracted strings for future localization
export const strings = {
  app: {
    title: 'TradeDex',
    tagline: 'Build your collection and trade to complete your set',
    loading: 'Loading TradeDex…',
    sessionExpired: 'Session expired. Refresh to continue.',
    refresh: 'Refresh',
  },
  catalog: {
    title: 'Card Catalog',
    subtitle: 'Add any card to your collection',
    search: 'Search cards…',
    filterAll: 'All rarities',
    filterCommon: 'Common',
    filterRare: 'Rare',
    filterEpic: 'Epic',
    sortName: 'Sort by name',
    sortValue: 'Sort by value',
    sortRarity: 'Sort by rarity',
  },
  collection: {
    title: 'Your Collection',
    emptyTitle: 'Your collection is empty',
    emptySubtitle: 'Add your first card from the catalog above to get started!',
    selectToTrade: 'Select cards to offer in a trade',
    escToClear: 'Esc to clear',
    offeringValue: 'Offering {value} value — expect ~1–2 new card(s)',
    addToCollection: '+ Add to Collection',
    clearSelection: 'Clear selection',
    tradeCards: 'Trade {count} card(s)',
    trading: 'Trading...',
  },
  stats: {
    progress: 'Collection progress',
    totalCards: 'Total: {count} cards',
    totalValue: 'Value: {value}',
    mostOwned: 'Most owned: {name} ×{qty}',
  },
  actions: {
    export: 'Export',
    exporting: 'Exporting…',
    import: 'Import',
    importing: 'Importing…',
    share: 'Share',
    copied: 'Copied!',
    dismiss: 'Dismiss',
    retry: 'Retry',
    undo: 'Undo',
  },
  achievements: {
    completeSet: 'Complete Set',
    firstTrade: 'First Trade',
  },
  tradeHistory: {
    title: 'Recent Trades',
  },
  leaderboard: {
    title: 'Leaderboard',
    subtitle: 'Top collectors by unique cards',
    you: 'You',
  },
  confirm: {
    importTitle: 'Import collection?',
    importMessage: 'This will add {count} card(s) to your collection. Continue?',
  },
} as const;

export type StringKey = keyof typeof strings;
