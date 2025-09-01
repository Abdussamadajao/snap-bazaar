import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { RefreshCw, AlertCircle } from "lucide-react";

interface RefundCanceledOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  orderNumber: string;
  amount: number | string;
  isLoading?: boolean;
}

const refundReasons = [
  "Order canceled - customer request",
  "Order canceled - item out of stock",
  "Order canceled - delivery issues",
  "Order canceled - pricing error",
  "Order canceled - duplicate order",
  "Other",
];

const RefundCanceledOrderModal: React.FC<RefundCanceledOrderModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  orderNumber,
  amount,
  isLoading = false,
}) => {
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [customReason, setCustomReason] = useState<string>("");

  const handleConfirm = () => {
    const finalReason =
      selectedReason === "Other" ? customReason : selectedReason;
    if (finalReason.trim()) {
      onConfirm(finalReason);
    }
  };

  const handleClose = () => {
    setSelectedReason("");
    setCustomReason("");
    onClose();
  };

  const canConfirm =
    selectedReason && (selectedReason !== "Other" || customReason.trim());

  // Helper function to safely format amount
  const formatAmount = (amount: number | string): string => {
    if (typeof amount === "number") {
      return amount.toFixed(2);
    }
    if (typeof amount === "string") {
      const numAmount = parseFloat(amount);
      return isNaN(numAmount) ? "0.00" : numAmount.toFixed(2);
    }
    return "0.00";
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-primary" /> Request Refund
          </DialogTitle>
          <DialogDescription>
            You're requesting a refund for canceled order{" "}
            <strong>{orderNumber}</strong>. The refund amount of{" "}
            <strong>₦{formatAmount(amount)}</strong> will be processed through
            your original payment method.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-medium mb-1">Important:</p>
                <p>
                  This refund will be processed through Stripe and may take 5-10
                  business days to appear in your account, depending on your
                  bank.
                </p>
              </div>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium mb-3 block">
              Refund Reason
            </Label>
            <RadioGroup
              value={selectedReason}
              onValueChange={setSelectedReason}
              className="space-y-3"
            >
              {refundReasons.map((reason) => (
                <div key={reason} className="flex items-center space-x-2">
                  <RadioGroupItem value={reason} id={reason} />
                  <Label htmlFor={reason} className="text-sm font-medium">
                    {reason}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {selectedReason === "Other" && (
            <div className="space-y-2">
              <Label htmlFor="custom-reason" className="text-sm font-medium">
                Please specify the reason
              </Label>
              <Textarea
                id="custom-reason"
                placeholder="Enter your reason for requesting a refund..."
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!canConfirm || isLoading}
            className="bg-primary hover:bg-primary-foreground"
          >
            {isLoading ? "Processing..." : "Request Refund"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RefundCanceledOrderModal;
