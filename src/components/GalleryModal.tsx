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

    useEffect(() => {
        if (isOpen) {
            fetchImages();
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            setCurrentIndex(initialIndex);
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
                <DialogPrimitive.Content className="fixed inset-0 z-[101] flex items-center justify-center p-4 md:p-10 outline-none">
                    <DialogPrimitive.Title className="sr-only">
                        {currentImage?.title || 'Design Gallery'}
                    </DialogPrimitive.Title>
                    <DialogPrimitive.Description className="sr-only">
                        Detailed view of {currentImage?.title}
                    </DialogPrimitive.Description>

                    <div className="bg-[#111] w-full max-w-7xl h-full max-h-[90vh] rounded-3xl overflow-hidden flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/5 animate-in zoom-in-95 duration-300">

                        {/* 1. Header: Title on Top */}
                        <div className="p-6 md:px-10 flex items-center justify-between border-b border-white/5 bg-black/40">
                            <div className="flex items-center gap-4">
                                <div className="w-1.5 h-6 bg-accent rounded-full" />
                                <h2 className="text-white text-xl md:text-2xl font-serif font-medium tracking-tight">
                                    {currentImage?.title || 'Untitled Project'}
                                </h2>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onClose}
                                className="text-white/30 hover:text-white hover:bg-white/10 rounded-xl"
                            >
                                <X className="w-6 h-6" />
                            </Button>
                        </div>

                        {/* 2. Main Content: Split Left (Image) and Right (Description) */}
                        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">

                            {/* Left Side: Image with Watermark */}
                            <div className="relative flex-[2] bg-black/40 flex flex-col items-center justify-center overflow-hidden border-r border-white/5">
                                <div className="w-full h-full relative flex items-center justify-center p-4 md:p-12">
                                    {isImageLoading && (
                                        <div className="absolute inset-0 flex items-center justify-center z-10">
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
                                                    "max-w-full max-h-full w-auto h-auto object-contain rounded-sm transition-all duration-700 shadow-2xl",
                                                    isImageLoading ? "opacity-0 scale-98 blur-sm" : "opacity-100 scale-100 blur-0"
                                                )}
                                                onLoad={() => setIsImageLoading(false)}
                                            />
                                            {/* Watermark - Overlayed on image edge */}
                                            {!isImageLoading && (
                                                <div className="absolute bottom-4 right-4 pointer-events-none select-none opacity-40 group-hover/img:opacity-60 transition-opacity flex items-center gap-2 mix-blend-difference">
                                                    <p className="text-white font-serif text-[10px] md:text-sm tracking-[0.2em] font-light italic">
                                                        dplhomestar
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Navigation Arrows */}
                                    {filteredImages.length > 1 && (
                                        <>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handlePrevious(); }}
                                                className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 hover:bg-accent text-white transition-all backdrop-blur-xl border border-white/5 flex items-center justify-center z-30"
                                            >
                                                <ChevronLeft className="w-6 h-6" />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                                                className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 hover:bg-accent text-white transition-all backdrop-blur-xl border border-white/5 flex items-center justify-center z-30"
                                            >
                                                <ChevronRight className="w-6 h-6" />
                                            </button>
                                        </>
                                    )}
                                </div>

                                {/* Thumbnail strip */}
                                <div className="h-20 w-full px-6 mb-4 hidden md:block">
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
                                                <img src={image.image_url} className="w-full h-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Description */}
                            <div className="flex-1 bg-black/40 border-l border-white/5 flex flex-col p-8 md:p-10 lg:max-w-sm">
                                <div className="flex-1 overflow-y-auto no-scrollbar">
                                    <div className="mb-8">
                                        <span className="text-accent text-[10px] uppercase tracking-[0.4em] font-bold block mb-4">Description</span>
                                        {currentImage?.description ? (
                                            <p className="text-white/70 text-sm md:text-base leading-relaxed font-light italic">
                                                "{currentImage.description}"
                                            </p>
                                        ) : (
                                            <p className="text-white/30 text-xs italic">No project description available.</p>
                                        )}
                                    </div>

                                    {currentImage?.social_media_url && (
                                        <div className="mb-10">
                                            <a
                                                href={currentImage.social_media_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 text-white/50 hover:text-accent text-xs font-bold uppercase tracking-widest transition-colors group"
                                            >
                                                {getSocialIcon(currentImage.social_media_source)}
                                                <span>Visit on {currentImage.social_media_source || 'Social'}</span>
                                                <ExternalLink className="w-3 h-3 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                            </a>
                                        </div>
                                    )}

                                    <div className="space-y-4">
                                        <span className="text-white/20 text-[10px] uppercase tracking-widest font-bold block">Tags</span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {currentImage?.tags.map(tag => (
                                                <span key={tag} className="text-[9px] uppercase tracking-wider px-2 py-1 bg-white/5 border border-white/5 rounded-md text-white/40">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. Footer: Property Ownership Declaration */}
                        <div className="p-4 bg-black/60 border-t border-white/5 flex items-center justify-center">
                            <p className="text-[10px] md:text-xs text-white/20 tracking-wider uppercase font-medium text-center">
                                © {new Date().getFullYear()} dplHomestar. All designs and photographic property are trademarks and intellectual assets of <span className="text-white/40">DCODE Private Limited</span>.
                            </p>
                        </div>
                    </div>
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
};
