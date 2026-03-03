import { Card, CardContent, Box, Typography, Skeleton } from "@mui/material";
import { TrendingUp, TrendingDown } from "@mui/icons-material";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  color?: string;
  isLoading?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendLabel = "vs last month",
  color = "primary.main",
  isLoading = false,
}) => {
  const isPositive = trend && trend > 0;

  if (isLoading) {
    return (
      <Card sx={{ height: "100%" }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box flex={1}>
              <Skeleton variant="text" width={100} height={24} />
              <Skeleton variant="text" width={80} height={40} sx={{ my: 1 }} />
              <Skeleton variant="text" width={120} height={20} />
            </Box>
            <Skeleton variant="circular" width={48} height={48} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={700} sx={{ my: 1 }}>
              {value}
            </Typography>
            {trend !== undefined && (
              <Box display="flex" alignItems="center" gap={0.5}>
                {isPositive ? (
                  <TrendingUp sx={{ fontSize: 18, color: "success.main" }} />
                ) : (
                  <TrendingDown sx={{ fontSize: 18, color: "error.main" }} />
                )}
                <Typography
                  variant="body2"
                  color={isPositive ? "success.main" : "error.main"}
                  fontWeight={600}
                >
                  {isPositive ? "+" : ""}
                  {trend}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {trendLabel}
                </Typography>
              </Box>
            )}
          </Box>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: `${color}15`,
              color: color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatsCard;

