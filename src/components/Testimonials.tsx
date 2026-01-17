import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { StarSpinner } from "./StarSpinner";

interface Testimonial {
    id: string;
    client_name: string;
    client_photo_url: string | null;
    rating: number;
    review_text: string;
    project_type: string | null;
    location: string | null;
}

export const Testimonials = () => {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            const { data, error } = await supabase
                .from('testimonials')
                .select('*')
                .eq('is_published', true)
                .order('display_order', { ascending: true })
                .limit(6);

            if (error) throw error;
            setTestimonials(data || []);
        } catch (error) {
            console.error('Error fetching testimonials:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }).map((_, index) => (
            <Star
                key={index}
                className={`w-5 h-5 ${index < rating ? 'fill-[#FCD34D] text-[#FCD34D]' : 'text-foreground/10'
                    }`}
            />
        ));
    };

    return (
        <section id="testimonials" className="py-[100px] md:py-[140px] bg-background reveal">
            <div className="container-custom">
                {loading ? (
                    <div className="flex flex-col items-center justify-center min-h-[400px]">
                        <StarSpinner size="w-16 h-16" />
                        <p className="text-foreground/30 mt-6 tracking-widest uppercase text-xs font-bold">Loading Testimonials</p>
                    </div>
                ) : testimonials.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-foreground/30">No testimonials yet.</p>
                    </div>
                ) : (
                    <>
                        <div className="text-center mb-16">
                            <h2 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter text-foreground">
                                Client Testimonials
                            </h2>
                            <p className="text-xl text-foreground/50 max-w-2xl mx-auto font-light italic">
                                What our clients say about working with us
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {testimonials.map((testimonial, index) => (
                                <Card
                                    key={testimonial.id}
                                    className="p-10 bg-card border-border shadow-2xl transition-all duration-500 hover:border-accent/40 animate-fade-in"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className="flex items-center gap-4 mb-6">
                                        {testimonial.client_photo_url ? (
                                            <img
                                                src={testimonial.client_photo_url}
                                                alt={testimonial.client_name}
                                                className="w-14 h-14 rounded-full object-cover border-2 border-accent/20"
                                            />
                                        ) : (
                                            <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center">
                                                <span className="text-2xl font-bold text-accent">
                                                    {testimonial.client_name.charAt(0)}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg text-foreground mb-1 uppercase tracking-wide">{testimonial.client_name}</h3>
                                            {testimonial.project_type && (
                                                <p className="text-xs text-accent font-medium uppercase tracking-widest">
                                                    {testimonial.project_type}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex gap-1 mb-6">{renderStars(testimonial.rating)}</div>

                                    <p className="text-foreground/70 leading-relaxed mb-6 italic font-light text-lg">
                                        "{testimonial.review_text}"
                                    </p>

                                    {testimonial.location && (
                                        <div className="pt-4 border-t border-border">
                                            <p className="text-sm text-foreground/40 font-medium">
                                                {testimonial.location}
                                            </p>
                                        </div>
                                    )}
                                </Card>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
};
