import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Loader2 } from "lucide-react";

export const BlogPostForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [fetching, setFetching] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        author: "Admin",
        tags: "",
        is_published: false,
    });

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            fetchPost();
        }
    }, [id]);

    const fetchPost = async () => {
        setFetching(true);
        try {
            const { data, error } = await supabase
                .from('blog_posts')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;

            if (data) {
                setFormData({
                    title: data.title,
                    slug: data.slug,
                    excerpt: data.excerpt || "",
                    content: data.content,
                    author: data.author || "Admin",
                    tags: data.tags ? data.tags.join(", ") : "",
                    is_published: data.is_published || false,
                });
                if (data.featured_image_url) {
                    setImagePreview(data.featured_image_url);
                }
            }
        } catch (error) {
            console.error("Error fetching post:", error);
            toast({
                title: "Error",
                description: "Failed to load blog post",
                variant: "destructive",
            });
            navigate("/admin/blog");
        } finally {
            setFetching(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        // Only auto-generate slug if creating new post
        if (!id) {
            setFormData({
                ...formData,
                title,
                slug: generateSlug(title)
            });
        } else {
            setFormData({ ...formData, title });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let featuredImageUrl = imagePreview; // Default to existing image

            // 1. Upload new image if selected
            if (imageFile) {
                setUploading(true);
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('blog-images')
                    .upload(filePath, imageFile);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('blog-images')
                    .getPublicUrl(filePath);

                featuredImageUrl = publicUrl;
            }

            // 2. Save record to database
            const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== "");

            const postData = {
                title: formData.title,
                slug: formData.slug,
                excerpt: formData.excerpt,
                content: formData.content,
                featured_image_url: featuredImageUrl,
                author: formData.author,
                tags: tagsArray,
                is_published: formData.is_published,
                published_at: formData.is_published ? (id ? undefined : new Date().toISOString()) : null,
                updated_at: new Date().toISOString(),
            };

            let error;
            if (id) {
                const { error: updateError } = await supabase
                    .from('blog_posts')
                    .update(postData)
                    .eq('id', id);
                error = updateError;
            } else {
                const { error: insertError } = await supabase
                    .from('blog_posts')
                    .insert(postData);
                error = insertError;
            }

            if (error) throw error;

            toast({
                title: "Success",
                description: `Blog post ${id ? 'updated' : 'created'} successfully`,
            });

            navigate("/admin/blog");
        } catch (error: any) {
            console.error("Error:", error);
            toast({
                title: "Error",
                description: error.message || "Something went wrong",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
            setUploading(false);
        }
    };

    if (fetching) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-serif font-medium">Write Blog Post</h1>
                    <Button variant="outline" onClick={() => navigate("/admin/blog")}>
                        Cancel
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="p-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={handleTitleChange}
                                        placeholder="Enter post title"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="slug">Slug</Label>
                                    <Input
                                        id="slug"
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        placeholder="post-url-slug"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="content">Content</Label>
                                    <Textarea
                                        id="content"
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        placeholder="Write your blog post content here..."
                                        className="min-h-[400px] font-mono"
                                        required
                                    />
                                    <p className="text-xs text-muted-foreground">Markdown is supported</p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card className="p-6">
                            <h3 className="font-medium mb-4">Publishing</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="published">Publish immediately</Label>
                                    <Switch
                                        id="published"
                                        checked={formData.is_published}
                                        onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                                    />
                                </div>
                                <Button
                                    onClick={handleSubmit}
                                    className="w-full"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            {uploading ? "Uploading..." : "Saving..."}
                                        </>
                                    ) : (
                                        "Save Post"
                                    )}
                                </Button>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <h3 className="font-medium mb-4">Featured Image</h3>
                            <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:bg-accent/50 transition-colors">
                                {imagePreview ? (
                                    <div className="relative">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full rounded-lg"
                                        />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-2 right-2"
                                            onClick={() => {
                                                setImageFile(null);
                                                setImagePreview(null);
                                            }}
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center py-4">
                                        <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                                        <p className="text-xs text-muted-foreground mb-2">
                                            Upload cover image
                                        </p>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            id="blog-image-upload"
                                            onChange={handleImageChange}
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => document.getElementById('blog-image-upload')?.click()}
                                        >
                                            Select Image
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </Card>

                        <Card className="p-6">
                            <h3 className="font-medium mb-4">Metadata</h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="excerpt">Excerpt</Label>
                                    <Textarea
                                        id="excerpt"
                                        value={formData.excerpt}
                                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                        placeholder="Short summary..."
                                        rows={3}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="author">Author</Label>
                                    <Input
                                        id="author"
                                        value={formData.author}
                                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tags">Tags</Label>
                                    <Input
                                        id="tags"
                                        value={formData.tags}
                                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                        placeholder="Design, Tips, News"
                                    />
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};
