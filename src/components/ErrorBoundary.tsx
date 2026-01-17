
import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-background p-6">
                    <div className="max-w-md w-full bg-card border border-border rounded-lg shadow-lg p-8 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="w-8 h-8 text-red-600" />
                        </div>
                        <h1 className="text-2xl font-serif font-medium mb-4">Something went wrong</h1>
                        <p className="text-muted-foreground mb-6">
                            We're sorry, but an unexpected error has occurred. Please try refreshing the page.
                        </p>
                        {this.state.error && (
                            <div className="bg-muted/50 p-4 rounded-md text-left mb-6 overflow-auto max-h-40">
                                <p className="text-xs font-mono text-red-500 break-words">
                                    {this.state.error.toString()}
                                </p>
                            </div>
                        )}
                        <div className="flex gap-4 justify-center">
                            <Button onClick={() => window.location.reload()}>
                                Refresh Page
                            </Button>
                            <Button variant="outline" onClick={() => window.location.href = '/'}>
                                Go Home
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
