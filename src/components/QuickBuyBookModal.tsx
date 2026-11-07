import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { API_URL } from "@/config";
import {
  Smartphone,
  Plus,
  Minus,
  Check,
  CheckCircle2,
  Lock,
  ArrowRight,
  Loader2,
  ExternalLink,
  AlertCircle,
  Truck
} from "lucide-react";

export interface BookItem {
  id: string;
  title: string;
  subtitle?: string;
  cover: string;
  price?: number;
}

interface QuickBuyBookModalProps {
  book: BookItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const UNIT_PRICE = 30000;

export const QuickBuyBookModal: React.FC<QuickBuyBookModalProps> = ({
  book,
  isOpen,
  onClose,
}) => {
  const { toast } = useToast();

  const [quantity, setQuantity] = useState<number>(1);
  const [fullName, setFullName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [deliveryAddress, setDeliveryAddress] = useState<string>("");
  const [provider, setProvider] = useState<"mtn" | "airtel">("mtn");

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [transactionId, setTransactionId] = useState<string>("");
  const [checkoutUrl, setCheckoutUrl] = useState<string>("");
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "pending" | "completed" | "failed">("idle");

  const totalAmount = quantity * UNIT_PRICE;

  // Reset when dialog closes or book changes
  useEffect(() => {
    if (!isOpen) {
      setPaymentStatus("idle");
      setTransactionId("");
      setCheckoutUrl("");
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // Polling for mobile money confirmation
  useEffect(() => {
    if (!transactionId || paymentStatus !== "pending") return;

    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      if (attempts > 40) {
        clearInterval(interval);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/payment-status/${encodeURIComponent(transactionId)}`);
        if (res.ok) {
          const json = await res.json();
          const status = json.status || json.data?.status;
          if (status === "completed" || status === "success") {
            setPaymentStatus("completed");
            toast({
              title: "Payment Received!",
              description: "Your Mobile Money payment has been confirmed. Thank you!",
            });
            clearInterval(interval);
          } else if (status === "failed") {
            setPaymentStatus("failed");
            clearInterval(interval);
          }
        }
      } catch (e) {
        // Ignore network glitches while polling
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [transactionId, paymentStatus, toast]);

  if (!book) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your full name for book delivery.",
        variant: "destructive",
      });
      return;
    }

    if (!phone.trim() || phone.replace(/\s+/g, "").length < 9) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid MTN or Airtel Mobile Money phone number.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/buy-book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId: book.id,
          bookTitle: book.title,
          quantity,
          amount: totalAmount,
          phone,
          provider,
          fullName,
          deliveryAddress,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Failed to initialize payment");
      }

      setTransactionId(data.transactionId || "");
      setCheckoutUrl(data.checkoutUrl || "");
      setPaymentStatus("pending");

      toast({
        title: "Payment Prompt Sent!",
        description: `Check ${phone} for the Mobile Money PIN prompt of UGX ${totalAmount.toLocaleString()}.`,
      });
    } catch (err: any) {
      toast({
        title: "Order Failed",
        description: err.message || "Could not initiate payment. Please check your number.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setPaymentStatus("idle");
    setTransactionId("");
    setCheckoutUrl("");
    setQuantity(1);
    setPhone("");
    setFullName("");
    setDeliveryAddress("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg w-[95vw] sm:w-full p-0 overflow-hidden rounded-3xl border border-border shadow-2xl bg-card">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-5 sm:p-6 border-b border-border/50">
          <DialogHeader className="text-left">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shadow-md bg-muted/40 shrink-0 border border-border">
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                  Instant Mobile Money Order
                </span>
                <DialogTitle className="text-lg sm:text-xl font-extrabold text-foreground leading-tight line-clamp-1">
                  "{book.title}"
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  UGX {UNIT_PRICE.toLocaleString()} per copy • MTN & Airtel MoMo
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6">
          {paymentStatus !== "idle" ? (
            /* Prompt Sent / Status View */
            <div className="text-center space-y-5 py-2">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto transition-all duration-300 ${
                  paymentStatus === "completed"
                    ? "bg-primary text-white shadow-xl shadow-primary/30 ring-4 ring-primary/15"
                    : paymentStatus === "failed"
                    ? "bg-rose-500/10 text-rose-600"
                    : "bg-primary/10 text-primary"
                }`}
              >
                {paymentStatus === "completed" ? (
                  <Check className="w-9 h-9 text-white stroke-[3.5] animate-in zoom-in-75 duration-300" />
                ) : paymentStatus === "failed" ? (
                  <AlertCircle className="w-8 h-8 text-rose-600" />
                ) : (
                  <Smartphone className="w-8 h-8 text-primary animate-pulse" />
                )}
              </div>

              <div className="space-y-1.5">
                {paymentStatus === "completed" ? (
                  <>
                    <h3 className="text-2xl font-extrabold text-emerald-600">
                      Payment Confirmed!
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Thank you, <strong className="text-foreground">{fullName}</strong>! Your payment of{" "}
                      <strong className="text-foreground">UGX {totalAmount.toLocaleString()}</strong> has been confirmed. We will deliver to your location soon.
                    </p>
                  </>
                ) : paymentStatus === "failed" ? (
                  <>
                    <h3 className="text-2xl font-extrabold text-rose-600">
                      Payment Not Completed
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      The Mobile Money prompt was cancelled or timed out.
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-foreground">
                      Check Your Handset!
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      A prompt was sent to <strong className="text-foreground">{phone}</strong>. Enter your Mobile Money PIN to authorize{" "}
                      <strong className="text-primary font-bold">
                        UGX {totalAmount.toLocaleString()}
                      </strong>.
                    </p>
                    <div className="flex items-center justify-center gap-2 text-xs font-semibold text-primary pt-1">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Waiting for PIN authorization on phone...</span>
                    </div>
                  </>
                )}
              </div>

              {checkoutUrl && paymentStatus !== "completed" && (
                <div className="pt-1">
                  <a
                    href={checkoutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 text-xs text-primary font-bold hover:underline"
                  >
                    <span>Didn't get the prompt? Complete via Web Checkout</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              <div className="flex gap-2.5 pt-3">
                {paymentStatus === "completed" ? (
                  <Button
                    onClick={() => {
                      handleReset();
                      onClose();
                    }}
                    className="w-full bg-primary text-white font-bold rounded-full h-11"
                  >
                    Done
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={handleReset}
                      className="w-1/2 rounded-full h-11 text-xs sm:text-sm"
                    >
                      Try Again
                    </Button>
                    <Button
                      onClick={onClose}
                      className="w-1/2 bg-primary text-white font-bold rounded-full h-11 text-xs sm:text-sm"
                    >
                      Close
                    </Button>
                  </>
                )}
              </div>
            </div>
          ) : (
            /* Purchase Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Quantity */}
              <div className="flex items-center justify-between bg-muted/30 border border-border rounded-2xl p-3">
                <span className="text-xs sm:text-sm font-semibold text-foreground">
                  Number of Copies:
                </span>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </Button>
                  <span className="font-extrabold text-base w-6 text-center text-foreground">
                    {quantity}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => setQuantity((q) => Math.min(50, q + 1))}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>

              {/* Payment Provider Selection */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-foreground">
                  Mobile Money Provider
                </Label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setProvider("mtn")}
                    className={`py-2.5 px-3 rounded-xl border-2 text-center transition-all flex items-center justify-center gap-2 ${
                      provider === "mtn"
                        ? "border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold shadow-sm"
                        : "border-border text-muted-foreground hover:border-amber-500/40"
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="text-xs sm:text-sm">MTN MoMo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setProvider("airtel")}
                    className={`py-2.5 px-3 rounded-xl border-2 text-center transition-all flex items-center justify-center gap-2 ${
                      provider === "airtel"
                        ? "border-red-500 bg-red-500/10 text-red-600 dark:text-red-400 font-bold shadow-sm"
                        : "border-border text-muted-foreground hover:border-red-500/40"
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <span className="text-xs sm:text-sm">Airtel Money</span>
                  </button>
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <Label htmlFor="momo-phone" className="text-xs font-bold text-foreground">
                  Mobile Money Phone Number *
                </Label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="momo-phone"
                    type="tel"
                    required
                    placeholder="e.g. 0770000000 or 0750000000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-10 h-11 rounded-xl text-sm font-mono"
                  />
                </div>
              </div>

              {/* Full Name */}
              <div className="space-y-1.5">
                <Label htmlFor="momo-name" className="text-xs font-bold text-foreground">
                  Your Full Name *
                </Label>
                <Input
                  id="momo-name"
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="h-11 rounded-xl text-sm"
                />
              </div>

              {/* Delivery Address */}
              <div className="space-y-1.5">
                <Label htmlFor="momo-address" className="text-xs font-bold text-foreground">
                  Delivery Address / Town (Optional)
                </Label>
                <div className="relative">
                  <Truck className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="momo-address"
                    type="text"
                    placeholder="e.g. Kampala, Ntinda / Plot 14"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="pl-10 h-11 rounded-xl text-sm"
                  />
                </div>
              </div>

              {/* Total & Submit */}
              <div className="pt-2 space-y-2.5">
                <div className="flex justify-between items-center bg-primary/5 border border-primary/20 rounded-xl px-4 py-2.5 text-sm">
                  <span className="font-semibold text-foreground">Total to Pay:</span>
                  <span className="text-lg font-extrabold text-primary">
                    UGX {totalAmount.toLocaleString()}
                  </span>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-extrabold h-12 rounded-full text-sm sm:text-base shadow-lg shadow-primary/25 transition-all"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending Mobile Money Prompt...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <span>Pay UGX {totalAmount.toLocaleString()} via MoMo</span>
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
                  <Lock className="w-3 h-3 text-primary" />
                  <span>Instant USSD prompt on your phone via LapterPay</span>
                </div>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickBuyBookModal;

