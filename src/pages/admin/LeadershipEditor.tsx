
import { useState } from "react";
import { useData, Leader } from "@/context/DataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { compressImage } from "@/lib/image-utils";

const LeadershipEditor = () => {
    const { leaders, boardMembers, updateLeaders, updateBoardMembers } = useData();
    const [activeTab, setActiveTab] = useState("directors");
    const [isSaving, setIsSaving] = useState(false);

    // State for Dialog
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState<number>(-1);
    const [formData, setFormData] = useState<Leader | null>(null);

    const getCurrentList = () => activeTab === "directors" ? leaders : boardMembers;
    const updateCurrentList = async (list: Leader[]) => activeTab === "directors" ? await updateLeaders(list) : await updateBoardMembers(list);

    const handleDelete = async (index: number) => {
        if (confirm("Delete this member?")) {
            const list = [...getCurrentList()];
            list.splice(index, 1);
            await updateCurrentList(list);
        }
    };

    const openEditor = (member: Leader | null, index: number) => {
        setSelectedIndex(index);
        setFormData(member ? { ...member } : { name: "", role: "", bio: "", image: "" });
        setIsDialogOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData) return;

        setIsSaving(true);
        try {
            const list = [...getCurrentList()];
            if (selectedIndex === -1) list.push(formData);
            else list[selectedIndex] = formData;

            await updateCurrentList(list);
            setIsDialogOpen(false);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Leadership</h1>
                <Button onClick={() => openEditor(null, -1)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Member
                </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList>
                    <TabsTrigger value="directors">Board of Directors</TabsTrigger>
                    <TabsTrigger value="executive">Executive Committee</TabsTrigger>
                </TabsList>

                <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {getCurrentList().map((member, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-sm border p-4 flex flex-col items-center text-center">
                            <img src={member.image} alt={member.name} className="w-20 h-20 rounded-full object-cover mb-3 bg-gray-100" />
                            <h3 className="font-bold text-lg mb-1">{member.name}</h3>
                            <p className="text-sm text-primary mb-2">{member.role}</p>
                            {member.bio && <p className="text-sm text-gray-500 line-clamp-2 mb-4">{member.bio}</p>}

                            <div className="flex gap-2 mt-auto">
                                <Button variant="outline" size="sm" onClick={() => openEditor(member, index)}>Edit</Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(index)}><Trash2 className="w-4 h-4" /></Button>
                            </div>
                        </div>
                    ))}
                </div>
            </Tabs>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedIndex === -1 ? "Add Member" : "Edit Member"}</DialogTitle>
                    </DialogHeader>
                    {formData && (
                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Name</Label>
                                <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                            </div>
                            <div className="space-y-2">
                                <Label>Role</Label>
                                <Input value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} required />
                            </div>
                            <div className="space-y-2">
                                <Label>Bio (Optional)</Label>
                                <Textarea value={formData.bio || ""} onChange={e => setFormData({ ...formData, bio: e.target.value })} />
                            </div>
                            <div className="space-y-4">
                                <Label>Profile Image (Auto-compressed)</Label>
                                {formData.image && (
                                    <div className="relative w-32 h-32 mx-auto">
                                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover rounded-full border" />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-0 right-0 h-8 w-8 rounded-full"
                                            onClick={() => setFormData({ ...formData, image: "" })}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                )}
                                <Input
                                    type="file"
                                    accept="image/*"
                                    disabled={isSaving}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onloadend = async () => {
                                                const compressed = await compressImage(reader.result as string, 500, 500);
                                                setFormData({ ...formData, image: compressed });
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                />
                                <p className="text-xs text-muted-foreground">Upload a profile picture. It will be optimized for fast loading.</p>
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                                <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} disabled={isSaving}>Cancel</Button>
                                <Button type="submit" disabled={isSaving}>
                                    {isSaving ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Saving...
                                        </>
                                    ) : "Save Changes"}
                                </Button>
                            </div>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default LeadershipEditor;
