import { useState } from "react";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  Eye,
  MapPin,
  XCircle,
  RefreshCw,
  Calendar,
  DollarSign,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { formatNGN } from "@/utils/currency";
import type { Order } from "@/types";
import CancelOrderModal from "./CancelOrderModal";
import RefundCanceledOrderModal from "./RefundCanceledOrderModal";
import OrderStats from "./OrderStats";

interface OrdersProps {
  orders: Order[];
  onCancelOrder?: (orderId: string, reason?: string) => void;
  onRequestRefund?: (orderId: string, reason: string, items?: any[]) => void;
  onRefundCanceledOrder?: (orderId: string, reason: string) => void;
  onViewOrder?: (orderId: string) => void;
  onTrackOrder?: (orderId: string) => void;
  isLoading?: boolean;
}

const Orders: React.FC<OrdersProps> = ({
  orders,
  onCancelOrder,
  onRequestRefund,
  onRefundCanceledOrder,
  onViewOrder,
  onTrackOrder,
  isLoading = false,
}) => {
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedOrderForCancel, setSelectedOrderForCancel] =
    useState<Order | null>(null);
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [selectedOrderForRefund, setSelectedOrderForRefund] =
    useState<Order | null>(null);

  const handleCancelClick = (order: Order) => {
    setSelectedOrderForCancel(order);
    setCancelModalOpen(true);
  };

  const handleCancelConfirm = (reason: string) => {
    if (selectedOrderForCancel && onCancelOrder) {
      onCancelOrder(selectedOrderForCancel.id, reason);
      setCancelModalOpen(false);
      setSelectedOrderForCancel(null);
    }
  };

  const handleCancelClose = () => {
    setCancelModalOpen(false);
    setSelectedOrderForCancel(null);
  };

  const handleRefundClick = (order: Order) => {
    setSelectedOrderForRefund(order);
    setRefundModalOpen(true);
  };

  const handleRefundConfirm = (reason: string) => {
    if (selectedOrderForRefund && onRefundCanceledOrder) {
      onRefundCanceledOrder(selectedOrderForRefund.id, reason);
      setRefundModalOpen(false);
      setSelectedOrderForRefund(null);
    }
  };

  const handleRefundClose = () => {
    setRefundModalOpen(false);
    setSelectedOrderForRefund(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "shipped":
        return <Truck className="h-5 w-5 text-blue-600" />;
      case "processing":
      case "confirmed":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Package className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "processing":
      case "confirmed":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "Delivered";
      case "shipped":
        return "Shipped";
      case "processing":
        return "Processing";
      case "confirmed":
        return "Confirmed";
      case "cancelled":
        return "Cancelled";
      case "refunded":
        return "Refunded";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const canCancelOrder = (status: string) => {
    return ["pending", "confirmed"].includes(status.toLowerCase());
  };

  const canRequestRefund = (status: string) => {
    return status.toLowerCase() === "delivered";
  };

  const canRefundCanceledOrder = (order: Order) => {
    return (
      order.status.toLowerCase() === "cancelled" &&
      order.payments &&
      order.payments.some(
        (payment) =>
          payment.method !== "CASH_ON_DELIVERY" &&
          payment.status === "COMPLETED"
      )
    );
  };

  if (orders.length === 0) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-center py-16">
        <div className="bg-primary p-6 rounded-full mb-6">
          <Package className="h-20 w-20 text-white" />
        </div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-3">
          No orders found
        </h3>
        <p className="text-gray-600 mb-8 max-w-md">
          You haven't placed any orders yet. Start shopping to see your order
          history here.
        </p>
        <Button className="bg-primary hover:bg-primary-foreground px-8 py-3 text-base">
          Start Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Simple Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-primary p-3 rounded-lg">
            <ShoppingBag className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-600 mt-1">
              Track your orders and view order history
            </p>
          </div>
        </div>
      </div>

      {/* Order Statistics */}
      <OrderStats orders={orders} className="mb-8" />

      {/* Orders Accordion */}
      <Accordion type="multiple" className="space-y-4">
        {orders.map((order) => (
          <AccordionItem
            key={order.id}
            value={`order-${order.id}`}
            className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <AccordionTrigger className="px-6 py-4 hover:no-underline bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center justify-between w-full pr-4">
                <div className="flex items-center gap-4">
                  <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                    {getStatusIcon(order.status)}
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        #{order.orderNumber}
                      </h3>
                      <Badge
                        className={`${getStatusColor(
                          order.status
                        )} border px-3 py-1`}
                      >
                        {getStatusText(order.status)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-NG",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        <span className="font-semibold text-gray-900">
                          {formatNGN(order.total)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent className="px-6 pb-6">
              {/* Quick Order Summary */}
              <div className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      Delivery Address
                    </h4>
                    {order.shippingAddress ? (
                      <div className="text-sm text-gray-700 space-y-1">
                        <p>{order.shippingAddress.address1}</p>
                        {order.shippingAddress.address2 && (
                          <p>{order.shippingAddress.address2}</p>
                        )}
                        <p>
                          {order.shippingAddress.city},{" "}
                          {order.shippingAddress.state}{" "}
                          {order.shippingAddress.postalCode}
                        </p>
                        <p>{order.shippingAddress.country}</p>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">
                        No address provided
                      </p>
                    )}
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-gray-600" />
                      Order Summary
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-medium">
                          {formatNGN(order.subtotal)}
                        </span>
                      </div>
                      {order.taxAmount > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tax:</span>
                          <span className="font-medium">
                            {formatNGN(order.taxAmount)}
                          </span>
                        </div>
                      )}
                      {order.shippingAmount > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Shipping:</span>
                          <span className="font-medium">
                            {formatNGN(order.shippingAmount)}
                          </span>
                        </div>
                      )}
                      {order.discountAmount > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Discount:</span>
                          <span className="font-medium text-green-600">
                            -{formatNGN(order.discountAmount)}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between font-semibold text-lg border-t border-gray-200 pt-2 mt-2">
                        <span>Total:</span>
                        <span className="text-primary">
                          {formatNGN(order.total)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  className="flex-1 min-w-[140px]"
                  onClick={() => onViewOrder?.(order.id)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Full Details
                </Button>

                <Button
                  variant="outline"
                  className="flex-1 min-w-[140px]"
                  onClick={() => onTrackOrder?.(order.id)}
                >
                  <Truck className="h-4 w-4 mr-2" />
                  Track Order
                </Button>

                {canCancelOrder(order.status) && (
                  <Button
                    variant="outline"
                    className="flex-1 min-w-[140px]"
                    onClick={() => handleCancelClick(order)}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancel Order
                  </Button>
                )}

                {canRequestRefund(order.status) && (
                  <Button
                    className="flex-1 min-w-[140px] bg-primary hover:bg-primary-foreground"
                    onClick={() => onRequestRefund?.(order.id, "Quality issue")}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Request Refund
                  </Button>
                )}

                {canRefundCanceledOrder(order) && (
                  <Button
                    className="flex-1 min-w-[140px] bg-primary hover:bg-primary-foreground"
                    onClick={() => handleRefundClick(order)}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Get Refund
                  </Button>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Cancel Order Modal */}
      {selectedOrderForCancel && (
        <CancelOrderModal
          isOpen={cancelModalOpen}
          onClose={handleCancelClose}
          onConfirm={handleCancelConfirm}
          orderNumber={selectedOrderForCancel.orderNumber}
          isLoading={isLoading}
        />
      )}

      {/* Refund Canceled Order Modal */}
      {selectedOrderForRefund && (
        <RefundCanceledOrderModal
          isOpen={refundModalOpen}
          onClose={handleRefundClose}
          onConfirm={handleRefundConfirm}
          orderNumber={selectedOrderForRefund.orderNumber}
          amount={selectedOrderForRefund.total}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default Orders;
