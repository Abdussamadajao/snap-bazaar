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
  ArrowLeft,
  Phone,
  Mail,
  CreditCard,
  FileText,
  Download,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatNGN } from "@/utils/currency";
import type { Order } from "@/types";
import CancelOrderModal from "./CancelOrderModal";
import RefundCanceledOrderModal from "./RefundCanceledOrderModal";

interface OrderDetailsProps {
  order: Order;
  onBack: () => void;
  onCancelOrder?: (orderId: string, reason?: string) => void;
  onRequestRefund?: (orderId: string, reason: string, items?: any[]) => void;
  onRefundCanceledOrder?: (orderId: string, reason: string) => void;
  onTrackOrder?: (orderId: string) => void;
  isLoading?: boolean;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({
  order,
  onBack,
  onCancelOrder,
  onRequestRefund,
  onRefundCanceledOrder,
  onTrackOrder,
  isLoading = false,
}) => {
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [refundModalOpen, setRefundModalOpen] = useState(false);

  const handleCancelClick = () => {
    setCancelModalOpen(true);
  };

  const handleCancelConfirm = (reason: string) => {
    if (onCancelOrder) {
      onCancelOrder(order.id, reason);
      setCancelModalOpen(false);
    }
  };

  const handleCancelClose = () => {
    setCancelModalOpen(false);
  };

  const handleRefundClick = () => {
    setRefundModalOpen(true);
  };

  const handleRefundConfirm = (reason: string) => {
    if (onRefundCanceledOrder) {
      onRefundCanceledOrder(order.id, reason);
      setRefundModalOpen(false);
    }
  };

  const handleRefundClose = () => {
    setRefundModalOpen(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case "shipped":
        return <Truck className="h-6 w-6 text-blue-600" />;
      case "processing":
      case "confirmed":
        return <Clock className="h-6 w-6 text-yellow-600" />;
      case "cancelled":
        return <XCircle className="h-6 w-6 text-red-600" />;
      default:
        return <Package className="h-6 w-6 text-gray-600" />;
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

  const getPaymentMethodIcon = (method: string) => {
    switch (method?.toUpperCase()) {
      case "CREDIT_CARD":
      case "DEBIT_CARD":
        return <CreditCard className="h-4 w-4" />;
      case "BANK_TRANSFER":
        return <FileText className="h-4 w-4" />;
      case "CASH_ON_DELIVERY":
        return <DollarSign className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  console.log(order);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4 p-0 h-auto font-normal text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Order #{order.orderNumber}
            </h1>
            <p className="text-gray-600 mt-1">
              Placed on{" "}
              {new Date(order.createdAt).toLocaleDateString("en-NG", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          <div className="text-right">
            <Badge
              className={`${getStatusColor(
                order.status
              )} border px-4 py-2 text-base`}
            >
              {getStatusText(order.status)}
            </Badge>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {formatNGN(order.total)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                Order Items ({order.orderItems.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.orderItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100"
                  >
                    {item.product.images && item.product.images.length > 0 && (
                      <img
                        src={item.product.images[0].url}
                        alt={item.product.images[0].alt || item.product.name}
                        className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {item.product.name}
                      </h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Quantity: {item.quantity}</span>
                        <span>Price: {formatNGN(item.unitPrice)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 text-lg">
                        {formatNGN(item.totalPrice)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Order Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Order Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-2 rounded-full">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Order Placed</p>
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString("en-NG", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                {order.status.toLowerCase() !== "cancelled" && (
                  <>
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Clock className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          Order Confirmed
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-NG",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </div>
                    </div>

                    {["shipped", "delivered"].includes(
                      order.status.toLowerCase()
                    ) && (
                      <div className="flex items-center gap-4">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <Truck className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            Order Shipped
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-NG",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    )}

                    {order.status.toLowerCase() === "delivered" && (
                      <div className="flex items-center gap-4">
                        <div className="bg-green-100 p-2 rounded-full">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            Order Delivered
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-NG",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {order.status.toLowerCase() === "cancelled" && (
                  <div className="flex items-center gap-4">
                    <div className="bg-red-100 p-2 rounded-full">
                      <XCircle className="h-5 w-5 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        Order Cancelled
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString("en-NG", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - 1/3 width */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
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
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-primary">{formatNGN(order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Address */}
          {order.shippingAddress && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600">
                    {order.shippingAddress.address1}
                  </p>
                  {order.shippingAddress.address2 && (
                    <p className="text-gray-600">
                      {order.shippingAddress.address2}
                    </p>
                  )}
                  <p className="text-gray-600">
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    {order.shippingAddress.postalCode}
                  </p>
                  <p className="text-gray-600">
                    {order.shippingAddress.country}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment Information */}
          {order.payments && order.payments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {order.payments.map((payment, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        {getPaymentMethodIcon(payment.method)}
                        <span className="text-sm text-gray-600">
                          {payment.method?.replace(/_/g, " ")}
                        </span>
                      </div>
                      <Badge
                        variant={
                          payment.status === "COMPLETED"
                            ? "default"
                            : "secondary"
                        }
                        className="text-xs text-white"
                      >
                        {payment.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => onTrackOrder?.(order.id)}
                >
                  <Truck className="h-4 w-4 mr-2" />
                  Track Order
                </Button>

                {canCancelOrder(order.status) && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleCancelClick}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancel Order
                  </Button>
                )}

                {canRequestRefund(order.status) && (
                  <Button
                    className="w-full bg-primary hover:bg-primary-foreground"
                    onClick={() => onRequestRefund?.(order.id, "Quality issue")}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Request Refund
                  </Button>
                )}

                {canRefundCanceledOrder(order) && (
                  <Button
                    className="w-full bg-primary hover:bg-primary-foreground"
                    onClick={handleRefundClick}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Get Refund
                  </Button>
                )}

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Invoice
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Cancel Order Modal */}
      <CancelOrderModal
        isOpen={cancelModalOpen}
        onClose={handleCancelClose}
        onConfirm={handleCancelConfirm}
        orderNumber={order.orderNumber}
        isLoading={isLoading}
      />

      {/* Refund Canceled Order Modal */}
      <RefundCanceledOrderModal
        isOpen={refundModalOpen}
        onClose={handleRefundClose}
        onConfirm={handleRefundConfirm}
        orderNumber={order.orderNumber}
        amount={order.total}
        isLoading={isLoading}
      />
    </div>
  );
};

export default OrderDetails;
