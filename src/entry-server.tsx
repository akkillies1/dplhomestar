import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AppRoutes } from './AppRoutes';

export async function render(url: string, helmetContext: any) {
    const queryClient = new QueryClient();

    const html = ReactDOMServer.renderToString(
        <HelmetProvider context={helmetContext}>
            <QueryClientProvider client={queryClient}>
                <TooltipProvider>
                    <StaticRouter location={url}>
                        <AppRoutes />
                    </StaticRouter>
                </TooltipProvider>
            </QueryClientProvider>
        </HelmetProvider>
    );

    return { html };
}
