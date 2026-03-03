import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  Search as SearchIcon,
  EmojiEvents,
} from "@mui/icons-material";
import { stockService, type StockQuote } from "@/services/stockService";

type FilterType = "all" | "gainers" | "losers";

const SECTORS = ["All Sectors", "IT", "Banking", "Pharma", "Auto", "FMCG", "Energy", "Financial Services", "Metals", "Telecom"];

const Screener = () => {
  const navigate = useNavigate();
  const [stocks, setStocks] = useState<StockQuote[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState("All Sectors");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStocks = async () => {
      setLoading(true);
      const data = await stockService.getAllQuotes();
      setStocks(data);
      setLoading(false);
    };
    fetchStocks();
  }, []);

  // Filter and sort stocks
  const filteredStocks = useMemo(() => {
    let result = [...stocks];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (s) => s.symbol.toLowerCase().includes(query) || s.name.toLowerCase().includes(query)
      );
    }

    // Apply sector filter
    if (selectedSector !== "All Sectors") {
      result = result.filter((s) => s.sector === selectedSector);
    }

    // Apply gainers/losers filter and sort
    if (filter === "gainers") {
      result = result.filter((s) => s.changePercent > 0).sort((a, b) => b.changePercent - a.changePercent);
    } else if (filter === "losers") {
      result = result.filter((s) => s.changePercent < 0).sort((a, b) => a.changePercent - b.changePercent);
    } else {
      result = result.sort((a, b) => b.changePercent - a.changePercent);
    }

    return result;
  }, [stocks, filter, searchQuery, selectedSector]);

  // Top 5 gainers and losers for cards
  const topGainers = useMemo(
    () => [...stocks].filter((s) => s.changePercent > 0).sort((a, b) => b.changePercent - a.changePercent).slice(0, 5),
    [stocks]
  );
  const topLosers = useMemo(
    () => [...stocks].filter((s) => s.changePercent < 0).sort((a, b) => a.changePercent - b.changePercent).slice(0, 5),
    [stocks]
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <Typography>Loading stocks...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1400, mx: "auto" }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Stock Screener
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Discover top performing stocks and filter by sector
        </Typography>
      </Box>

      {/* Top Gainers & Losers Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              boxShadow: 2,
              bgcolor: "success.50",
              borderLeft: 4,
              borderColor: "success.main",
              height: "100%",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" gap={1.5} mb={3}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    bgcolor: "success.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <EmojiEvents sx={{ color: "white", fontSize: 22 }} />
                </Box>
                <Typography variant="h6" fontWeight="bold" color="success.main">
                  Top 5 Gainers
                </Typography>
              </Box>
              {topGainers.map((stock, index) => (
                <Box
                  key={stock.symbol}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  py={1.5}
                  sx={{
                    cursor: "pointer",
                    "&:hover": { bgcolor: "success.100" },
                    borderRadius: 1,
                    px: 2,
                    transition: "background-color 0.2s",
                  }}
                  onClick={() => navigate(`/company/${stock.symbol}`)}
                >
                  <Box display="flex" alignItems="center" gap={2}>
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        bgcolor: "success.200",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {index + 1}
                    </Typography>
                    <Typography fontWeight="600">{stock.symbol}</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <TrendingUp fontSize="small" color="success" />
                    <Typography color="success.main" fontWeight="bold">
                      +{stock.changePercent.toFixed(2)}%
                    </Typography>
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              boxShadow: 2,
              bgcolor: "error.50",
              borderLeft: 4,
              borderColor: "error.main",
              height: "100%",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" gap={1.5} mb={3}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    bgcolor: "error.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <TrendingDown sx={{ color: "white", fontSize: 22 }} />
                </Box>
                <Typography variant="h6" fontWeight="bold" color="error.main">
                  Top 5 Losers
                </Typography>
              </Box>
              {topLosers.map((stock, index) => (
                <Box
                  key={stock.symbol}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  py={1.5}
                  sx={{
                    cursor: "pointer",
                    "&:hover": { bgcolor: "error.100" },
                    borderRadius: 1,
                    px: 2,
                    transition: "background-color 0.2s",
                  }}
                  onClick={() => navigate(`/company/${stock.symbol}`)}
                >
                  <Box display="flex" alignItems="center" gap={2}>
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        bgcolor: "error.200",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {index + 1}
                    </Typography>
                    <Typography fontWeight="600">{stock.symbol}</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <TrendingDown fontSize="small" color="error" />
                    <Typography color="error.main" fontWeight="bold">
                      {stock.changePercent.toFixed(2)}%
                    </Typography>
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 4, boxShadow: 2 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="subtitle1" fontWeight="600" mb={2}>
            Filter Stocks
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
            <TextField
              placeholder="Search by symbol or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ minWidth: 280, flex: 1 }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <FormControl sx={{ minWidth: 180 }}>
              <InputLabel>Sector</InputLabel>
              <Select
                value={selectedSector}
                label="Sector"
                onChange={(e) => setSelectedSector(e.target.value)}
              >
                {SECTORS.map((sector) => (
                  <MenuItem key={sector} value={sector}>{sector}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <ToggleButtonGroup
              value={filter}
              exclusive
              onChange={(_, newFilter) => newFilter && setFilter(newFilter)}
              sx={{ height: 56 }}
            >
              <ToggleButton value="all" sx={{ px: 3, fontWeight: 600 }}>All</ToggleButton>
              <ToggleButton value="gainers" color="success" sx={{ px: 3, fontWeight: 600 }}>Gainers</ToggleButton>
              <ToggleButton value="losers" color="error" sx={{ px: 3, fontWeight: 600 }}>Losers</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </CardContent>
      </Card>

      {/* Stocks Table */}
      <Card sx={{ boxShadow: 2 }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
          <Typography variant="h6" fontWeight="bold">
            All Stocks ({filteredStocks.length})
          </Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "action.hover" }}>
                <TableCell sx={{ fontWeight: 700, py: 2 }}>Symbol</TableCell>
                <TableCell sx={{ fontWeight: 700, py: 2 }}>Company</TableCell>
                <TableCell sx={{ fontWeight: 700, py: 2 }}>Sector</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, py: 2 }}>Price</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, py: 2 }}>Change</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, py: 2 }}>Volume</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStocks.map((stock) => {
                const isPositive = stock.changePercent >= 0;
                return (
                  <TableRow
                    key={stock.symbol}
                    hover
                    sx={{
                      cursor: "pointer",
                      "&:hover": { bgcolor: "action.hover" },
                      transition: "background-color 0.2s",
                    }}
                    onClick={() => navigate(`/company/${stock.symbol}`)}
                  >
                    <TableCell sx={{ py: 2 }}>
                      <Typography fontWeight="bold" color="primary">{stock.symbol}</Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>{stock.name}</TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Chip label={stock.sector} size="small" variant="outlined" sx={{ borderRadius: 1 }} />
                    </TableCell>
                    <TableCell align="right" sx={{ py: 2 }}>
                      <Typography fontWeight="600" fontSize="1rem">₹{stock.price.toFixed(2)}</Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ py: 2 }}>
                      <Box display="flex" alignItems="center" justifyContent="flex-end" gap={0.5}>
                        {isPositive ? (
                          <TrendingUp fontSize="small" color="success" />
                        ) : (
                          <TrendingDown fontSize="small" color="error" />
                        )}
                        <Typography color={isPositive ? "success.main" : "error.main"} fontWeight="600">
                          {isPositive ? "+" : ""}{stock.changePercent.toFixed(2)}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right" sx={{ py: 2 }}>
                      <Typography color="text.secondary" fontWeight={500}>
                        {(stock.volume / 1000000).toFixed(2)}M
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {filteredStocks.length === 0 && (
          <Box textAlign="center" py={6}>
            <SearchIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No stocks found
            </Typography>
            <Typography color="text.secondary">
              Try adjusting your search or filter criteria
            </Typography>
          </Box>
        )}
      </Card>
    </Box>
  );
};

export default Screener;
