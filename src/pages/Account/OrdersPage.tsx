import { useNavigate } from "react-router-dom";
import { Orders } from "@/components/account";
import { useOrders, useOrderMutations } from "@/api";
import { useRefundCanceledOrder } from "@/api/hooks/payment";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { PATH } from "@/routes/paths";

const OrdersPage = () => {
  const navigate = useNavigate();

  // Use real orders hooks
  const { data: ordersData, isLoading, error } = useOrders(1, 50); // Get first 50 orders
  const {
    cancelOrder,
    requestRefund,
    isLoading: mutationsLoading,
  } = useOrderMutations();

  const refundCanceledOrderMutation = useRefundCanceledOrder();

  const orders = ordersData?.orders || [];

  const handleCancelOrder = async (orderId: string, reason?: string) => {
    try {
      await cancelOrder({ orderId, reason });
    } catch (error) {
      toast.error("Failed to cancel order");
    }
  };

  const handleRequestRefund = async (
    orderId: string,
    reason: string,
    items?: any[]
  ) => {
    try {
      await requestRefund({ orderId, reason, items });
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

  const handleViewOrder = (orderId: string) => {
    navigate(PATH.account.orderDetails(orderId));
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
              Loading your orders...
            </h3>
            <p className="text-gray-600">
              Please wait while we fetch your order history
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="h-8 w-8 bg-red-600 rounded-full" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Failed to load orders
            </h3>
            <p className="text-gray-600 mb-6">
              {error.message ||
                "Something went wrong while loading your orders"}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary hover:bg-primary-foreground text-white px-4 py-2 rounded-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Orders
          orders={orders}
          onCancelOrder={handleCancelOrder}
          onRequestRefund={handleRequestRefund}
          onRefundCanceledOrder={handleRefundCanceledOrder}
          onViewOrder={handleViewOrder}
          onTrackOrder={handleTrackOrder}
          isLoading={mutationsLoading || refundCanceledOrderMutation.isPending}
        />
      </div>
    </div>
  );
};

export default OrdersPage;
