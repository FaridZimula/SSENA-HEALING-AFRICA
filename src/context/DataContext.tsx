import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { projects as initialProjects } from '@/data/projects';
import { leaders as initialLeaders, boardMembers as initialBoardMembers } from '@/data/leadership';
import { partners as initialPartners } from '@/data/partners';
const initialVideos: Video[] = [
    { 
        id: 'default-video',
        title: "Our Impact & Mission", 
        description: "A highlight of our activities and the impact we are making in the community.", 
        video_url: "https://youtube.com/shorts/sk4vFIBLSR4", 
        order: 0,
        created_at: new Date().toISOString()
    }
];

export { initialProjects, initialLeaders, initialBoardMembers, initialPartners };

export interface Project {
    id?: string;
    title: string;
    category: string;
    description: string;
    shortDescription?: string;
    short_description?: string;
    impact: string;
    images: string[];
    icon: string;
    order?: number;
}

export interface Leader {
    id?: string;
    name: string;
    role: string;
    bio?: string;
    image: string;
    type?: 'LEADER' | 'BOARD';
    order?: number;
}

export interface Partner {
    id?: string;
    name: string;
    logo: string;
    order?: number;
}

export interface Message {
    id: string;
    full_name: string;
    email: string;
    subject: string;
    content: string;
    created_at: string;
    read: boolean;
    name?: string;
    message?: string;
    date?: string;
}

export interface Donation {
    id: string;
    amount: number;
    status: string;
    created_at: string;
    donor_name?: string;
    email?: string;
}

export interface Video {
    id: string;
    title: string;
    description: string;
    video_url: string;
    thumbnail_url?: string;
    order: number;
    created_at: string;
}

interface DataContextType {
    projects: Project[];
    leaders: Leader[];
    boardMembers: Leader[];
    partners: Partner[];
    messages: Message[];
    donations: Donation[];
    videos: Video[];
    isLoading: boolean;

    updateProjects: (projects: Project[]) => Promise<void>;
    updateLeaders: (leaders: Leader[]) => Promise<void>;
    updateBoardMembers: (members: Leader[]) => Promise<void>;
    updatePartners: (partners: Partner[]) => Promise<void>;
    updateVideos: (videos: Video[]) => Promise<void>;
    markMessageRead: (id: string) => Promise<void>;
    deleteMessage: (id: string) => Promise<void>;
    resetData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [projects, setProjects] = useState<Project[]>(initialProjects);
    const [leaders, setLeaders] = useState<Leader[]>(initialLeaders);
    const [boardMembers, setBoardMembers] = useState<Leader[]>(initialBoardMembers);
    const [partners, setPartners] = useState<Partner[]>(initialPartners);
    const [messages, setMessages] = useState<Message[]>([]);
    const [donations, setDonations] = useState<Donation[]>([]);
    const [videos, setVideos] = useState<Video[]>(initialVideos);
    const [isLoading, setIsLoading] = useState(true);

    // Initial load from Supabase
    useEffect(() => {
        const fetchAllData = async () => {
            setIsLoading(true);
            try {
                const [
                    { data: projectsData },
                    { data: leadersData },
                    { data: partnersData },
                    { data: messagesData },
                    { data: donationsData },
                    { data: videosData }
                ] = await Promise.all([
                    supabase.from('projects').select('*').order('order'),
                    supabase.from('leaders').select('*').order('order'),
                    supabase.from('partners').select('*').order('order'),
                    supabase.from('messages').select('*').order('created_at', { ascending: false }),
                    supabase.from('donations').select('*').order('created_at', { ascending: false }),
                    supabase.from('videos').select('*').order('order')
                ]);

                if (projectsData && projectsData.length > 0) {
                    setProjects(projectsData.map(p => ({
                        ...p,
                        shortDescription: p.short_description || p.shortDescription
                    })));
                } else {
                    setProjects(initialProjects);
                }
                
                if (leadersData && leadersData.length > 0) {
                    setLeaders(leadersData.filter(l => l.type === 'LEADER'));
                    setBoardMembers(leadersData.filter(l => l.type === 'BOARD'));
                } else {
                    setLeaders(initialLeaders);
                    setBoardMembers(initialBoardMembers);
                }
                
                if (partnersData && partnersData.length > 0) {
                    setPartners(partnersData);
                } else {
                    setPartners(initialPartners);
                }
                
                if (messagesData) {
                    setMessages(messagesData.map(m => ({
                        ...m,
                        name: m.full_name,
                        message: m.content,
                        date: m.created_at,
                        read: m.read || false
                    })));
                }

                if (donationsData) setDonations(donationsData);
                
                const RICK_ROLL_ID = 'dQw4w9WgXcQ';
                if (videosData && videosData.length > 0) {
                    // Filter out the Rick Astley placeholder if it exists
                    const filtered = videosData.filter(v => !v.video_url.includes(RICK_ROLL_ID));
                    if (filtered.length > 0) {
                        setVideos(filtered);
                    } else {
                        setVideos(initialVideos);
                    }
                } else {
                    setVideos(initialVideos);
                }

            } catch (error) {
                console.error("Failed to fetch data from Supabase, using local defaults:", error);
                setProjects(initialProjects);
                setLeaders(initialLeaders);
                setBoardMembers(initialBoardMembers);
                setPartners(initialPartners);
                setVideos(initialVideos);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllData();

        // Realtime Subscriptions
        const messagesChannel = supabase
            .channel('messages-db-changes')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
                const newMessage = payload.new as any;
                setMessages(prev => [{
                    ...newMessage,
                    name: newMessage.full_name,
                    message: newMessage.content,
                    date: newMessage.created_at,
                    read: false
                }, ...prev]);
                toast.info(`New message from ${newMessage.full_name}`);
            })
            .subscribe();

        const donationsChannel = supabase
            .channel('donations-db-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'donations' }, payload => {
                if (payload.eventType === 'INSERT') {
                    setDonations(prev => [payload.new as Donation, ...prev]);
                    toast.success(`New donation of UGX ${payload.new.amount}`);
                } else if (payload.eventType === 'UPDATE') {
                    setDonations(prev => prev.map(d => d.id === payload.new.id ? payload.new as Donation : d));
                    if (payload.new.status === 'SUCCESSFUL') {
                        toast.success(`Payment confirmed for UGX ${payload.new.amount}!`);
                    }
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(messagesChannel);
            supabase.removeChannel(donationsChannel);
        };
    }, []);

    const updateProjects = async (newProjects: Project[]) => {
        try {
            await supabase.from('projects').delete().neq('id', '00000000-0000-0000-0000-000000000000');
            const cleaned = newProjects.map((p, i) => ({
                title: p.title,
                category: p.category,
                description: p.description,
                short_description: p.shortDescription || p.short_description,
                impact: p.impact,
                images: p.images,
                icon: p.icon,
                order: i
            }));
            const { data, error } = await supabase.from('projects').insert(cleaned).select();
            if (error) throw error;
            setProjects(data.map(p => ({ ...p, shortDescription: p.short_description })));
            toast.success("Projects updated");
        } catch (error: any) {
            toast.error(`Sync failed: ${error.message}`);
            throw error;
        }
    };

    const updateLeaders = async (newLeaders: Leader[]) => {
        try {
            await supabase.from('leaders').delete().eq('type', 'LEADER');
            const cleaned = newLeaders.map((l, i) => ({
                name: l.name, role: l.role, bio: l.bio, image: l.image, type: 'LEADER', order: i
            }));
            const { data, error } = await supabase.from('leaders').insert(cleaned).select();
            if (error) throw error;
            setLeaders(data);
            toast.success("Leadership updated");
        } catch (error: any) {
            toast.error("Cloud sync failed");
            throw error;
        }
    };

    const updateBoardMembers = async (newMembers: Leader[]) => {
        try {
            await supabase.from('leaders').delete().eq('type', 'BOARD');
            const cleaned = newMembers.map((l, i) => ({
                name: l.name, role: l.role, bio: l.bio, image: l.image, type: 'BOARD', order: i
            }));
            const { data, error } = await supabase.from('leaders').insert(cleaned).select();
            if (error) throw error;
            setBoardMembers(data);
            toast.success("Board members updated");
        } catch (error: any) {
            throw error;
        }
    };

    const updatePartners = async (newPartners: Partner[]) => {
        try {
            await supabase.from('partners').delete().neq('id', '00000000-0000-0000-0000-000000000000');
            const cleaned = newPartners.map((p, i) => ({ name: p.name, logo: p.logo, order: i }));
            const { data, error } = await supabase.from('partners').insert(cleaned).select();
            if (error) throw error;
            setPartners(data);
            toast.success("Partners updated");
        } catch (error: any) {
            throw error;
        }
    };

    const updateVideos = async (newVideos: Video[]) => {
        try {
            await supabase.from('videos').delete().neq('id', '00000000-0000-0000-0000-000000000000');
            const cleaned = newVideos.map((v, i) => ({
                title: v.title,
                description: v.description,
                video_url: v.video_url,
                thumbnail_url: v.thumbnail_url,
                order: i
            }));
            const { data, error } = await supabase.from('videos').insert(cleaned).select();
            if (error) throw error;
            setVideos(data);
            toast.success("Video Gallery updated");
        } catch (error: any) {
            toast.error("Failed to sync videos");
            throw error;
        }
    };

    const markMessageRead = async (id: string) => {
        try {
            await supabase.from('messages').update({ read: true }).eq('id', id);
            setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
        } catch (error) {}
    };

    const deleteMessage = async (id: string) => {
        try {
            await supabase.from('messages').delete().eq('id', id);
            setMessages(prev => prev.filter(m => m.id !== id));
            toast.success("Message deleted");
        } catch (error) {}
    };

    const resetData = () => {
        window.location.reload();
    };

    return (
        <DataContext.Provider value={{
            projects,
            leaders,
            boardMembers,
            partners,
            messages,
            donations,
            videos,
            isLoading,
            updateProjects,
            updateLeaders,
            updateBoardMembers,
            updatePartners,
            updateVideos,
            markMessageRead,
            deleteMessage,
            resetData
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) throw new Error('useData must be used within a DataProvider');
    return context;
};
