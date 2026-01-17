import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Eye, EyeOff, Star, Edit } from "lucide-react";

interface GalleryImage {
    id: string;
    title: string;
    description: string | null;
    image_url: string;
    thumbnail_url: string | null;
    tags: string[];
    is_featured: boolean;
    is_published: boolean;
    display_order: number;
}

export const GalleryManager = () => {
    const navigate = useNavigate();
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const { data, error } = await supabase
                .from("gallery_images")
                .select("*")
                .order("display_order", { ascending: true });

            if (error) throw error;
            setImages(data || []);
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
                .from("gallery_images")
                .update({ is_published: !currentStatus })
                .eq("id", id);

            if (error) throw error;

            toast({
                title: "Success",
                description: `Image ${!currentStatus ? "published" : "unpublished"}`,
            });

            fetchImages();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    const toggleFeatured = async (id: string, currentStatus: boolean) => {
        try {
            const { error } = await supabase
                .from("gallery_images")
                .update({ is_featured: !currentStatus })
                .eq("id", id);

            if (error) throw error;

            toast({
                title: "Success",
                description: `Image ${!currentStatus ? "featured" : "unfeatured"}`,
            });

            fetchImages();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    const deleteImage = async (id: string) => {
        if (!confirm("Are you sure you want to delete this image?")) return;

        try {
            const { error } = await supabase
                .from("gallery_images")
                .delete()
                .eq("id", id);

            if (error) throw error;

            toast({
                title: "Success",
                description: "Image deleted",
            });

            fetchImages();
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
                        <h1 className="text-3xl font-serif font-medium mb-2">Gallery</h1>
                        <p className="text-muted-foreground">
                            Manage your portfolio images
                        </p>
                    </div>
                    <Button onClick={() => navigate("/admin/gallery/new")}>Upload New Image</Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {images.map((image) => (
                        <Card key={image.id} className="overflow-hidden">
                            <div className="relative aspect-square">
                                <img
                                    src={image.thumbnail_url || image.image_url}
                                    alt={image.title}
                                    className="w-full h-full object-cover"
                                />
                                {image.is_featured && (
                                    <div className="absolute top-2 right-2 bg-yellow-400 text-black px-2 py-1 rounded text-xs font-medium">
                                        ⭐ Featured
                                    </div>
                                )}
                                {!image.is_published && (
                                    <div className="absolute top-2 left-2 bg-gray-900 text-white px-2 py-1 rounded text-xs">
                                        Draft
                                    </div>
                                )}
                            </div>

                            <div className="p-4">
                                <h3 className="font-medium mb-2">{image.title}</h3>
                                {image.description && (
                                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                        {image.description}
                                    </p>
                                )}

                                {image.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mb-3">
                                        {image.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="text-xs bg-accent px-2 py-1 rounded"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => toggleFeatured(image.id, image.is_featured)}
                                    >
                                        <Star
                                            className={`w-4 h-4 ${image.is_featured ? "fill-yellow-400" : ""
                                                }`}
                                        />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => navigate(`/admin/gallery/${image.id}`)}
                                    >
                                        <Edit className="w-4 h-4 mr-2" /> Edit
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => togglePublish(image.id, image.is_published)}
                                    >
                                        {image.is_published ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => deleteImage(image.id)}
                                    >
                                        <Trash2 className="w-4 h-4 text-red-600" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}

                    {images.length === 0 && (
                        <Card className="col-span-full p-12 text-center">
                            <p className="text-muted-foreground mb-4">No images yet</p>
                            <Button>Upload Your First Image</Button>
                        </Card>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};
