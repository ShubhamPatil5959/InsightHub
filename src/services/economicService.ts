// Economic Indicators for India
// Data based on RBI and Government of India statistics

export interface EconomicIndicator {
  name: string;
  value: string;
  change: number;
  trend: "up" | "down" | "stable";
  description: string;
  lastUpdated: string;
}

export interface GDPData {
  quarter: string;
  gdp: number;
  growth: number;
}

export interface InflationData {
  month: string;
  cpi: number;
  wpi: number;
}

export interface MarketIndex {
  name: string;
  value: number;
  change: number;
  changePercent: number;
}

export const economicService = {
  // Get key economic indicators
  getIndicators: async (): Promise<EconomicIndicator[]> => {
    // Based on latest RBI and Government data (March 2026)
    return [
      {
        name: "GDP Growth Rate",
        value: "6.8%",
        change: 0.3,
        trend: "up",
        description: "Year-on-Year GDP Growth",
        lastUpdated: "Q3 FY26",
      },
      {
        name: "Inflation (CPI)",
        value: "4.85%",
        change: -0.2,
        trend: "down",
        description: "Consumer Price Index",
        lastUpdated: "Feb 2026",
      },
      {
        name: "Repo Rate",
        value: "6.50%",
        change: 0,
        trend: "stable",
        description: "RBI Policy Rate",
        lastUpdated: "Mar 2026",
      },
      {
        name: "Unemployment",
        value: "7.2%",
        change: -0.3,
        trend: "down",
        description: "Urban Unemployment Rate",
        lastUpdated: "Feb 2026",
      },
      {
        name: "FII Investment",
        value: "₹12,450 Cr",
        change: 2100,
        trend: "up",
        description: "Foreign Institutional Investment (MTD)",
        lastUpdated: "Mar 2026",
      },
      {
        name: "USD/INR",
        value: "₹83.25",
        change: -0.15,
        trend: "down",
        description: "Exchange Rate",
        lastUpdated: "Live",
      },
    ];
  },

  // Get GDP historical data
  getGDPData: async (): Promise<GDPData[]> => {
    return [
      { quarter: "Q1 FY24", gdp: 41.8, growth: 7.8 },
      { quarter: "Q2 FY24", gdp: 42.5, growth: 7.6 },
      { quarter: "Q3 FY24", gdp: 43.2, growth: 8.4 },
      { quarter: "Q4 FY24", gdp: 44.1, growth: 7.8 },
      { quarter: "Q1 FY25", gdp: 45.2, growth: 6.7 },
      { quarter: "Q2 FY25", gdp: 46.0, growth: 5.4 },
      { quarter: "Q3 FY25", gdp: 47.1, growth: 6.2 },
      { quarter: "Q4 FY25", gdp: 48.0, growth: 6.5 },
      { quarter: "Q1 FY26", gdp: 49.2, growth: 6.9 },
      { quarter: "Q2 FY26", gdp: 50.1, growth: 7.1 },
      { quarter: "Q3 FY26", gdp: 51.0, growth: 6.8 },
    ];
  },

  // Get inflation data
  getInflationData: async (): Promise<InflationData[]> => {
    return [
      { month: "Apr", cpi: 4.83, wpi: 1.26 },
      { month: "May", cpi: 4.75, wpi: 1.52 },
      { month: "Jun", cpi: 5.08, wpi: 2.04 },
      { month: "Jul", cpi: 3.54, wpi: 1.82 },
      { month: "Aug", cpi: 3.65, wpi: 1.31 },
      { month: "Sep", cpi: 5.49, wpi: 1.84 },
      { month: "Oct", cpi: 6.21, wpi: 2.36 },
      { month: "Nov", cpi: 5.48, wpi: 1.89 },
      { month: "Dec", cpi: 5.22, wpi: 2.37 },
      { month: "Jan", cpi: 4.56, wpi: 2.31 },
      { month: "Feb", cpi: 4.85, wpi: 2.05 },
    ];
  },

  // Get market indices - returns MOCK data to save API calls
  // Real API is only used for individual company details
  getMarketIndices: async (): Promise<MarketIndex[]> => {
    // Return mock data for overview page to conserve API calls (800/day limit)
    return [
      { name: "NIFTY 50", value: 22456.8, change: 268.45, changePercent: 1.21 },
      { name: "SENSEX", value: 73892.15, change: 812.3, changePercent: 1.11 },
      {
        name: "NIFTY Bank",
        value: 48234.5,
        change: -156.2,
        changePercent: -0.32,
      },
      { name: "NIFTY IT", value: 38567.25, change: 423.8, changePercent: 1.11 },
    ];
  },

  // Get sector performance
  getSectorPerformance: async () => {
    return [
      { sector: "IT", change: 2.4, color: "#2196f3" },
      { sector: "Banking", change: 1.8, color: "#4caf50" },
      { sector: "Pharma", change: 0.9, color: "#9c27b0" },
      { sector: "Auto", change: -0.5, color: "#f44336" },
      { sector: "FMCG", change: 1.2, color: "#ff9800" },
      { sector: "Energy", change: 3.1, color: "#00bcd4" },
    ];
  },
};
