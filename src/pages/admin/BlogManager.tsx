import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Eye, EyeOff, Edit } from "lucide-react";

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    featured_image_url: string | null;
    author: string;
    tags: string[];
    is_published: boolean;
    published_at: string | null;
    created_at: string;
}

export const BlogManager = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const { data, error } = await supabase
                .from("blog_posts")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setPosts(data || []);
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const togglePublish = async (id: string, currentStatus: boolean) => {
        try {
            const { error } = await supabase
                .from("blog_posts")
                .update({
                    is_published: !currentStatus,
                    published_at: !currentStatus ? new Date().toISOString() : null,
                })
                .eq("id", id);

            if (error) throw error;

            toast({
                title: "Success",
                description: `Post ${!currentStatus ? "published" : "unpublished"}`,
            });

            fetchPosts();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    const deletePost = async (id: string) => {
        if (!confirm("Are you sure you want to delete this blog post?")) return;

        try {
            const { error } = await supabase
                .from("blog_posts")
                .delete()
                .eq("id", id);

            if (error) throw error;

            toast({
                title: "Success",
                description: "Blog post deleted",
            });

            fetchPosts();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-serif font-medium mb-2">Blog Posts</h1>
                        <p className="text-muted-foreground">
                            Manage your blog content and SEO
                        </p>
                    </div>
                    <Button onClick={() => navigate("/admin/blog/new")}>Create New Post</Button>
                </div>

                <div className="space-y-4">
                    {posts.map((post) => (
                        <Card key={post.id} className="p-6">
                            <div className="flex flex-col md:flex-row gap-6">
                                {post.featured_image_url && (
                                    <img
                                        src={post.featured_image_url}
                                        alt={post.title}
                                        className="w-32 h-32 object-cover rounded"
                                    />
                                )}

                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h3 className="text-xl font-medium mb-1">{post.title}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                /{post.slug}
                                            </p>
                                        </div>

                                        <div className="flex gap-2">
                                            {!post.is_published && (
                                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                                    Draft
                                                </span>
                                            )}
                                            {post.is_published && (
                                                <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                                                    Published
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {post.excerpt && (
                                        <p className="text-muted-foreground mb-3 line-clamp-2">
                                            {post.excerpt}
                                        </p>
                                    )}

                                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                                        <span>By {post.author}</span>
                                        <span>•</span>
                                        <span>
                                            {new Date(post.created_at).toLocaleDateString()}
                                        </span>
                                        {post.tags.length > 0 && (
                                            <>
                                                <span>•</span>
                                                <div className="flex gap-1">
                                                    {post.tags.slice(0, 3).map((tag) => (
                                                        <span
                                                            key={tag}
                                                            className="bg-accent px-2 py-0.5 rounded text-xs"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => navigate(`/admin/blog/${post.id}`)}
                                        >
                                            <Edit className="w-4 h-4 mr-2" />
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => togglePublish(post.id, post.is_published)}
                                        >
                                            {post.is_published ? (
                                                <EyeOff className="w-4 h-4" />
                                            ) : (
                                                <Eye className="w-4 h-4" />
                                            )}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => deletePost(post.id)}
                                        >
                                            <Trash2 className="w-4 h-4 text-red-600" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}

                    {posts.length === 0 && (
                        <Card className="p-12 text-center">
                            <p className="text-muted-foreground mb-4">No blog posts yet</p>
                            <Button>Create Your First Post</Button>
                        </Card>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};
