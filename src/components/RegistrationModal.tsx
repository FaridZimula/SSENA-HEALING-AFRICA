import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload } from "lucide-react";

const RegistrationModal = ({ children }: { children: React.ReactNode }) => {
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phoneNumber: "",
        paymentProofType: "screenshot", // "screenshot" | "message"
        paymentMessage: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleProofTypeChange = (value: string) => {
        setFormData((prev) => ({ ...prev, paymentProofType: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setOpen(false);
            toast({
                title: "Registration Successful!",
                description: "Your registration details have been submitted. We will review your payment proof shortly.",
            });
            // Reset form
            setFormData({
                fullName: "",
                email: "",
                phoneNumber: "",
                paymentProofType: "screenshot",
                paymentMessage: "",
            });
        }, 2000);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Register for Membership</DialogTitle>
                    <DialogDescription>
                        Join SSENA HEALING AFRICA today. The annual registration fee is <span className="font-bold text-primary">UGX 10,000</span>.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input
                                id="fullName"
                                name="fullName"
                                placeholder="Enter your full name"
                                required
                                value={formData.fullName}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    required
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phoneNumber">Phone Number</Label>
                                <Input
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    placeholder="077..."
                                    required
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="space-y-3 pt-2">
                            <Label className="text-base">Proof of Payment</Label>
                            <p className="text-xs text-muted-foreground pb-2">
                                Please provide proof of your UGX 10,000 payment.
                            </p>

                            <RadioGroup
                                value={formData.paymentProofType}
                                onValueChange={handleProofTypeChange}
                                className="flex flex-col space-y-2"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="screenshot" id="screenshot" />
                                    <Label htmlFor="screenshot" className="font-normal cursor-pointer">
                                        Upload Screenshot/Photo
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="message" id="message" />
                                    <Label htmlFor="message" className="font-normal cursor-pointer">
                                        Paste Payment Message
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>

                        {formData.paymentProofType === "screenshot" ? (
                            <div className="space-y-2 bg-secondary/30 p-4 rounded-lg border border-dashed border-secondary-foreground/20 text-center">
                                <div className="flex flex-col items-center justify-center gap-2 py-4">
                                    <Upload className="h-8 w-8 text-muted-foreground" />
                                    <Label htmlFor="file-upload" className="cursor-pointer text-sm text-primary hover:underline">
                                        Click to upload image
                                    </Label>
                                    <Input
                                        id="file-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            if (e.target.files?.[0]) {
                                                toast({
                                                    title: "File Selected",
                                                    description: `Selected: ${e.target.files[0].name}`,
                                                });
                                            }
                                        }}
                                    />
                                    <span className="text-xs text-muted-foreground">Supported: JPG, PNG</span>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <Label htmlFor="paymentMessage">Paste Payment Message</Label>
                                <Textarea
                                    id="paymentMessage"
                                    name="paymentMessage"
                                    placeholder="Paste the SMS confirmation from Airtel/MTN here..."
                                    className="min-h-[100px]"
                                    required={formData.paymentProofType === "message"}
                                    value={formData.paymentMessage}
                                    onChange={handleInputChange}
                                />
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                "Submit Registration"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default RegistrationModal;
