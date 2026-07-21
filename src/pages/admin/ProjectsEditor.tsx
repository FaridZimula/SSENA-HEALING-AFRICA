
import { useState } from "react";
import { useData, Project } from "@/context/DataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, X, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { compressImage } from "@/lib/image-utils";
import * as Icons from "lucide-react";

const SUPPORTED_ICONS = [
    "Target", "Heart", "Zap", "Users", "BookOpen", "Briefcase", "Shield", "Globe", "Award", "Star"
];

const ProjectsEditor = () => {
    const { projects, updateProjects } = useData();

    // Keep order consistent with the frontend
    const originalOrder = [
        "Youth Leadership in Community Action",
        "Outreach to Ishaka Adventist Hospital",
        "Basoga Nssete Leadership Training",
        "Mentorship and Career Guidance",
        "Inter-University Mentorship Front",
        "Community Outreach: Market Cleanup",
        "Community Outreach: Elderly & Orphans",
        "44th Tarehe Sita Anniversary Celebrations",
        "State Dinner: 44th Tarehe Sita Anniversary",
        "National University Leadership Training",
        "Mentorship at Bassajabalaba Secondary School",
        "Counseling and Guidance at Bassajabalaba Secondary School",
        "Tech & Innovation: Mastering the New Economy"
    ];

    const sortedProjects = projects
        .filter(p => originalOrder.includes(p.title))
        .sort((a, b) => {
            const indexA = originalOrder.indexOf(a.title);
            const indexB = originalOrder.indexOf(b.title);
            return indexA - indexB;
        });

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState<number>(-1); // -1 = new
    const [formData, setFormData] = useState<Project | null>(null);

    const openEdit = (project: Project, index: number) => {
        setSelectedIndex(index);
        setFormData({ ...project });
        setIsDialogOpen(true);
    };

    const openNew = () => {
        setSelectedIndex(-1);
        setFormData({
            title: "",
            category: "",
            description: "",
            shortDescription: "",
            impact: "",
            images: [],
            icon: "Target"
        });
        setIsDialogOpen(true);
    };

    const handleDelete = async (index: number) => {
        if (confirm("Are you sure you want to delete this project?")) {
            const newProjects = [...projects];
            newProjects.splice(index, 1);
            await updateProjects(newProjects);
        }
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData) return;

        setIsSaving(true);
        try {
            const newProjects = [...projects];
            if (selectedIndex === -1) {
                newProjects.push(formData);
            } else {
                newProjects[selectedIndex] = formData;
            }
            await updateProjects(newProjects);
            setIsDialogOpen(false);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
                <Button onClick={openNew}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Project
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {sortedProjects.map((project, index) => {
                    const Icon = (Icons[project.icon as keyof typeof Icons] as React.ElementType) || Icons.HelpCircle;
                    return (
                        <div key={index} className="bg-white rounded-xl shadow-sm border p-4 flex flex-col">
                            <div className="flex items-start justify-between mb-2">
                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                    <Icon className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold uppercase">
                                    {project.category}
                                </span>
                            </div>
                            <h3 className="font-bold text-lg mb-1 truncate">{project.title}</h3>
                            <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-1">{project.description}</p>

                            <div className="flex justify-end gap-2 mt-auto pt-2 border-t">
                                <Button variant="outline" size="sm" onClick={() => openEdit(project, index)}>Edit</Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(index)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{selectedIndex === -1 ? "Add New Project" : "Edit Project"}</DialogTitle>
                    </DialogHeader>
                    {formData && (
                        <form onSubmit={handleFormSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Title</Label>
                                    <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Category</Label>
                                    <Input value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} required />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Icon</Label>
                                    <Select value={formData.icon} onValueChange={val => setFormData({ ...formData, icon: val })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Icon" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {SUPPORTED_ICONS.map(icon => (
                                                <SelectItem key={icon} value={icon}>
                                                    <div className="flex items-center gap-2">
                                                        {icon}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Impact Stat</Label>
                                    <Input value={formData.impact} onChange={e => setFormData({ ...formData, impact: e.target.value })} placeholder="e.g. 500+ Students" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Short Description (Home Page Card)</Label>
                                <Textarea value={formData.shortDescription} onChange={e => setFormData({ ...formData, shortDescription: e.target.value })} required />
                            </div>
                            <div className="space-y-2">
                                <Label>Full Description</Label>
                                <Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="min-h-[100px]" required />
                            </div>
                            
                            <div className="space-y-4">
                                <Label>Project Images (Auto-compressed)</Label>
                                <div className="grid grid-cols-3 gap-2 mb-2">
                                    {formData.images.map((img, idx) => (
                                        <div key={idx} className="relative aspect-video group">
                                            <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover rounded-md border" />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => {
                                                    const newImages = [...formData.images];
                                                    newImages.splice(idx, 1);
                                                    setFormData({ ...formData, images: newImages });
                                                }}
                                            >
                                                <X className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        disabled={isSaving}
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onloadend = async () => {
                                                    const compressed = await compressImage(reader.result as string);
                                                    setFormData({ ...formData, images: [...formData.images, compressed] });
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground italic">Images are automatically optimized to ensure live updates sync correctly.</p>
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

export default ProjectsEditor;
