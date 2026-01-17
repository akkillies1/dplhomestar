import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const ProtectedRoute = () => {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        checkAuth();

        const { data: authListener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                setAuthenticated(!!session);
                setLoading(false);
            }
        );

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const checkAuth = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        setAuthenticated(!!session);
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-muted-foreground">Loading...</p>
            </div>
        );
    }

    if (!authenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    return <Outlet />;
};
