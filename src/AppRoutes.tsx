import { Routes, Route } from "react-router-dom";
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

export const AppRoutes = () => (
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
        <Route path="*" element={<NotFound />} />
    </Routes>
);
