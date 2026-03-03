import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
} from "@mui/material";
import {
  PersonAdd as PersonAddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Login as LoginIcon,
  Settings as SettingsIcon,
  ShoppingCart as OrderIcon,
} from "@mui/icons-material";

interface Activity {
  id: string;
  type: "user_created" | "user_updated" | "user_deleted" | "login" | "settings" | "order";
  description: string;
  timestamp: string;
  user?: string;
}

const mockActivities: Activity[] = [
  { id: "1", type: "order", description: "New order #ORD001 received", timestamp: "5 min ago" },
  { id: "2", type: "user_created", description: "New user registered", user: "Alice Brown", timestamp: "15 min ago" },
  { id: "3", type: "login", description: "Admin logged in", user: "John Doe", timestamp: "1 hour ago" },
  { id: "4", type: "user_updated", description: "User profile updated", user: "Jane Smith", timestamp: "2 hours ago" },
  { id: "5", type: "settings", description: "System settings updated", timestamp: "3 hours ago" },
  { id: "6", type: "order", description: "Order #ORD002 completed", timestamp: "5 hours ago" },
  { id: "7", type: "user_deleted", description: "User account removed", user: "Bob Wilson", timestamp: "Yesterday" },
];

const activityIcons: Record<Activity["type"], React.ReactNode> = {
  user_created: <PersonAddIcon fontSize="small" />,
  user_updated: <EditIcon fontSize="small" />,
  user_deleted: <DeleteIcon fontSize="small" />,
  login: <LoginIcon fontSize="small" />,
  settings: <SettingsIcon fontSize="small" />,
  order: <OrderIcon fontSize="small" />,
};

const activityColors: Record<Activity["type"], string> = {
  user_created: "#4caf50",
  user_updated: "#2196f3",
  user_deleted: "#f44336",
  login: "#9c27b0",
  settings: "#ff9800",
  order: "#00bcd4",
};

const ActivityLog = () => {
  return (
    <Paper sx={{ p: 3, height: "100%" }}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Recent Activity
      </Typography>
      <List sx={{ py: 0 }}>
        {mockActivities.map((activity) => (
          <ListItem
            key={activity.id}
            sx={{
              px: 0,
              py: 1.5,
              borderBottom: "1px solid",
              borderColor: "divider",
              "&:last-child": { borderBottom: "none" },
            }}
          >
            <ListItemAvatar>
              <Avatar
                sx={{
                  bgcolor: activityColors[activity.type],
                  width: 36,
                  height: 36,
                }}
              >
                {activityIcons[activity.type]}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="body2" fontWeight={500}>
                    {activity.description}
                  </Typography>
                  {activity.user && (
                    <Chip
                      label={activity.user}
                      size="small"
                      variant="outlined"
                      sx={{ height: 20, fontSize: "0.7rem" }}
                    />
                  )}
                </Box>
              }
              secondary={activity.timestamp}
              secondaryTypographyProps={{ variant: "caption" }}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default ActivityLog;

