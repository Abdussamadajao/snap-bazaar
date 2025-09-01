import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { PATH } from "@/routes/paths";

import { useCancelOrder, useRequestRefund } from "@/api/hooks/orders";
import { useRefundCanceledOrder } from "@/api/hooks/payment";
import OrderDetails from "@/components/account/OrderDetails";
import type { Order } from "@/types";
import { useGetOrder } from "@/api/hooks/orders";

const OrderDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);

  // Fetch order data
  const { data: orderResponse, isLoading, error } = useGetOrder(id!);

  // Mutations
  const cancelOrderMutation = useCancelOrder();
  const requestRefundMutation = useRequestRefund();
  const refundCanceledOrderMutation = useRefundCanceledOrder();

  useEffect(() => {
    if (orderResponse?.order) {
      setOrder(orderResponse.order);
    }
  }, [orderResponse]);

  const handleBack = () => {
    navigate(PATH.account.orders);
  };

  const handleCancelOrder = async (orderId: string, reason?: string) => {
    try {
      await cancelOrderMutation.mutateAsync({
        orderId,
        reason,
      });
      toast.success("Order cancelled successfully!");
      // Refresh order data
      window.location.reload();
    } catch (error) {
      toast.error("Failed to cancel order");
      console.error("Error cancelling order:", error);
    }
  };

  const handleRequestRefund = async (
    orderId: string,
    reason: string,
    items?: any[]
  ) => {
    try {
      await requestRefundMutation.mutateAsync({
        orderId,
        reason,
        items,
      });
      toast.success("Refund request submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit refund request");
      console.error("Error requesting refund:", error);
    }
  };

  const handleRefundCanceledOrder = async (orderId: string, reason: string) => {
    try {
      await refundCanceledOrderMutation.mutateAsync({
        orderId,
        data: { reason },
      });
      toast.success(
        "Refund request submitted successfully! The refund will be processed through your original payment method."
      );
    } catch (error) {
      toast.error("Failed to submit refund request");
      console.error("Error requesting refund for canceled order:", error);
    }
  };

  const handleTrackOrder = (orderId: string) => {
    // TODO: Implement order tracking view
    toast.info("Order tracking coming soon!");
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <Loader2 className="h-16 w-16 text-secondary mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Loading order details...
            </h3>
            <p className="text-gray-600">
              Please wait while we fetch your order information
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Order not found
            </h3>
            <p className="text-gray-600 mb-6">
              {error?.message ||
                "The order you're looking for doesn't exist or you don't have permission to view it"}
            </p>
            <button
              onClick={handleBack}
              className="bg-primary hover:bg-primary-foreground text-white px-4 py-2 rounded-lg"
            >
              Back to Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <OrderDetails
          order={order}
          onBack={handleBack}
          onCancelOrder={handleCancelOrder}
          onRequestRefund={handleRequestRefund}
          onRefundCanceledOrder={handleRefundCanceledOrder}
          onTrackOrder={handleTrackOrder}
          isLoading={
            cancelOrderMutation.isPending ||
            requestRefundMutation.isPending ||
            refundCanceledOrderMutation.isPending
          }
        />
      </div>
    </div>
  );
};

export default OrderDetailsPage;
