import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";

interface MobileMenuProps {
  isScrolled: boolean;
}

export const MobileMenu = ({ isScrolled }: MobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (id: string) => {
    setIsOpen(false);

    if (location.pathname !== '/') {
      navigate(`/#${id}`);
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
    } else {
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button
          className={`md:hidden p-2 transition-colors ${isScrolled ? 'text-foreground hover:text-primary' : 'text-white hover:text-accent bg-background/10 backdrop-blur-sm rounded-md'}`}
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] bg-background border-l border-border z-[100] p-0">
        <span className="sr-only">
          <SheetTitle>Mobile Navigation Menu</SheetTitle>
          <SheetDescription>Navigation links for mobile devices</SheetDescription>
        </span>
        <div className="flex flex-col h-full bg-background p-8">
          <div className="mb-8">
            <Logo className="w-40 h-auto mb-6" />
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-bold tracking-[0.1em] uppercase text-accent">
              <span className="flex h-1.5 w-1.5 rounded-full bg-accent animate-pulse"></span>
              Premier Turnkey Studio
            </div>
          </div>

          <nav className="flex-1 space-y-2 overflow-y-auto">
            {[
              { id: 'home', label: 'Home' },
              { id: 'about', label: 'About' },
              { id: 'philosophy', label: 'Philosophy' },
              { id: 'services', label: 'Services' },
              { id: 'process', label: 'Process' },
              { id: 'work', label: 'Work' },
              { id: 'testimonials', label: 'Testimonials' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className="w-full text-left px-4 py-3 text-lg font-outfit font-semibold rounded-lg transition-all hover:bg-white/5 hover:translate-x-1 text-foreground tracking-tight"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/blog');
              }}
              className="w-full text-left px-4 py-3 text-lg font-outfit font-semibold rounded-lg transition-all hover:bg-black/5 dark:hover:bg-white/5 hover:translate-x-1 text-foreground tracking-tight"
            >
              Blog
            </button>
          </nav>

          <div className="mt-auto px-2 pt-6 border-t border-border/50 flex items-center gap-4">
            <Button
              variant="hero"
              size="lg"
              className="flex-1 justify-center font-bold uppercase tracking-widest text-sm"
              onClick={() => handleNavigation('contact')}
            >
              Contact Us
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
