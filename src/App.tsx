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

import { AppRoutes } from "./AppRoutes";

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
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
