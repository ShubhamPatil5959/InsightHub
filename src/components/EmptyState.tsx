import { Box, Typography, Button } from "@mui/material";
import {
  Inbox as InboxIcon,
  Search as SearchIcon,
  PersonOff as PersonOffIcon,
  FolderOff as FolderOffIcon,
} from "@mui/icons-material";

type EmptyStateType = "default" | "search" | "users" | "data";

interface EmptyStateProps {
  type?: EmptyStateType;
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const iconMap: Record<EmptyStateType, React.ReactNode> = {
  default: <InboxIcon sx={{ fontSize: 64, color: "text.disabled" }} />,
  search: <SearchIcon sx={{ fontSize: 64, color: "text.disabled" }} />,
  users: <PersonOffIcon sx={{ fontSize: 64, color: "text.disabled" }} />,
  data: <FolderOffIcon sx={{ fontSize: 64, color: "text.disabled" }} />,
};

const defaultMessages: Record<EmptyStateType, { title: string; message: string }> = {
  default: {
    title: "No data available",
    message: "There's nothing to display here yet.",
  },
  search: {
    title: "No results found",
    message: "Try adjusting your search or filters to find what you're looking for.",
  },
  users: {
    title: "No users found",
    message: "Get started by adding your first user.",
  },
  data: {
    title: "No data available",
    message: "Data will appear here once available.",
  },
};

const EmptyState: React.FC<EmptyStateProps> = ({
  type = "default",
  title,
  message,
  actionLabel,
  onAction,
}) => {
  const displayTitle = title || defaultMessages[type].title;
  const displayMessage = message || defaultMessages[type].message;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 8,
        px: 3,
        textAlign: "center",
      }}
    >
      {iconMap[type]}
      <Typography variant="h6" fontWeight={600} sx={{ mt: 2, mb: 1 }}>
        {displayTitle}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400 }}>
        {displayMessage}
      </Typography>
      {actionLabel && onAction && (
        <Button variant="contained" onClick={onAction} sx={{ mt: 3 }}>
          {actionLabel}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;

