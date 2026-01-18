import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, User, Tag } from "lucide-react";
import { Logo } from "@/components/Logo";
import { MobileMenu } from "@/components/MobileMenu";

import { SEO } from "@/components/SEO";

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    featured_image_url: string | null;
    author: string;
    published_at: string;
    tags: string[];
}

const Blog = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const currentTag = searchParams.get('tag');
    const navigate = useNavigate();

    const handleNavigation = (id: string) => {
        navigate(`/#${id}`);
        // Small timeout to allow potential navigation/render to complete before scrolling
        setTimeout(() => {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }, 500);
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const { data, error } = await supabase
                .from('blog_posts')
                .select('*')
                .eq('is_published', true)
                .order('published_at', { ascending: false });

            if (error) throw error;
            setPosts(data || []);
        } catch (error) {
            console.error('Error fetching blog posts:', error);
        } finally {
            setLoading(false);
        }
    };

    // Extract unique tags
    const allTags = Array.from(new Set(posts.flatMap(post => post.tags || []))).sort();

    // Filter posts by tag
    const filteredPosts = currentTag
        ? posts.filter(post => post.tags?.includes(currentTag))
        : posts;

    return (
        <div className="min-h-screen bg-background">
            <SEO
                title={currentTag ? `${currentTag} Articles` : "Design Journal"}
                description="Insights, trends, and stories from the world of interior design by DPL Homestar."
                url={window.location.href}
            />
            {/* Header */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg shadow-sm border-b border-border/50 py-3">
                <div className="container-custom flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="pointer-events-none">
                            <Logo className="w-32 md:w-48 h-auto" />
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            Home
                        </Link>
                        <Link to="/blog" className="text-sm font-medium text-foreground relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-accent after:w-full">
                            Blog
                        </Link>
                        <Button
                            variant="default"
                            size="sm"
                            className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
                            onClick={() => handleNavigation('contact')}
                        >
                            Contact
                        </Button>
                    </div>

                    {/* Mobile Navigation */}
                    <MobileMenu isScrolled={true} />
                </div>
            </nav>

            <main className="pt-24 md:pt-32 pb-20">
                <div className="container-custom">
                    <div className="text-center mb-12 animate-fade-in">
                        <h1 className="text-5xl md:text-8xl font-bold mb-6 tracking-tighter text-foreground">
                            Design Journal
                        </h1>
                        <p className="text-xl text-foreground/60 max-w-2xl mx-auto font-light mb-8">
                            Insights, trends, and stories from the world of interior design
                        </p>

                        {/* Tag Filter */}
                        {allTags.length > 0 && (
                            <div className="flex flex-wrap justify-center gap-2 animate-fade-in">
                                <Button
                                    variant={!currentTag ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setSearchParams({})}
                                    className="rounded-full"
                                >
                                    All
                                </Button>
                                {allTags.map(tag => (
                                    <Button
                                        key={tag}
                                        variant={currentTag === tag ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setSearchParams({ tag })}
                                        className="rounded-full capitalize"
                                    >
                                        {tag}
                                    </Button>
                                ))}
                            </div>
                        )}
                    </div>

                    {loading ? (
                        <div className="text-center py-20">
                            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                        </div>
                    ) : filteredPosts.length === 0 ? (
                        <div className="text-center py-20 text-muted-foreground">
                            <p>No articles found matching your criteria.</p>
                            {currentTag && (
                                <Button variant="link" onClick={() => setSearchParams({})}>
                                    View all articles
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredPosts.map((post, index) => (
                                <Link key={post.id} to={`/blog/${post.slug}`}>
                                    <Card className="h-full overflow-hidden group premium-card-hover animate-fade-in border-0 shadow-lg bg-card" style={{ animationDelay: `${index * 0.1}s` }}>
                                        <div className="aspect-[16/10] overflow-hidden">
                                            {post.featured_image_url ? (
                                                <img
                                                    src={post.featured_image_url}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-accent/5 flex items-center justify-center text-accent/20">
                                                    <span className="text-5xl font-bold opacity-10">Aa</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-6">
                                            <div className="flex items-center gap-4 text-xs text-foreground/50 mb-4">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(post.published_at).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <User className="w-3 h-3" />
                                                    {post.author}
                                                </div>
                                            </div>
                                            <h2 className="text-2xl font-bold mb-3 text-foreground group-hover:text-accent transition-colors line-clamp-2 tracking-tight">
                                                {post.title}
                                            </h2>
                                            {post.excerpt && (
                                                <p className="text-foreground/60 text-sm line-clamp-3 mb-4 leading-relaxed">
                                                    {post.excerpt}
                                                </p>
                                            )}

                                            {/* Tags in card */}
                                            {post.tags && post.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {post.tags.slice(0, 3).map(tag => (
                                                        <span key={tag} className="text-[10px] uppercase tracking-wider px-2 py-1 bg-muted rounded-sm text-muted-foreground">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="flex items-center text-accent text-sm font-medium mt-auto">
                                                Read Article <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="py-12 border-t border-border bg-background">
                <div className="container-custom text-center text-foreground/30 font-light text-sm">
                    <p>&copy; {new Date().getFullYear()} DPL Homestar. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Blog;
