import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Loader2, Link } from "lucide-react";

export const GalleryImageForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [fetching, setFetching] = useState(!!id);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        tags: "",
        is_featured: false,
        is_published: true,
        display_order: 0,
        social_media_url: "",
        social_media_source: "",
    });

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            fetchImage();
        }
    }, [id]);

    const fetchImage = async () => {
        try {
            const { data, error } = await supabase
                .from('gallery_images')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;

            if (data) {
                setFormData({
                    title: data.title,
                    description: data.description || "",
                    tags: data.tags ? data.tags.join(", ") : "",
                    is_featured: data.is_featured || false,
                    is_published: data.is_published || true,
                    display_order: data.display_order || 0,
                    social_media_url: data.social_media_url || "",
                    social_media_source: data.social_media_source || "",
                });
                setImagePreview(data.image_url);
            }
        } catch (error) {
            console.error("Error fetching image:", error);
            toast({
                title: "Error",
                description: "Could not fetch image details",
                variant: "destructive",
            });
            navigate("/admin/gallery");
        } finally {
            setFetching(false);
        }
    };

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        let source = formData.social_media_source;

        if (url.includes("instagram.com")) source = "instagram";
        else if (url.includes("facebook.com")) source = "facebook";
        else if (url.includes("pinterest.com")) source = "pinterest";

        setFormData({ ...formData, social_media_url: url, social_media_source: source });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!imageFile && !id) {
            toast({
                title: "Error",
                description: "Please select an image",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);

        try {
            let publicUrl = imagePreview;

            // 1. Upload image to Supabase Storage if new file selected
            if (imageFile) {
                setUploading(true);
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('gallery-images')
                    .upload(filePath, imageFile);

                if (uploadError) throw uploadError;

                const { data } = supabase.storage
                    .from('gallery-images')
                    .getPublicUrl(filePath);

                publicUrl = data.publicUrl;
            }

            // 2. Save record to database
            const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== "");

            const payload = {
                title: formData.title,
                description: formData.description,
                image_url: publicUrl,
                thumbnail_url: publicUrl, // Using same URL for now
                tags: tagsArray,
                is_featured: formData.is_featured,
                is_published: formData.is_published,
                display_order: formData.display_order || 0,
                social_media_url: formData.social_media_url || null,
                social_media_source: formData.social_media_source || null,
            };

            let error;
            if (id) {
                const { error: updateError } = await supabase
                    .from('gallery_images')
                    .update(payload)
                    .eq('id', id);
                error = updateError;
            } else {
                const { error: insertError } = await supabase
                    .from('gallery_images')
                    .insert(payload);
                error = insertError;
            }

            if (error) throw error;

            toast({
                title: "Success",
                description: `Image ${id ? "updated" : "uploaded"} successfully`,
            });

            navigate("/admin/gallery");
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
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-serif font-medium">{id ? "Edit Image" : "Add New Image"}</h1>
                    <Button variant="outline" onClick={() => navigate("/admin/gallery")}>
                        Cancel
                    </Button>
                </div>

                <Card className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Image Upload */}
                        <div className="space-y-2">
                            <Label>Image</Label>
                            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:bg-accent/50 transition-colors">
                                {imagePreview ? (
                                    <div className="relative">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="max-h-[300px] mx-auto rounded-lg"
                                        />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-2 right-2"
                                            onClick={() => {
                                                setImageFile(null);
                                                if (!id) setImagePreview(null); // Keep preview if editing and reverting to original
                                            }}
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <Upload className="w-10 h-10 text-muted-foreground mb-2" />
                                        <p className="text-sm text-muted-foreground mb-2">
                                            Drag and drop or click to upload
                                        </p>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            id="image-upload"
                                            onChange={handleImageChange}
                                        />
                                        <Button type="button" variant="outline" onClick={() => document.getElementById('image-upload')?.click()}>
                                            Select Image
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Title */}
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g., Modern Living Room"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Brief description of the project..."
                                rows={3}
                            />
                        </div>

                        {/* Tags */}
                        <div className="space-y-2">
                            <Label htmlFor="tags">Tags (comma separated)</Label>
                            <Input
                                id="tags"
                                value={formData.tags}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                placeholder="e.g., Residential, Kitchen, Modern"
                            />
                        </div>

                        {/* Social Media Integration */}
                        <div className="space-y-4 border p-4 rounded-lg bg-accent/5">
                            <h3 className="font-medium flex items-center gap-2">
                                <Link className="w-4 h-4" />
                                Social Media Link
                            </h3>
                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="social_media_url">Post URL</Label>
                                    <Input
                                        id="social_media_url"
                                        value={formData.social_media_url}
                                        onChange={handleUrlChange}
                                        placeholder="https://instagram.com/p/..."
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Paste a link to the original social media post
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="social_media_source">Source</Label>
                                    <Select
                                        value={formData.social_media_source}
                                        onValueChange={(value) => setFormData({ ...formData, social_media_source: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select platform" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="instagram">Instagram</SelectItem>
                                            <SelectItem value="facebook">Facebook</SelectItem>
                                            <SelectItem value="pinterest">Pinterest</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Options */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center justify-between border p-4 rounded-lg">
                                <Label htmlFor="featured">Featured</Label>
                                <Switch
                                    id="featured"
                                    checked={formData.is_featured}
                                    onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                                />
                            </div>
                            <div className="flex items-center justify-between border p-4 rounded-lg">
                                <Label htmlFor="published">Published</Label>
                                <Switch
                                    id="published"
                                    checked={formData.is_published}
                                    onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full" size="lg" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    {uploading ? "Uploading..." : "Saving..."}
                                </>
                            ) : (
                                id ? "Update Image" : "Save Image"
                            )}
                        </Button>
                    </form>
                </Card>
            </div>
        </AdminLayout>
    );
};
