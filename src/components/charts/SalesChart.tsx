import { Card, CardContent, Typography, Box, Skeleton } from "@mui/material";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface SalesData {
  name: string;
  value: number;
  color: string;
}

interface SalesChartProps {
  data: SalesData[];
  isLoading?: boolean;
}

const SalesChart: React.FC<SalesChartProps> = ({ data, isLoading = false }) => {
  if (isLoading) {
    return (
      <Card sx={{ height: "100%" }}>
        <CardContent>
          <Skeleton variant="text" width={150} height={32} />
          <Box display="flex" justifyContent="center" mt={2}>
            <Skeleton variant="circular" width={200} height={200} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Sales by Category
        </Typography>
        <Box sx={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`$${Number(value).toLocaleString()}`, "Sales"]}
                contentStyle={{ borderRadius: 8 }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SalesChart;

