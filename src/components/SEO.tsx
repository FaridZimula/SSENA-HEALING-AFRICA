import { Helmet } from "react-helmet-async";

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    ogImage?: string;
    url?: string;
    schema?: object;
}

const DEFAULT_URL = "https://ssenahealingafrica.org";
const DEFAULT_IMAGE = "https://ssenahealingafrica.org/SSENA%20LOGO.jpg";

const SEO = ({
    title = "Ssena Healing Africa | Mental Health, Youth Empowerment & Community Outreach Uganda",
    description = "Ssena Healing Africa is a registered non-governmental organization empowering Ugandan youth and vulnerable communities through mental health advocacy, trauma recovery, child sexual violence awareness, and vocational life skilling.",
    keywords = "Ssena Healing Africa, Mental Health Uganda, Youth Empowerment Uganda, Child Sexual Violence Awareness, Breaking The Circle, Echoes of a Stolen Childhood, Community Outreach Uganda, Non-Profit Uganda, Donate Uganda, Farid Zimula",
    ogImage = DEFAULT_IMAGE,
    url = DEFAULT_URL,
    schema
}: SEOProps) => {
    const siteTitle = title.includes("Ssena") ? title : `${title} | Ssena Healing Africa`;

    const defaultSchema = {
        "@context": "https://schema.org",
        "@type": "NGO",
        "name": "Ssena Healing Africa",
        "alternateName": "SSENA",
        "url": DEFAULT_URL,
        "logo": DEFAULT_IMAGE,
        "image": DEFAULT_IMAGE,
        "description": description,
        "foundingLocation": {
            "@type": "Place",
            "name": "Kampala, Uganda"
        },
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Kampala, Wakiso & Iganga",
            "addressCountry": "UG"
        },
        "contactPoint": [
            {
                "@type": "ContactPoint",
                "telephone": "+256 705 206 985",
                "contactType": "General inquiries",
                "areaServed": "UG",
                "availableLanguage": ["English", "Luganda"]
            },
            {
                "@type": "ContactPoint",
                "telephone": "+256 763 238 667",
                "contactType": "Emergency / Support",
                "areaServed": "UG"
            }
        ],
        "sameAs": [
            "https://twitter.com/ssenahealing",
            "https://facebook.com/ssenahealingafrica",
            "https://instagram.com/ssenahealingafrica",
            "https://linkedin.com/company/ssena-healing-africa"
        ]
    };

    const structuredData = schema || defaultSchema;

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{siteTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <link rel="canonical" href={url} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content="Ssena Healing Africa" />
            <meta property="og:title" content={siteTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:url" content={url} />
            <meta property="og:locale" content="en_UG" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={siteTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage} />

            {/* Structured Data (JSON-LD) */}
            <script type="application/ld+json">
                {JSON.stringify(structuredData)}
            </script>
        </Helmet>
    );
};

export default SEO;
