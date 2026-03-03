import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  Autocomplete,
  Button,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  TrendingUp,
  TrendingDown,
  Add as AddIcon,
  BookmarkBorder,
} from "@mui/icons-material";
import { useAppSelector, useAppDispatch } from "@/store";
import { addToWatchlist, removeFromWatchlist } from "@/features";
import { INDIAN_STOCKS, stockService, type StockQuote } from "@/services/stockService";

const Watchlist = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const watchlistItems = useAppSelector((state) => state.watchlist.items);
  const [quotes, setQuotes] = useState<Map<string, StockQuote>>(new Map());
  const [selectedStock, setSelectedStock] = useState<(typeof INDIAN_STOCKS)[0] | null>(null);

  // Fetch quotes for watchlist items
  useEffect(() => {
    const fetchQuotes = async () => {
      const allQuotes = await stockService.getAllQuotes();
      const quotesMap = new Map<string, StockQuote>();
      allQuotes.forEach((q) => quotesMap.set(q.symbol, q));
      setQuotes(quotesMap);
    };
    fetchQuotes();
  }, [watchlistItems]);

  const handleAddStock = () => {
    if (selectedStock) {
      dispatch(addToWatchlist({
        symbol: selectedStock.symbol,
        name: selectedStock.name,
        sector: selectedStock.sector,
      }));
      setSelectedStock(null);
    }
  };

  const handleRemove = (symbol: string) => {
    dispatch(removeFromWatchlist(symbol));
  };

  const availableStocks = INDIAN_STOCKS.filter(
    (stock) => !watchlistItems.some((item) => item.symbol === stock.symbol)
  );

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          My Watchlist
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track your favorite stocks and monitor their performance
        </Typography>
      </Box>

      {/* Add Stock Section */}
      <Card sx={{ mb: 4, boxShadow: 2 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="subtitle1" fontWeight="600" mb={2}>
            Add Stock to Watchlist
          </Typography>
          <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
            <Autocomplete
              options={availableStocks}
              getOptionLabel={(option) => `${option.symbol} - ${option.name}`}
              value={selectedStock}
              onChange={(_, newValue) => setSelectedStock(newValue)}
              sx={{ flex: 1, minWidth: 300 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Search by stock symbol or company name..."
                  variant="outlined"
                />
              )}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <Box>
                    <Typography fontWeight="bold">{option.symbol}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {option.name} • {option.sector}
                    </Typography>
                  </Box>
                </Box>
              )}
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddStock}
              disabled={!selectedStock}
              sx={{ px: 4, py: 1.5, fontWeight: 600 }}
            >
              Add to Watchlist
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Watchlist Table */}
      {watchlistItems.length > 0 ? (
        <Card sx={{ boxShadow: 2 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "action.hover" }}>
                  <TableCell sx={{ fontWeight: 700, py: 2 }}>Symbol</TableCell>
                  <TableCell sx={{ fontWeight: 700, py: 2 }}>Company</TableCell>
                  <TableCell sx={{ fontWeight: 700, py: 2 }}>Sector</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, py: 2 }}>Price</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, py: 2 }}>Change</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, py: 2 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {watchlistItems.map((item) => {
                  const quote = quotes.get(item.symbol);
                  const isPositive = (quote?.change || 0) >= 0;
                  return (
                    <TableRow
                      key={item.symbol}
                      hover
                      sx={{
                        cursor: "pointer",
                        "&:hover": { bgcolor: "action.hover" },
                        transition: "background-color 0.2s",
                      }}
                      onClick={() => navigate(`/company/${item.symbol}`)}
                    >
                      <TableCell sx={{ py: 2 }}>
                        <Typography fontWeight="bold" color="primary">
                          {item.symbol}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>{item.name}</TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Chip
                          label={item.sector}
                          size="small"
                          variant="outlined"
                          sx={{ borderRadius: 1 }}
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ py: 2 }}>
                        <Typography fontWeight="600" fontSize="1rem">
                          ₹{quote?.price.toFixed(2) || "-"}
                        </Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ py: 2 }}>
                        <Box display="flex" alignItems="center" justifyContent="flex-end" gap={0.5}>
                          {isPositive ? (
                            <TrendingUp fontSize="small" color="success" />
                          ) : (
                            <TrendingDown fontSize="small" color="error" />
                          )}
                          <Typography
                            fontWeight="600"
                            color={isPositive ? "success.main" : "error.main"}
                          >
                            {isPositive ? "+" : ""}{quote?.changePercent.toFixed(2) || 0}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center" sx={{ py: 2 }}>
                        <IconButton
                          color="error"
                          size="small"
                          onClick={(e) => { e.stopPropagation(); handleRemove(item.symbol); }}
                          sx={{
                            "&:hover": { bgcolor: "error.light", color: "white" },
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      ) : (
        <Card
          sx={{
            boxShadow: 2,
            border: "2px dashed",
            borderColor: "divider",
            bgcolor: "background.default",
          }}
        >
          <CardContent sx={{ textAlign: "center", py: 8, px: 4 }}>
            <Box
              sx={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                bgcolor: "primary.light",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 3,
              }}
            >
              <BookmarkBorder sx={{ fontSize: 48, color: "primary.main" }} />
            </Box>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Your watchlist is empty
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 400, mx: "auto", mb: 3 }}>
              Start tracking stocks by searching and adding them using the search box above.
              Get real-time updates on your favorite companies.
            </Typography>
            <Chip
              label={`${availableStocks.length} stocks available`}
              color="primary"
              variant="outlined"
            />
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default Watchlist;

