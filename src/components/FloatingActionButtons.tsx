import { MessageCircle, Phone } from "lucide-react";

export const FloatingActionButtons = () => {
  const handleWhatsApp = () => {
    const message = encodeURIComponent("Hello! I'm interested in your interior design services. I'd like to discuss a project with you.");
    window.open(`https://wa.me/919633860898?text=${message}`, '_blank');
  };

  const handleCall = () => {
    window.location.href = 'tel:+919633860898';
  };

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
      {/* WhatsApp Button */}
      <button
        onClick={handleWhatsApp}
        className="w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_8px_24px_-8px_rgba(37,211,102,0.6)] hover:shadow-[0_12px_32px_-8px_rgba(37,211,102,0.8)] hover:scale-110 transition-all duration-300 hover:bg-[#20BA5A]"
        aria-label="WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Call Button */}
      <button
        onClick={handleCall}
        className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-[0_8px_24px_-8px_hsl(var(--primary)/0.6)] hover:shadow-[0_12px_32px_-8px_hsl(var(--primary)/0.8)] hover:scale-110 transition-all duration-300"
        aria-label="Call"
      >
        <Phone className="h-6 w-6" />
      </button>
    </div>
  );
};
