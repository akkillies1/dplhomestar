import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Image, MessageSquare, FileText, TrendingUp, Users } from "lucide-react";

export const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalImages: 0,
        totalTestimonials: 0,
        totalBlogPosts: 0,
        publishedPosts: 0,
        totalLeads: 0,
        newLeads: 0,
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [imagesRes, testimonialsRes, blogRes, leadsRes] = await Promise.all([
                supabase.from("gallery_images").select("id", { count: "exact" }),
                supabase.from("testimonials").select("id", { count: "exact" }),
                supabase.from("blog_posts").select("id, is_published", { count: "exact" }),
                supabase.from("leads").select("id, status", { count: "exact" }),
            ]);

            setStats({
                totalImages: imagesRes.count || 0,
                totalTestimonials: testimonialsRes.count || 0,
                totalBlogPosts: blogRes.count || 0,
                publishedPosts: blogRes.data?.filter((p) => p.is_published).length || 0,
                totalLeads: leadsRes.count || 0,
                newLeads: leadsRes.data?.filter((l) => l.status === 'new').length || 0,
            });
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    };

    const statCards = [
        {
            icon: Users,
            label: "Total Leads",
            value: stats.totalLeads,
            color: "text-red-600",
            bgColor: "bg-red-50",
        },
        {
            icon: Image,
            label: "Gallery Images",
            value: stats.totalImages,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            icon: MessageSquare,
            label: "Testimonials",
            value: stats.totalTestimonials,
            color: "text-green-600",
            bgColor: "bg-green-50",
        },
        {
            icon: FileText,
            label: "Blog Posts",
            value: stats.totalBlogPosts,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
        },
    ];

    return (
        <AdminLayout>
            <div>
                <h1 className="text-3xl font-serif font-medium mb-2">Dashboard</h1>
                <p className="text-muted-foreground mb-8">
                    Welcome to your content management system
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {statCards.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={stat.label} className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                                        <Icon className={`w-6 h-6 ${stat.color}`} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                                        <p className="text-2xl font-semibold">{stat.value}</p>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>

                <Card className="p-6">
                    <h2 className="text-xl font-medium mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <a
                            href="/admin/leads"
                            className="p-4 border border-border rounded-lg hover:bg-accent transition-colors"
                        >
                            <Users className="w-8 h-8 mb-2 text-red-600" />
                            <h3 className="font-medium mb-1">Manage Leads</h3>
                            <p className="text-sm text-muted-foreground">
                                {stats.newLeads} new enquiries
                            </p>
                        </a>
                        <a
                            href="/admin/gallery"
                            className="p-4 border border-border rounded-lg hover:bg-accent transition-colors"
                        >
                            <Image className="w-8 h-8 mb-2 text-blue-600" />
                            <h3 className="font-medium mb-1">Manage Gallery</h3>
                            <p className="text-sm text-muted-foreground">
                                Upload and organize images
                            </p>
                        </a>
                        <a
                            href="/admin/testimonials"
                            className="p-4 border border-border rounded-lg hover:bg-accent transition-colors"
                        >
                            <MessageSquare className="w-8 h-8 mb-2 text-green-600" />
                            <h3 className="font-medium mb-1">Add Testimonial</h3>
                            <p className="text-sm text-muted-foreground">
                                Manage client reviews
                            </p>
                        </a>
                        <a
                            href="/admin/blog"
                            className="p-4 border border-border rounded-lg hover:bg-accent transition-colors"
                        >
                            <FileText className="w-8 h-8 mb-2 text-purple-600" />
                            <h3 className="font-medium mb-1">Write Blog Post</h3>
                            <p className="text-sm text-muted-foreground">
                                Create new content
                            </p>
                        </a>
                    </div>
                </Card>
            </div>
        </AdminLayout>
    );
};
