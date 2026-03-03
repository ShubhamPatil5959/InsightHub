import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  Avatar,
} from "@mui/material";
import { ArrowBack, TrendingUp, TrendingDown } from "@mui/icons-material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  INDIAN_STOCKS,
  stockService,
  type StockQuote,
  type StockTimeSeries,
} from "@/services/stockService";

// Mock financial data for companies
const getCompanyFinancials = (_symbol: string) => {
  const baseRevenue = Math.floor(Math.random() * 50000 + 10000);
  return {
    marketCap: `₹${(Math.random() * 15 + 2).toFixed(2)} Lakh Cr`,
    peRatio: (Math.random() * 40 + 10).toFixed(2),
    eps: `₹${(Math.random() * 200 + 20).toFixed(2)}`,
    dividendYield: `${(Math.random() * 3).toFixed(2)}%`,
    week52High: `₹${(Math.random() * 1000 + 500).toFixed(2)}`,
    week52Low: `₹${(Math.random() * 400 + 100).toFixed(2)}`,
    quarterlyResults: [
      { quarter: "Q1 FY25", revenue: baseRevenue, profit: baseRevenue * 0.12 },
      { quarter: "Q2 FY25", revenue: baseRevenue * 1.08, profit: baseRevenue * 0.14 },
      { quarter: "Q3 FY25", revenue: baseRevenue * 1.12, profit: baseRevenue * 0.15 },
      { quarter: "Q4 FY25", revenue: baseRevenue * 1.18, profit: baseRevenue * 0.16 },
      { quarter: "Q1 FY26", revenue: baseRevenue * 1.22, profit: baseRevenue * 0.17 },
    ],
  };
};

const CompanyInsights = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [timeSeries, setTimeSeries] = useState<StockTimeSeries[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const decodedSymbol = symbol ? decodeURIComponent(symbol) : "";
  const stockInfo = INDIAN_STOCKS.find((s) => s.symbol === decodedSymbol);
  const financials = getCompanyFinancials(decodedSymbol);

  useEffect(() => {
    const fetchData = async () => {
      if (!decodedSymbol) return;
      try {
        setLoading(true);
        setError(null);
        const { quote: q, timeSeries: ts } = await stockService.getStockDetails(decodedSymbol);
        if (q) {
          setQuote(q);
          setTimeSeries(ts);
        } else {
          // Use mock data if API fails
          const allStocks = await stockService.getAllQuotes();
          const mockQuote = allStocks.find((s) => s.symbol === decodedSymbol);
          if (mockQuote) setQuote(mockQuote);
        }
      } catch (err) {
        console.error(err);
        setError("Using cached data - Live API limit reached");
        const allStocks = await stockService.getAllQuotes();
        const mockQuote = allStocks.find((s) => s.symbol === decodedSymbol);
        if (mockQuote) setQuote(mockQuote);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [decodedSymbol]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!quote && !stockInfo) {
    return (
      <Box textAlign="center" py={6}>
        <Typography variant="h5" color="error">Company not found</Typography>
        <Button onClick={() => navigate("/market")} startIcon={<ArrowBack />} sx={{ mt: 2 }}>
          Back to Market
        </Button>
      </Box>
    );
  }

  const isPositive = (quote?.change || 0) >= 0;

  return (
    <Box>
      {/* Back Button & Header */}
      <Button onClick={() => navigate("/market")} startIcon={<ArrowBack />} sx={{ mb: 2 }}>
        Back to Market
      </Button>

      {error && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>}

      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Avatar sx={{ width: 56, height: 56, fontSize: "2rem", bgcolor: "primary.main" }}>
          {stockInfo?.logo || "📊"}
        </Avatar>
        <Box>
          <Typography variant="h4" fontWeight="bold">{stockInfo?.name || quote?.name}</Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="body1" color="text.secondary">
              {decodedSymbol} • {stockInfo?.sector}
            </Typography>
            <Chip label="NSE" size="small" color="primary" variant="outlined" />
          </Box>
        </Box>
      </Box>

      {/* Price Card */}
      <Card sx={{ mb: 3, bgcolor: isPositive ? "success.dark" : "error.dark", color: "white" }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="h3" fontWeight="bold">
                ₹{quote?.price.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                {isPositive ? <TrendingUp /> : <TrendingDown />}
                <Typography variant="h6">
                  {isPositive ? "+" : ""}{quote?.change.toFixed(2)} ({quote?.changePercent.toFixed(2)}%)
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, md: 2 }}>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>Day High</Typography>
              <Typography variant="h6">₹{quote?.high.toLocaleString("en-IN")}</Typography>
            </Grid>
            <Grid size={{ xs: 6, md: 2 }}>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>Day Low</Typography>
              <Typography variant="h6">₹{quote?.low.toLocaleString("en-IN")}</Typography>
            </Grid>
            <Grid size={{ xs: 6, md: 2 }}>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>Volume</Typography>
              <Typography variant="h6">{(quote?.volume || 0).toLocaleString("en-IN")}</Typography>
            </Grid>
            <Grid size={{ xs: 6, md: 2 }}>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>Prev Close</Typography>
              <Typography variant="h6">₹{quote?.previousClose.toLocaleString("en-IN")}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <Typography variant="h6" fontWeight="bold" mb={2}>Key Metrics</Typography>
      <Grid container spacing={2} mb={3}>
        {[
          { label: "Market Cap", value: financials.marketCap },
          { label: "P/E Ratio", value: financials.peRatio },
          { label: "EPS", value: financials.eps },
          { label: "Dividend Yield", value: financials.dividendYield },
          { label: "52 Week High", value: financials.week52High },
          { label: "52 Week Low", value: financials.week52Low },
        ].map((metric) => (
          <Grid size={{ xs: 6, sm: 4, md: 2 }} key={metric.label}>
            <Card>
              <CardContent sx={{ textAlign: "center", py: 2 }}>
                <Typography variant="caption" color="text.secondary">{metric.label}</Typography>
                <Typography variant="h6" fontWeight="bold">{metric.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Price Chart */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={2}>Price History (30 Days)</Typography>
              {timeSeries.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={timeSeries}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(v) => v.slice(5)} />
                    <YAxis domain={["auto", "auto"]} />
                    <Tooltip formatter={(value) => [`₹${Number(value).toFixed(2)}`, "Price"]} />
                    <Line type="monotone" dataKey="close" stroke="#2196f3" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <Box height={300} display="flex" alignItems="center" justifyContent="center">
                  <Typography color="text.secondary">Historical data unavailable (API limit)</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Quarterly Results */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={2}>Quarterly Results (₹ Cr)</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={financials.quarterlyResults}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="quarter" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#2196f3" name="Revenue" />
                  <Bar dataKey="profit" fill="#4caf50" name="Profit" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CompanyInsights;

