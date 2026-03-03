import { Card, CardContent, Typography, Box, Skeleton } from "@mui/material";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface AreaData {
  name: string;
  visitors: number;
  pageViews: number;
}

interface AreaChartComponentProps {
  title: string;
  data: AreaData[];
  isLoading?: boolean;
}

const AreaChartComponent: React.FC<AreaChartComponentProps> = ({ title, data, isLoading = false }) => {
  if (isLoading) {
    return (
      <Card sx={{ height: "100%" }}>
        <CardContent>
          <Skeleton variant="text" width={150} height={32} />
          <Skeleton variant="rectangular" height={300} sx={{ mt: 2, borderRadius: 1 }} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          {title}
        </Typography>
        <Box sx={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1976d2" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#1976d2" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPageViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9c27b0" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#9c27b0" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: 8 }} />
              <Area
                type="monotone"
                dataKey="visitors"
                stroke="#1976d2"
                fillOpacity={1}
                fill="url(#colorVisitors)"
              />
              <Area
                type="monotone"
                dataKey="pageViews"
                stroke="#9c27b0"
                fillOpacity={1}
                fill="url(#colorPageViews)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AreaChartComponent;

