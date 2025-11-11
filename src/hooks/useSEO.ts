import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export interface SEOData {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'service' | 'organization';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  canonical?: string;
  noindex?: boolean;
  nofollow?: boolean;
  schema?: Record<string, any>;
}

// Default SEO data for Falcon Security Limited
const defaultSEO: SEOData = {
  title: 'Falcon Security Limited - Premium Security Services in Bangladesh',
  description: 'Professional security services including residential, commercial, event security, bodyguard services, and security consultancy. Trusted security solutions across Bangladesh.',
  keywords: [
    'security services bangladesh',
    'falcon security limited',
    'bodyguard services dhaka',
    'commercial security',
    'residential security',
    'event security',
    'security consultancy',
    'professional security',
    'security company bangladesh',
    'private security services'
  ],
  image: '/images/falcon-security-og.jpg',
  type: 'website'
};

// Page-specific SEO configurations
const pageSEOConfig: Record<string, Partial<SEOData>> = {
  '/': {
    title: 'Falcon Security Limited - Premium Security Services in Bangladesh',
    description: 'Leading security company providing comprehensive protection services including residential, commercial, event security, and bodyguard services across Bangladesh.',
    type: 'website',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'SecurityCompany',
      name: 'Falcon Security Limited',
      description: 'Professional security services company in Bangladesh',
      url: 'https://falconsecurity.com.bd',
      telephone: '+880-XXX-XXXXXX',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'BD',
        addressLocality: 'Dhaka'
      },
      serviceArea: 'Bangladesh',
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Security Services',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Residential Security'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Commercial Security'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Event Security'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Bodyguard Services'
            }
          }
        ]
      }
    }
  },
  '/about': {
    title: 'About Falcon Security - Professional Security Company in Bangladesh',
    description: 'Learn about Falcon Security Limited, our mission, values, and commitment to providing top-tier security services across Bangladesh with experienced professionals.',
    keywords: ['about falcon security', 'security company history', 'professional security team', 'security mission bangladesh'],
    type: 'website'
  },
  '/services': {
    title: 'Security Services - Residential, Commercial & Event Security | Falcon Security',
    description: 'Comprehensive security services including residential protection, commercial security, event security, bodyguard services, and security consultancy in Bangladesh.',
    keywords: ['security services', 'residential security', 'commercial security', 'event security', 'bodyguard services'],
    type: 'website'
  },
  '/services/residential': {
    title: 'Residential Security Services - Home Protection | Falcon Security',
    description: '24/7 residential security services to protect your home and family. Professional security guards, surveillance systems, and comprehensive home protection in Bangladesh.',
    keywords: ['residential security', 'home security', 'house security guard', 'family protection'],
    type: 'service'
  },
  '/services/commercial': {
    title: 'Commercial Security Services - Business Protection | Falcon Security',
    description: 'Professional commercial security solutions for offices, factories, and businesses. Comprehensive security systems and trained personnel to protect your assets.',
    keywords: ['commercial security', 'office security', 'business protection', 'industrial security'],
    type: 'service'
  },
  '/services/events': {
    title: 'Event Security Services - Professional Event Protection | Falcon Security',
    description: 'Specialized event security services for conferences, concerts, weddings, and corporate events. Experienced security personnel for safe and successful events.',
    keywords: ['event security', 'conference security', 'wedding security', 'concert security'],
    type: 'service'
  },
  '/services/bodyguard': {
    title: 'Bodyguard Services - Personal Protection | Falcon Security',
    description: 'Professional bodyguard and personal protection services for VIPs, executives, and high-profile individuals. Trained security professionals for personal safety.',
    keywords: ['bodyguard services', 'personal protection', 'VIP security', 'executive protection'],
    type: 'service'
  },
  '/blog': {
    title: 'Security Blog - Tips, News & Insights | Falcon Security',
    description: 'Latest security tips, industry news, and expert insights on personal and business security. Stay informed with Falcon Security\'s security blog.',
    keywords: ['security blog', 'security tips', 'security news', 'security insights'],
    type: 'website'
  },
  '/contact': {
    title: 'Contact Falcon Security - Get Professional Security Services Quote',
    description: 'Contact Falcon Security Limited for professional security services. Get a free quote, consultation, and expert advice on your security needs in Bangladesh.',
    keywords: ['contact falcon security', 'security quote', 'security consultation', 'hire security services'],
    type: 'website'
  },
  '/careers': {
    title: 'Careers at Falcon Security - Join Our Professional Security Team',
    description: 'Join Falcon Security Limited\'s professional team. Explore career opportunities in security services and become part of Bangladesh\'s leading security company.',
    keywords: ['security jobs', 'falcon security careers', 'security guard jobs', 'security employment'],
    type: 'website'
  }
};

export const useSEO = (pageData?: Partial<SEOData>) => {
  const location = useLocation();
  
  const getSEOData = (): SEOData => {
    const pathSEO = pageSEOConfig[location.pathname] || {};
    const finalSEO = {
      ...defaultSEO,
      ...pathSEO,
      ...pageData
    };

    // Generate full URL
    if (!finalSEO.url) {
      finalSEO.url = `${window.location.origin}${location.pathname}`;
    }

    // Generate canonical URL
    if (!finalSEO.canonical) {
      finalSEO.canonical = finalSEO.url;
    }

    return finalSEO;
  };

  const seoData = getSEOData();

  // Track page view for analytics
  useEffect(() => {
    // Google Analytics page view
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: location.pathname,
        page_title: seoData.title,
      });
    }
  }, [location.pathname, seoData.title]);

  return seoData;
};

// Utility functions for SEO
export const generateBreadcrumbSchema = (breadcrumbs: Array<{ label: string; url: string }>) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.label,
      item: crumb.url
    }))
  };
};

export const generateArticleSchema = (article: {
  title: string;
  description: string;
  author: string;
  publishedTime: string;
  modifiedTime?: string;
  image?: string;
  url: string;
}) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    author: {
      '@type': 'Person',
      name: article.author
    },
    publisher: {
      '@type': 'Organization',
      name: 'Falcon Security Limited',
      logo: {
        '@type': 'ImageObject',
        url: '/images/falcon-security-logo.png'
      }
    },
    datePublished: article.publishedTime,
    dateModified: article.modifiedTime || article.publishedTime,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url
    },
    ...(article.image && {
      image: {
        '@type': 'ImageObject',
        url: article.image
      }
    })
  };
};

export const generateServiceSchema = (service: {
  name: string;
  description: string;
  provider: string;
  areaServed?: string;
  serviceType?: string;
}) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    provider: {
      '@type': 'Organization',
      name: service.provider
    },
    areaServed: service.areaServed || 'Bangladesh',
    serviceType: service.serviceType || 'Security Service'
  };
};

export default useSEO;