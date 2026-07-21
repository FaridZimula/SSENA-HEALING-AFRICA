import { User, Heart } from "lucide-react";

interface Donation {
    id: string;
    name: string;
    amount: number;
    timeAgo: string;
}

const recentDonations: Donation[] = [
    { id: "1", name: "Anonymous", amount: 100000, timeAgo: "2h" },
    { id: "2", name: "Anonymous", amount: 50000, timeAgo: "5h" },
    { id: "3", name: "Chloe Milbourne", amount: 25000, timeAgo: "12h" },
    { id: "4", name: "Bec Thomson", amount: 30000, timeAgo: "1d" },
];

const RecentDonations = () => {
    return (
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 flex flex-col gap-6">
            <h3 className="text-xl font-bold text-foreground">Recent donations</h3>
            <div className="flex flex-col gap-6">
                {recentDonations.map((donation, index) => (
                    <div key={donation.id} className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${index === 0 ? 'bg-orange-50 text-orange-500' :
                            index === 1 ? 'bg-purple-50 text-purple-500' :
                                'bg-gray-50 text-gray-500'
                            }`}>
                            {donation.name === "Anonymous" ? (
                                <Heart className="w-6 h-6" />
                            ) : (
                                donation.name.charAt(0)
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="font-bold text-gray-900 leading-tight">{donation.name}</div>
                            <div className="text-gray-900 font-bold text-lg">
                                UGX {donation.amount.toLocaleString()} <span className="text-gray-400 font-normal text-sm">• {donation.timeAgo}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <button className="text-primary font-bold text-left hover:underline">
                See all
            </button>
        </div>
    );
};

export default RecentDonations;
