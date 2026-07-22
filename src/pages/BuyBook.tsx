import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  BookOpen,
  ShoppingBag,
  Plus,
  Minus,
  Smartphone,
  CheckCircle2,
  ArrowRight,
  ChevronLeft,
  ShieldCheck,
  Lock,
  Truck
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
    title: "Childhood Traumas & Adulthood",
    subtitle: "Ending Child Sexual Violence & Abuse Awareness",
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

  const totalAmount = quantity * UNIT_PRICE;

  const handleIncrement = () => {
    setQuantity((prev) => Math.min(prev + 1, 50));
  };

  const handleDecrement = () => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
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

    // Simulate API authorization call
    setTimeout(() => {
      const generatedRef = "BK-" + Math.floor(100000 + Math.random() * 900000);
      setOrderRef(generatedRef);
      setIsSubmitting(false);
      setIsSuccess(true);
      toast({
        title: "Order Initiated!",
        description: `Please check ${phone} for a Mobile Money prompt to complete your payment of UGX ${totalAmount.toLocaleString()}.`,
      });
    }, 1500);
  };

  return (
    <Layout>
      <SEO
        title={`Order "${selectedBook.title}" | SSENA HEALING AFRICA`}
        description={`Purchase "${selectedBook.title}" by SSENA HEALING AFRICA for UGX 30,000. Pay securely via MTN Mobile Money or Airtel Money.`}
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

          {/* Book Selection Tabs */}
          <div className="mb-8 max-w-xl mx-auto">
            <div className="bg-muted/50 p-1.5 rounded-2xl border border-border grid grid-cols-2 gap-1 text-center">
              {BOOKS.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setSelectedBookId(b.id)}
                  className={`py-3 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
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
            /* Success State */
            <div className="max-w-2xl mx-auto bg-card border border-border rounded-3xl p-8 md:p-12 shadow-2xl text-center space-y-6 animate-scale-in">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                <CheckCircle2 className="w-12 h-12" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
                  Order ID: #{orderRef}
                </span>
                <h2 className="text-3xl font-extrabold text-foreground">
                  Payment Prompt Sent!
                </h2>
                <p className="text-muted-foreground text-base max-w-md mx-auto">
                  A Mobile Money push prompt has been initiated to your phone{" "}
                  <strong className="text-foreground">{phone}</strong>. Please check your handset and enter your PIN to authorize payment of{" "}
                  <strong className="text-primary font-bold">
                    UGX {totalAmount.toLocaleString()}
                  </strong>.
                </p>
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

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                <Button
                  onClick={() => {
                    setIsSuccess(false);
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
