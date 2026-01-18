import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, Share2 } from "lucide-react";
import { ExplodingCube } from "@/components/ExplodingCube";
import ReactMarkdown from 'react-markdown';
import { Logo } from "@/components/Logo";
import { MobileMenu } from "@/components/MobileMenu";

import { SEO } from "@/components/SEO";

interface BlogPost {
    id: string;
    title: string;
    content: string;
    excerpt: string | null;
    featured_image_url: string | null;
    author: string;
    published_at: string;
    tags: string[];
}

const BlogPost = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (slug) {
            fetchPost();
        }
    }, [slug]);

    const fetchPost = async () => {
        try {
            const { data, error } = await supabase
                .from('blog_posts')
                .select('*')
                .eq('slug', slug)
                .eq('is_published', true)
                .single();

            if (error) throw error;
            setPost(data);
        } catch (error) {
            console.error('Error fetching blog post:', error);
            navigate('/blog');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!post) return null;



    // ... imports

    return (
        <div className="min-h-screen bg-background">
            <SEO
                title={post.title}
                description={post.excerpt || `Read ${post.title} on The DCode Design Journal.`}
                image={post.featured_image_url || "/og-image.png"}
                url={window.location.href}
                type="article"
            />
            {/* Header */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg shadow-sm border-b border-border/50 py-3">
                <div className="container-custom flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3">
                        <Logo className="w-24 md:w-32 h-auto" />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link to="/blog" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                            <ArrowLeft className="w-4 h-4" /> Back to Journal
                        </Link>
                    </div>

                    {/* Mobile Navigation */}
                    <MobileMenu isScrolled={true} />
                </div>
            </nav>

            <main className="pt-24 md:pt-32 pb-20">
                <article className="container-custom max-w-3xl">
                    <div className="text-center mb-12 animate-fade-in">
                        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-6">
                            <span className="flex items-center gap-1 bg-accent/5 px-3 py-1 rounded-full text-accent">
                                <Calendar className="w-3 h-3" />
                                {new Date(post.published_at).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                {post.author}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-8 leading-tight tracking-tighter text-foreground">
                            {post.title}
                        </h1>
                        {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap justify-center gap-2">
                                {post.tags.map(tag => (
                                    <Link
                                        key={tag}
                                        to={`/blog?tag=${tag}`}
                                        className="text-xs font-medium px-3 py-1 bg-muted rounded-full text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                                    >
                                        #{tag}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {post.featured_image_url && (
                        <div className="aspect-video rounded-xl overflow-hidden mb-12 shadow-2xl animate-fade-in">
                            <img
                                src={post.featured_image_url}
                                alt={post.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    <div className="prose prose-lg dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-a:text-accent prose-img:rounded-xl max-w-none animate-fade-in text-foreground/80">
                        <ReactMarkdown>{post.content}</ReactMarkdown>
                    </div>

                    <div className="mt-16 pt-8 border-t border-border flex justify-between items-center">
                        <Button variant="outline" onClick={() => navigate('/blog')}>
                            <ArrowLeft className="w-4 h-4 mr-2" /> More Articles
                        </Button>
                        <Button variant="ghost" onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            // You could add a toast here
                        }}>
                            <Share2 className="w-4 h-4 mr-2" /> Share
                        </Button>
                    </div>
                </article>
            </main>

            {/* Footer */}
            <footer className="py-12 border-t border-border bg-background">
                <div className="container-custom text-center text-foreground/30 font-light text-sm">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                        <img src="/dcode-logo.jpg" alt="DCODE Logo" className="w-8 h-8 rounded-sm opacity-60" />
                        <p>&copy; {new Date().getFullYear()} dplHomestar. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default BlogPost;
