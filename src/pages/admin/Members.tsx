import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { API_URL } from "@/config";
import { Loader2, Users, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Member {
    _id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    paymentPhone: string;
    provider: string;
    status: string;
    amount: number;
    createdAt: string;
}

const Members = () => {
    const [members, setMembers] = useState<Member[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchMembers = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/admin/members`);
            if (response.ok) {
                const data = await response.json();
                setMembers(data);
            }
        } catch (error) {
            console.error("Error fetching members:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    const filteredMembers = members.filter(member =>
        member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.phoneNumber.includes(searchTerm)
    );

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'SUCCESSFUL':
                return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">Successful</Badge>;
            case 'FAILED':
                return <Badge variant="destructive">Failed</Badge>;
            case 'INITIATED':
            case 'PENDING':
                return <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">Pending</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        <Users className="w-8 h-8 text-primary" />
                        Members List
                    </h1>
                    <p className="text-muted-foreground mt-1">Track and manage online membership registrations.</p>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border w-full sm:w-auto">
                    <Search className="w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Search members..."
                        className="border-none shadow-none focus-visible:ring-0 p-0 h-auto text-sm w-full sm:w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-[2rem] shadow-sm border overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50/50">
                        <TableRow>
                            <TableHead className="font-bold py-5 px-6">Date</TableHead>
                            <TableHead className="font-bold py-5">Full Name</TableHead>
                            <TableHead className="font-bold py-5">Contact Info</TableHead>
                            <TableHead className="font-bold py-5">Payment Details</TableHead>
                            <TableHead className="font-bold py-5">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-20">
                                    <div className="flex flex-col items-center gap-3">
                                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                                        <p className="text-muted-foreground font-medium">Loading members...</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredMembers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-20 text-gray-500">
                                    {searchTerm ? "No members match your search." : "No members registered yet."}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredMembers.map((member) => (
                                <TableRow key={member._id} className="hover:bg-gray-50/50 transition-colors">
                                    <TableCell className="px-6">
                                        <div className="font-medium text-gray-900">
                                            {format(new Date(member.createdAt), "MMM d, yyyy")}
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            {format(new Date(member.createdAt), "h:mm a")}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-bold text-gray-900">{member.fullName}</div>
                                        <div className="text-xs text-gray-500">{member.email}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm font-medium">{member.phoneNumber}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold uppercase text-gray-400">{member.provider}</span>
                                            <span className="text-sm">{member.paymentPhone}</span>
                                        </div>
                                        <div className="text-[10px] font-bold text-primary mt-1">UGX {member.amount.toLocaleString()}</div>
                                    </TableCell>
                                    <TableCell>
                                        {getStatusBadge(member.status)}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default Members;
