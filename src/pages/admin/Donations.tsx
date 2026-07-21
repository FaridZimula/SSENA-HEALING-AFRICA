import { useData } from "@/context/DataContext";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Smartphone, CheckCircle2, Clock, XCircle } from "lucide-react";

const Donations = () => {
    const { donations, isLoading } = useData();

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'SUCCESSFUL':
                return <Badge className="bg-green-100 text-green-700 border-green-200"><CheckCircle2 className="w-3 h-3 mr-1" /> Successful</Badge>;
            case 'PENDING':
                return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
            case 'INITIATED':
                return <Badge className="bg-blue-100 text-blue-700 border-blue-200"><Smartphone className="w-3 h-3 mr-1" /> Sent PIN</Badge>;
            case 'FAILED':
                return <Badge className="bg-red-100 text-red-700 border-red-200"><XCircle className="w-3 h-3 mr-1" /> Failed</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                        <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Donations</h1>
                        <p className="text-gray-500">Track real-time mobile money and card donations.</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                        UGX {donations.filter(d => d.status === 'SUCCESSFUL').reduce((acc, d) => acc + d.amount, 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">Total Successful Collections</div>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] shadow-sm border overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50">
                        <TableRow>
                            <TableHead>Status</TableHead>
                            <TableHead>Date & Time</TableHead>
                            <TableHead>Donor</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead>Reference</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-12">
                                    <div className="flex flex-col items-center gap-2 text-gray-400">
                                        <Clock className="w-8 h-8 animate-pulse" />
                                        <span>Loading real-time data...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : donations.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                                    No donations recorded yet.
                                </TableCell>
                            </TableRow>
                        ) : (
                            donations.map((d) => (
                                <TableRow key={d.id} className="hover:bg-gray-50/50 transition-colors">
                                    <TableCell>
                                        {getStatusBadge(d.status)}
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap">
                                        <div className="font-medium">{format(new Date(d.created_at), "MMM d, yyyy")}</div>
                                        <div className="text-xs text-gray-400">{format(new Date(d.created_at), "h:mm a")}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-bold text-gray-900">
                                            {d.is_anonymous ? "Anonymous Donor" : `${d.first_name || ''} ${d.last_name || ''}`.trim() || "Guest"}
                                        </div>
                                        <div className="text-xs text-gray-500">{d.email || d.phone}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-bold text-blue-600">
                                            UGX {d.amount.toLocaleString()}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {d.provider === 'card' ? (
                                                <DollarSign className="w-4 h-4 text-gray-400" />
                                            ) : (
                                                <Smartphone className="w-4 h-4 text-gray-400" />
                                            )}
                                            <span className="capitalize text-sm font-medium">{d.provider}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-mono text-[10px] text-gray-400">
                                        {d.transaction_ref || 'N/A'}
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

export default Donations;
