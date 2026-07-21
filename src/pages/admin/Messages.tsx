
import { useData } from "@/context/DataContext";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, CheckCircle, MailOpen } from "lucide-react";

const Messages = () => {
    const { messages, markMessageRead, deleteMessage } = useData();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
                <div className="text-sm text-gray-500">
                    Total: {messages.length} | Unread: {messages.filter(m => !m.read).length}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Sender</TableHead>
                            <TableHead>Subject</TableHead>
                            <TableHead>Message</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {messages.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                    No messages yet.
                                </TableCell>
                            </TableRow>
                        ) : (
                            messages.map((msg) => (
                                <TableRow key={msg.id} className={msg.read ? "bg-gray-50" : "bg-white"}>
                                    <TableCell>
                                        {msg.read ? (
                                            <MailOpen className="w-5 h-5 text-gray-400" />
                                        ) : (
                                            <div className="w-3 h-3 bg-blue-500 rounded-full" title="Unread" />
                                        )}
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap text-gray-600">
                                        {format(new Date(msg.date), "MMM d, yyyy")}
                                        <div className="text-xs text-gray-400">{format(new Date(msg.date), "h:mm a")}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">{msg.name}</div>
                                        <div className="text-xs text-gray-500">{msg.email}</div>
                                        <div className="text-xs text-gray-500">{msg.phone}</div>
                                    </TableCell>
                                    <TableCell className="font-medium">{msg.subject}</TableCell>
                                    <TableCell className="max-w-md truncate text-gray-600" title={msg.message}>
                                        {msg.message}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            {!msg.read && (
                                                <Button variant="ghost" size="icon" onClick={() => markMessageRead(msg.id)} title="Mark as Read">
                                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                                </Button>
                                            )}
                                            <Button variant="ghost" size="icon" onClick={() => deleteMessage(msg.id)} title="Delete">
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </Button>
                                        </div>
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

export default Messages;
