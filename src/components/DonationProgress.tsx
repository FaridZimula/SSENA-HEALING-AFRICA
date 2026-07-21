import { Share2, Heart } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";

interface DonationProgressProps {
    raised: number;
    goal: number;
    donationsCount: number;
    onDonateClick: () => void;
}

const DonationProgress = ({ raised, goal, donationsCount, onDonateClick }: DonationProgressProps) => {
    const percentage = Math.min((raised / goal) * 100, 100);
    const [currentIndex, setCurrentIndex] = useState(0);

    const donations = [
        { name: "Zimula Farid", amount: "UGX 100,000" },
        { name: "Hannah Davis", amount: "UGX 65,000" },
        { name: "Oshin Josephs", amount: "UGX 35,000" },
        { name: "Anonymous", amount: "UGX 50,000" }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % donations.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [donations.length]);
    const strokeDasharray = 2 * Math.PI * 45; // r=45
    const strokeDashoffset = strokeDasharray - (strokeDasharray * percentage) / 100;

    return (
        <div className="bg-card rounded-3xl shadow-xl p-6 md:p-8 border border-border flex flex-col gap-6 sticky top-24">
            {/* Progress Section */}
            <div className="flex items-center gap-4 md:gap-6">
                <div className="relative w-16 h-16 md:w-24 md:h-24 flex-shrink-0">
                    <svg className="w-full h-full -rotate-90">
                        <circle
                            cx="50%"
                            cy="50%"
                            r="35%"
                            fill="none"
                            stroke="hsl(var(--border))"
                            strokeWidth="6"
                            className="md:stroke-[8]"
                        />
                        <circle
                            cx="50%"
                            cy="50%"
                            r="35%"
                            fill="none"
                            stroke="hsl(var(--primary))"
                            strokeWidth="6"
                            className="md:stroke-[8]"
                            strokeDasharray="219.9" // Approx 2 * pi * 35% of w
                            strokeDashoffset={219.9 - (219.9 * percentage) / 100}
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center font-bold text-xs md:text-sm">
                        {Math.round(percentage)}%
                    </div>
                </div>
                <div className="flex-1 overflow-hidden h-14 flex flex-col justify-center">
                    <div className="text-xl md:text-3xl font-bold text-foreground">
                        UGX {raised.toLocaleString()} <span className="text-gray-400 font-normal text-sm md:text-base">raised</span>
                    </div>
                    <div className="text-gray-500 text-xs md:text-sm">
                        of <span className="font-semibold text-foreground">UGX {goal.toLocaleString()}</span> goal
                    </div>
                    <div className="relative h-4 mt-1 md:hidden overflow-hidden">
                        {donations.map((donation, index) => (
                            <div
                                key={index}
                                className={`absolute inset-0 text-gray-400 text-[11px] flex items-center gap-1 transition-all duration-500 transform ${index === currentIndex
                                    ? 'translate-y-0 opacity-100'
                                    : index < currentIndex ? '-translate-y-full opacity-0' : 'translate-y-full opacity-0'
                                    }`}
                            >
                                <span className="font-medium text-gray-500">{donation.name}</span> donated {donation.amount} <button className="text-primary"><Share2 className="w-3 h-3 inline" /></button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Buttons Section */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                <Button
                    size="lg"
                    className="w-full h-12 md:h-14 rounded-full text-base md:text-lg font-bold bg-primary hover:bg-primary/90 text-white border-none"
                    onClick={onDonateClick}
                >
                    Donate
                </Button>
                <Button
                    size="lg"
                    variant="secondary"
                    className="w-full h-12 md:h-14 rounded-full text-base md:text-lg font-bold flex items-center justify-center gap-2"
                >
                    <Share2 className="w-4 h-4 md:w-5 md:h-5" />
                    Share
                </Button>
            </div>

            {/* Desktop-only donor info */}
            <div className="hidden md:block pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-primary font-medium">
                    <Heart className="w-5 h-5 fill-primary" />
                    <span>{donationsCount} people recently donated</span>
                </div>
            </div>
        </div>
    );
};

export default DonationProgress;
