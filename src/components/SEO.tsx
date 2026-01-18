import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description?: string;
    image?: string;
    url?: string;
    type?: string;
}

export const SEO = ({
    title,
    description = "dplHomestar - Interior Design Studio in Kerala",
    image = "https://dplhomestar.com/og-image.png",
    url = typeof window !== 'undefined' ? window.location.href : "",
    type = "website"
}: SEOProps) => {
    const siteTitle = "dplHomestar";
    const fullTitle = title === siteTitle ? title : `${title} | ${siteTitle}`;

    return (
        <Helmet>
            {/* Standard metadata */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={url} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image.startsWith('http') ? image : `https://dplhomestar.com${image}`} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={url} />
            <meta property="twitter:title" content={fullTitle} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={image.startsWith('http') ? image : `https://dplhomestar.com${image}`} />
        </Helmet>
    );
};
