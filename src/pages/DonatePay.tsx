import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
    Heart,
    Smartphone,
    CheckCircle2,
    ArrowRight,
    Loader2,
    ChevronLeft,
    ShieldCheck,
    Lock,
    Landmark
} from "lucide-react";

import { API_URL } from "@/config";

const DonatePay = () => {
    const navigate = useNavigate();
    const { toast } = useToast();

    // Form State
    const [amount, setAmount] = useState("");
    const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
    const [provider, setProvider] = useState<"mtn" | "airtel" | "card" | null>(null);
    const [phone, setPhone] = useState("");
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    // Card State
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");
    const [nameOnCard, setNameOnCard] = useState("");

    const presets = [10000, 25000, 50000, 100000, 200000, 500000];
    const usdPresets = [10, 25, 50, 100, 200, 500];
    const EXCHANGE_RATE = 3700; // 1 USD = 3700 UGX

    const getCurrency = () => provider === "card" ? "USD" : "UGX";
    const getSymbol = () => provider === "card" ? "$" : "UGX";

    const handlePresetClick = (val: number) => {
        setSelectedPreset(val);
        setAmount(val.toString());
    };

    const handleAmountChange = (val: string) => {
        setAmount(val);
        if (selectedPreset !== -1) {
            setSelectedPreset(null);
        }
    };

    // Auto-convert amount when switching between Card (USD) and Mobile Money (UGX)
    useEffect(() => {
        if (!amount || amount === "0") return;

        const numAmount = parseFloat(amount);
        if (isNaN(numAmount)) return;

        // If it's a preset, swap to the corresponding preset in the other currency
        const ugxIdx = presets.indexOf(numAmount);
        const usdIdx = usdPresets.indexOf(numAmount);

        if (provider === "card") {
            if (ugxIdx !== -1) {
                // If it was a UGX preset, switch to USD preset
                setAmount(usdPresets[ugxIdx].toString());
                setSelectedPreset(usdPresets[ugxIdx]);
            } else if (numAmount > 500) {
                // Likely a UGX amount converted to USD
                setAmount(Math.round(numAmount / EXCHANGE_RATE).toString());
                setSelectedPreset(null);
            }
        } else if (provider === "mtn" || provider === "airtel") {
            if (usdIdx !== -1) {
                // If it was a USD preset, switch to UGX preset
                setAmount(presets[usdIdx].toString());
                setSelectedPreset(presets[usdIdx]);
            } else if (numAmount < 1000) {
                // Likely a USD amount converted to UGX
                setAmount(Math.round(numAmount * EXCHANGE_RATE).toString());
                setSelectedPreset(null);
            }
        }
    }, [provider]);

    const totalDue = amount ? parseFloat(amount) : 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!amount || parseFloat(amount) <= 0) {
            toast({
                title: "Invalid Amount",
                description: "Please enter a valid donation amount.",
                variant: "destructive",
            });
            return;
        }

        if (!provider) {
            toast({
                title: "Payment Method Required",
                description: "Please select a payment method to continue.",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(`${API_URL}/donate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount,
                    phone,
                    provider,
                    email,
                    firstName,
                    lastName,
                    cardNumber,
                    expiry,
                    cvv,
                    nameOnCard,
                    isAnonymous
                }),
            });

            if (!response.ok) {
                let errorMsg = "Payment processing failed";
                try {
                    const errorData = await response.json();
                    errorMsg = errorData.error || errorData.message || errorMsg;
                } catch (e) {
                    // If not JSON, try text
                    const errorText = await response.text();
                    if (errorText) errorMsg = errorText;
                }
                throw new Error(errorMsg);
            }

            setIsSuccess(true);
            toast({
                title: provider === "card" ? "Donation Successful!" : "Donation Initiated!",
                description: provider === "card"
                    ? "Thank you for your generous contribution."
                    : "Please check your phone for the PIN prompt to complete your donation.",
            });
        } catch (err: any) {
            toast({
                title: "Error",
                description: err.message || "An error occurred. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-xl p-10 text-center animate-in fade-in zoom-in duration-500">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-14 h-14 text-green-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Thank You!</h2>
                    <p className="text-gray-600 mb-8">
                        Your donation of <span className="font-bold text-primary">UGX {parseFloat(amount).toLocaleString()}</span> helps empower vulnerable youth.
                        A confirmation email will be sent shortly.
                    </p>
                    <Button
                        onClick={() => {
                            setIsSuccess(false);
                            setAmount("");
                            setSelectedPreset(null);
                            setPhone("");
                            // Reset card fields too just in case
                            setEmail("");
                            setFirstName("");
                            setLastName("");
                            setCardNumber("");
                            setExpiry("");
                            setCvv("");
                            setNameOnCard("");
                        }}
                        className="w-full h-14 rounded-full text-lg font-bold"
                    >
                        Make another donation
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Simple Header */}
            <header className="border-b border-gray-100 py-4 px-6 sticky top-0 bg-white z-10">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div className="flex-1">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors font-medium"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            <span className="hidden sm:inline">Back</span>
                        </button>
                    </div>
                    <img src="/Suyel%20Main%20Logo.png" alt="SUYEL Logo" className="h-14 w-auto" />
                    <div className="flex-1 flex justify-end">
                        <div className="hidden md:flex items-center gap-2 text-gray-400 text-sm font-medium">
                            <Lock className="w-4 h-4" />
                            Secure Checkout
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 py-8 md:py-12">
                <div className="grid lg:grid-cols-5 gap-12">
                    {/* Left Column: Form */}
                    <div className="lg:col-span-3 space-y-12">
                        <section className="text-center">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">You're supporting SUYEL</h1>
                            <p className="text-gray-500">Your donation will help us reach our target and empower more youth.</p>
                        </section>

                        <form onSubmit={handleSubmit} className="space-y-10">
                            {/* 1. Amount Selection */}
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-foreground text-center">
                                    Enter your donation
                                </h2>

                                <div className="grid grid-cols-3 gap-3">
                                    {(provider === "card" ? usdPresets : presets).map((val) => (
                                        <button
                                            key={val}
                                            type="button"
                                            onClick={() => handlePresetClick(val)}
                                            className={`h-14 rounded-xl border-2 transition-all font-bold text-lg ${selectedPreset === val
                                                ? "border-primary bg-primary text-primary-foreground shadow-md"
                                                : "border-border text-muted-foreground hover:border-primary/40 hover:bg-primary/10"
                                                }`}
                                        >
                                            {getSymbol()} {val >= 1000 ? `${val / 1000}k` : val}
                                            {(val === 50000 || val === 50) && (
                                                <span className={`block text-[10px] uppercase tracking-wider -mt-1 font-bold ${selectedPreset === val ? "text-primary-foreground/80" : "text-primary"}`}>Suggested</span>
                                            )}
                                        </button>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedPreset(-1);
                                            inputRef.current?.focus();
                                        }}
                                        className={`h-10 w-fit px-8 mx-auto rounded-full border-2 transition-all font-bold text-sm col-start-2 ${(selectedPreset === -1 || (amount !== "" && !presets.includes(Number(amount)) && !usdPresets.includes(Number(amount))))
                                            ? "border-primary bg-primary text-primary-foreground shadow-md"
                                            : "border-border text-muted-foreground hover:border-primary/40 hover:bg-primary/10"
                                            }`}
                                    >
                                        Custom
                                    </button>
                                </div>

                                <div className="flex justify-center group">
                                    <div className="relative w-full max-w-sm">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-xl font-bold text-muted-foreground group-focus-within:text-primary transition-colors">{getSymbol()}</div>
                                        <Input
                                            id="custom-amount"
                                            ref={inputRef}
                                            type="number"
                                            placeholder="0.00"
                                            className="h-20 pl-20 pr-8 text-center text-3xl font-bold rounded-2xl border-2 border-border focus:border-primary bg-card transition-all outline-none ring-0 focus-visible:ring-0 text-primary"
                                            value={amount}
                                            onChange={(e) => handleAmountChange(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* 2. Payment Method */}
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-foreground text-center">
                                    Payment method
                                </h2>

                                <div className="space-y-4">
                                    {/* Card Option */}
                                    <div className={`rounded-2xl border-2 transition-all overflow-hidden ${provider === "card" ? "border-primary ring-4 ring-primary/20 shadow-md bg-card" : "border-border hover:border-border/80 bg-card"}`}>
                                        <button
                                            type="button"
                                            onClick={() => setProvider("card")}
                                            className="w-full flex items-center justify-center gap-4 p-6"
                                        >
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${provider === "card" ? "border-primary" : "border-muted-foreground"}`}>
                                                {provider === "card" && <div className="w-3 h-3 bg-primary rounded-full" />}
                                            </div>
                                            <div className="flex flex-col items-center gap-1">
                                                <span className="font-bold text-foreground text-lg">Credit or debit card</span>
                                            </div>
                                        </button>

                                        {provider === "card" && (
                                            <div className="px-6 pb-8 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300 border-t border-border pt-6">
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Card Information</Label>
                                                    <Input placeholder="Email address" className="h-12 rounded-xl" value={email} onChange={e => setEmail(e.target.value)} required />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <Input placeholder="First name" className="h-12 rounded-xl" value={firstName} onChange={e => setFirstName(e.target.value)} required />
                                                    <Input placeholder="Last name" className="h-12 rounded-xl" value={lastName} onChange={e => setLastName(e.target.value)} required />
                                                </div>
                                                <Input placeholder="Card number" className="h-12 rounded-xl" value={cardNumber} onChange={e => setCardNumber(e.target.value)} required />
                                                <div className="grid grid-cols-2 gap-4">
                                                    <Input placeholder="MM / YY" className="h-12 rounded-xl" value={expiry} onChange={e => setExpiry(e.target.value)} required />
                                                    <Input placeholder="CVV" className="h-12 rounded-xl" value={cvv} onChange={e => setCvv(e.target.value)} required />
                                                </div>
                                                <Input placeholder="Name on card" className="h-12 rounded-xl" value={nameOnCard} onChange={e => setNameOnCard(e.target.value)} required />
                                            </div>
                                        )}
                                    </div>

                                    {/* Mobile Money Options */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setProvider("mtn")}
                                            className={`relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all group ${provider === "mtn"
                                                ? "border-yellow-400 bg-yellow-400/5 ring-4 ring-yellow-400/10"
                                                : "border-border hover:border-yellow-200 bg-card"
                                                }`}
                                        >
                                            <img src="/MTN mobile money.png" alt="MTN MoMo" className="h-12 w-auto object-contain mb-3" />
                                            <span className={`font-bold text-sm ${provider === "mtn" ? "text-yellow-500" : "text-muted-foreground group-hover:text-yellow-500"}`}>MTN MoMo</span>
                                            {provider === "mtn" && <div className="absolute top-3 right-3 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-black ring-2 ring-background"><CheckCircle2 className="w-4 h-4" /></div>}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setProvider("airtel")}
                                            className={`relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all group ${provider === "airtel"
                                                ? "border-red-600 bg-red-600/5 ring-4 ring-red-600/10"
                                                : "border-border hover:border-red-200 bg-card"
                                                }`}
                                        >
                                            <img src="/Airtel mobile money.jpg" alt="Airtel Money" className="h-12 w-auto object-contain mb-3" />
                                            <span className={`font-bold text-sm ${provider === "airtel" ? "text-red-500" : "text-muted-foreground group-hover:text-red-500"}`}>Airtel Money</span>
                                            {provider === "airtel" && <div className="absolute top-3 right-3 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center text-white ring-2 ring-background"><CheckCircle2 className="w-4 h-4" /></div>}
                                        </button>
                                    </div>

                                    {provider && provider !== "card" && (
                                        <div className="p-6 rounded-2xl bg-card border border-border animate-in slide-in-from-top-2 duration-300">
                                            <div className="space-y-4 flex flex-col items-center">
                                                <Label htmlFor="phone" className="text-sm font-bold text-foreground text-center">Mobile Money Number</Label>
                                                <div className="relative w-full max-w-xs">
                                                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                                                    <Input
                                                        id="phone"
                                                        type="tel"
                                                        placeholder="07XX XXX XXX"
                                                        className="h-14 pl-12 text-center text-lg rounded-xl border-border bg-background"
                                                        value={phone}
                                                        onChange={(e) => setPhone(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <p className="text-xs text-muted-foreground italic text-center">You'll receive a secure PIN prompt on your phone.</p>

                                                <div className="w-full pt-4 border-t border-border flex flex-col items-center gap-4">
                                                    <Label htmlFor="momo-amount" className="text-sm font-bold text-foreground">Donation Amount (UGX)</Label>
                                                    <div className="relative w-full max-w-xs">
                                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">UGX</div>
                                                        <Input
                                                            id="momo-amount"
                                                            type="number"
                                                            placeholder="0.00"
                                                            className="h-14 pl-16 pr-4 text-center text-xl font-bold rounded-xl border-border bg-background focus:border-primary transition-all text-primary"
                                                            value={amount}
                                                            onChange={(e) => handleAmountChange(e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Submit */}
                            <Button
                                type="submit"
                                disabled={isSubmitting || !amount}
                                className="w-full h-16 rounded-full text-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/20 active:scale-95 transition-all group overflow-hidden relative"
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                        {provider === "card" ? "Processing..." : "Sending PIN prompt..."}
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        Donate now
                                        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                )}
                            </Button>

                            {/* 3. Privacy & Terms */}
                            <div className="space-y-6 pt-6 border-t border-border">
                                <div className="space-y-4 flex flex-col items-center">
                                    <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setIsAnonymous(!isAnonymous)}>
                                        <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${isAnonymous ? "bg-primary border-primary" : "border-border group-hover:border-primary"}`}>
                                            {isAnonymous && <CheckCircle2 className="w-4 h-4 text-primary-foreground" />}
                                        </div>
                                        <span className="text-sm text-muted-foreground font-medium select-none">Don't display my name publicly</span>
                                    </div>

                                    <div className="flex items-center gap-3 group">
                                        <div className="w-6 h-6 rounded border-2 bg-primary border-primary flex items-center justify-center">
                                            <CheckCircle2 className="w-4 h-4 text-primary-foreground" />
                                        </div>
                                        <span className="text-sm text-muted-foreground font-medium whitespace-nowrap">Sign me up for updates from SUYEL</span>
                                    </div>
                                </div>

                                <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl flex items-start gap-3 shadow-md">
                                    <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                    <p className="text-xs text-foreground leading-relaxed">
                                        SUYEL has a <span className="font-bold underline text-primary">0% platform fee</span> for donors. Your contribution goes directly to empowering youth programs across Uganda.
                                    </p>
                                </div>
                            </div>

                            <p className="text-center text-[10px] text-muted-foreground leading-relaxed max-w-sm mx-auto mt-6">
                                By clicking 'Donate now', you agree to SUYEL's Terms of Service and Privacy Notice. Learn more about our secure payment processing.
                            </p>
                        </form>
                    </div>

                    {/* Right Column: Summary Sticky */}
                    <div className="lg:col-span-2">
                        <div className="sticky top-28 space-y-6">
                            <div className="bg-card rounded-3xl p-8 border border-border shadow-sm">
                                <h3 className="text-xl font-bold text-foreground mb-6 font-primary text-center">Your donation</h3>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-muted-foreground">
                                        <span className="font-medium">Your donation</span>
                                        <span className="font-bold text-foreground">{getSymbol()} {amount ? parseFloat(amount).toLocaleString() : "0.00"}</span>
                                    </div>

                                    <div className="pt-4 border-t border-border flex flex-col items-center gap-2">
                                        <span className="text-muted-foreground font-medium">Total due today</span>
                                        <span className="text-3xl font-bold text-primary">{getSymbol()} {totalDue.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Direct Bank Account Card */}
                            <div className="bg-black text-white rounded-3xl p-6 border border-neutral-800 shadow-xl space-y-4">
                                <div className="flex items-center gap-3 border-b border-neutral-800 pb-3">
                                    <div className="w-10 h-10 rounded-full bg-white p-1.5 flex items-center justify-center shrink-0 border border-neutral-800 overflow-hidden">
                                        <img
                                            src="/DFCU LOGO.png"
                                            onError={(e) => {
                                                (e.currentTarget as HTMLImageElement).src = "/DFCU LOGO.jpg";
                                            }}
                                            alt="DFCU Bank Logo"
                                            className="w-full h-full object-contain rounded-full"
                                        />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-base text-white">Direct Bank Wire Transfer</h4>
                                        <p className="text-xs text-neutral-400">Official Organization Bank Account</p>
                                    </div>
                                </div>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between items-center border-b border-neutral-800/60 pb-2">
                                        <span className="text-neutral-400 text-xs uppercase tracking-wider font-medium">Bank Account</span>
                                        <strong className="text-white font-semibold text-right">DFCU, Ssena Healing Africa</strong>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-neutral-800/60 pb-2">
                                        <span className="text-neutral-400 text-xs uppercase tracking-wider font-medium">Acc/No</span>
                                        <strong className="text-primary font-mono text-base font-bold">01150016614215</strong>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-neutral-400 text-xs uppercase tracking-wider font-medium">SWIFT Code</span>
                                        <strong className="text-white font-mono font-semibold">DFCUUGKA</strong>
                                    </div>
                                </div>
                            </div>

                            <div className="px-4 text-center">
                                <div className="flex items-center justify-center gap-2 text-gray-400 mb-2">
                                    <ShieldCheck className="w-5 h-5" />
                                    <span className="text-sm font-bold">Guaranteed safe & secure</span>
                                </div>
                                <p className="text-xs text-gray-400 px-4">
                                    We use bank-level 256-bit encryption to protect your data. Payment processed via Mobile Money & Direct Wire.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DonatePay;
