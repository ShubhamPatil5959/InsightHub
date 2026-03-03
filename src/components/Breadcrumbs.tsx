import { Breadcrumbs as MuiBreadcrumbs, Link, Typography, Box } from "@mui/material";
import { NavigateNext, Home } from "@mui/icons-material";
import { useLocation, Link as RouterLink } from "react-router-dom";

const routeLabels: Record<string, string> = {
  dashboard: "Dashboard",
  users: "Users",
  analytics: "Analytics",
  settings: "Settings",
};

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Don't show breadcrumbs on login page
  if (location.pathname === "/login") {
    return null;
  }

  return (
    <Box sx={{ mb: 2 }}>
      <MuiBreadcrumbs
        separator={<NavigateNext fontSize="small" />}
        aria-label="breadcrumb"
      >
        <Link
          component={RouterLink}
          to="/dashboard"
          underline="hover"
          color="inherit"
          sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
        >
          <Home fontSize="small" />
          Home
        </Link>
        {pathnames.map((value, index) => {
          const isLast = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          const label = routeLabels[value] || value.charAt(0).toUpperCase() + value.slice(1);

          return isLast ? (
            <Typography key={to} color="text.primary" fontWeight={500}>
              {label}
            </Typography>
          ) : (
            <Link
              key={to}
              component={RouterLink}
              to={to}
              underline="hover"
              color="inherit"
            >
              {label}
            </Link>
          );
        })}
      </MuiBreadcrumbs>
    </Box>
  );
};

export default Breadcrumbs;

