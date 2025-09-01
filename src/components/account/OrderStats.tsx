import React from "react";
import { Package, CheckCircle, XCircle, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatNGN } from "@/utils/currency";
import type { Order } from "@/types";

interface OrderStatsProps {
  className?: string;
  orders: Order[];
}

const OrderStats: React.FC<OrderStatsProps> = ({ className = "", orders }) => {
  // Calculate statistics from orders data
  const totalOrders = orders.length;
  const deliveredOrders = orders.filter(
    (order) => order.status.toLowerCase() === "delivered"
  ).length;
  const cancelledOrders = orders.filter(
    (order) => order.status.toLowerCase() === "cancelled"
  ).length;

  const totalSpent = orders.reduce((sum, order) => {
    // Try to get the total value, handling different data types
    let orderTotal = order.total;

    // Handle undefined, null, or invalid values
    if (
      orderTotal === undefined ||
      orderTotal === null ||
      isNaN(Number(orderTotal))
    ) {
      return sum;
    }

    // Convert to number if it's a string
    const numericTotal =
      typeof orderTotal === "string"
        ? parseFloat(orderTotal)
        : Number(orderTotal);
    return sum + numericTotal;
  }, 0);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Show message if no orders */}
      {totalOrders === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Orders Found
          </h3>
          <p className="text-gray-600">You haven't placed any orders yet.</p>
        </div>
      )}

      {/* Main Stats Cards */}
      {totalOrders > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Delivery Confirmed Orders */}
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Delivery Confirmed</p>
                  <p className="text-2xl font-bold text-green-600">
                    {deliveredOrders}
                  </p>
                  <p className="text-xs text-gray-500">
                    Successfully delivered
                  </p>
                </div>
                <div className="bg-green-500/10 p-3 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Total Orders */}
          <Card className="border-l-4 border-l-primary">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalOrders}
                  </p>
                  <p className="text-xs text-gray-500">All time</p>
                </div>
                <div className="bg-primary/10 p-3 rounded-full">
                  <Package className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Total Spent */}
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {totalSpent > 0 ? formatNGN(totalSpent) : "₦0"}
                  </p>
                  <p className="text-xs text-gray-500">All time</p>
                </div>
                <div className="bg-blue-500/10 p-3 rounded-full">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Canceled Orders */}
          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Canceled Orders</p>
                  <p className="text-2xl font-bold text-red-600">
                    {cancelledOrders}
                  </p>
                  <p className="text-xs text-gray-500">Cancelled</p>
                </div>
                <div className="bg-red-500/10 p-3 rounded-full">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Summary Stats
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {totalOrders}
              </div>
              <p className="text-sm text-gray-600">Total Orders Placed</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {totalSpent > 0 ? formatNGN(totalSpent) : "₦0"}
              </div>
              <p className="text-sm text-gray-600">Total Amount Spent</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {completionRate.toFixed(1)}%
              </div>
              <p className="text-sm text-gray-600">Order Completion Rate</p>
            </div>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
};

export default OrderStats;
