import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OrderTrendsChartProps {
  monthlyTrends: Record<string, number>;
  className?: string;
}

const OrderTrendsChart: React.FC<OrderTrendsChartProps> = ({
  monthlyTrends,
  className = "",
}) => {
  if (!monthlyTrends || Object.keys(monthlyTrends).length === 0) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">No trend data available</p>
        </CardContent>
      </Card>
    );
  }

  // Convert to array and sort by month
  const trendData = Object.entries(monthlyTrends)
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => {
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return months.indexOf(a.month) - months.indexOf(b.month);
    });

  // Calculate trend direction
  const getTrendDirection = () => {
    if (trendData.length < 2) return "neutral";

    const recent = trendData
      .slice(-3)
      .reduce((sum, item) => sum + item.count, 0);
    const previous = trendData
      .slice(-6, -3)
      .reduce((sum, item) => sum + item.count, 0);

    if (recent > previous) return "up";
    if (recent < previous) return "down";
    return "neutral";
  };

  const trendDirection = getTrendDirection();

  const getTrendIcon = () => {
    switch (trendDirection) {
      case "up":
        return <TrendingUp className="h-5 w-5 text-green-600" />;
      case "down":
        return <TrendingDown className="h-5 w-5 text-red-600" />;
      default:
        return <Minus className="h-5 w-5 text-gray-600" />;
    }
  };

  const getTrendText = () => {
    switch (trendDirection) {
      case "up":
        return "Increasing";
      case "down":
        return "Decreasing";
      default:
        return "Stable";
    }
  };

  const getTrendColor = () => {
    switch (trendDirection) {
      case "up":
        return "text-green-600";
      case "down":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  // Find max value for scaling
  const maxCount = Math.max(...trendData.map((item) => item.count));

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getTrendIcon()}
          Order Trends
          <span className={`text-sm font-normal ${getTrendColor()}`}>
            ({getTrendText()})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Trend Summary */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">Trend Direction:</span>
            <span className={`text-sm font-medium ${getTrendColor()}`}>
              {getTrendText()}
            </span>
          </div>

          {/* Chart Bars */}
          <div className="space-y-3">
            {trendData.map(({ month, count }) => (
              <div key={month} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700">{month}</span>
                  <span className="text-gray-600">{count} orders</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-primary h-3 rounded-full transition-all duration-300"
                    style={{
                      width:
                        maxCount > 0 ? `${(count / maxCount) * 100}%` : "0%",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">
                {trendData.reduce((sum, item) => sum + item.count, 0)}
              </div>
              <div className="text-xs text-gray-600">Total Orders</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">
                {trendData.length > 0
                  ? (
                      trendData.reduce((sum, item) => sum + item.count, 0) /
                      trendData.length
                    ).toFixed(1)
                  : "0"}
              </div>
              <div className="text-xs text-gray-600">Avg per Month</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderTrendsChart;
