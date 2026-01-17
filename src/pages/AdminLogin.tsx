import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Lock, Mail, Key } from "lucide-react";

export const AdminLogin = () => {
    const [pin, setPin] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [pinValidated, setPinValidated] = useState(false);
    const [validatingPin, setValidatingPin] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    const handlePinSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setValidatingPin(true);

        try {
            // Call Edge Function to validate PIN
            const { data, error } = await supabase.functions.invoke('validate-admin-pin', {
                body: { pin },
            });

            if (error) throw error;

            if (data?.valid) {
                setPinValidated(true);
                setPin(""); // Clear PIN from memory
            } else {
                // Silent failure - redirect to home
                toast({
                    title: "Session Timeout",
                    description: "Please try again",
                });
                navigate("/");
            }
        } catch (error) {
            console.error("PIN validation error:", error);
            toast({
                title: "Session Timeout",
                description: "Please try again",
            });
            navigate("/");
        } finally {
            setValidatingPin(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            console.log('Attempting login with:', email);

            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                console.error('Login error:', error);
                throw error;
            }

            console.log('Login successful, user:', data.user?.email);
            console.log('User metadata:', data.user?.user_metadata);

            // Check if user has admin role
            const isAdmin = data.user?.user_metadata?.is_admin === true;
            console.log('Is admin:', isAdmin);

            if (!isAdmin) {
                console.log('User is not admin, signing out');
                // Not an admin - silent failure
                await supabase.auth.signOut();
                toast({
                    title: "Session Timeout",
                    description: "Please try again",
                });
                navigate("/");
                return;
            }

            // Success - admin user
            console.log('Admin login successful, redirecting to dashboard');
            toast({
                title: "✓ Login Successful",
                description: "Welcome to the admin dashboard",
                className: "bg-green-50 border-green-200 text-green-900",
            });

            navigate("/admin/dashboard");
        } catch (error: any) {
            console.error('Login failed:', error);
            // Silent failure - don't reveal what went wrong
            toast({
                title: "Session Timeout",
                description: "Please try again",
            });
            navigate("/");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="w-full max-w-md p-8 shadow-[var(--shadow-elevated)]">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2 tracking-tight">Admin Login</h1>
                    <p className="text-muted-foreground">
                        Sign in to manage your content
                    </p>
                </div>

                <form onSubmit={pinValidated ? handleLogin : handlePinSubmit} className="space-y-6">
                    {!pinValidated ? (
                        // PIN Entry
                        <div>
                            <label className="block text-sm font-medium mb-2">Access PIN</label>
                            <div className="relative">
                                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    type="password"
                                    value={pin}
                                    onChange={(e) => setPin(e.target.value)}
                                    placeholder="Enter PIN"
                                    className="pl-10"
                                    required
                                    autoFocus
                                />
                            </div>
                        </div>
                    ) : (
                        // Login Fields (shown after PIN validation)
                        <>
                            <div>
                                <label className="block text-sm font-medium mb-2">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <Input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="admin@example.com"
                                        className="pl-10"
                                        required
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <Input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={loading || validatingPin}
                    >
                        {validatingPin ? "Validating..." : loading ? "Signing in..." : pinValidated ? "Sign In" : "Continue"}
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm text-muted-foreground">
                    <a href="/" className="hover:text-foreground transition-colors">
                        ← Back to website
                    </a>
                </div>
            </Card>
        </div>
    );
};
