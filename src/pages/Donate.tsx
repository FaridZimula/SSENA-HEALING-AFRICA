import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Heart, Smartphone, CheckCircle2, ArrowRight, Share2, Calendar, User, Info, Landmark } from "lucide-react";
import DonationProgress from "@/components/DonationProgress";
import RecentDonations from "@/components/RecentDonations";
import DonationStickyBar from "@/components/DonationStickyBar";
import heroImage from "@/assets/hero-youth.jpg";
import SEO from "@/components/SEO";

const Donate = () => {
    const navigate = useNavigate();
    const [isStickyVisible, setIsStickyVisible] = useState(false);
    const heroRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (heroRef.current) {
                const heroBottom = heroRef.current.getBoundingClientRect().bottom;
                setIsStickyVisible(heroBottom < 100);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navigateToPay = () => {
        navigate("/donate/pay");
    };

    return (
        <Layout>
            <SEO
                title="Support Our Mission | Donate to SSENA HEALING AFRICA"
                description="Your contribution helps us provide professional counseling, trauma healing workshops, and mental health support. Support our mission today."
            />
            {/* Hero Section */}
            <section className="bg-zinc-900 section-padding relative overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-30">
                    <img
                        src="/Pad 10.webp"
                        alt="Support SSENA HEALING AFRICA"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="container-narrow mx-auto text-center relative z-10">
                    <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-6">
                        Support Our Mission
                    </h1>
                    <p className="text-lg text-white max-w-2xl mx-auto">
                        Your contribution helps us provide counseling, trauma healing workshops, and mental wellness support across communities.
                    </p>
                </div>
            </section>

            <section className="section-padding bg-background">
                <div className="container-narrow mx-auto">
                    <div className="grid lg:grid-cols-3 gap-8 md:gap-12">
                        <div className="lg:col-span-2 space-y-8 md:space-y-12">
                            <div ref={heroRef} className="relative aspect-[4/5] md:aspect-video rounded-b-[3.5rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl" data-aos="fade-up">
                                <img
                                    src="/KINGS 1.webp"
                                    alt="SSENA HEALING AFRICA support programs - Healing hearts, rebuilding lives"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 md:p-12">
                                    <div className="space-y-4">
                                        <h2 className="text-4xl md:text-6xl font-bold text-white drop-shadow-2xl leading-tight">
                                            SUPPORT HEALING & RECOVERY
                                        </h2>
                                        <p className="md:hidden text-lg font-bold text-white/90 leading-snug">
                                            Restoring Hope & Building Resilience
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:hidden" data-aos="fade-up">
                                <DonationProgress
                                    raised={5712000}
                                    goal={15000000}
                                    donationsCount={174}
                                    onDonateClick={navigateToPay}
                                />
                            </div>


                            <div className="prose prose-lg max-w-none text-gray-600 space-y-6" data-aos="fade-up">
                                <p className="leading-relaxed">
                                    SSENA HEALING AFRICA is a community-based organization dedicated to promoting mental wellness, emotional healing, and holistic support across communities in Africa.
                                </p>
                                <p className="leading-relaxed">
                                    Our mission is to provide professional, confidential counseling services and trauma healing workshops. Your donation directly funds:
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Talk therapy and counseling sessions for vulnerable individuals.</li>
                                    <li>Substance abuse and addiction recovery programs.</li>
                                    <li>Trauma healing workshops in remote communities.</li>
                                    <li>School counseling, self-discovery, and peer support programs.</li>
                                </ul>
                            </div>

                            <div className="pt-8 border-t border-gray-100" data-aos="fade-up">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-3 bg-primary/5 rounded-2xl">
                                        <Calendar className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500 font-medium">Fundraiser started</div>
                                        <div className="font-bold text-gray-900">January 15, 2026</div>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <Button variant="outline" className="flex-1 h-14 rounded-full border-2 border-primary text-primary hover:bg-primary/5 font-bold text-lg">
                                        <Share2 className="w-5 h-5 mr-2" /> Share
                                    </Button>
                                    <Button onClick={navigateToPay} className="flex-1 h-14 rounded-full font-bold text-lg shadow-lg shadow-primary/20">
                                        Donate now
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <aside className="hidden lg:block space-y-8 sticky top-28 h-fit">
                            <DonationProgress
                                raised={5712000}
                                goal={15000000}
                                donationsCount={174}
                                onDonateClick={navigateToPay}
                            />
                            
                            {/* Direct Bank Account Card */}
                            <div className="bg-black text-white rounded-[2rem] p-6 border border-neutral-800 shadow-xl space-y-4">
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
                                        <h4 className="font-bold text-base text-white">Direct Bank Transfer</h4>
                                        <p className="text-xs text-neutral-400">Official Bank Wire Details</p>
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

                            <RecentDonations />
                        </aside>
                    </div>
                </div>
            </section>

            <DonationStickyBar
                raised={5712000}
                goal={15000000}
                onDonateClick={navigateToPay}
                isVisible={isStickyVisible}
            />
        </Layout>
    );
};

export default Donate;
