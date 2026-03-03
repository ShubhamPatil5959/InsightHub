import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface WatchlistItem {
  symbol: string;
  name: string;
  sector: string;
  addedAt: string;
}

export interface WatchlistState {
  items: WatchlistItem[];
}

// Load from localStorage
const loadWatchlist = (): WatchlistItem[] => {
  const saved = localStorage.getItem("watchlist");
  return saved ? JSON.parse(saved) : [];
};

const initialState: WatchlistState = {
  items: loadWatchlist(),
};

const watchlistSlice = createSlice({
  name: "watchlist",
  initialState,
  reducers: {
    addToWatchlist: (state, action: PayloadAction<Omit<WatchlistItem, "addedAt">>) => {
      const exists = state.items.some((item) => item.symbol === action.payload.symbol);
      if (!exists) {
        state.items.push({
          ...action.payload,
          addedAt: new Date().toISOString(),
        });
        localStorage.setItem("watchlist", JSON.stringify(state.items));
      }
    },
    removeFromWatchlist: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.symbol !== action.payload);
      localStorage.setItem("watchlist", JSON.stringify(state.items));
    },
    clearWatchlist: (state) => {
      state.items = [];
      localStorage.removeItem("watchlist");
    },
  },
});

export const { addToWatchlist, removeFromWatchlist, clearWatchlist } = watchlistSlice.actions;
export default watchlistSlice.reducer;

