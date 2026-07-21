import { useState } from "react";
import { useData, Video } from "@/context/DataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Video as VideoIcon, Loader2, PlayCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const VideosEditor = () => {
    const { videos, updateVideos } = useData();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState<number>(-1);
    const [formData, setFormData] = useState<Partial<Video> | null>(null);

    const openEdit = (video: Video, index: number) => {
        setSelectedIndex(index);
        setFormData({ ...video });
        setIsDialogOpen(true);
    };

    const openNew = () => {
        setSelectedIndex(-1);
        setFormData({
            title: "",
            description: "",
            video_url: "",
            thumbnail_url: ""
        });
        setIsDialogOpen(true);
    };

    const handleDelete = async (index: number) => {
        if (confirm("Are you sure you want to delete this video?")) {
            const newVideos = [...videos];
            newVideos.splice(index, 1);
            await updateVideos(newVideos);
        }
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData) return;

        setIsSaving(true);
        try {
            const newVideos = [...videos];
            const videoData = formData as Video;
            if (selectedIndex === -1) {
                newVideos.push({ ...videoData, id: crypto.randomUUID(), created_at: new Date().toISOString(), order: newVideos.length });
            } else {
                newVideos[selectedIndex] = videoData;
            }
            await updateVideos(newVideos);
            setIsDialogOpen(false);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-600">
                        <VideoIcon className="w-6 h-6" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Video Gallery</h1>
                </div>
                <Button onClick={openNew}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Video
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {videos.map((video, index) => (
                    <div key={video.id} className="bg-white rounded-2xl shadow-sm border overflow-hidden flex flex-col group">
                        <div className="aspect-video bg-gray-100 relative">
                            {video.thumbnail_url ? (
                                <img src={video.thumbnail_url} alt={video.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <PlayCircle className="w-12 h-12" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                <PlayCircle className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity scale-90 group-hover:scale-100 duration-300" />
                            </div>
                        </div>
                        <div className="p-4 flex-1">
                            <h3 className="font-bold text-lg mb-1 truncate">{video.title}</h3>
                            <p className="text-sm text-gray-500 line-clamp-2">{video.description}</p>
                            <div className="mt-4 flex justify-end gap-2 pt-4 border-t">
                                <Button variant="outline" size="sm" onClick={() => openEdit(video, index)}>Edit</Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(index)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle>{selectedIndex === -1 ? "Add New Video" : "Edit Video"}</DialogTitle>
                    </DialogHeader>
                    {formData && (
                        <form onSubmit={handleFormSubmit} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label>Video Title</Label>
                                <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                            </div>
                            <div className="space-y-2">
                                <Label>Video URL (YouTube or Direct Link)</Label>
                                <Input 
                                    placeholder="https://www.youtube.com/watch?v=..." 
                                    value={formData.video_url} 
                                    onChange={e => setFormData({ ...formData, video_url: e.target.value })} 
                                    required 
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Thumbnail URL (Optional)</Label>
                                <Input 
                                    placeholder="https://..." 
                                    value={formData.thumbnail_url} 
                                    onChange={e => setFormData({ ...formData, thumbnail_url: e.target.value })} 
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                            </div>
                            
                            <div className="flex justify-end gap-2 pt-6">
                                <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} disabled={isSaving}>Cancel</Button>
                                <Button type="submit" disabled={isSaving}>
                                    {isSaving ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Saving...
                                        </>
                                    ) : "Save Video"}
                                </Button>
                            </div>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default VideosEditor;
