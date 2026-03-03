import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  dashboardService,
  type DashboardStats,
  type RevenueData,
  type SalesData,
  type Order,
} from "../../services";

// State interface
interface DashboardState {
  stats: DashboardStats | null;
  revenueData: RevenueData[];
  salesData: SalesData[];
  recentOrders: Order[];
  loading: {
    stats: boolean;
    revenue: boolean;
    sales: boolean;
    orders: boolean;
  };
  error: string | null;
}

// Initial state
const initialState: DashboardState = {
  stats: null,
  revenueData: [],
  salesData: [],
  recentOrders: [],
  loading: {
    stats: false,
    revenue: false,
    sales: false,
    orders: false,
  },
  error: null,
};

// Async thunks
export const fetchStats = createAsyncThunk("dashboard/fetchStats", async () => {
  return await dashboardService.getStats();
});

export const fetchRevenueData = createAsyncThunk("dashboard/fetchRevenueData", async () => {
  return await dashboardService.getRevenueData();
});

export const fetchSalesData = createAsyncThunk("dashboard/fetchSalesData", async () => {
  return await dashboardService.getSalesData();
});

export const fetchRecentOrders = createAsyncThunk("dashboard/fetchRecentOrders", async () => {
  return await dashboardService.getRecentOrders();
});

// Dashboard slice
const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearDashboard: (state) => {
      state.stats = null;
      state.revenueData = [];
      state.salesData = [];
      state.recentOrders = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Stats
    builder
      .addCase(fetchStats.pending, (state) => {
        state.loading.stats = true;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.loading.stats = false;
        state.stats = action.payload;
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.loading.stats = false;
        state.error = action.error.message || "Failed to fetch stats";
      })
      // Revenue
      .addCase(fetchRevenueData.pending, (state) => {
        state.loading.revenue = true;
      })
      .addCase(fetchRevenueData.fulfilled, (state, action) => {
        state.loading.revenue = false;
        state.revenueData = action.payload;
      })
      .addCase(fetchRevenueData.rejected, (state, action) => {
        state.loading.revenue = false;
        state.error = action.error.message || "Failed to fetch revenue data";
      })
      // Sales
      .addCase(fetchSalesData.pending, (state) => {
        state.loading.sales = true;
      })
      .addCase(fetchSalesData.fulfilled, (state, action) => {
        state.loading.sales = false;
        state.salesData = action.payload;
      })
      .addCase(fetchSalesData.rejected, (state, action) => {
        state.loading.sales = false;
        state.error = action.error.message || "Failed to fetch sales data";
      })
      // Orders
      .addCase(fetchRecentOrders.pending, (state) => {
        state.loading.orders = true;
      })
      .addCase(fetchRecentOrders.fulfilled, (state, action) => {
        state.loading.orders = false;
        state.recentOrders = action.payload;
      })
      .addCase(fetchRecentOrders.rejected, (state, action) => {
        state.loading.orders = false;
        state.error = action.error.message || "Failed to fetch orders";
      });
  },
});

export const { clearDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;

