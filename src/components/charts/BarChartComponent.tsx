import { Card, CardContent, Typography, Box, Skeleton } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface BarData {
  name: string;
  current: number;
  previous: number;
}

interface BarChartComponentProps {
  title: string;
  data: BarData[];
  isLoading?: boolean;
}

const BarChartComponent: React.FC<BarChartComponentProps> = ({ title, data, isLoading = false }) => {
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
            <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: 8 }} />
              <Legend />
              <Bar dataKey="current" name="This Year" fill="#1976d2" radius={[4, 4, 0, 0]} />
              <Bar dataKey="previous" name="Last Year" fill="#90caf9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BarChartComponent;

