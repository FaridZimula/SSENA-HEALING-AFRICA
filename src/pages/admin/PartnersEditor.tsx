
import { useState } from "react";
import { useData, Partner } from "@/context/DataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { compressImage } from "@/lib/image-utils";

const PartnersEditor = () => {
    const { partners, updatePartners } = useData();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState<number>(-1);
    const [formData, setFormData] = useState<Partner | null>(null);

    const handleDelete = async (index: number) => {
        if (confirm("Delete this partner?")) {
            const list = [...partners];
            list.splice(index, 1);
            await updatePartners(list);
        }
    };

    const openEditor = (partner: Partner | null, index: number) => {
        setSelectedIndex(index);
        setFormData(partner ? { ...partner } : { name: "", logo: "" });
        setIsDialogOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData) return;

        setIsSaving(true);
        try {
            const list = [...partners];
            if (selectedIndex === -1) list.push(formData);
            else list[selectedIndex] = formData;

            await updatePartners(list);
            setIsDialogOpen(false);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Partners</h1>
                <Button onClick={() => openEditor(null, -1)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Partner
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
                {partners.map((partner, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm border p-4 flex flex-col items-center text-center">
                        <div className="w-full h-32 bg-gray-50 rounded-lg mb-3 flex items-center justify-center p-4">
                            <img src={partner.logo} alt={partner.name} className="max-w-full max-h-full object-contain" />
                        </div>
                        <h3 className="font-bold mb-4">{partner.name}</h3>

                        <div className="flex gap-2 mt-auto w-full">
                            <Button variant="outline" className="flex-1" size="sm" onClick={() => openEditor(partner, index)}>Edit</Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDelete(index)}><Trash2 className="w-4 h-4" /></Button>
                        </div>
                    </div>
                ))}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedIndex === -1 ? "Add Partner" : "Edit Partner"}</DialogTitle>
                    </DialogHeader>
                    {formData && (
                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Partner Name</Label>
                                <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                            </div>
                            <div className="space-y-4">
                                <Label>Partner Logo (Auto-compressed)</Label>
                                {formData.logo && (
                                    <div className="relative w-32 h-32 mx-auto bg-gray-50 rounded-lg flex items-center justify-center p-2 mb-2 border">
                                        <img src={formData.logo} alt="Preview" className="max-w-full max-h-full object-contain" />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-1 right-1 h-6 w-6"
                                            onClick={() => setFormData({ ...formData, logo: "" })}
                                        >
                                            <Trash2 className="w-3 h-3" />
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
                                                const compressed = await compressImage(reader.result as string, 800, 800);
                                                setFormData({ ...formData, logo: compressed });
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                />
                                <p className="text-xs text-muted-foreground">Upload partner logo. It will be automatically optimized.</p>
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

export default PartnersEditor;
