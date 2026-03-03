// Supabase database row types
export interface UserRow {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "user";
  status: "active" | "inactive";
  avatar_url: string | null;
  created_at: string;
}

export interface OrderRow {
  id: string;
  customer: string;
  email: string;
  amount: number;
  status: "pending" | "completed" | "cancelled";
  date: string;
  created_at: string;
}

export interface DashboardStatsRow {
  id: string;
  total_revenue: number;
  total_users: number;
  total_orders: number;
  growth_rate: number;
  updated_at: string;
}

// Generic Database type for Supabase client
export interface Database {
  public: {
    Tables: {
      users: {
        Row: UserRow;
        Insert: Partial<UserRow> & { name: string; email: string };
        Update: Partial<UserRow>;
      };
      orders: {
        Row: OrderRow;
        Insert: Partial<OrderRow> & {
          customer: string;
          email: string;
          amount: number;
        };
        Update: Partial<OrderRow>;
      };
      dashboard_stats: {
        Row: DashboardStatsRow;
        Insert: Partial<DashboardStatsRow>;
        Update: Partial<DashboardStatsRow>;
      };
    };
  };
}
