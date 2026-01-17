import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AdminLogin } from "./pages/AdminLogin";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { GalleryManager } from "./pages/admin/GalleryManager";
import { TestimonialsManager } from "./pages/admin/TestimonialsManager";
import { BlogManager } from "./pages/admin/BlogManager";
import { GalleryImageForm } from "./pages/admin/GalleryImageForm";
import { TestimonialForm } from "./pages/admin/TestimonialForm";
import { BlogPostForm } from "./pages/admin/BlogPostForm";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { LeadsManager } from "./pages/admin/LeadsManager";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import { HelmetProvider } from 'react-helmet-async';

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/leads" element={<LeadsManager />} />
              <Route path="/admin/blog/:id" element={<BlogPostForm />} />
              <Route path="/admin/gallery" element={<GalleryManager />} />
              <Route path="/admin/gallery/new" element={<GalleryImageForm />} />
              <Route path="/admin/gallery/:id" element={<GalleryImageForm />} />
              <Route path="/admin/testimonials" element={<TestimonialsManager />} />
              <Route path="/admin/testimonials/new" element={<TestimonialForm />} />
              <Route path="/admin/testimonials/:id" element={<TestimonialForm />} />
              <Route path="/admin/blog" element={<BlogManager />} />
              <Route path="/admin/blog/new" element={<BlogPostForm />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
