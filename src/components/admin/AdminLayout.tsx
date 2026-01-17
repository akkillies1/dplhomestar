import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
    LayoutDashboard,
    Image,
    MessageSquare,
    FileText,
    LogOut,
    Menu,
    Users,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface AdminLayoutProps {
    children: ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
    const navigate = useNavigate();
    const { toast } = useToast();

    // Check if user is authenticated AND has admin role
    useEffect(() => {
        const checkAdminAccess = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                // Not authenticated
                toast({
                    title: "Session Timeout",
                    description: "Please try again",
                });
                navigate("/admin/login");
                return;
            }

            // Check if user has admin role
            const isAdmin = user.user_metadata?.is_admin === true;

            if (!isAdmin) {
                // Authenticated but not admin - silent failure
                await supabase.auth.signOut();
                toast({
                    title: "Session Timeout",
                    description: "Please try again",
                });
                navigate("/");
            }
        };

        checkAdminAccess();
    }, [navigate, toast]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        toast({
            title: "Logged out",
            description: "You have been successfully logged out",
        });
        navigate("/admin/login");
    };

    const navItems = [
        { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
        { icon: Users, label: "Leads", path: "/admin/leads" },
        { icon: Image, label: "Gallery", path: "/admin/gallery" },
        { icon: MessageSquare, label: "Testimonials", path: "/admin/testimonials" },
        { icon: FileText, label: "Blog", path: "/admin/blog" },
    ];

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            <div className="mb-8">
                <h1 className="text-2xl font-serif font-medium">Admin Panel</h1>
                <p className="text-sm text-muted-foreground">The DCode</p>
            </div>

            <nav className="space-y-2 flex-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = window.location.pathname === item.path;
                    return (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                ? "bg-accent text-accent-foreground"
                                : "hover:bg-accent/50"
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            <div className="mt-auto pt-6">
                <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleLogout}
                >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                </Button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background">
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card">
                <h1 className="text-lg font-serif font-medium">The DCode</h1>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="w-6 h-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="p-6 bg-white dark:bg-zinc-950">
                        <SidebarContent />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Desktop Sidebar */}
            <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-card border-r border-border p-6 flex-col">
                <SidebarContent />
            </aside>

            {/* Main Content */}
            <main className="md:ml-64 px-4 py-6 md:p-8">{children}</main>
        </div>
    );
};
