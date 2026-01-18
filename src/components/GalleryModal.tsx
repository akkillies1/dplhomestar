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
    alt_text?: string | null;
}

interface GalleryModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialIndex?: number;
}

export const GalleryModal = ({ isOpen, onClose, initialIndex = 0 }: GalleryModalProps) => {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [isImageLoading, setIsImageLoading] = useState(true);

    // Sync currentIndex with initialIndex when modal opens
    useEffect(() => {
        if (isOpen) {
            setCurrentIndex(initialIndex);
            fetchImages();
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, initialIndex]);

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
                <DialogPrimitive.Overlay className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl animate-in fade-in duration-300" />
                <DialogPrimitive.Content className="fixed inset-0 z-[101] flex items-center justify-center p-2 md:p-10 outline-none">
                    <DialogPrimitive.Title className="sr-only">
                        {currentImage?.title || 'Design Gallery'}
                    </DialogPrimitive.Title>
                    <DialogPrimitive.Description className="sr-only">
                        Detailed view of {currentImage?.title}
                    </DialogPrimitive.Description>

                    <div className="bg-[#0A0A0A] w-full max-w-7xl h-full max-h-[92vh] rounded-2xl md:rounded-3xl overflow-hidden flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/5 animate-in zoom-in-95 duration-300">

                        {/* 1. Header: Title on Top */}
                        <div className="p-4 md:p-6 lg:px-10 flex items-center justify-between border-b border-white/5 bg-black/40 flex-shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-1 h-5 bg-accent rounded-full" />
                                <h2 className="text-white text-lg md:text-2xl font-serif font-medium tracking-tight truncate max-w-[200px] md:max-w-none">
                                    {currentImage?.title || 'Untitled Project'}
                                </h2>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onClose}
                                className="text-white/30 hover:text-white hover:bg-white/10 rounded-xl w-10 h-10"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        {/* 2. Main Content: Split Left (Image) and Right (Description) */}
                        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">

                            {/* Left Side: Image with Watermark */}
                            <div className="relative flex-[1.4] lg:flex-[2] bg-black/20 flex flex-col items-center justify-center overflow-hidden border-b lg:border-b-0 lg:border-r border-white/5 min-h-[300px] lg:min-h-0">
                                <div className="w-full h-full relative flex items-center justify-center p-4">
                                    {isImageLoading && (
                                        <div className="absolute inset-0 flex items-center justify-center z-10 bg-[#0A0A0A]/50 backdrop-blur-sm">
                                            <div className="w-8 h-8 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
                                        </div>
                                    )}
                                    {currentImage && (
                                        <div className="relative max-w-full max-h-full flex items-center justify-center">
                                            <img
                                                key={currentImage.id}
                                                src={currentImage.image_url}
                                                alt={currentImage.title}
                                                className={cn(
                                                    "max-w-full max-h-full object-contain rounded-sm transition-all duration-700 shadow-2xl",
                                                    isImageLoading ? "opacity-0 scale-98" : "opacity-100 scale-100"
                                                )}
                                                onLoad={() => setIsImageLoading(false)}
                                            />
                                            {/* Watermark - Overlayed on image edge */}
                                            {!isImageLoading && (
                                                <div className="absolute bottom-3 right-3 pointer-events-none select-none opacity-40 flex items-center gap-2 mix-blend-difference">
                                                    <p className="text-white font-serif text-[10px] md:text-xs tracking-[0.2em] font-light italic">
                                                        dplhomestar
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Navigation Arrows (visible on desktop or if not loading) */}
                                    {filteredImages.length > 1 && !isImageLoading && (
                                        <>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handlePrevious(); }}
                                                className="absolute left-2 lg:left-6 top-1/2 -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-black/60 hover:bg-accent text-white transition-all backdrop-blur-md border border-white/5 flex items-center justify-center z-30 shadow-lg"
                                            >
                                                <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6" />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                                                className="absolute right-2 lg:right-6 top-1/2 -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-black/60 hover:bg-accent text-white transition-all backdrop-blur-md border border-white/5 flex items-center justify-center z-30 shadow-lg"
                                            >
                                                <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6" />
                                            </button>
                                        </>
                                    )}
                                </div>

                                {/* Thumbnail strip (only on larger screens to save space) */}
                                <div className="h-20 w-full px-6 mb-4 hidden lg:block flex-shrink-0">
                                    <div className="flex gap-2 justify-center overflow-x-auto no-scrollbar py-2">
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
                                                    "flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all duration-300",
                                                    index === currentIndex ? "border-accent scale-105" : "border-white/5 opacity-30 hover:opacity-100"
                                                )}
                                            >
                                                <img src={image.image_url} className="w-full h-full object-cover" alt="thumbnail" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Description */}
                            <div className="flex-1 bg-black/40 flex flex-col p-6 md:p-8 lg:max-w-sm overflow-hidden">
                                <div className="flex-1 overflow-y-auto no-scrollbar">
                                    <div className="mb-6">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-accent text-[9px] uppercase tracking-[0.3em] font-bold">Project Overview</span>
                                        </div>
                                        {currentImage?.description ? (
                                            <p className="text-white/70 text-sm md:text-base leading-relaxed font-light italic">
                                                "{currentImage.description}"
                                            </p>
                                        ) : (
                                            <p className="text-white/20 text-xs italic">No project description provided for this work.</p>
                                        )}
                                    </div>

                                    {currentImage?.social_media_url && (
                                        <div className="mb-8">
                                            <a
                                                href={currentImage.social_media_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 text-white/50 hover:text-accent text-[10px] font-bold uppercase tracking-widest transition-colors group"
                                            >
                                                {getSocialIcon(currentImage.social_media_source)}
                                                <span>View on {currentImage.social_media_source || 'Social'}</span>
                                                <ExternalLink className="w-3 h-3 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                            </a>
                                        </div>
                                    )}

                                    <div className="space-y-3">
                                        <span className="text-white/20 text-[9px] uppercase tracking-widest font-bold block">Attributes</span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {currentImage?.tags.map(tag => (
                                                <span key={tag} className="text-[8px] md:text-[9px] uppercase tracking-wider px-2 py-1 bg-white/5 border border-white/5 rounded text-white/40">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. Footer: Property Ownership Declaration */}
                        <div className="p-3 md:p-4 bg-black/60 border-t border-white/5 flex items-center justify-center flex-shrink-0">
                            <p className="text-[8px] md:text-[10px] text-white/20 tracking-wider uppercase font-medium text-center px-4">
                                © {new Date().getFullYear()} dplHomestar. Architectural designs & photographic content are protected assets of <span className="text-white/40">DCODE Private Limited</span>.
                            </p>
                        </div>
                    </div>
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
};
