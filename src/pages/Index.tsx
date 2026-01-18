import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ArrowRight, Mail, Phone, MapPin, Layers, Ruler, PenTool, ChevronDown, Lightbulb, Hammer, Palette, Scissors } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SEO } from "@/components/SEO";
import { MobileMenu } from "@/components/MobileMenu";
import { FloatingActionButtons } from "@/components/FloatingActionButtons";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Gallery } from "@/components/Gallery";
import { Testimonials } from "@/components/Testimonials";
import portfolio1 from "@/assets/portfolio-1.jpg";
import portfolio2 from "@/assets/portfolio-2.jpg";
import portfolio3 from "@/assets/portfolio-3.jpg";
import portfolio4 from "@/assets/portfolio-4.jpg";
import heroInterior from "@/assets/hero-interior.jpg";

const Index = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
  const [heroImage, setHeroImage] = useState(portfolio4);

  // Set random hero image on mount
  useEffect(() => {
    const images = [portfolio1, portfolio2, portfolio3, portfolio4, heroInterior];
    const randomImage = images[Math.floor(Math.random() * images.length)];
    setHeroImage(randomImage);
  }, []);

  // Track scroll position for header shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsHeaderScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Reveal animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1 }
    );

    const observeElements = () => {
      const revealElements = document.querySelectorAll('.reveal:not(.active)');
      revealElements.forEach((el) => observer.observe(el));
    };

    // Initial scan
    observeElements();

    // Use MutationObserver to catch elements added after initial mount
    const mutationObserver = new MutationObserver(() => {
      observeElements();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Periodic check as a fallback for complex state changes
    const interval = setInterval(observeElements, 1000);

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
      clearInterval(interval);
    };
  }, []);

  // Track active section on scroll and sync URL
  useEffect(() => {
    const sections = ['home', 'about', 'philosophy', 'process', 'services', 'work', 'testimonials', 'contact'];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            setActiveSection(id);

            // Sync URL hash without jumping the page or cluttering history
            if (window.location.hash !== `#${id}`) {
              window.history.replaceState(null, '', `#${id}`);
            }
          }
        });
      },
      { threshold: 0.2, rootMargin: '-100px 0px -30% 0px' }
    );

    const observeSections = () => {
      sections.forEach((id) => {
        const element = document.getElementById(id);
        if (element) observer.observe(element);
      });
    };

    observeSections();
    const timeout = setTimeout(observeSections, 500);

    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (!formData.name || !formData.email || !formData.phone || !formData.location || !formData.message) {
      toast({
        title: "✗ Missing Fields",
        description: "Please fill in all fields before submitting.",
        variant: "destructive",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "✗ Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // STEP 1: Save to database first (MOST IMPORTANT - prevents lead loss)
      // STEP 1: Save to database first (MOST IMPORTANT - prevents lead loss)
      // We use an RPC function to bypass RLS policies safely
      const { data: lead, error: dbError } = await supabase
        .rpc('submit_lead', {
          p_name: formData.name,
          p_email: formData.email,
          p_phone: formData.phone,
          p_location: formData.location,
          p_message: formData.message,
        });

      if (dbError) {
        console.error("Database error:", dbError);
        throw new Error("Failed to save your enquiry. Please try again.");
      }

      // STEP 2: Send email notification (SECONDARY - optional)
      // If email fails, lead is still saved in database
      try {
        await supabase.functions.invoke('send-brevo-email', {
          body: { ...formData, leadId: lead.id },
        });
      } catch (emailError) {
        // Email failed but lead is saved - log but don't show error to user
        console.error("Email notification failed (lead saved):", emailError);
      }

      toast({
        title: "✓ Message Sent Successfully",
        description: "Thank you for reaching out. We'll get back to you within 24 hours.",
        className: "bg-green-50 border-green-200 text-green-900",
      });

      setFormData({ name: "", email: "", phone: "", location: "", message: "" });
    } catch (error: any) {
      console.error("Error sending email:", error);
      toast({
        title: "✗ Failed to Send Message",
        description: error?.message || "Something went wrong. Please try calling us directly at +91 9633860898.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // SEO Metadata Mapping
  const getMetadata = () => {
    switch (activeSection) {
      case 'about':
        return {
          title: "Our Story | Luxury Interior Design Pioneers",
          description: "Discover the philosophy behind dplHomestar. Delivering budget-friendly luxury and turnkey interior solutions across Kerala and major South Indian cities.",
        };
      case 'services':
        return {
          title: "Turnkey Interior Services in Kerala & Bangalore",
          description: "Full-service interior design & execution. From bespoke residences to commercial spaces in Cochin, Coimbatore & more. Quality turnkey solutions at dplHomestar.",
        };
      case 'work':
        return {
          title: "Our Work | Featured Luxury Interior Projects",
          description: "Explore our gallery of premium interior projects in Kerala, Bangalore and Coimbatore. Realize your dream home with our budget-friendly luxury designs.",
        };
      case 'contact':
        return {
          title: "Contact dplHomestar | Interior Design Experts South India",
          description: "Start your project with dplHomestar. Premium turnkey interiors in Kerala, Cochin, Bangalore & Coimbatore. Inquire today for budget-friendly luxury at your door.",
        };
      default:
        return {
          title: "Premium Interior Design & Turnkey Execution",
          description: "Transform your space with dplHomestar. Luxury turnkey interiors in Kerala, Cochin, Bangalore & Coimbatore. Budget-friendly elegance & precision craft.",
        };
    }
  };

  const metadata = getMetadata();

  return (
    <div className="min-h-screen bg-background selection:bg-accent/30">
      <SEO
        title={metadata.title}
        description={metadata.description}
      />

      {/* Floating Action Buttons */}
      <FloatingActionButtons />

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isHeaderScrolled ? 'bg-background/95 backdrop-blur-lg shadow-sm border-b border-border/50 py-3' : 'bg-gradient-to-b from-black/60 to-transparent border-b border-transparent py-5'}`}>
        <div className="container-custom flex items-center justify-between">
          <div className="flex flex-col md:flex-row md:items-center gap-0 md:gap-4 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <Logo className="w-32 md:w-48 h-auto transition-transform duration-500 group-hover:scale-[1.02]" />
            <div className={`hidden md:block h-8 w-[1px] transition-all duration-500 ${isHeaderScrolled ? 'bg-white/10' : 'bg-white/30'}`} />
            <div className="flex flex-col">
              <span className={`text-[8px] md:text-[10px] font-medium tracking-[0.2em] uppercase transition-all duration-500 ${isHeaderScrolled ? 'text-white/60' : 'text-white/80'}`}>
                Premier Turnkey
              </span>
              <span className={`hidden md:block text-[9px] font-bold tracking-[0.1em] uppercase transition-all duration-500 ${isHeaderScrolled ? 'text-accent' : 'text-white drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]'}`}>
                Interior Design
              </span>
              <span className={`md:hidden text-[7px] font-bold tracking-[0.1em] uppercase transition-all duration-500 ${isHeaderScrolled ? 'text-accent' : 'text-white drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]'}`}>
                Design Studio
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {['Home', 'About', 'Philosophy', 'Process', 'Services', 'Work', 'Testimonials'].map((item) => {
              const id = item.toLowerCase() === 'home' ? 'home' : (item.toLowerCase() === 'work' ? 'work' : item.toLowerCase());
              const isActive = activeSection === id;
              const linkColor = isHeaderScrolled ? 'text-foreground' : 'text-white';
              return (
                <a
                  key={item}
                  href={`#${id}`}
                  className={`text-sm font-medium transition-all duration-300 relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-accent after:transition-all after:duration-300 ${isActive
                    ? `${linkColor} after:w-full`
                    : `${linkColor}/70 hover:${linkColor} after:w-0 hover:after:w-full`
                    }`}
                >
                  {item}
                </a>
              );
            })}
            <a
              href="/blog"
              className={`text-sm font-medium transition-all duration-300 relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-accent after:transition-all after:duration-300 ${isHeaderScrolled ? 'text-foreground' : 'text-white'}/80 hover:${isHeaderScrolled ? 'text-foreground' : 'text-white'} after:w-0 hover:after:w-full`}
            >
              Blog
            </a>
            <Button
              variant="default"
              size="sm"
              className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Contact
            </Button>
            <ThemeToggle />
          </div>

          <MobileMenu isScrolled={isHeaderScrolled} />
        </div>
      </nav>

      {/* Home Section (previously Hero) */}
      <section id="home" className="relative min-h-screen flex items-start md:items-center justify-center overflow-hidden pt-48 md:pt-24">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-background" />
        </div>

        <div className="relative z-10 container-custom text-center">
          <div className="flex items-baseline justify-center gap-3 mb-10 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <Logo className="w-[320px] md:w-[580px] lg:w-[720px] h-auto drop-shadow-2xl" />
          </div>

          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-8 leading-tight text-balance animate-fade-in tracking-[0.15em] uppercase" style={{ animationDelay: '0.2s' }}>
            <span className="text-foreground dark:text-white">Design.</span>
            <span className="mx-3 text-foreground/20 dark:text-white/20 font-light">·</span>
            <span className="text-foreground dark:text-white">Execute.</span>
            <span className="mx-3 text-foreground/20 dark:text-white/20 font-light">·</span>
            <span style={{ color: '#D4AF37' }} className="italic font-serif normal-case">Elevate.</span>
          </h1>

          <p className="text-lg md:text-xl text-foreground/70 dark:text-white/70 mb-12 leading-relaxed text-balance animate-fade-in font-light tracking-wide max-w-3xl mx-auto" style={{ animationDelay: '0.4s' }}>
            From concept to completion, we craft interiors that inspire how you live, work, and feel.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <Button
              variant="default"
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-[0_10px_40px_-10px_rgba(252,211,77,0.3)] hover:scale-105 transition-all duration-500 rounded-full h-14 md:h-16 min-w-[200px] md:min-w-[240px] font-bold text-base md:text-lg uppercase tracking-widest"
              onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore Portfolio
              <ArrowRight className="ml-2 h-5 w-5 md:h-6 md:w-6" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-foreground/20 dark:border-white/20 text-foreground dark:text-white hover:bg-foreground/5 dark:hover:bg-white/10 rounded-full h-14 md:h-16 min-w-[200px] md:min-w-[240px] font-bold text-base md:text-lg uppercase tracking-widest backdrop-blur-sm"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Contact Us
            </Button>
          </div>

          {/* Scroll Cue */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
            <ChevronDown className="w-8 h-8 text-white/70" />
          </div>
        </div>
      </section >

      {/* About Section */}
      <section id="about" className="py-[100px] md:py-[140px] bg-background border-b border-border reveal">
        <div className="container-custom max-w-6xl">
          <div className="text-center">
            <h2 className="text-5xl md:text-8xl font-serif font-medium mb-6 tracking-tight text-foreground">Our Story</h2>
            <p className="text-xl md:text-2xl text-accent font-serif italic mb-16 tracking-wide">Elevated Interiors, Thoughtfully Crafted</p>

            <div className="space-y-12 max-w-4xl mx-auto">
              <p className="text-2xl md:text-3xl font-serif leading-relaxed text-foreground/90 text-balance italic">
                "At <span className="text-accent font-bold not-italic font-outfit uppercase tracking-widest text-lg">dplHomestar</span>, we believe luxury doesn't mean excess. Every space has the potential to inspire — and we design to elevate your environment while keeping it practical and within budget."
              </p>

              <div className="h-px w-20 bg-accent/30 mx-auto py-0 my-0"></div>

              <div className="grid md:grid-cols-2 gap-12 text-left items-start pt-4">
                <p className="text-lg md:text-xl text-foreground/70 leading-relaxed font-light">
                  Our philosophy blends <span className="text-accent font-semibold">timeless elegance</span>, precision craftsmanship, and intentional design. From bespoke layouts to modular solutions, every detail is carefully chosen to create beauty that endures.
                </p>
                <p className="text-lg md:text-xl text-foreground/70 leading-relaxed font-light">
                  We deliver <span className="text-accent font-semibold">turnkey interior solutions</span> that transform homes and commercial spaces — luxury that feels effortless, functional, and entirely yours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section >

      {/* Philosophy Section */}
      <section id="philosophy" className="py-[100px] md:py-[140px] bg-background reveal" >
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter text-foreground">Philosophy</h2>
            <p className="text-xl text-accent max-w-2xl mx-auto italic font-medium">
              Elevate, Don't Excess.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-10 text-center bg-card border-border shadow-2xl transition-all duration-300 hover:border-accent/40 group">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Layers className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">Inspire Progress</h3>
              <p className="text-foreground/70 leading-relaxed text-lg font-light">
                Spaces that move you forward.
              </p>
            </Card>

            <Card className="p-10 text-center bg-card border-border shadow-2xl transition-all duration-300 hover:border-accent/40 group">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <PenTool className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">Move Upward</h3>
              <p className="text-foreground/70 leading-relaxed text-lg font-light">
                Design that reaches for refinement.
              </p>
            </Card>

            <Card className="p-10 text-center bg-card border-border shadow-2xl transition-all duration-300 hover:border-accent/40 group">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Ruler className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">Intentional Luxury</h3>
              <p className="text-foreground/70 leading-relaxed text-lg font-light">
                Sculpted, luminous, effortlessly sophisticated.
              </p>
            </Card>
          </div>
        </div>
      </section >

      {/* Process Flow Section */}
      {/* Process Section */}
      <section id="process" className="py-[100px] md:py-[140px] bg-background reveal" >
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter text-foreground">DCode Workflow</h2>
            <p className="text-xl text-foreground/50 max-w-2xl mx-auto font-light">
              Our systematic approach to transforming your vision into reality
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            {/* Step 1: D → Discovery */}
            <div className="grid md:grid-cols-[1fr,auto,2fr] gap-8 mb-12 items-center animate-fade-in">
              <div className="md:text-right pl-4 md:pl-0">
                <div className="inline-block md:block">
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4 md:ml-auto">
                    <span className="text-3xl font-light text-accent">D</span>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2 tracking-tight">Discovery</h3>
                  <p className="text-accent font-medium text-xs uppercase tracking-widest">Understand & Align</p>
                </div>
              </div>

              <div className="hidden md:flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-accent"></div>
                <div className="w-0.5 h-32 bg-accent/30"></div>
              </div>

              <Card className="p-10 bg-card border-border shadow-2xl transition-all duration-300 hover:border-accent/40 group">
                <p className="text-foreground/70 leading-relaxed text-lg font-light">
                  We begin by DCoding your vision—understanding your needs, goals, and site potential. This phase is about deep alignment, where we define expectations, timelines, and budgets to establish a shared direction before design begins.
                </p>
              </Card>
            </div>


            {/* Step 3: C → Craft */}
            <div className="grid md:grid-cols-[1fr,auto,2fr] gap-8 mb-12 items-center animate-fade-in text-foreground">
              <div className="md:text-right pl-4 md:pl-0">
                <div className="inline-block md:block">
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4 md:ml-auto">
                    <span className="text-3xl font-light text-accent">C</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2 tracking-tight">Craft</h3>
                  <p className="text-accent font-medium text-xs uppercase tracking-widest">Design & conceptualization</p>
                </div>
              </div>

              <div className="hidden md:flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-accent"></div>
                <div className="w-0.5 h-32 bg-accent/30"></div>
              </div>

              <Card className="p-10 bg-card border-border shadow-2xl transition-all duration-300 hover:border-accent/40 group">
                <p className="text-foreground/70 leading-relaxed text-lg font-light">
                  We create thoughtful, tailored designs — layouts, materials, color schemes, and project plans — refined with your feedback to form a complete, client-approved design.
                </p>
              </Card>
            </div>

            {/* Step 4: O → Optimize */}
            <div className="grid md:grid-cols-[1fr,auto,2fr] gap-8 mb-12 items-center animate-fade-in text-foreground">
              <div className="md:text-right pl-4 md:pl-0">
                <div className="inline-block md:block">
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4 md:ml-auto">
                    <span className="text-3xl font-light text-accent">O</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2 tracking-tight">Optimize</h3>
                  <p className="text-accent font-medium text-xs uppercase tracking-widest">Finalize & perfect</p>
                </div>
              </div>

              <div className="hidden md:flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-accent"></div>
                <div className="w-0.5 h-32 bg-accent/30"></div>
              </div>

              <Card className="p-10 bg-card border-border shadow-2xl transition-all duration-300 hover:border-accent/40 group">
                <p className="text-foreground/70 leading-relaxed text-lg font-light">
                  We fine-tune the design with you and end-users, adjusting for functionality, aesthetics, and efficiency to ensure the design is perfected before production.
                </p>
              </Card>
            </div>

            {/* Step 5: D → Delivery */}
            <div className="grid md:grid-cols-[1fr,auto,2fr] gap-8 mb-12 items-center animate-fade-in text-foreground">
              <div className="md:text-right pl-4 md:pl-0">
                <div className="inline-block md:block">
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4 md:ml-auto">
                    <span className="text-3xl font-light text-accent">D</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2 tracking-tight">Delivery</h3>
                  <p className="text-accent font-medium text-xs uppercase tracking-widest">Production & logistics</p>
                </div>
              </div>

              <div className="hidden md:flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-accent"></div>
                <div className="w-0.5 h-32 bg-accent/30"></div>
              </div>

              <Card className="p-10 bg-card border-border shadow-2xl transition-all duration-300 hover:border-accent/40 group">
                <p className="text-foreground/70 leading-relaxed text-lg font-light">
                  From factory to site, we manage production, quality checks, and logistics, ensuring every material, furniture, and fixture arrives ready for seamless installation.
                </p>
              </Card>
            </div>

            {/* Step 6: E → Execution */}
            <div className="grid md:grid-cols-[1fr,auto,2fr] gap-8 items-center animate-fade-in text-foreground">
              <div className="md:text-right pl-4 md:pl-0">
                <div className="inline-block md:block">
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4 md:ml-auto">
                    <span className="text-3xl font-light text-accent">E</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2 tracking-tight">Execution</h3>
                  <p className="text-accent font-medium text-xs uppercase tracking-widest">Installation & handover</p>
                </div>
              </div>

              <div className="hidden md:flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-accent"></div>
              </div>

              <Card className="p-10 bg-card border-border shadow-2xl transition-all duration-300 hover:border-accent/40 group">
                <p className="text-foreground/70 leading-relaxed text-lg font-light">
                  We bring the project to life on-site — installing, adjusting, and perfecting every detail, with thorough walkthroughs to deliver a fully functional space ready for use.
                </p>
              </Card>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-20 reveal">
            <p className="text-2xl text-foreground font-medium mb-10 tracking-tight">
              Ready to redefine your perspective?
            </p>
            <Button
              variant="default"
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-[0_10px_40px_-10px_rgba(252,211,77,0.3)] hover:scale-105 transition-all duration-500 rounded-full h-14 md:h-16 min-w-[220px] md:min-w-[260px] font-bold text-base md:text-lg uppercase tracking-widest"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Start Your Project
              <ArrowRight className="ml-2 h-5 w-5 md:h-6 md:w-6" />
            </Button>
          </div>
        </div>
      </section >

      {/* Decor Duty Section */}
      <section className="py-[100px] md:py-[140px] bg-background relative overflow-hidden reveal" >
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 text-foreground">Decor Duty</h2>
            <p className="text-xl text-foreground/50 font-light max-w-2xl mx-auto">
              Our post-installation service ensures every detail and finish remains flawless — long after your project is complete.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-10 bg-card border-border shadow-2xl relative z-10 h-full flex flex-col transition-all duration-300 hover:border-accent/40 group">
              <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-2xl font-bold font-outfit text-accent">1</span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Alignment Checks</h3>
              <p className="text-foreground/70 leading-relaxed text-lg font-light">
                Every detail remains precise and perfectly positioned.
              </p>
            </Card>

            <Card className="p-10 bg-card border-border shadow-2xl relative z-10 h-full flex flex-col transition-all duration-300 hover:border-accent/40 group">
              <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-2xl font-bold font-outfit text-accent">2</span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Material Care</h3>
              <p className="text-foreground/70 leading-relaxed text-lg font-light">
                Every finish remains elevated and well-maintained.
              </p>
            </Card>

            <Card className="p-10 bg-card border-border shadow-2xl relative z-10 h-full flex flex-col transition-all duration-300 hover:border-accent/40 group">
              <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-2xl font-bold font-outfit text-accent">3</span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Ongoing Support</h3>
              <p className="text-foreground/70 leading-relaxed text-lg font-light">
                Intentional composition, preserved over time.
              </p>
            </Card>
          </div>

          <div className="text-center mt-16 animate-fade-in">
            <p className="text-2xl font-medium text-accent italic">
              Excellence doesn't end at delivery.
            </p>
          </div>
        </div>
      </section >

      {/* Services Section */}
      <section id="services" className="py-[100px] md:py-[140px] bg-background reveal" >
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter text-foreground">Services</h2>
            <p className="text-xl text-foreground/50 max-w-2xl mx-auto font-light">
              Complete design solutions from concept to completion
            </p>
            <p className="text-lg text-accent font-medium mt-6 italic">
              Elevate, Don't Excess.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-10 text-center bg-card border-border shadow-2xl transition-all duration-300 hover:border-accent/40 group">
              <div className="w-16 h-16 mx-auto mb-8 rounded-full bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Lightbulb className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-foreground">Full Interiors</h3>
              <p className="text-foreground/70 leading-relaxed mb-6 font-light text-sm">
                From concept to installation — we design, manufacture, and deliver turnkey interior solutions.
              </p>
              <ul className="text-foreground/60 space-y-3 text-xs font-light text-left max-w-[180px] mx-auto">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-accent" />Space planning</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-accent" />Custom furniture</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-accent" />Material procurement</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-accent" />On-site installation</li>
              </ul>
            </Card>

            <Card className="p-10 text-center bg-card border-border shadow-2xl transition-all duration-300 hover:border-accent/40 group">
              <div className="w-16 h-16 mx-auto mb-8 rounded-full bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Palette className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-foreground">Bespoke Furniture</h3>
              <p className="text-foreground/70 leading-relaxed mb-6 font-light text-sm">
                Modular and custom-built furniture tailored to your space and style.
              </p>
              <ul className="text-foreground/60 space-y-3 text-xs font-light text-left max-w-[180px] mx-auto">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-accent" />Custom wardrobes</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-accent" />Modular kitchens</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-accent" />Bespoke seating</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-accent" />Premium detailing</li>
              </ul>
            </Card>

            <Card className="p-10 text-center bg-card border-border shadow-2xl transition-all duration-300 hover:border-accent/40 group">
              <div className="w-16 h-16 mx-auto mb-8 rounded-full bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Scissors className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-foreground">Curtain Works</h3>
              <p className="text-foreground/70 leading-relaxed mb-6 font-light text-sm">
                Premium soft furnishings and window treatments designed for privacy and depth.
              </p>
              <ul className="text-foreground/60 space-y-3 text-xs font-light text-left max-w-[180px] mx-auto">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-accent" />Custom drapery</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-accent" />Specialized automation</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-accent" />Premium sourcing</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-accent" />Installation</li>
              </ul>
            </Card>

            <Card className="p-10 text-center bg-card border-border shadow-2xl transition-all duration-300 hover:border-accent/40 group">
              <div className="w-16 h-16 mx-auto mb-8 rounded-full bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Hammer className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-foreground">Consulting</h3>
              <p className="text-foreground/70 leading-relaxed mb-6 font-light text-sm">
                Expert guidance on layouts, materials, planning, and execution strategy.
              </p>
              <ul className="text-foreground/60 space-y-3 text-xs font-light text-left max-w-[180px] mx-auto">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-accent" />Space optimization</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-accent" />Material selection</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-accent" />Project planning</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-accent" />Execution strategy</li>
              </ul>
            </Card>
          </div>
        </div>
      </section >

      {/* Gallery Section - Replaces Portfolio */}
      < Gallery />

      {/* Testimonials Section */}
      < Testimonials />

      {/* Contact Section */}
      <section id="contact" className="py-[100px] md:py-[140px] bg-background reveal" >
        <div className="container-custom max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter text-foreground">Get in Touch</h2>
            <p className="text-xl text-foreground/50 font-light">
              Tell us about your project
            </p>
            <p className="text-lg text-accent font-medium mt-4 italic">
              Let's elevate your space together.
            </p>
          </div>

          <Card className="p-10 md:p-16 bg-card border-border shadow-2xl animate-fade-in relative z-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label htmlFor="name" className="block text-sm font-bold mb-3 tracking-widest uppercase text-muted-foreground">Name *</label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="h-14 text-base bg-background border-border text-foreground placeholder:text-muted-foreground/30 transition-all focus:ring-2 focus:ring-accent focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-bold mb-3 tracking-widest uppercase text-muted-foreground">Email *</label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="h-14 text-base bg-background border-border text-foreground placeholder:text-muted-foreground/30 transition-all focus:ring-2 focus:ring-accent focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label htmlFor="phone" className="block text-sm font-bold mb-3 tracking-widest uppercase text-muted-foreground">Phone *</label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    className="h-14 text-base bg-background border-border text-foreground placeholder:text-muted-foreground/30 transition-all focus:ring-2 focus:ring-accent focus:border-transparent"
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <label htmlFor="location" className="block text-sm font-bold mb-3 tracking-widest uppercase text-muted-foreground">Location *</label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                    className="h-14 text-base bg-background border-border text-foreground placeholder:text-muted-foreground/30 transition-all focus:ring-2 focus:ring-accent focus:border-transparent"
                    placeholder="City, State"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-bold mb-3 tracking-widest uppercase text-muted-foreground">Message *</label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={6}
                  className="resize-none text-base bg-background border-border text-foreground placeholder:text-muted-foreground/30 transition-all focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="Tell us about your project..."
                />
              </div>

              <Button
                type="submit"
                variant="default"
                size="lg"
                className="w-full h-14 md:h-16 text-sm md:text-xl font-bold bg-accent text-white hover:bg-accent/90 shadow-[0_10px_40px_-10px_rgba(252,211,77,0.3)] hover:scale-[1.02] transition-all duration-500 rounded-xl uppercase tracking-wider md:tracking-widest"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="inline-block w-5 h-5 border-3 border-accent-foreground border-t-transparent rounded-full animate-spin mr-3"></span>
                    Processing...
                  </>
                ) : (
                  <>
                    Start Your Project
                    <ArrowRight className="ml-2 h-6 w-6" />
                  </>
                )}
              </Button>
            </form>
          </Card>
        </div>
      </section >

      {/* Footer */}
      <footer className="py-12 md:py-16 border-t border-border bg-background relative overflow-hidden" >
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[120px] -z-10" />
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-10 md:gap-16 mb-12">
            <div>
              <div className="flex items-baseline gap-2 mb-4">
                <Logo className="w-40 h-auto" />
              </div>
              <p className="text-foreground/60 leading-relaxed font-light mb-4">
                The luxury home interior brand by <span className="text-accent font-semibold">DCODE Private Limited</span>.
              </p>
              <p className="text-foreground/40 text-sm leading-relaxed">
                Transforming spaces into refined living experiences.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-bold mb-6 tracking-widest uppercase text-foreground">Contact</h4>
              <div className="space-y-4">
                <a href="mailto:shinu.thej1039@gmail.com" className="flex items-center gap-3 text-foreground/60 hover:text-accent transition-colors group">
                  <Mail className="w-5 h-5 group-hover:scale-110 transition-transform text-accent" />
                  <span>shinu.thej1039@gmail.com</span>
                </a>
                <a href="tel:+919633860898" className="flex items-center gap-3 text-foreground/60 hover:text-accent transition-colors group">
                  <Phone className="w-5 h-5 group-hover:scale-110 transition-transform text-accent" />
                  <span>+91 9633860898</span>
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold mb-6 tracking-widest uppercase text-foreground">Location</h4>
              <div className="flex items-start gap-3 text-foreground/60">
                <MapPin className="w-5 h-5 mt-1 flex-shrink-0 text-accent" />
                <span className="text-sm leading-relaxed">
                  <div className="flex flex-col gap-3">
                    <img src="/dcode-logo.jpg" alt="DCODE Logo" className="w-16 h-16 rounded-md shadow-sm opacity-80" />
                    <strong className="block text-foreground mb-1 underline decoration-accent/30 decoration-2 underline-offset-4">DCODE PRIVATE LTD</strong>
                  </div>
                  24/1701, Door No 14/22AB4, Suite No 883,<br />
                  2nd floor, KC Arcade, Near TV center,<br />
                  Cochin Special Economin Zone,<br />
                  Ernakulam, Kerala 682037
                </span>
              </div>
            </div>
          </div>

          <div className="pt-5 border-t border-border text-center">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-foreground/30 font-light text-sm">
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-2">
                  <img src="/dcode-logo.jpg" alt="DCODE Logo" className="w-8 h-8 rounded-sm opacity-60" />
                  <p>&copy; {new Date().getFullYear()} <span className="text-accent font-medium">dplHomestar</span> — A brand of <span className="text-foreground/50 font-medium">DCODE Private Limited</span>. All rights reserved.</p>
                </div>
              </div>
              <a
                href="/admin/login"
                className="text-[12px] text-foreground/20 hover:text-accent transition-all duration-300 md:self-end self-start uppercase tracking-widest font-bold"
                aria-label="Admin Access"
              >
                *
              </a>
            </div>
          </div>
        </div>
      </footer >
    </div >
  );
};

export default Index;
