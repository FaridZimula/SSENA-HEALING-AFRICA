import React, { useState, useEffect } from 'react';
import { Share2 } from "lucide-react";
import { Button } from "./ui/button";

interface DonationStickyBarProps {
    raised: number;
    goal: number;
    lastDonorName?: string;
    lastDonorAmount?: string;
    onDonateClick: () => void;
    isVisible: boolean;
}

const DonationStickyBar = ({
    raised,
    goal,
    onDonateClick,
    isVisible
}: DonationStickyBarProps) => {
    const percentage = Math.min((raised / goal) * 100, 100);
    const [currentIndex, setCurrentIndex] = useState(0);

    const donations = [
        { name: "Zimula Farid", amount: "UGX 100,000", time: "2h" },
        { name: "Hannah Davis", amount: "UGX 65,000", time: "5h" },
        { name: "Oshin Josephs", amount: "UGX 35,000", time: "12h" },
        { name: "Anonymous", amount: "UGX 50,000", time: "1d" }
    ];

    useEffect(() => {
        if (!isVisible) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % donations.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [isVisible, donations.length]);

    return (
        <div
            className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 transform md:hidden ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
                }`}
        >
            <div className="bg-card m-4 rounded-[2rem] shadow-2xl p-4 border border-border">
                <div className="flex flex-col gap-4">
                    {/* Stats Row */}
                    <div className="flex items-center gap-4 px-2">
                        <div className="relative w-12 h-12 flex-shrink-0">
                            <svg className="w-full h-full -rotate-90">
                                <circle
                                    cx="50%"
                                    cy="50%"
                                    r="40%"
                                    fill="none"
                                    stroke="hsl(var(--border))"
                                    strokeWidth="4"
                                />
                                <circle
                                    cx="50%"
                                    cy="50%"
                                    r="40%"
                                    fill="none"
                                    stroke="hsl(var(--primary))"
                                    strokeWidth="4"
                                    strokeDasharray="125.6" // 2 * pi * 20
                                    strokeDashoffset={125.6 - (125.6 * percentage) / 100}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center font-bold text-[10px]">
                                {Math.round(percentage)}%
                            </div>
                        </div>
                        <div className="flex-1 overflow-hidden h-10 flex flex-col justify-center">
                            <div className="text-lg font-bold text-foreground leading-tight">
                                UGX {raised.toLocaleString()} <span className="text-gray-400 font-normal text-xs uppercase tracking-wider">raised</span>
                            </div>
                            <div className="relative h-4 mt-0.5 overflow-hidden">
                                {donations.map((donation, index) => (
                                    <div
                                        key={index}
                                        className={`absolute inset-0 text-gray-400 text-[11px] flex items-center gap-1 transition-all duration-500 transform ${index === currentIndex
                                            ? 'translate-y-0 opacity-100'
                                            : index < currentIndex ? '-translate-y-full opacity-0' : 'translate-y-full opacity-0'
                                            }`}
                                    >
                                        <span className="font-medium text-gray-500">{donation.name}</span> donated {donation.amount} <Share2 className="w-3 h-3 text-primary inline" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Buttons Row */}
                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            size="sm"
                            className="w-full h-12 rounded-full text-base font-bold bg-primary hover:bg-primary/90 text-white border-none"
                            onClick={onDonateClick}
                        >
                            Donate
                        </Button>
                        <Button
                            size="sm"
                            variant="secondary"
                            className="w-full h-12 rounded-full text-base font-bold flex items-center justify-center gap-2"
                        >
                            <Share2 className="w-4 h-4" />
                            Share
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DonationStickyBar;
