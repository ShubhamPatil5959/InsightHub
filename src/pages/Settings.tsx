import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Avatar,
  Button,
  Alert,
} from "@mui/material";
import {
  DarkMode,
  LightMode,
  Notifications,
  Language,
  AccountCircle,
  Security,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useThemeContext } from "@/theme";
import { useAppSelector, useAppDispatch } from "@/store";
import { clearWatchlist, clearPortfolio } from "@/features";

const Settings = () => {
  const { mode, toggleTheme } = useThemeContext();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const watchlistCount = useAppSelector((state) => state.watchlist.items.length);
  const portfolioCount = useAppSelector((state) => state.portfolio.holdings.length);

  const handleClearData = () => {
    if (window.confirm("Are you sure you want to clear all your data? This action cannot be undone.")) {
      dispatch(clearWatchlist());
      dispatch(clearPortfolio());
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto" }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your account preferences and application settings
        </Typography>
      </Box>

      {/* User Profile Card */}
      <Card sx={{ mb: 3, boxShadow: 2 }}>
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" gap={3}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: "primary.main",
                fontSize: 32,
                fontWeight: "bold",
              }}
            >
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {user?.name || "User"}
              </Typography>
              <Typography color="text.secondary" variant="body1">
                {user?.email}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Appearance Settings */}
      <Card sx={{ mb: 3, boxShadow: 2 }}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ p: 3, borderBottom: 1, borderColor: "divider" }}>
            <Typography variant="h6" fontWeight="bold">
              Appearance
            </Typography>
          </Box>
          <List disablePadding>
            <ListItem sx={{ py: 2, px: 3 }}>
              <ListItemIcon>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    bgcolor: mode === "dark" ? "grey.800" : "warning.100",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {mode === "dark" ? <DarkMode color="primary" /> : <LightMode sx={{ color: "warning.main" }} />}
                </Box>
              </ListItemIcon>
              <ListItemText
                primary={<Typography fontWeight={600}>Dark Mode</Typography>}
                secondary={mode === "dark" ? "Switch to light theme" : "Switch to dark theme"}
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={mode === "dark"}
                  onChange={toggleTheme}
                  color="primary"
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card sx={{ mb: 3, boxShadow: 2 }}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ p: 3, borderBottom: 1, borderColor: "divider" }}>
            <Typography variant="h6" fontWeight="bold">
              Preferences
            </Typography>
          </Box>
          <List disablePadding>
            <ListItem sx={{ py: 2, px: 3 }}>
              <ListItemIcon>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    bgcolor: "info.100",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Notifications sx={{ color: "info.main" }} />
                </Box>
              </ListItemIcon>
              <ListItemText
                primary={<Typography fontWeight={600}>Price Alerts</Typography>}
                secondary="Get notified when stocks hit target prices"
              />
              <ListItemSecondaryAction>
                <Switch defaultChecked color="primary" />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
            <ListItem sx={{ py: 2, px: 3 }}>
              <ListItemIcon>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    bgcolor: "secondary.100",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Language sx={{ color: "secondary.main" }} />
                </Box>
              </ListItemIcon>
              <ListItemText
                primary={<Typography fontWeight={600}>Language</Typography>}
                secondary="English (India)"
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Account Settings */}
      <Card sx={{ mb: 3, boxShadow: 2 }}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ p: 3, borderBottom: 1, borderColor: "divider" }}>
            <Typography variant="h6" fontWeight="bold">
              Account
            </Typography>
          </Box>
          <List disablePadding>
            <ListItem sx={{ py: 2, px: 3 }}>
              <ListItemIcon>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    bgcolor: "primary.100",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AccountCircle sx={{ color: "primary.main" }} />
                </Box>
              </ListItemIcon>
              <ListItemText
                primary={<Typography fontWeight={600}>Profile Information</Typography>}
                secondary="Update your personal details"
              />
            </ListItem>
            <Divider />
            <ListItem sx={{ py: 2, px: 3 }}>
              <ListItemIcon>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    bgcolor: "success.100",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Security sx={{ color: "success.main" }} />
                </Box>
              </ListItemIcon>
              <ListItemText
                primary={<Typography fontWeight={600}>Security</Typography>}
                secondary="Password and two-factor authentication"
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card sx={{ boxShadow: 2 }}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ p: 3, borderBottom: 1, borderColor: "divider" }}>
            <Typography variant="h6" fontWeight="bold">
              Data Management
            </Typography>
          </Box>
          <Box sx={{ p: 3 }}>
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                You have <strong>{watchlistCount}</strong> stocks in your watchlist and{" "}
                <strong>{portfolioCount}</strong> holdings in your portfolio.
              </Typography>
            </Alert>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleClearData}
              sx={{ fontWeight: 600 }}
            >
              Clear All Data
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Settings;

