import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { GalleryModal } from "./GalleryModal";
import { StarSpinner } from "./StarSpinner";

interface GalleryImage {
    id: string;
    title: string;
    description: string | null;
    image_url: string;
    thumbnail_url: string | null;
    tags: string[];
    alt_text?: string | null;
}

export const Gallery = () => {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentIndices, setCurrentIndices] = useState<number[]>([0, 1, 2, 3]);

    useEffect(() => {
        fetchFeaturedImages();
    }, []);

    // Auto-slide effect - randomly change one image every 3 seconds
    useEffect(() => {
        if (images.length <= 4) return; // Don't animate if 4 or fewer images

        const interval = setInterval(() => {
            setCurrentIndices(prev => {
                // Pick a random position (0-3) to replace
                const positionToReplace = Math.floor(Math.random() * 4);

                // Get all available indices not currently shown
                const availableIndices = images
                    .map((_, idx) => idx)
                    .filter(idx => !prev.includes(idx));

                if (availableIndices.length === 0) return prev;

                // Pick a random available image
                const randomAvailableIndex = availableIndices[
                    Math.floor(Math.random() * availableIndices.length)
                ];

                // Replace the selected position
                const newIndices = [...prev];
                newIndices[positionToReplace] = randomAvailableIndex;

                return newIndices;
            });
        }, 3000); // Change every 3 seconds

        return () => clearInterval(interval);
    }, [images]);

    const fetchFeaturedImages = async () => {
        try {
            const { data, error } = await supabase
                .from('gallery_images')
                .select('*')
                .eq('is_published', true)
                .order('display_order', { ascending: true });

            if (error) throw error;
            setImages(data || []);
        } catch (error) {
            console.error('Error fetching gallery images:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <section id="work" className="py-[100px] md:py-[140px] bg-background">
                <div className="container-custom">
                    <div className="flex flex-col items-center justify-center min-h-[400px]">
                        <StarSpinner size="w-16 h-16" />
                        <p className="text-foreground/30 mt-6 tracking-widest uppercase text-xs font-bold">Loading Gallery</p>
                    </div>
                </div>
            </section>
        );
    }

    if (images.length === 0) {
        return null; // Don't show section if no images
    }

    // Get the 4 currently displayed images
    const displayedImages = currentIndices.map(idx => images[idx]).filter(Boolean);

    return (
        <>
            <section id="work" className="py-[100px] md:py-[140px] bg-background reveal">
                <div className="container-custom">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter text-foreground">
                            Our Work
                        </h2>
                        <p className="text-xl text-foreground/50 max-w-2xl mx-auto font-light italic">
                            A curated selection of our interior design projects
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {displayedImages.map((image, index) => (
                            <Card
                                key={`${image.id}-${currentIndices[index]}`}
                                className="group relative overflow-hidden cursor-pointer border-border bg-card aspect-square transition-all duration-500 hover:border-accent/40"
                                onClick={() => setIsModalOpen(true)}
                            >
                                <img
                                    src={image.thumbnail_url || image.image_url}
                                    alt={image.alt_text || image.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F13]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                    <div className="text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                        <h3 className="font-bold text-lg mb-1 text-accent uppercase tracking-wider">{image.title}</h3>
                                        {image.description && (
                                            <p className="text-sm text-white/70 line-clamp-2 font-light">
                                                {image.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    <div className="text-center mt-16">
                        <Button
                            size="lg"
                            variant="outline"
                            onClick={() => setIsModalOpen(true)}
                            className="min-w-[200px] md:min-w-[240px] h-12 md:h-14 border-accent text-accent hover:bg-accent hover:text-accent-foreground font-bold rounded-full transition-all duration-500 uppercase tracking-widest text-[10px] md:text-xs"
                        >
                            Explore Full Gallery
                        </Button>
                    </div>
                </div>
            </section>

            <GalleryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
};

