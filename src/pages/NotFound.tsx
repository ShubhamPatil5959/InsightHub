import { Box, Typography, Button, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Home, ArrowBack, SearchOff } from "@mui/icons-material";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "background.default",
        p: 3,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          textAlign: "center",
          p: 6,
          borderRadius: 4,
          maxWidth: 500,
          bgcolor: "background.paper",
        }}
      >
        {/* Icon */}
        <Box
          sx={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            bgcolor: "primary.light",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 3,
          }}
        >
          <SearchOff sx={{ fontSize: 60, color: "primary.main" }} />
        </Box>

        {/* 404 Text */}
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: 80, md: 120 },
            fontWeight: 800,
            color: "primary.main",
            lineHeight: 1,
          }}
        >
          404
        </Typography>

        <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mt: 2 }}>
          Oops! Page Not Found
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          The page you're looking for doesn't exist or has been moved.
        </Typography>

        {/* Action Buttons */}
        <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
          <Button
            variant="contained"
            startIcon={<Home />}
            onClick={() => navigate("/dashboard")}
          >
            Go to Dashboard
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default NotFound;

