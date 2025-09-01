import React from "react";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import useCartStore from "@/store/cart";
import {
  useSelectedDeliveryTime,
  useDeliveryFee,
  useDeliveryInstructions,
  useTaxRate,
  useSelectedPaymentMethod,
  useCheckoutStore,
} from "@/store/checkout";
import {
  DeliveryAddress,
  OrderSummary,
  DeliveryTypeSelector,
} from "@/components/cart";
import PaymentMethodSelector from "@/components/cart/PaymentMethodSelector";
import {
  useCartMutations,
  useCreateOrder,
  useCreatePaymentIntent,
} from "@/api/hooks";
import { toast } from "sonner";
import { useAddressStore } from "@/store/address";
import { useNavigate } from "react-router-dom";
import { usePaymentStore } from "@/store/payment";
import { PATH } from "@/routes/paths";

const Cart: React.FC = () => {
  useScrollToTop();
  const navigate = useNavigate();
  const { items: cartItems, totalPrice } = useCartStore();
  const { clearCart } = useCartMutations();
  const { setPaymentId, setOrderId, setClientSecret, setPaymentIntentId } =
    usePaymentStore();
  const { selectedAddressId, setSelectedAddressId } = useAddressStore();

  const selectedDeliveryTime = useSelectedDeliveryTime();
  const deliveryFee = useDeliveryFee();
  const deliveryInstructions = useDeliveryInstructions();
  const taxRate = useTaxRate();
  const selectedPaymentMethod = useSelectedPaymentMethod();
  const { setPaymentMethod } = useCheckoutStore();

  const createOrderMutation = useCreateOrder();

  const createPaymentIntentMutation = useCreatePaymentIntent();

  const tax = totalPrice * taxRate;
  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error("Please select a delivery address");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const orderData = {
      items: cartItems,
      shippingAddressId: selectedAddressId,
      billingAddressId: selectedAddressId, // Use shipping address as billing for now
      deliveryTime: selectedDeliveryTime,
      shippingAmount: deliveryFee,
      taxAmount: tax,
      paymentMethod: selectedPaymentMethod,
      notes: `Order placed from cart${
        deliveryInstructions
          ? ` | Delivery Instructions: ${deliveryInstructions}`
          : ""
      }`,
    };

    // Use toast.promise for better UX
    toast.promise(
      (async () => {
        // Create order first
        const result = await createOrderMutation.mutateAsync(orderData);

        if (!result.order) {
          throw new Error("Failed to create order");
        }

        // Calculate total amount for payment intent
        const subtotal = cartItems.reduce(
          (total, item) =>
            total + parseFloat(item.product?.price || "0") * item.quantity,
          0
        );
        const totalAmount = subtotal + (deliveryFee || 0);

        // Ensure amount is properly formatted (2 decimal places)
        const formattedAmount = Math.round(totalAmount * 100) / 100;

        // Validate minimum amount for Stripe (₦1.00 minimum for practical processing)
        if (formattedAmount < 1.0) {
          throw new Error(
            "Order total must be at least ₦1.00 to proceed with payment processing"
          );
        }

        // Additional validation: check if any individual item has a very low price
        const lowPriceItems = cartItems.filter((item) => {
          const itemPrice = parseFloat(item.product?.price || "0");
          return itemPrice < 1.0;
        });

        if (lowPriceItems.length > 0) {
          toast.error("Warning: Some items have very low prices");
        }

        // Handle payment method-specific logic
        if (selectedPaymentMethod === "CASH_ON_DELIVERY") {
          // For COD, no payment intent needed - redirect directly to success
          clearCart();

          navigate(PATH.payment.success, {
            state: {
              order: result.order,
              paymentMethod: "CASH_ON_DELIVERY",
              amount: formattedAmount,
            },
          });

          return { order: result.order, paymentMethod: "CASH_ON_DELIVERY" };
        } else {
          // For Stripe payment, create payment intent
          const paymentIntentResult =
            await createPaymentIntentMutation.mutateAsync({
              orderId: result.order.id,
              amount: formattedAmount,
              currency: "ngn",
            });

          if (!paymentIntentResult.success) {
            throw new Error("Failed to create payment intent");
          }

          setPaymentId(paymentIntentResult.paymentId);
          setOrderId(result.order.id);
          setClientSecret(paymentIntentResult.clientSecret);
          setPaymentIntentId(paymentIntentResult.paymentIntentId);

          // Clear the cart after successful order and payment intent creation
          clearCart();

          // Redirect to payment page with order and payment intent details
          navigate(PATH.payment.order(result.order.id), {
            state: {
              order: result.order,
              paymentIntent: paymentIntentResult,
              clientSecret: paymentIntentResult.clientSecret,
              paymentIntentId: paymentIntentResult.paymentIntentId,
              paymentId: paymentIntentResult.paymentId,
            },
          });

          return { order: result.order, paymentIntent: paymentIntentResult };
        }
      })(),
      {
        loading:
          selectedPaymentMethod === "CASH_ON_DELIVERY"
            ? "Creating your order..."
            : "Creating your order",
        success: (data) => {
          if (selectedPaymentMethod === "CASH_ON_DELIVERY") {
            return `Order #${data.order.id} created successfully! Order confirmed for Cash on Delivery.`;
          }
          return `Order #${data.order.id} created successfully! Redirecting to payment...`;
        },
        error: (error) => `Failed to process: ${error.message}`,
      }
    );
  };

  const isFormValid = Boolean(
    selectedAddressId &&
      selectedDeliveryTime &&
      !createOrderMutation.isPending &&
      !createPaymentIntentMutation.isPending
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Checkout Steps */}
          <div
            className={`lg:col-span-2 space-y-6 ${
              createOrderMutation.isPending ||
              createPaymentIntentMutation.isPending
                ? "opacity-50 pointer-events-none"
                : ""
            }`}
          >
            <DeliveryAddress
              selectedAddressId={selectedAddressId}
              onAddressSelect={setSelectedAddressId}
            />

            <DeliveryTypeSelector />

            <PaymentMethodSelector
              selectedMethod={selectedPaymentMethod}
              onMethodChange={setPaymentMethod}
            />
          </div>

          {/* Right Column - Order Summary */}
          <OrderSummary
            onPlaceOrder={handlePlaceOrder}
            isFormValid={isFormValid}
            isLoading={
              createOrderMutation.isPending ||
              createPaymentIntentMutation.isPending
            }
          />
        </div>
      </div>
    </div>
  );
};

export default Cart;
