import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Chip,
  Avatar,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Search as SearchIcon,
  TrendingUp,
  TrendingDown,
  TrendingFlat,
} from "@mui/icons-material";
import {
  INDIAN_STOCKS,
  stockService,
  type StockQuote,
} from "@/services/stockService";
import { economicService, type MarketIndex } from "@/services/economicService";

const MarketOverview = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [stocks, setStocks] = useState<StockQuote[]>([]);
  const [marketIndices, setMarketIndices] = useState<MarketIndex[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [stocksData, indicesData] = await Promise.all([
          stockService.getAllQuotes(),
          economicService.getMarketIndices(),
        ]);
        setStocks(stocksData);
        setMarketIndices(indicesData);
      } catch (err) {
        setError("Failed to load market data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredStocks = stockService.searchStocks(searchQuery, stocks);

  const handleCompanyClick = (symbol: string) => {
    navigate(`/company/${encodeURIComponent(symbol)}`);
  };

  const getStockInfo = (symbol: string) =>
    INDIAN_STOCKS.find((s) => s.symbol === symbol);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        🇮🇳 Indian Market Overview
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        Live market indices and top 50 companies
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {/* Market Indices */}
      <Grid container spacing={2} mb={4}>
        {marketIndices.map((index) => (
          <Grid size={{ xs: 6, sm: 3 }} key={index.name}>
            <Card
              sx={{
                bgcolor: index.change >= 0 ? "success.dark" : "error.dark",
                color: "white",
              }}
            >
              <CardContent>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  {index.name}
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {index.value.toLocaleString("en-IN")}
                </Typography>
                <Box display="flex" alignItems="center" gap={0.5}>
                  {index.change >= 0 ? (
                    <TrendingUp fontSize="small" />
                  ) : (
                    <TrendingDown fontSize="small" />
                  )}
                  <Typography variant="body2">
                    {index.change >= 0 ? "+" : ""}
                    {index.changePercent.toFixed(2)}%
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Search */}
      <TextField
        fullWidth
        placeholder="Search companies by name, symbol, or sector..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      {/* Company Cards */}
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Select a Company to View Insights ({filteredStocks.length})
      </Typography>

      <Grid container spacing={2}>
        {filteredStocks.map((stock) => {
          const info = getStockInfo(stock.symbol);
          return (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={stock.symbol}>
              <Card
                onClick={() => handleCompanyClick(stock.symbol)}
                sx={{
                  cursor: "pointer",
                  transition: "all 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Avatar sx={{ bgcolor: "primary.main", fontSize: "1.2rem" }}>
                      {info?.logo || "📊"}
                    </Avatar>
                    <Box flex={1}>
                      <Typography variant="subtitle2" fontWeight="bold" noWrap>
                        {stock.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {stock.symbol.replace(".BSE", "")}
                      </Typography>
                    </Box>
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" fontWeight="bold">
                      ₹{stock.price.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                    </Typography>
                    <Chip
                      size="small"
                      icon={
                        stock.change > 0 ? (
                          <TrendingUp fontSize="small" />
                        ) : stock.change < 0 ? (
                          <TrendingDown fontSize="small" />
                        ) : (
                          <TrendingFlat fontSize="small" />
                        )
                      }
                      label={`${stock.change >= 0 ? "+" : ""}${stock.changePercent.toFixed(2)}%`}
                      color={stock.change >= 0 ? "success" : "error"}
                      sx={{ fontWeight: "bold" }}
                    />
                  </Box>
                  <Chip label={stock.sector} size="small" variant="outlined" sx={{ mt: 1 }} />
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {filteredStocks.length === 0 && (
        <Box textAlign="center" py={6}>
          <Typography variant="h6" color="text.secondary">
            No companies found matching "{searchQuery}"
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default MarketOverview;

