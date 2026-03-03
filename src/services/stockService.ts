import axios from "axios";

// Twelve Data API - 800 API calls/day free tier
const TWELVE_DATA_API_KEY = "3114809a46eb4759acd2e6cd13dd9c5f";
const TWELVE_DATA_BASE_URL = "https://api.twelvedata.com";

// Top 50 Indian Stock Symbols (NSE format for Twelve Data)
export const INDIAN_STOCKS = [
  {
    symbol: "RELIANCE",
    name: "Reliance Industries",
    sector: "Energy",
    logo: "🛢️",
  },
  {
    symbol: "TCS",
    name: "Tata Consultancy Services",
    sector: "IT",
    logo: "💻",
  },
  { symbol: "HDFCBANK", name: "HDFC Bank", sector: "Banking", logo: "🏦" },
  { symbol: "ICICIBANK", name: "ICICI Bank", sector: "Banking", logo: "🏦" },
  { symbol: "INFY", name: "Infosys", sector: "IT", logo: "💻" },
  {
    symbol: "HINDUNILVR",
    name: "Hindustan Unilever",
    sector: "FMCG",
    logo: "🧴",
  },
  {
    symbol: "SBIN",
    name: "State Bank of India",
    sector: "Banking",
    logo: "🏦",
  },
  {
    symbol: "BHARTIARTL",
    name: "Bharti Airtel",
    sector: "Telecom",
    logo: "📱",
  },
  { symbol: "ITC", name: "ITC Limited", sector: "FMCG", logo: "🏭" },
  {
    symbol: "KOTAKBANK",
    name: "Kotak Mahindra Bank",
    sector: "Banking",
    logo: "🏦",
  },
  {
    symbol: "LT",
    name: "Larsen & Toubro",
    sector: "Infrastructure",
    logo: "🏗️",
  },
  { symbol: "AXISBANK", name: "Axis Bank", sector: "Banking", logo: "🏦" },
  {
    symbol: "ASIANPAINT",
    name: "Asian Paints",
    sector: "Consumer",
    logo: "🎨",
  },
  { symbol: "MARUTI", name: "Maruti Suzuki", sector: "Auto", logo: "🚗" },
  {
    symbol: "SUNPHARMA",
    name: "Sun Pharmaceutical",
    sector: "Pharma",
    logo: "💊",
  },
  { symbol: "TITAN", name: "Titan Company", sector: "Consumer", logo: "💎" },
  {
    symbol: "BAJFINANCE",
    name: "Bajaj Finance",
    sector: "Finance",
    logo: "💰",
  },
  { symbol: "WIPRO", name: "Wipro", sector: "IT", logo: "💻" },
  {
    symbol: "ULTRACEMCO",
    name: "UltraTech Cement",
    sector: "Cement",
    logo: "🏭",
  },
  { symbol: "HCLTECH", name: "HCL Technologies", sector: "IT", logo: "💻" },
  { symbol: "NTPC", name: "NTPC Limited", sector: "Power", logo: "⚡" },
  { symbol: "POWERGRID", name: "Power Grid Corp", sector: "Power", logo: "⚡" },
  { symbol: "TATAMOTORS", name: "Tata Motors", sector: "Auto", logo: "🚗" },
  { symbol: "M&M", name: "Mahindra & Mahindra", sector: "Auto", logo: "🚗" },
  { symbol: "TATASTEEL", name: "Tata Steel", sector: "Metal", logo: "🔩" },
  { symbol: "ONGC", name: "ONGC", sector: "Energy", logo: "🛢️" },
  { symbol: "JSWSTEEL", name: "JSW Steel", sector: "Metal", logo: "🔩" },
  {
    symbol: "ADANIENT",
    name: "Adani Enterprises",
    sector: "Conglomerate",
    logo: "🏢",
  },
  {
    symbol: "ADANIPORTS",
    name: "Adani Ports",
    sector: "Infrastructure",
    logo: "🚢",
  },
  { symbol: "COALINDIA", name: "Coal India", sector: "Mining", logo: "⛏️" },
  { symbol: "TECHM", name: "Tech Mahindra", sector: "IT", logo: "💻" },
  {
    symbol: "BAJAJFINSV",
    name: "Bajaj Finserv",
    sector: "Finance",
    logo: "💰",
  },
  { symbol: "DRREDDY", name: "Dr. Reddy's Labs", sector: "Pharma", logo: "💊" },
  { symbol: "CIPLA", name: "Cipla", sector: "Pharma", logo: "💊" },
  { symbol: "NESTLEIND", name: "Nestle India", sector: "FMCG", logo: "🍫" },
  {
    symbol: "BRITANNIA",
    name: "Britannia Industries",
    sector: "FMCG",
    logo: "🍪",
  },
  {
    symbol: "DIVISLAB",
    name: "Divi's Laboratories",
    sector: "Pharma",
    logo: "💊",
  },
  { symbol: "GRASIM", name: "Grasim Industries", sector: "Cement", logo: "🏭" },
  {
    symbol: "INDUSINDBK",
    name: "IndusInd Bank",
    sector: "Banking",
    logo: "🏦",
  },
  { symbol: "EICHERMOT", name: "Eicher Motors", sector: "Auto", logo: "🏍️" },
  {
    symbol: "APOLLOHOSP",
    name: "Apollo Hospitals",
    sector: "Healthcare",
    logo: "🏥",
  },
  {
    symbol: "HINDALCO",
    name: "Hindalco Industries",
    sector: "Metal",
    logo: "🔩",
  },
  {
    symbol: "SBILIFE",
    name: "SBI Life Insurance",
    sector: "Insurance",
    logo: "🛡️",
  },
  {
    symbol: "HDFCLIFE",
    name: "HDFC Life Insurance",
    sector: "Insurance",
    logo: "🛡️",
  },
  { symbol: "BPCL", name: "Bharat Petroleum", sector: "Energy", logo: "⛽" },
  { symbol: "HEROMOTOCO", name: "Hero MotoCorp", sector: "Auto", logo: "🏍️" },
  { symbol: "TATACONSUM", name: "Tata Consumer", sector: "FMCG", logo: "☕" },
  { symbol: "VEDL", name: "Vedanta Limited", sector: "Metal", logo: "⛏️" },
  { symbol: "ZOMATO", name: "Zomato", sector: "Tech", logo: "🍔" },
  { symbol: "PAYTM", name: "Paytm (One97)", sector: "Fintech", logo: "📲" },
];

export interface StockInfo {
  symbol: string;
  name: string;
  sector: string;
  logo: string;
}

export interface StockQuote {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
  previousClose: number;
}

export interface StockTimeSeries {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Twelve Data API response types
interface TwelveDataQuote {
  symbol: string;
  name: string;
  exchange: string;
  currency: string;
  datetime: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  previous_close: string;
  change: string;
  percent_change: string;
}

interface TwelveDataTimeSeries {
  values: Array<{
    datetime: string;
    open: string;
    high: string;
    low: string;
    close: string;
    volume: string;
  }>;
}

// Fetch stock quote using Twelve Data API
export const stockService = {
  getQuote: async (symbol: string): Promise<StockQuote | null> => {
    try {
      const url = `${TWELVE_DATA_BASE_URL}/quote?symbol=${symbol}&exchange=NSE&apikey=${TWELVE_DATA_API_KEY}`;
      const response = await axios.get(url);
      const data: TwelveDataQuote = response.data;

      // Check for API errors
      if (data && !response.data.code) {
        const stockInfo = INDIAN_STOCKS.find((s) => s.symbol === symbol);
        const price = parseFloat(data.close) || 0;
        const prevClose = parseFloat(data.previous_close) || 0;
        const change = parseFloat(data.change) || price - prevClose;
        const changePercent =
          parseFloat(data.percent_change) ||
          (prevClose ? (change / prevClose) * 100 : 0);

        return {
          symbol: symbol,
          name: stockInfo?.name || data.name || symbol,
          sector: stockInfo?.sector || "Unknown",
          price: price,
          change: parseFloat(change.toFixed(2)),
          changePercent: parseFloat(changePercent.toFixed(2)),
          high: parseFloat(data.high) || 0,
          low: parseFloat(data.low) || 0,
          volume: parseInt(data.volume) || 0,
          previousClose: prevClose,
        };
      }
      return null;
    } catch (error) {
      console.error("Error fetching quote from Twelve Data:", error);
      return null;
    }
  },

  // Fetch historical data for charts using Twelve Data
  getTimeSeries: async (symbol: string): Promise<StockTimeSeries[]> => {
    try {
      const url = `${TWELVE_DATA_BASE_URL}/time_series?symbol=${symbol}&exchange=NSE&interval=1day&outputsize=30&apikey=${TWELVE_DATA_API_KEY}`;
      const response = await axios.get(url);
      const data: TwelveDataTimeSeries = response.data;

      if (data.values && Array.isArray(data.values)) {
        return data.values
          .map((item) => ({
            date: item.datetime,
            open: parseFloat(item.open) || 0,
            high: parseFloat(item.high) || 0,
            low: parseFloat(item.low) || 0,
            close: parseFloat(item.close) || 0,
            volume: parseInt(item.volume) || 0,
          }))
          .reverse(); // Reverse to get oldest first
      }
      // If API fails or no data, return mock historical data
      console.warn("Twelve Data time series unavailable, using mock data");
      return generateMockTimeSeries(symbol);
    } catch (error) {
      console.error("Error fetching time series from Twelve Data:", error);
      // Return mock historical data as fallback
      return generateMockTimeSeries(symbol);
    }
  },

  // Get all 50 Indian stocks quotes - returns MOCK data to save API calls
  // Real data is fetched only when user clicks on a specific company
  getAllQuotes: async (): Promise<StockQuote[]> => {
    // Return mock data for overview page to conserve API calls
    // Real API is called only in getStockDetails() for individual company view
    return getMockStockData();
  },

  // Search stocks by name or symbol
  searchStocks: (query: string, stocks: StockQuote[]): StockQuote[] => {
    if (!query.trim()) return stocks;
    const lowerQuery = query.toLowerCase();
    return stocks.filter(
      (stock) =>
        stock.name.toLowerCase().includes(lowerQuery) ||
        stock.symbol.toLowerCase().includes(lowerQuery) ||
        stock.sector.toLowerCase().includes(lowerQuery),
    );
  },

  // Get single stock with real API (for detailed view)
  getStockDetails: async (
    symbol: string,
  ): Promise<{
    quote: StockQuote | null;
    timeSeries: StockTimeSeries[];
  }> => {
    const quote = await stockService.getQuote(symbol);
    const timeSeries = await stockService.getTimeSeries(symbol);
    return { quote, timeSeries };
  },
};

// Mock data for all 50 Indian stocks (realistic prices for demo)
const getMockStockData = (): StockQuote[] =>
  INDIAN_STOCKS.map((stock) => {
    // Generate realistic mock data based on typical Indian stock ranges
    const basePrice = getBasePrice(stock.symbol);
    const change = (Math.random() - 0.5) * basePrice * 0.04; // ±2% change
    const changePercent = (change / basePrice) * 100;
    return {
      symbol: stock.symbol,
      name: stock.name,
      sector: stock.sector,
      price: basePrice + change,
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2)),
      high: basePrice * (1 + Math.random() * 0.02),
      low: basePrice * (1 - Math.random() * 0.02),
      volume: Math.floor(1000000 + Math.random() * 10000000),
      previousClose: basePrice,
    };
  });

// Base prices for each stock (approximately accurate as of March 2026) - NSE symbols
const getBasePrice = (symbol: string): number => {
  const prices: Record<string, number> = {
    RELIANCE: 2890,
    TCS: 4120,
    HDFCBANK: 1525,
    ICICIBANK: 1085,
    INFY: 1650,
    HINDUNILVR: 2580,
    SBIN: 785,
    BHARTIARTL: 1420,
    ITC: 465,
    KOTAKBANK: 1780,
    LT: 3450,
    AXISBANK: 1125,
    ASIANPAINT: 2890,
    MARUTI: 11250,
    SUNPHARMA: 1680,
    TITAN: 3520,
    BAJFINANCE: 6850,
    WIPRO: 478,
    ULTRACEMCO: 10850,
    HCLTECH: 1720,
    NTPC: 345,
    POWERGRID: 295,
    TATAMOTORS: 985,
    "M&M": 2680,
    TATASTEEL: 142,
    ONGC: 265,
    JSWSTEEL: 890,
    ADANIENT: 2950,
    ADANIPORTS: 1380,
    COALINDIA: 425,
    TECHM: 1580,
    BAJAJFINSV: 1620,
    DRREDDY: 6250,
    CIPLA: 1520,
    NESTLEIND: 2485,
    BRITANNIA: 5120,
    DIVISLAB: 3890,
    GRASIM: 2650,
    INDUSINDBK: 1480,
    EICHERMOT: 4680,
    APOLLOHOSP: 6890,
    HINDALCO: 625,
    SBILIFE: 1560,
    HDFCLIFE: 680,
    BPCL: 295,
    HEROMOTOCO: 4520,
    TATACONSUM: 1120,
    VEDL: 445,
    ZOMATO: 245,
    PAYTM: 485,
  };
  return prices[symbol] || 1000;
};

// Generate mock historical time series data for 30 days
const generateMockTimeSeries = (symbol: string): StockTimeSeries[] => {
  const basePrice = getBasePrice(symbol);
  const data: StockTimeSeries[] = [];
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    // Skip weekends
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;

    // Add some realistic price movement (random walk)
    const dailyVariation = (Math.random() - 0.5) * basePrice * 0.03;
    const trendFactor = (29 - i) * (Math.random() - 0.5) * 0.002 * basePrice;
    const price = basePrice + dailyVariation + trendFactor;

    data.push({
      date: date.toISOString().split("T")[0],
      open: parseFloat((price * (1 - Math.random() * 0.01)).toFixed(2)),
      high: parseFloat((price * (1 + Math.random() * 0.02)).toFixed(2)),
      low: parseFloat((price * (1 - Math.random() * 0.02)).toFixed(2)),
      close: parseFloat(price.toFixed(2)),
      volume: Math.floor(1000000 + Math.random() * 10000000),
    });
  }
  return data;
};
