import { useState } from "react";
import { Copy, Check, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface DonationCardProps {
    className?: string;
    providerName?: string;
    accountName?: string;
    accountNumber?: string;
    swiftCode?: string;
}

const DonationCard = ({
    className = "",
    providerName = "DFCU Bank",
    accountName = "Ssena Healing Africa",
    accountNumber = "01150016614215",
    swiftCode = "DFCUUGKA",
}: DonationCardProps) => {
    const { toast } = useToast();
    const [copiedAcc, setCopiedAcc] = useState(false);
    const [copiedSwift, setCopiedSwift] = useState(false);

    const copyAccount = () => {
        navigator.clipboard.writeText(accountNumber);
        setCopiedAcc(true);
        toast({
            title: "Account Number Copied!",
            description: `${accountNumber} copied to clipboard.`,
        });
        setTimeout(() => setCopiedAcc(false), 2500);
    };

    const copySwift = () => {
        navigator.clipboard.writeText(swiftCode);
        setCopiedSwift(true);
        toast({
            title: "SWIFT Code Copied!",
            description: `${swiftCode} copied to clipboard.`,
        });
        setTimeout(() => setCopiedSwift(false), 2500);
    };

    return (
        <div className={`bg-card rounded-[2.5rem] shadow-xl p-6 sm:p-8 border border-border transition-all duration-300 ${className}`}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Left Side: Bank Brand Info */}
                <div className="flex items-center gap-4 text-center md:text-left">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                        <Building2 className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-xl sm:text-2xl font-extrabold text-foreground">
                            {providerName}
                        </h3>
                        <p className="text-sm text-muted-foreground font-medium">
                            Account Name: <span className="text-foreground font-bold">{accountName}</span>
                        </p>
                    </div>
                </div>

                {/* Right Side: Account Number & Swift Badges */}
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                    {/* Account Number Pill in Brand Green */}
                    <div className="bg-primary hover:bg-primary/90 transition-colors text-white rounded-2xl p-4 flex items-center justify-between gap-4 w-full sm:w-auto shadow-md">
                        <div>
                            <p className="text-[10px] text-white/80 font-bold uppercase tracking-wider">
                                ACCOUNT NUMBER
                            </p>
                            <code className="text-base sm:text-lg font-mono font-extrabold tracking-wider block">
                                {accountNumber}
                            </code>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={copyAccount}
                            className="h-9 w-9 text-white hover:bg-white/20 rounded-xl shrink-0"
                            title="Copy Account Number"
                        >
                            {copiedAcc ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                        </Button>
                    </div>

                    {/* Swift Code Pill in Dark Theme */}
                    <div className="bg-black hover:bg-neutral-900 transition-colors text-white rounded-2xl p-4 flex items-center justify-between gap-4 w-full sm:w-auto shadow-md border border-neutral-800">
                        <div>
                            <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                                SWIFT CODE
                            </p>
                            <code className="text-base sm:text-lg font-mono font-extrabold tracking-wider block">
                                {swiftCode}
                            </code>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={copySwift}
                            className="h-9 w-9 text-white hover:bg-white/20 rounded-xl shrink-0"
                            title="Copy SWIFT Code"
                        >
                            {copiedSwift ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DonationCard;
