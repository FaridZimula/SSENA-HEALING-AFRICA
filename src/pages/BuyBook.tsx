import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { API_URL } from "@/config";
import {
  BookOpen,
  ShoppingBag,
  Plus,
  Minus,
  Smartphone,
  Check,
  CheckCircle2,
  ArrowRight,
  ChevronLeft,
  ShieldCheck,
  Lock,
  Truck,
  ExternalLink,
  Loader2,
  AlertCircle
} from "lucide-react";

const UNIT_PRICE = 30000;

interface BookOption {
  id: string;
  title: string;
  subtitle: string;
  cover: string;
  description: string;
}

const BOOKS: BookOption[] = [
  {
    id: "breaking-the-circle",
    title: "Breaking The Circle",
    subtitle: "Mental Health & Emotional Healing Guide",
    cover: "/BREAKING_THE_CIRCLE.webp",
    description: "An empowering mental health guide offering practical coping mechanisms, emotional healing strategies, and tools to overcome life's silent struggles."
  },
  {
    id: "childhood",
    title: "Echoes of a Stolen Childhood",
    subtitle: "Reclaiming the lost voices",
    cover: "/CHILDHOOD.webp",
    description: "Authored by our Founder to create awareness about child sexual violence, protection, and how unaddressed childhood traumas profoundly affect adult life."
  }
];

const BuyBook = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const requestedBook = searchParams.get("book");
  const initialBookId = requestedBook === "childhood" ? "childhood" : "breaking-the-circle";

  const [selectedBookId, setSelectedBookId] = useState<string>(initialBookId);
  const selectedBook = BOOKS.find((b) => b.id === selectedBookId) || BOOKS[0];

  // Order Form State
  const [quantity, setQuantity] = useState<number>(1);
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [deliveryAddress, setDeliveryAddress] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<"mtn" | "airtel" | null>("mtn");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [orderRef, setOrderRef] = useState<string>("");
  const [checkoutUrl, setCheckoutUrl] = useState<string>("");
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "completed" | "failed">("pending");

  const totalAmount = quantity * UNIT_PRICE;

  const handleIncrement = () => {
    setQuantity((prev) => Math.min(prev + 1, 50));
  };

  const handleDecrement = () => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  // Poll for payment completion when order is initiated
  useEffect(() => {
    if (!orderRef || paymentStatus !== "pending" || !isSuccess) return;

    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      if (attempts > 40) { // stop polling after ~2 minutes
        clearInterval(interval);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/payment-status/${encodeURIComponent(orderRef)}`);
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
        // Ignore polling network glitches
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [orderRef, paymentStatus, isSuccess, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your full name.",
        variant: "destructive",
      });
      return;
    }

    if (!phone.trim() || phone.replace(/\s+/g, "").length < 9) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid Airtel or MTN Mobile Money phone number.",
        variant: "destructive",
      });
      return;
    }

    if (!paymentMethod) {
      toast({
        title: "Payment Method Required",
        description: "Please select either MTN Mobile Money or Airtel Money.",
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
          bookId: selectedBook.id,
          bookTitle: selectedBook.title,
          quantity,
          amount: totalAmount,
          phone,
          provider: paymentMethod,
          fullName,
          email,
          deliveryAddress,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Failed to initiate payment");
      }

      const generatedRef = data.transactionId || ("BK-" + Math.floor(100000 + Math.random() * 900000));
      setOrderRef(generatedRef);
      setCheckoutUrl(data.checkoutUrl || "");
      setPaymentStatus("pending");
      setIsSuccess(true);

      toast({
        title: "Payment Prompt Sent!",
        description: `Please check ${phone} for a Mobile Money prompt to complete payment of UGX ${totalAmount.toLocaleString()}.`,
      });
    } catch (err: any) {
      toast({
        title: "Order Failed",
        description: err.message || "Could not initiate payment. Please check your phone number and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <SEO
        title={`Order "${selectedBook.title}" | SSENA HEALING AFRICA`}
        description={`Purchase "${selectedBook.title}" by SSENA HEALING AFRICA for UGX 30,000. Pay securely via MTN Mobile Money or Airtel Money.`}
        url={`https://ssenahealingafrica.org/buy-book?book=${selectedBook.id}`}
        ogImage={`https://ssenahealingafrica.org${selectedBook.cover}`}
        schema={{
          "@context": "https://schema.org",
          "@type": "Book",
          "name": selectedBook.title,
          "author": {
            "@type": "Organization",
            "name": "Ssena Healing Africa"
          },
          "image": `https://ssenahealingafrica.org${selectedBook.cover}`,
          "description": selectedBook.description,
          "offers": {
            "@type": "Offer",
            "price": "30000",
            "priceCurrency": "UGX",
            "availability": "https://schema.org/InStock",
            "url": `https://ssenahealingafrica.org/buy-book?book=${selectedBook.id}`
          }
        }}
      />

      <div className="bg-background min-h-screen py-8 md:py-12">
        <div className="container-narrow mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Breadcrumb / Back Button */}
          <div className="mb-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>

          {/* Book Selection Tabs - Centered Middle Alignment on Mobile & Desktop */}
          <div className="mb-8 w-full max-w-xl mx-auto flex justify-center items-center px-2">
            <div className="w-full bg-muted/50 p-1.5 rounded-2xl border border-border grid grid-cols-2 gap-1.5 text-center items-center justify-center">
              {BOOKS.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setSelectedBookId(b.id)}
                  className={`py-3 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center text-center leading-tight ${
                    selectedBookId === b.id
                      ? "bg-card text-foreground shadow-md border border-border"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  "{b.title}"
                </button>
              ))}
            </div>
          </div>

          {isSuccess ? (
            /* Success / Pending Prompt State */
            <div className="max-w-2xl mx-auto bg-card border border-border rounded-3xl p-8 md:p-12 shadow-2xl text-center space-y-6 animate-scale-in">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto transition-all duration-300 ${
                paymentStatus === "completed"
                  ? "bg-primary text-white shadow-xl shadow-primary/30 ring-8 ring-primary/15"
                  : paymentStatus === "failed"
                  ? "bg-rose-500/10 text-rose-600"
                  : "bg-primary/10 text-primary"
              }`}>
                {paymentStatus === "completed" ? (
                  <Check className="w-11 h-11 text-white stroke-[3.5] animate-in zoom-in-75 duration-300" />
                ) : paymentStatus === "failed" ? (
                  <AlertCircle className="w-11 h-11 text-rose-600" />
                ) : (
                  <Smartphone className="w-10 h-10 animate-pulse text-primary" />
                )}
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
                  Transaction: #{orderRef}
                </span>

                {paymentStatus === "completed" ? (
                  <>
                    <h2 className="text-3xl font-extrabold text-emerald-600">
                      Payment Confirmed!
                    </h2>
                    <p className="text-muted-foreground text-base max-w-md mx-auto">
                      Thank you <strong className="text-foreground">{fullName}</strong>! Your payment of{" "}
                      <strong className="text-foreground font-bold">
                        UGX {totalAmount.toLocaleString()}
                      </strong>{" "}
                      was received. We are preparing your order for delivery.
                    </p>
                  </>
                ) : paymentStatus === "failed" ? (
                  <>
                    <h2 className="text-3xl font-extrabold text-rose-600">
                      Payment Not Completed
                    </h2>
                    <p className="text-muted-foreground text-base max-w-md mx-auto">
                      The transaction was not completed or timed out. Please try again or open the web checkout below.
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="text-3xl font-extrabold text-foreground">
                      Check Your Handset!
                    </h2>
                    <p className="text-muted-foreground text-base max-w-md mx-auto">
                      A Mobile Money push prompt has been sent to{" "}
                      <strong className="text-foreground">{phone}</strong>. Please enter your PIN to approve payment of{" "}
                      <strong className="text-primary font-bold">
                        UGX {totalAmount.toLocaleString()}
                      </strong>.
                    </p>
                    <div className="flex items-center justify-center gap-2 text-xs font-semibold text-primary pt-1">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Waiting for PIN authorization on your phone...</span>
                    </div>
                  </>
                )}
              </div>

              <div className="bg-muted/50 border border-border rounded-2xl p-6 text-left space-y-3 text-sm">
                <div className="flex justify-between border-b border-border/60 pb-2">
                  <span className="text-muted-foreground">Selected Book:</span>
                  <span className="font-bold text-foreground">"{selectedBook.title}" ({quantity} {quantity > 1 ? "copies" : "copy"})</span>
                </div>
                <div className="flex justify-between border-b border-border/60 pb-2">
                  <span className="text-muted-foreground">Payment Method:</span>
                  <span className="font-bold text-foreground uppercase">{paymentMethod} Mobile Money</span>
                </div>
                <div className="flex justify-between border-b border-border/60 pb-2">
                  <span className="text-muted-foreground">Recipient Name:</span>
                  <span className="font-bold text-foreground">{fullName}</span>
                </div>
                {deliveryAddress && (
                  <div className="flex justify-between border-b border-border/60 pb-2">
                    <span className="text-muted-foreground">Delivery Location:</span>
                    <span className="font-bold text-foreground">{deliveryAddress}</span>
                  </div>
                )}
                <div className="flex justify-between pt-1 text-base">
                  <span className="font-bold text-foreground">Total Amount:</span>
                  <span className="font-extrabold text-primary">UGX {totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {checkoutUrl && paymentStatus !== "completed" && (
                <div className="pt-1">
                  <a
                    href={checkoutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 text-xs text-primary hover:underline font-bold"
                  >
                    <span>Didn't receive prompt? Click here to open Web Checkout</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                <Button
                  onClick={() => {
                    setIsSuccess(false);
                    setPaymentStatus("pending");
                    setQuantity(1);
                  }}
                  variant="outline"
                  className="rounded-full"
                >
                  Place Another Order
                </Button>
                <Button
                  onClick={() => navigate("/")}
                  className="bg-primary text-white hover:bg-primary/90 rounded-full"
                >
                  Return to Home
                </Button>
              </div>
            </div>
          ) : (
            /* Purchase Layout */
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Left Column: Book Details & Visual */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-6">
                  <div className="relative w-full max-w-xs mx-auto aspect-[1170/936] rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-muted/30">
                    <img
                      src={selectedBook.cover}
                      alt={selectedBook.title}
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute top-3 right-3 bg-primary text-white font-extrabold px-3 py-1 rounded-full text-xs shadow-md">
                      UGX 30,000
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                      "{selectedBook.title}"
                    </h1>
                    <p className="text-xs font-semibold text-primary">
                      {selectedBook.subtitle}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed pt-2">
                      {selectedBook.description}
                    </p>
                  </div>

                  <div className="border-t border-border pt-4 text-xs text-muted-foreground space-y-2 text-left">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-primary shrink-0" />
                      <span>Delivery available across Kampala & regions.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                      <span>100% of proceeds support community outreach.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Checkout Form */}
              <div className="lg:col-span-7">
                <div className="bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-xl space-y-8">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-2">
                      Book Checkout
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Ordering: <strong className="text-foreground">"{selectedBook.title}"</strong>
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Quantity Selector */}
                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-foreground">
                        Select Quantity
                      </Label>
                      <div className="flex items-center justify-between bg-muted/40 border border-border rounded-2xl p-3">
                        <span className="text-sm font-medium text-muted-foreground">
                          UGX 30,000 × {quantity} {quantity === 1 ? "copy" : "copies"}
                        </span>
                        <div className="flex items-center gap-3 bg-card border border-border rounded-full p-1 shadow-sm">
                          <button
                            type="button"
                            onClick={handleDecrement}
                            disabled={quantity <= 1}
                            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted text-foreground disabled:opacity-40 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-extrabold text-foreground min-w-[20px] text-center">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={handleIncrement}
                            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted text-foreground transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Customer Personal Details */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName" className="text-sm font-bold text-foreground">
                          Full Name *
                        </Label>
                        <Input
                          id="fullName"
                          type="text"
                          required
                          placeholder="e.g. Juliet Nakyewa"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="rounded-xl h-11"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-bold text-foreground">
                          Email Address (Optional)
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="juliet@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="rounded-xl h-11"
                        />
                      </div>
                    </div>

                    {/* Delivery Address */}
                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-sm font-bold text-foreground">
                        Delivery Address / Location (Optional)
                      </Label>
                      <Input
                        id="address"
                        type="text"
                        placeholder="e.g. Kibuli, Kampala / Institution Name"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        className="rounded-xl h-11"
                      />
                    </div>

                    {/* Payment Method Selector */}
                    <div className="space-y-3">
                      <Label className="text-sm font-bold text-foreground">
                        Select Payment Method *
                      </Label>
                      <div className="grid grid-cols-2 gap-4">
                        {/* MTN Mobile Money */}
                        <button
                          type="button"
                          onClick={() => setPaymentMethod("mtn")}
                          className={`p-4 rounded-2xl border-2 text-left transition-all duration-200 flex flex-col justify-between h-24 ${
                            paymentMethod === "mtn"
                              ? "border-amber-500 bg-amber-500/10 shadow-md"
                              : "border-border bg-card hover:border-amber-500/50"
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="font-extrabold text-amber-600 dark:text-amber-400 text-sm">
                              MTN MoMo
                            </span>
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                paymentMethod === "mtn"
                                  ? "border-amber-500 bg-amber-500 text-white"
                                  : "border-muted-foreground/40"
                              }`}
                            >
                              {paymentMethod === "mtn" && <div className="w-2 h-2 rounded-full bg-white" />}
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            MTN Mobile Money
                          </span>
                        </button>

                        {/* Airtel Money */}
                        <button
                          type="button"
                          onClick={() => setPaymentMethod("airtel")}
                          className={`p-4 rounded-2xl border-2 text-left transition-all duration-200 flex flex-col justify-between h-24 ${
                            paymentMethod === "airtel"
                              ? "border-red-500 bg-red-500/10 shadow-md"
                              : "border-border bg-card hover:border-red-500/50"
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="font-extrabold text-red-600 dark:text-red-400 text-sm">
                              Airtel Money
                            </span>
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                paymentMethod === "airtel"
                                  ? "border-red-500 bg-red-500 text-white"
                                  : "border-muted-foreground/40"
                              }`}
                            >
                              {paymentMethod === "airtel" && <div className="w-2 h-2 rounded-full bg-white" />}
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            Airtel Mobile Commerce
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Phone Number Input */}
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-bold text-foreground">
                        Mobile Money Phone Number *
                      </Label>
                      <div className="relative">
                        <Smartphone className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          required
                          placeholder="e.g. 0770000000 or 0750000000"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="pl-11 rounded-xl h-11 font-mono text-base"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Enter the phone number registered with {paymentMethod === "airtel" ? "Airtel Money" : "MTN Mobile Money"} to receive the payment prompt.
                      </p>
                    </div>

                    {/* Order Total & Submit Button */}
                    <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 space-y-4">
                      <div className="flex justify-between items-center text-lg">
                        <span className="font-bold text-foreground">Total Amount:</span>
                        <span className="text-2xl font-extrabold text-primary">
                          UGX {totalAmount.toLocaleString()}
                        </span>
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-extrabold h-13 rounded-full text-base shadow-lg hover:shadow-primary/30 transition-all"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Processing Request...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            Pay UGX {totalAmount.toLocaleString()} via Mobile Money
                            <ArrowRight className="w-5 h-5" />
                          </span>
                        )}
                      </Button>

                      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                        <Lock className="w-3.5 h-3.5 text-primary" />
                        <span>Secure Mobile Money Payment Authorization</span>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BuyBook;
