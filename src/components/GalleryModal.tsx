import { X, ChevronLeft, ChevronRight, ExternalLink, Instagram, Facebook } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import * as DialogPrimitive from "@radix-ui/react-dialog";

interface GalleryImage {
    id: string;
    title: string;
    description: string | null;
    image_url: string;
    tags: string[];
    social_media_url?: string | null;
    social_media_source?: string | null;
}

interface GalleryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const GalleryModal = ({ isOpen, onClose }: GalleryModalProps) => {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isImageLoading, setIsImageLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            fetchImages();
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            setSelectedTag(null);
            setCurrentIndex(0);
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const fetchImages = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('gallery_images')
                .select('*')
                .eq('is_published', true)
                .order('display_order', { ascending: true });

            if (error) throw error;
            setImages(data || []);
            setFilteredImages(data || []);
        } catch (error) {
            console.error('Error fetching images:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedTag) {
            const filtered = images.filter(img => img.tags.includes(selectedTag));
            setFilteredImages(filtered);
            setCurrentIndex(0);
        } else {
            setFilteredImages(images);
        }
    }, [selectedTag, images]);

    const allTags = Array.from(new Set(images.flatMap(img => img.tags))).sort();

    const handleNext = () => {
        setIsImageLoading(true);
        setCurrentIndex((prev) => (prev + 1) % filteredImages.length);
    };

    const handlePrevious = () => {
        setIsImageLoading(true);
        setCurrentIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'ArrowLeft') handlePrevious();
            if (e.key === 'Escape') onClose();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, filteredImages.length, onClose]);

    if (!isOpen) return null;

    const currentImage = filteredImages[currentIndex];

    // Added safety check for currentImage not existing (e.g. if filteredImages is empty)
    if (!currentImage && !loading && filteredImages.length === 0) {
        // Return loaded state with "No images" message handled below in render
    }

    const getSocialIcon = (source?: string | null) => {
        switch (source) {
            case 'instagram': return <Instagram className="w-4 h-4" />;
            case 'facebook': return <Facebook className="w-4 h-4" />;
            default: return <ExternalLink className="w-4 h-4" />;
        }
    };

    return (
        <DialogPrimitive.Root open={isOpen} onOpenChange={onClose}>
            <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md animate-in fade-in duration-200" />
                <DialogPrimitive.Content className="fixed inset-0 z-[101] flex flex-col items-center justify-center outline-none">
                    <DialogPrimitive.Title className="sr-only">
                        Image Gallery
                    </DialogPrimitive.Title>
                    <DialogPrimitive.Description className="sr-only">
                        Detailed view of the selected gallery image
                    </DialogPrimitive.Description>

                    {/* Header */}
                    <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 z-10 bg-gradient-to-b from-black/80 to-transparent">
                        <div className="flex-1">
                            <div className="flex items-center gap-3">
                                <h2 className="text-white text-xl md:text-2xl font-outfit font-semibold tracking-tight">
                                    {currentImage?.title || 'Gallery'}
                                </h2>
                                {currentImage?.social_media_url && (
                                    <a
                                        href={currentImage.social_media_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors"
                                    >
                                        {getSocialIcon(currentImage.social_media_source)}
                                        <span className="hidden sm:inline">View on {currentImage.social_media_source ? currentImage.social_media_source.charAt(0).toUpperCase() + currentImage.social_media_source.slice(1) : 'Social Media'}</span>
                                    </a>
                                )}
                            </div>
                            {currentImage?.description && (
                                <p className="text-white/70 text-sm mt-0.5 font-light">{currentImage.description}</p>
                            )}
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </Button>
                    </div>

                    {/* Tags Filter */}
                    {allTags.length > 0 && (
                        <div className="absolute top-20 left-0 right-0 px-4 py-2 flex justify-center z-10 pointer-events-none">
                            <div className="flex gap-2 overflow-x-auto pb-2 max-w-full no-scrollbar pointer-events-auto">
                                <button
                                    onClick={() => setSelectedTag(null)}
                                    className={cn(
                                        "px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap",
                                        selectedTag === null
                                            ? "bg-white text-black"
                                            : "bg-white/10 text-white hover:bg-white/20"
                                    )}
                                >
                                    All
                                </button>
                                {allTags.map((tag) => (
                                    <button
                                        key={tag}
                                        onClick={() => setSelectedTag(tag)}
                                        className={cn(
                                            "px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap",
                                            selectedTag === tag
                                                ? "bg-white text-black"
                                                : "bg-white/10 text-white hover:bg-white/20"
                                        )}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Main Image Area */}
                    <div className="flex-1 w-full relative flex items-center justify-center p-4 md:p-8 overflow-hidden" onClick={onClose}>
                        <div className="relative max-w-full max-h-full flex items-center justify-center p-0 md:p-12 w-full h-full" onClick={(e) => e.stopPropagation()}>
                            {loading ? (
                                <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : filteredImages.length === 0 ? (
                                <p className="text-white/50">No images found</p>
                            ) : (
                                <>
                                    <div className="relative w-full h-full flex items-center justify-center">
                                        {isImageLoading && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            </div>
                                        )}
                                        {currentImage && (
                                            <img
                                                src={currentImage.image_url}
                                                alt={currentImage.title}
                                                className={cn(
                                                    "max-w-full max-h-full object-contain shadow-2xl transition-opacity duration-300",
                                                    isImageLoading ? "opacity-0" : "opacity-100"
                                                )}
                                                onLoad={() => setIsImageLoading(false)}
                                            />
                                        )}
                                    </div>

                                    {/* Navigation Arrows */}
                                    {filteredImages.length > 1 && (
                                        <>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handlePrevious(); }}
                                                className="absolute left-0 md:left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white/80 hover:text-white transition-all backdrop-blur-sm group z-20"
                                            >
                                                <ChevronLeft className="w-8 h-8 group-hover:-translate-x-0.5 transition-transform" />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                                                className="absolute right-0 md:right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white/80 hover:text-white transition-all backdrop-blur-sm group z-20"
                                            >
                                                <ChevronRight className="w-8 h-8 group-hover:translate-x-0.5 transition-transform" />
                                            </button>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Footer / Thumbnails */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent z-10 pointer-events-none">
                        {filteredImages.length > 1 && (
                            <div className="flex gap-2 justify-center overflow-x-auto pb-2 no-scrollbar pointer-events-auto">
                                {filteredImages.map((image, index) => (
                                    <button
                                        key={image.id}
                                        onClick={() => {
                                            if (index !== currentIndex) {
                                                setIsImageLoading(true);
                                                setCurrentIndex(index);
                                            }
                                        }}
                                        className={cn(
                                            "flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-md overflow-hidden border-2 transition-all relative",
                                            index === currentIndex
                                                ? "border-white opacity-100"
                                                : "border-transparent opacity-40 hover:opacity-70"
                                        )}
                                    >
                                        <img
                                            src={image.image_url}
                                            alt={image.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                        <div className="text-center text-white/40 text-xs mt-2">
                            {filteredImages.length > 0 ? `${currentIndex + 1} of ${filteredImages.length}` : ''}
                        </div>
                    </div>
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
};
