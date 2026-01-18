import { X, ChevronLeft, ChevronRight, ExternalLink, Instagram, Facebook, LayoutGrid } from "lucide-react";
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
    mood?: string | null;
}

interface GalleryModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialIndex?: number;
    initialViewMode?: 'grid' | 'detail';
}

export const GalleryModal = ({ isOpen, onClose, initialIndex = 0, initialViewMode = 'grid' }: GalleryModalProps) => {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'detail'>(initialViewMode);
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [isImageLoading, setIsImageLoading] = useState(true);

    // Initial fetch
    useEffect(() => {
        if (isOpen) {
            fetchImages();
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Sync index and viewMode on open
    useEffect(() => {
        if (isOpen) {
            setCurrentIndex(initialIndex);
            setViewMode(initialViewMode);
            setIsImageLoading(true); // Reset loading when image changes
        }
    }, [isOpen, initialIndex, initialViewMode]);

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
                <DialogPrimitive.Overlay className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl animate-in fade-in duration-300" />
                <DialogPrimitive.Content className="fixed inset-0 z-[101] flex items-center justify-center p-2 md:p-10 outline-none">
                    <DialogPrimitive.Title className="sr-only">
                        {currentImage?.title ? `${currentImage.title} — The Design Mood Board` : 'The Design Mood Board'}
                    </DialogPrimitive.Title>
                    <DialogPrimitive.Description className="sr-only">
                        Detailed view of {currentImage?.title}
                    </DialogPrimitive.Description>

                    <div className="bg-[#0A0A0A] w-full max-w-7xl h-full max-h-[92vh] rounded-2xl md:rounded-3xl overflow-hidden flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/5 animate-in zoom-in-95 duration-300">

                        {/* 1. Header: Title on Top */}
                        <div className="p-4 md:p-6 lg:px-10 flex items-center justify-between border-b border-white/5 bg-black/40 flex-shrink-0">
                            <div className="flex items-center gap-3">
                                {viewMode === 'detail' && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setViewMode('grid')}
                                        className="mr-2 text-white/40 hover:text-accent flex items-center gap-2 px-2"
                                    >
                                        <LayoutGrid className="w-4 h-4" />
                                        <span className="hidden sm:inline text-[10px] uppercase tracking-widest font-bold">Grid</span>
                                    </Button>
                                )}
                                <div className="w-1 h-5 bg-accent rounded-full" />
                                <div className="flex flex-col md:flex-row md:items-center">
                                    <h2 className="text-white/40 text-[9px] md:text-2xl md:text-white font-serif font-medium tracking-[0.2em] md:tracking-tight uppercase md:normal-case mt-1 md:mt-0">
                                        The Design Mood Board
                                    </h2>
                                    {viewMode === 'detail' && (
                                        <div className="flex items-center">
                                            <span className="text-white/30 font-light mx-2 hidden md:inline">—</span>
                                            <span className="text-accent italic font-light text-sm md:text-2xl leading-none">
                                                {currentImage?.title || 'Loading...'}
                                            </span>
                                        </div>
                                    )}
                                </div>
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

                        {/* 2. Main Content */}
                        <div className="flex-1 overflow-hidden min-h-0 relative">
                            {viewMode === 'grid' ? (
                                /* GRID MODE: Tiled/Masonry View */
                                <div className="h-full overflow-y-auto p-4 md:p-8 lg:p-12 no-scrollbar animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                                        {filteredImages.map((image, index) => (
                                            <div
                                                key={image.id}
                                                className="break-inside-avoid group relative cursor-pointer rounded-xl overflow-hidden border border-white/5 bg-white/[0.02] transition-all duration-500 hover:border-accent/40 hover:scale-[1.02] shadow-2xl"
                                                onClick={() => {
                                                    setCurrentIndex(index);
                                                    setIsImageLoading(true);
                                                    setViewMode('detail');
                                                }}
                                            >
                                                <img
                                                    src={image.image_url}
                                                    alt={image.title}
                                                    className="w-full h-auto object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">
                                                    <span className="text-accent text-[8px] uppercase tracking-[0.2em] font-bold mb-1">{image.mood || 'Signature Luxury'}</span>
                                                    <h3 className="text-white text-lg font-serif italic">{image.title}</h3>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {filteredImages.length === 0 && !loading && (
                                        <div className="h-full flex items-center justify-center">
                                            <p className="text-white/20 uppercase tracking-widest text-xs italic">The atelier is currently empty</p>
                                        </div>
                                    )}
                                    {loading && (
                                        <div className="h-full flex items-center justify-center">
                                            <div className="w-8 h-8 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                /* DETAIL MODE: Split Split Screen View */
                                <div className="h-full flex flex-col lg:flex-row overflow-hidden animate-in fade-in zoom-in-95 duration-500">

                                    {/* Left Side: Image Area */}
                                    <div className="relative flex-[1.5] lg:flex-[2.5] bg-black/20 flex flex-col items-center justify-center overflow-hidden border-b lg:border-b-0 lg:border-r border-white/5">

                                        {loading ? (
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="w-10 h-10 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
                                                <span className="text-white/20 text-[10px] uppercase tracking-widest">Loading project...</span>
                                            </div>
                                        ) : !currentImage ? (
                                            <p className="text-white/20 uppercase tracking-widest text-[10px]">No entry found</p>
                                        ) : (
                                            <div className="w-full h-full relative flex items-center justify-center p-4">
                                                {/* Image Loader Spinner (separate from main component loading) */}
                                                {isImageLoading && (
                                                    <div className="absolute inset-0 flex items-center justify-center z-10 bg-[#0A0A0A]/20 backdrop-blur-sm">
                                                        <div className="w-8 h-8 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
                                                    </div>
                                                )}

                                                <div className="relative max-w-full max-h-full flex items-center justify-center">
                                                    <img
                                                        key={currentImage.id}
                                                        src={currentImage.image_url}
                                                        alt={currentImage.title}
                                                        className={cn(
                                                            "max-w-full max-h-full object-contain rounded-sm shadow-2xl transition-all duration-700",
                                                            isImageLoading ? "opacity-0 scale-95" : "opacity-100 scale-100"
                                                        )}
                                                        onLoad={() => setIsImageLoading(false)}
                                                        onError={() => {
                                                            console.error("Image failed to load:", currentImage.image_url);
                                                            setIsImageLoading(false);
                                                        }}
                                                    />

                                                    {/* Watermark */}
                                                    {!isImageLoading && (
                                                        <div className="absolute bottom-4 right-4 pointer-events-none select-none opacity-40 mix-blend-difference hidden md:block">
                                                            <p className="text-white font-serif text-[10px] md:text-xs tracking-[0.2em] font-light italic">
                                                                dplhomestar
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Navigation Arrows */}
                                                {filteredImages.length > 1 && (
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
                                        )}

                                        {/* Thumbnail strip (only on larger screens) */}
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
                                    <div className="flex-1 bg-[#0A0A0A] lg:bg-black/40 flex flex-col p-6 md:p-8 lg:max-w-sm overflow-hidden">
                                        {loading ? (
                                            <div className="space-y-4 animate-pulse">
                                                <div className="h-2 w-24 bg-white/5 rounded" />
                                                <div className="h-4 w-full bg-white/5 rounded" />
                                                <div className="h-4 w-3/4 bg-white/5 rounded" />
                                            </div>
                                        ) : (
                                            <div className="flex-1 overflow-y-auto no-scrollbar">
                                                <div className="mb-6 pb-6 border-b border-white/5">
                                                    <span className="text-white/30 text-[9px] uppercase tracking-[0.3em] font-bold block mb-3">Project Aura / Mood</span>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                                                        <p className="text-white text-lg md:text-xl font-serif italic tracking-wide">
                                                            {currentImage?.mood || 'Signature Luxury'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="mb-6 relative">
                                                    <span className="text-accent text-[9px] uppercase tracking-[0.3em] font-bold block mb-3">Designer's Note</span>
                                                    {currentImage?.description ? (
                                                        <p className="text-white/80 text-lg md:text-xl leading-relaxed font-serif italic">
                                                            "{currentImage.description}"
                                                        </p>
                                                    ) : (
                                                        <p className="text-white/20 text-xs font-serif italic">A curated reflection of our design philosophy for this space.</p>
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
                                                    <span className="text-white/20 text-[9px] uppercase tracking-widest font-bold block">Tags</span>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {currentImage?.tags.map(tag => (
                                                            <span key={tag} className="text-[8px] md:text-[9px] uppercase tracking-wider px-2 py-1 bg-white/5 border border-white/5 rounded text-white/40">
                                                                #{tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 3. Footer: Property Ownership Declaration */}
                        <div className="p-3 md:p-4 bg-black/60 border-t border-white/5 flex items-center justify-center flex-shrink-0">
                            <p className="text-[8px] md:text-[10px] text-white/20 tracking-wider uppercase font-medium text-center px-4">
                                © {new Date().getFullYear()} dplHomestar. All designs and photographic property are protected trademarks of <span className="text-white/40">DCODE Private Limited</span>.
                            </p>
                        </div>
                    </div>
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
};
