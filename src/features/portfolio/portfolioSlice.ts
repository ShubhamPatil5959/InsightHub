import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface PortfolioHolding {
  symbol: string;
  name: string;
  sector: string;
  quantity: number;
  avgPrice: number;
  addedAt: string;
}

export interface PortfolioState {
  holdings: PortfolioHolding[];
}

// Load from localStorage
const loadPortfolio = (): PortfolioHolding[] => {
  const saved = localStorage.getItem("portfolio");
  return saved ? JSON.parse(saved) : [];
};

const initialState: PortfolioState = {
  holdings: loadPortfolio(),
};

const portfolioSlice = createSlice({
  name: "portfolio",
  initialState,
  reducers: {
    addHolding: (state, action: PayloadAction<Omit<PortfolioHolding, "addedAt">>) => {
      const existingIndex = state.holdings.findIndex(
        (h) => h.symbol === action.payload.symbol
      );
      if (existingIndex >= 0) {
        // Update existing holding (average the price)
        const existing = state.holdings[existingIndex];
        const totalQty = existing.quantity + action.payload.quantity;
        const avgPrice =
          (existing.avgPrice * existing.quantity +
            action.payload.avgPrice * action.payload.quantity) /
          totalQty;
        state.holdings[existingIndex] = {
          ...existing,
          quantity: totalQty,
          avgPrice: parseFloat(avgPrice.toFixed(2)),
        };
      } else {
        state.holdings.push({
          ...action.payload,
          addedAt: new Date().toISOString(),
        });
      }
      localStorage.setItem("portfolio", JSON.stringify(state.holdings));
    },
    removeHolding: (state, action: PayloadAction<string>) => {
      state.holdings = state.holdings.filter((h) => h.symbol !== action.payload);
      localStorage.setItem("portfolio", JSON.stringify(state.holdings));
    },
    updateHolding: (
      state,
      action: PayloadAction<{ symbol: string; quantity: number; avgPrice: number }>
    ) => {
      const index = state.holdings.findIndex((h) => h.symbol === action.payload.symbol);
      if (index >= 0) {
        state.holdings[index].quantity = action.payload.quantity;
        state.holdings[index].avgPrice = action.payload.avgPrice;
        localStorage.setItem("portfolio", JSON.stringify(state.holdings));
      }
    },
    clearPortfolio: (state) => {
      state.holdings = [];
      localStorage.removeItem("portfolio");
    },
  },
});

export const { addHolding, removeHolding, updateHolding, clearPortfolio } =
  portfolioSlice.actions;
export default portfolioSlice.reducer;

