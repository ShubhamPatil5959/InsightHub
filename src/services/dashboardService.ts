import { supabase } from "../lib";
import type { OrderRow, DashboardStatsRow } from "../lib/database.types";

// Dashboard types
export interface DashboardStats {
  totalRevenue: number;
  totalUsers: number;
  totalOrders: number;
  growthRate: number;
}

export interface RevenueData {
  month: string;
  revenue: number;
}

export interface SalesData {
  name: string;
  value: number;
  color: string;
}

export interface Order {
  id: string;
  customer: string;
  email: string;
  amount: number;
  status: "completed" | "pending" | "cancelled";
  date: string;
}

// Supabase API calls
export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    // Get stats from dashboard_stats table
    const { data: statsData } = await supabase
      .from("dashboard_stats")
      .select("*")
      .single();

    const stats = statsData as DashboardStatsRow | null;

    // Also get real counts from users and orders tables
    const { count: userCount } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });

    const { count: orderCount } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true });

    const { data: ordersData } = await supabase
      .from("orders")
      .select("amount")
      .eq("status", "completed");

    const orders = ordersData as Pick<OrderRow, "amount">[] | null;
    const totalRevenue =
      orders?.reduce((sum, order) => sum + Number(order.amount), 0) || 0;

    return {
      totalRevenue: totalRevenue || stats?.total_revenue || 0,
      totalUsers: userCount || stats?.total_users || 0,
      totalOrders: orderCount || stats?.total_orders || 0,
      growthRate: stats?.growth_rate || 12.5,
    };
  },

  getRevenueData: async (): Promise<RevenueData[]> => {
    // For demo, return mock revenue data (you can create a revenue_monthly table later)
    return [
      { month: "Jan", revenue: 12000 },
      { month: "Feb", revenue: 19000 },
      { month: "Mar", revenue: 15000 },
      { month: "Apr", revenue: 22000 },
      { month: "May", revenue: 28000 },
      { month: "Jun", revenue: 25000 },
      { month: "Jul", revenue: 32000 },
      { month: "Aug", revenue: 35000 },
      { month: "Sep", revenue: 30000 },
      { month: "Oct", revenue: 38000 },
      { month: "Nov", revenue: 42000 },
      { month: "Dec", revenue: 45000 },
    ];
  },

  getSalesData: async (): Promise<SalesData[]> => {
    // For demo, return mock sales data (you can create a sales_by_category table later)
    return [
      { name: "Electronics", value: 45000, color: "#1976d2" },
      { name: "Clothing", value: 28000, color: "#9c27b0" },
      { name: "Food", value: 18000, color: "#2e7d32" },
      { name: "Books", value: 12000, color: "#ed6c02" },
      { name: "Other", value: 8000, color: "#757575" },
    ];
  },

  getRecentOrders: async (): Promise<Order[]> => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) throw new Error(error.message);

    const orders = data as OrderRow[] | null;

    return (orders || []).map((order) => ({
      id: order.id.slice(0, 8).toUpperCase(),
      customer: order.customer,
      email: order.email,
      amount: Number(order.amount),
      status: order.status,
      date: new Date(order.date).toLocaleDateString(),
    }));
  },
};
