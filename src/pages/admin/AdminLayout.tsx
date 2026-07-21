
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Navigate, Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, MessageSquare, Briefcase, Users, LogOut, Settings, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminLayout = () => {
    const { isAuthenticated, logout } = useAuth();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    const navItems = [
        { label: "Messages", path: "/admin", icon: MessageSquare },
        { label: "Donations", path: "/admin/donations", icon: LayoutDashboard },
        { label: "Videos", path: "/admin/videos", icon: MessageSquare },
        { label: "Members", path: "/admin/members", icon: Users },
        { label: "Projects", path: "/admin/projects", icon: Briefcase },
        { label: "Leadership", path: "/admin/leadership", icon: Users },
        { label: "Partners", path: "/admin/partners", icon: Settings },
    ];

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="min-h-screen bg-background flex relative text-foreground">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border shadow-md flex-col transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:flex
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            `}>
                <div className="p-6 border-b border-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src="/SSENA LOGO.jpg" alt="SSENA HEALING AFRICA" className="w-10 h-10 object-contain rounded-lg" />
                        <h2 className="text-xl font-bold text-primary">SUYEL Admin</h2>
                    </div>
                    {/* Close button for mobile */}
                    <button className="md:hidden text-muted-foreground" onClick={() => setIsSidebarOpen(false)}>
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsSidebarOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === item.path
                                ? "bg-primary text-primary-foreground font-semibold"
                                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t border-border">
                    <Button variant="ghost" className="w-full justify-start gap-3 text-red-500 hover:text-red-400 hover:bg-red-950/20" onClick={logout}>
                        <LogOut className="w-5 h-5" />
                        Logout
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Mobile Header */}
                <header className="md:hidden bg-card border-b border-border p-4 flex items-center justify-between z-10">
                    <div className="flex items-center gap-3">
                        <button onClick={toggleSidebar} className="text-foreground">
                            <Menu className="w-6 h-6" />
                        </button>
                        <span className="font-bold text-primary">Admin Dashboard</span>
                    </div>
                    {/* <Button variant="outline" size="sm" onClick={logout}>Logout</Button> */}
                </header>

                <div className="flex-1 overflow-auto p-4 md:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
