import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Eye, EyeOff, Star, Edit } from "lucide-react";

interface Testimonial {
    id: string;
    client_name: string;
    client_photo_url: string | null;
    rating: number;
    review_text: string;
    project_type: string | null;
    location: string | null;
    is_published: boolean;
    display_order: number;
}

export const TestimonialsManager = () => {
    const navigate = useNavigate();
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            const { data, error } = await supabase
                .from("testimonials")
                .select("*")
                .order("display_order", { ascending: true });

            if (error) throw error;
            setTestimonials(data || []);
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
                .from("testimonials")
                .update({ is_published: !currentStatus })
                .eq("id", id);

            if (error) throw error;

            toast({
                title: "Success",
                description: `Testimonial ${!currentStatus ? "published" : "unpublished"}`,
            });

            fetchTestimonials();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    const deleteTestimonial = async (id: string) => {
        if (!confirm("Are you sure you want to delete this testimonial?")) return;

        try {
            const { error } = await supabase
                .from("testimonials")
                .delete()
                .eq("id", id);

            if (error) throw error;

            toast({
                title: "Success",
                description: "Testimonial deleted",
            });

            fetchTestimonials();
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
                        <h1 className="text-3xl font-serif font-medium mb-2">
                            Testimonials
                        </h1>
                        <p className="text-muted-foreground">
                            Manage client reviews and feedback
                        </p>
                    </div>
                    <Button onClick={() => navigate("/admin/testimonials/new")}>Add New Testimonial</Button>
                </div>

                <div className="space-y-4">
                    {testimonials.map((testimonial) => (
                        <Card key={testimonial.id} className="p-6">
                            <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-4 mb-3">
                                        <h3 className="text-xl font-medium">
                                            {testimonial.client_name}
                                        </h3>
                                        <div className="flex gap-1">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-4 h-4 ${i < testimonial.rating
                                                        ? "fill-yellow-400 text-yellow-400"
                                                        : "text-gray-300"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        {!testimonial.is_published && (
                                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                                Draft
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-muted-foreground mb-2">
                                        "{testimonial.review_text}"
                                    </p>

                                    <div className="flex gap-4 text-sm text-muted-foreground">
                                        {testimonial.project_type && (
                                            <span>📋 {testimonial.project_type}</span>
                                        )}
                                        {testimonial.location && (
                                            <span>📍 {testimonial.location}</span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => navigate(`/admin/testimonials/${testimonial.id}`)}
                                    >
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            togglePublish(testimonial.id, testimonial.is_published)
                                        }
                                    >
                                        {testimonial.is_published ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => deleteTestimonial(testimonial.id)}
                                    >
                                        <Trash2 className="w-4 h-4 text-red-600" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}

                    {testimonials.length === 0 && (
                        <Card className="p-12 text-center">
                            <p className="text-muted-foreground mb-4">
                                No testimonials yet
                            </p>
                            <Button>Add Your First Testimonial</Button>
                        </Card>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};
