
import React, { useEffect, useState } from "react";

const SplashScreen = () => {
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        // Fade out smoothly starting at 3.2s so the splash screen completes precisely at 4s
        const fadeTimer = setTimeout(() => {
            setFadeOut(true);
        }, 3200);

        return () => clearTimeout(fadeTimer);
    }, []);

    return (
        <div
            className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-white transition-opacity duration-800 ease-in-out ${
                fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
        >
            <div className="flex flex-col items-center gap-6">
                <img
                    src="/SSENA LOGO.png"
                    alt="SSENA HEALING AFRICA"
                    className="w-64 md:w-80 h-auto object-contain"
                />
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mt-2" />
            </div>
        </div>
    );
};

export default SplashScreen;
