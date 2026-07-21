import { Helmet } from "react-helmet-async";

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    ogImage?: string;
    url?: string;
}

const SEO = ({
    title = "Ssena Healing Africa - Inclusive Community Service",
    description = "Ssena Healing Africa is a non-governmental organization dedicated to youth empowerment, healthcare outreach, mentorship, and community development across Uganda.",
    keywords = "Ssena Healing Africa, Youth Empowerment, Uganda, Community Outreach, Mentorship, Healthcare",
    ogImage = "https://suyel.org/SSENA%20LOGO.jpg",
    url = "https://suyel.org"
}: SEOProps) => {
    const siteTitle = title.includes("Ssena") ? title : `${title} | Ssena Healing Africa`;

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{siteTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <link rel="canonical" href={url} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={siteTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:url" content={url} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={siteTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage} />

            {/* Structured Data (JSON-LD) */}
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "NGO",
                    "name": "Ssena Healing Africa",
                    "url": "https://suyel.org",
                    "logo": "https://suyel.org/SSENA%20LOGO.jpg",
                    "description": description,
                    "address": {
                        "@type": "PostalAddress",
                        "addressLocality": "Iganga & Wakiso",
                        "addressCountry": "UG"
                    },
                    "contactPoint": {
                        "@type": "ContactPoint",
                        "telephone": "+256 705 206 985 / +256 763 238 667",
                        "contactType": "General inquiries"
                    }
                })}
            </script>
        </Helmet>
    );
};

export default SEO;
