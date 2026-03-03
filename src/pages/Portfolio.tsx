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
  TextField,
  Autocomplete,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  TrendingUp,
  TrendingDown,
  Add as AddIcon,
  AccountBalanceWallet,
} from "@mui/icons-material";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useAppSelector, useAppDispatch } from "@/store";
import { addHolding, removeHolding } from "@/features";
import { INDIAN_STOCKS, stockService, type StockQuote } from "@/services/stockService";

const COLORS = ["#2196f3", "#4caf50", "#ff9800", "#f44336", "#9c27b0", "#00bcd4", "#795548", "#607d8b"];

const Portfolio = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const holdings = useAppSelector((state) => state.portfolio.holdings);
  const [quotes, setQuotes] = useState<Map<string, StockQuote>>(new Map());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState<(typeof INDIAN_STOCKS)[0] | null>(null);
  const [quantity, setQuantity] = useState("");
  const [avgPrice, setAvgPrice] = useState("");

  useEffect(() => {
    const fetchQuotes = async () => {
      const allQuotes = await stockService.getAllQuotes();
      const quotesMap = new Map<string, StockQuote>();
      allQuotes.forEach((q) => quotesMap.set(q.symbol, q));
      setQuotes(quotesMap);
    };
    fetchQuotes();
  }, [holdings]);

  const handleAddHolding = () => {
    if (selectedStock && quantity && avgPrice) {
      dispatch(addHolding({
        symbol: selectedStock.symbol,
        name: selectedStock.name,
        sector: selectedStock.sector,
        quantity: parseInt(quantity),
        avgPrice: parseFloat(avgPrice),
      }));
      setDialogOpen(false);
      setSelectedStock(null);
      setQuantity("");
      setAvgPrice("");
    }
  };

  // Calculate portfolio stats
  const totalInvested = holdings.reduce((sum, h) => sum + h.avgPrice * h.quantity, 0);
  const currentValue = holdings.reduce((sum, h) => {
    const quote = quotes.get(h.symbol);
    return sum + (quote?.price || h.avgPrice) * h.quantity;
  }, 0);
  const totalPnL = currentValue - totalInvested;
  const totalPnLPercent = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;

  // Sector allocation data for pie chart
  const sectorData = holdings.reduce((acc, h) => {
    const quote = quotes.get(h.symbol);
    const value = (quote?.price || h.avgPrice) * h.quantity;
    const existing = acc.find((s) => s.name === h.sector);
    if (existing) existing.value += value;
    else acc.push({ name: h.sector, value });
    return acc;
  }, [] as { name: string; value: number }[]);

  const availableStocks = INDIAN_STOCKS.filter(
    (stock) => !holdings.some((h) => h.symbol === stock.symbol)
  );

  return (
    <Box sx={{ maxWidth: 1400, mx: "auto" }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={4} flexWrap="wrap" gap={2}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            My Portfolio
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track your investments and monitor your returns
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
          sx={{ px: 3, py: 1.5, fontWeight: 600 }}
        >
          Add Holding
        </Button>
      </Box>

      {/* Portfolio Summary Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ boxShadow: 2, height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography color="text.secondary" variant="body2" fontWeight={500} gutterBottom>
                Total Invested
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                ₹{totalInvested.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ boxShadow: 2, height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography color="text.secondary" variant="body2" fontWeight={500} gutterBottom>
                Current Value
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                ₹{currentValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              boxShadow: 2,
              height: "100%",
              bgcolor: totalPnL >= 0 ? "success.50" : "error.50",
              borderLeft: 4,
              borderColor: totalPnL >= 0 ? "success.main" : "error.main",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography color="text.secondary" variant="body2" fontWeight={500} gutterBottom>
                Total P&L
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                {totalPnL >= 0 ? <TrendingUp color="success" /> : <TrendingDown color="error" />}
                <Typography variant="h4" fontWeight="bold" color={totalPnL >= 0 ? "success.main" : "error.main"}>
                  {totalPnL >= 0 ? "+" : ""}₹{Math.abs(totalPnL).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              boxShadow: 2,
              height: "100%",
              bgcolor: totalPnLPercent >= 0 ? "success.50" : "error.50",
              borderLeft: 4,
              borderColor: totalPnLPercent >= 0 ? "success.main" : "error.main",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography color="text.secondary" variant="body2" fontWeight={500} gutterBottom>
                Returns
              </Typography>
              <Typography variant="h4" fontWeight="bold" color={totalPnLPercent >= 0 ? "success.main" : "error.main"}>
                {totalPnLPercent >= 0 ? "+" : ""}{totalPnLPercent.toFixed(2)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {holdings.length > 0 ? (
        <Grid container spacing={3}>
          {/* Holdings Table */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Card sx={{ boxShadow: 2 }}>
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
                  <Typography variant="h6" fontWeight="bold">
                    Holdings ({holdings.length})
                  </Typography>
                </Box>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: "action.hover" }}>
                        <TableCell sx={{ fontWeight: 700, py: 2 }}>Stock</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, py: 2 }}>Qty</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, py: 2 }}>Avg Price</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, py: 2 }}>LTP</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, py: 2 }}>P&L</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 700, py: 2 }}>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {holdings.map((h) => {
                        const quote = quotes.get(h.symbol);
                        const currentPrice = quote?.price || h.avgPrice;
                        const pnl = (currentPrice - h.avgPrice) * h.quantity;
                        const pnlPercent = ((currentPrice - h.avgPrice) / h.avgPrice) * 100;
                        return (
                          <TableRow
                            key={h.symbol}
                            hover
                            sx={{ cursor: "pointer", "&:hover": { bgcolor: "action.hover" } }}
                            onClick={() => navigate(`/company/${h.symbol}`)}
                          >
                            <TableCell sx={{ py: 2 }}>
                              <Typography fontWeight="bold" color="primary">{h.symbol}</Typography>
                              <Typography variant="caption" color="text.secondary">{h.name}</Typography>
                            </TableCell>
                            <TableCell align="right" sx={{ py: 2, fontWeight: 600 }}>{h.quantity}</TableCell>
                            <TableCell align="right" sx={{ py: 2 }}>₹{h.avgPrice.toFixed(2)}</TableCell>
                            <TableCell align="right" sx={{ py: 2, fontWeight: 600 }}>₹{currentPrice.toFixed(2)}</TableCell>
                            <TableCell align="right" sx={{ py: 2 }}>
                              <Typography color={pnl >= 0 ? "success.main" : "error.main"} fontWeight="600">
                                {pnl >= 0 ? "+" : ""}₹{pnl.toFixed(0)} ({pnlPercent.toFixed(1)}%)
                              </Typography>
                            </TableCell>
                            <TableCell align="center" sx={{ py: 2 }}>
                              <IconButton
                                color="error"
                                size="small"
                                onClick={(e) => { e.stopPropagation(); dispatch(removeHolding(h.symbol)); }}
                                sx={{ "&:hover": { bgcolor: "error.light", color: "white" } }}
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
              </CardContent>
            </Card>
          </Grid>

          {/* Sector Allocation Pie Chart */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ height: "100%", boxShadow: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" mb={3}>
                  Sector Allocation
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={sectorData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                      {sectorData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `₹${Number(value).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
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
              <AccountBalanceWallet sx={{ fontSize: 48, color: "primary.main" }} />
            </Box>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              No holdings yet
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 400, mx: "auto", mb: 3 }}>
              Start building your portfolio by adding stock holdings.
              Track your investments and monitor your P&L in real-time.
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setDialogOpen(true)}
              sx={{ px: 4, py: 1.5, fontWeight: 600 }}
            >
              Add Your First Holding
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Add Holding Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" fontWeight="bold">Add Stock Holding</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Enter the details of your stock purchase to track it in your portfolio.
          </Typography>
          <Box display="flex" flexDirection="column" gap={3}>
            <Autocomplete
              options={availableStocks}
              getOptionLabel={(option) => `${option.symbol} - ${option.name}`}
              value={selectedStock}
              onChange={(_, newValue) => setSelectedStock(newValue)}
              renderInput={(params) => <TextField {...params} label="Select Stock" placeholder="Search stock..." />}
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
            <TextField
              label="Quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter number of shares"
              inputProps={{ min: 1 }}
            />
            <TextField
              label="Average Buy Price (₹)"
              type="number"
              value={avgPrice}
              onChange={(e) => setAvgPrice(e.target.value)}
              placeholder="Enter average purchase price"
              inputProps={{ min: 0, step: 0.01 }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ px: 3 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAddHolding}
            disabled={!selectedStock || !quantity || !avgPrice}
            sx={{ px: 4, fontWeight: 600 }}
          >
            Add Holding
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Portfolio;

