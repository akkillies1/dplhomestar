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
import { Loader2 } from "lucide-react";

export const TestimonialForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(!!id);

    const [formData, setFormData] = useState({
        client_name: "",
        rating: "5",
        review_text: "",
        project_type: "",
        location: "",
        is_published: true,
        display_order: 0,
    });

    useEffect(() => {
        if (id) {
            fetchTestimonial();
        }
    }, [id]);

    const fetchTestimonial = async () => {
        try {
            const { data, error } = await supabase
                .from("testimonials")
                .select("*")
                .eq("id", id)
                .single();

            if (error) throw error;

            if (data) {
                setFormData({
                    client_name: data.client_name,
                    rating: data.rating.toString(),
                    review_text: data.review_text,
                    project_type: data.project_type || "",
                    location: data.location || "",
                    is_published: data.is_published,
                    display_order: data.display_order,
                });
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
            navigate("/admin/testimonials");
        } finally {
            setInitialLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const testimonialData = {
                client_name: formData.client_name,
                rating: parseInt(formData.rating),
                review_text: formData.review_text,
                project_type: formData.project_type,
                location: formData.location,
                is_published: formData.is_published,
                display_order: formData.display_order || 0,
            };

            let error;

            if (id) {
                const { error: updateError } = await supabase
                    .from('testimonials')
                    .update(testimonialData)
                    .eq('id', id);
                error = updateError;
            } else {
                const { error: insertError } = await supabase
                    .from('testimonials')
                    .insert(testimonialData);
                error = insertError;
            }

            if (error) throw error;

            toast({
                title: "Success",
                description: `Testimonial ${id ? "updated" : "added"} successfully`,
            });

            navigate("/admin/testimonials");
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

    if (initialLoading) {
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
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-serif font-medium">{id ? "Edit Testimonial" : "Add Testimonial"}</h1>
                    <Button variant="outline" onClick={() => navigate("/admin/testimonials")}>
                        Cancel
                    </Button>
                </div>

                <Card className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Client Name */}
                        <div className="space-y-2">
                            <Label htmlFor="client_name">Client Name</Label>
                            <Input
                                id="client_name"
                                value={formData.client_name}
                                onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                                placeholder="e.g., John Doe"
                                required
                            />
                        </div>

                        {/* Rating */}
                        <div className="space-y-2">
                            <Label htmlFor="rating">Rating</Label>
                            <Select
                                value={formData.rating}
                                onValueChange={(value) => setFormData({ ...formData, rating: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select rating" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="5">⭐⭐⭐⭐⭐ (5 Stars)</SelectItem>
                                    <SelectItem value="4">⭐⭐⭐⭐ (4 Stars)</SelectItem>
                                    <SelectItem value="3">⭐⭐⭐ (3 Stars)</SelectItem>
                                    <SelectItem value="2">⭐⭐ (2 Stars)</SelectItem>
                                    <SelectItem value="1">⭐ (1 Star)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Review Text */}
                        <div className="space-y-2">
                            <Label htmlFor="review_text">Review</Label>
                            <Textarea
                                id="review_text"
                                value={formData.review_text}
                                onChange={(e) => setFormData({ ...formData, review_text: e.target.value })}
                                placeholder="Client's feedback..."
                                rows={4}
                                required
                            />
                        </div>

                        {/* Project Type */}
                        <div className="space-y-2">
                            <Label htmlFor="project_type">Project Type</Label>
                            <Input
                                id="project_type"
                                value={formData.project_type}
                                onChange={(e) => setFormData({ ...formData, project_type: e.target.value })}
                                placeholder="e.g., Residential Renovation"
                            />
                        </div>

                        {/* Location */}
                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                placeholder="e.g., Kochi, Kerala"
                            />
                        </div>

                        {/* Published Status */}
                        <div className="flex items-center justify-between border p-4 rounded-lg">
                            <Label htmlFor="published">Published</Label>
                            <Switch
                                id="published"
                                checked={formData.is_published}
                                onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                            />
                        </div>

                        <Button type="submit" className="w-full" size="lg" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save Testimonial"
                            )}
                        </Button>
                    </form>
                </Card>
            </div>
        </AdminLayout>
    );
};
