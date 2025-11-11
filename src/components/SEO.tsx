import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'service' | 'organization';
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
  service?: {
    name: string;
    price?: string;
    description: string;
    provider: string;
  };
  organization?: {
    name: string;
    url: string;
    logo: string;
    contactPoint: {
      telephone: string;
      contactType: string;
      email: string;
    };
    address: {
      streetAddress: string;
      addressLocality: string;
      addressRegion: string;
      postalCode: string;
      addressCountry: string;
    };
    sameAs: string[];
  };
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords = 'security services, armed guards, unarmed security, mobile patrol, event security, corporate security, Falcon Security Limited, professional security, New York security company',
  image = 'https://falcon-frontend-six.vercel.app/og-image.jpg',
  url = 'https://falcon-frontend-six.vercel.app',
  type = 'website',
  article,
  service,
  organization
}) => {
  const siteName = 'Falcon Security Limited';
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
  
  // Default organization data for Falcon Security
  const defaultOrganization = {
    "@context": "https://schema.org",
    "@type": "SecurityService",
    "name": "Falcon Security Limited",
    "url": "https://falcon-frontend-six.vercel.app",
    "logo": "https://falcon-frontend-six.vercel.app/logo.png",
    "description": "Professional security services company providing comprehensive protection solutions across corporate, retail, construction, and event sectors with 15+ years of expertise.",
    "telephone": "+1 (555) 123-SECURITY",
    "email": "info@falconsecurity.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "1234 Security Boulevard, Suite 500",
      "addressLocality": "Business District",
      "addressRegion": "NY",
      "postalCode": "10001",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "40.7128",
      "longitude": "-74.0060"
    },
    "openingHours": "Mo-Su 00:00-23:59",
    "priceRange": "$22-$75 per hour",
    "areaServed": {
      "@type": "State",
      "name": "New York"
    },
    "serviceType": [
      "Armed Security Guards",
      "Unarmed Security Guards", 
      "Mobile Patrol Services",
      "Event Security",
      "Executive Protection",
      "Corporate Security",
      "Retail Security",
      "Construction Site Security"
    ],
    "sameAs": [
      "https://facebook.com/falconsecurityltd",
      "https://linkedin.com/company/falcon-security-limited",
      "https://twitter.com/falconsecltd",
      "https://instagram.com/falconsecurityltd"
    ],
    "hasCredential": "Licensed, Bonded & Insured Security Services",
    "yearsInOperation": 15,
    "numberOfEmployees": "50-200"
  };

  // Generate JSON-LD structured data
  const generateStructuredData = () => {
    const structuredData: any[] = [defaultOrganization];

    if (type === 'article' && article) {
      structuredData.push({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "description": description,
        "image": image,
        "author": {
          "@type": "Organization",
          "name": article.author || siteName
        },
        "publisher": {
          "@type": "Organization",
          "name": siteName,
          "logo": {
            "@type": "ImageObject",
            "url": "https://falcon-frontend-six.vercel.app/logo.png"
          }
        },
        "datePublished": article.publishedTime,
        "dateModified": article.modifiedTime || article.publishedTime,
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": url
        }
      });
    }

    if (type === 'service' && service) {
      structuredData.push({
        "@context": "https://schema.org",
        "@type": "Service",
        "name": service.name,
        "description": service.description,
        "provider": {
          "@type": "Organization",
          "name": service.provider
        },
        "offers": service.price ? {
          "@type": "Offer",
          "price": service.price,
          "priceCurrency": "USD"
        } : undefined
      });
    }

    // Add breadcrumb if applicable
    if (url !== 'https://falcon-frontend-six.vercel.app') {
      const pathSegments = new URL(url).pathname.split('/').filter(Boolean);
      const breadcrumbList = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://falcon-frontend-six.vercel.app"
          }
        ]
      };

      pathSegments.forEach((segment, index) => {
        breadcrumbList.itemListElement.push({
          "@type": "ListItem",
          "position": index + 2,
          "name": segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
          "item": `https://falcon-frontend-six.vercel.app/${pathSegments.slice(0, index + 1).join('/')}`
        });
      });

      structuredData.push(breadcrumbList);
    }

    return structuredData;
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={siteName} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={`${title} - ${siteName}`} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_US" />
      
      {/* Article specific Open Graph */}
      {type === 'article' && article && (
        <>
          <meta property="article:published_time" content={article.publishedTime} />
          <meta property="article:modified_time" content={article.modifiedTime} />
          <meta property="article:author" content={article.author} />
          <meta property="article:section" content={article.section} />
          {article.tags?.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@falconsecltd" />
      <meta name="twitter:creator" content="@falconsecltd" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={`${title} - ${siteName}`} />
      
      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#1e40af" />
      <meta name="msapplication-TileColor" content="#1e40af" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="format-detection" content="telephone=yes" />
      
      {/* Business Information */}
      <meta name="geo.region" content="US-NY" />
      <meta name="geo.placename" content="New York" />
      <meta name="geo.position" content="40.7128;-74.0060" />
      <meta name="ICBM" content="40.7128, -74.0060" />
      
      {/* JSON-LD Structured Data */}
      {generateStructuredData().map((data, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEO;