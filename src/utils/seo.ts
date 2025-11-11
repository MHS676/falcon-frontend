export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export const generateSitemap = async (): Promise<string> => {
  const baseUrl = 'https://falcon-frontend-six.vercel.app';
  const currentDate = new Date().toISOString().split('T')[0];

  // Static pages with their priorities and change frequencies
  const staticPages: SitemapUrl[] = [
    {
      loc: baseUrl,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 1.0
    },
    {
      loc: `${baseUrl}/about`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.9
    },
    {
      loc: `${baseUrl}/services`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.9
    },
    {
      loc: `${baseUrl}/gallery`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.8
    },
    {
      loc: `${baseUrl}/blog`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: 0.8
    },
    {
      loc: `${baseUrl}/career`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.7
    },
    {
      loc: `${baseUrl}/contact`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.8
    }
  ];

  // Service pages (would be dynamically loaded in real implementation)
  const servicePages: SitemapUrl[] = [
    'armed-security-guards',
    'unarmed-security-guards', 
    'mobile-patrol-services',
    'event-security',
    'executive-protection',
    'corporate-security',
    'retail-security',
    'construction-site-security'
  ].map(service => ({
    loc: `${baseUrl}/services/${service}`,
    lastmod: currentDate,
    changefreq: 'monthly' as const,
    priority: 0.8
  }));

  // Blog post pages (would be dynamically loaded from API)
  const blogPages: SitemapUrl[] = [
    '10-essential-security-tips-for-businesses',
    'importance-of-mobile-security-patrols',
    'event-security-planning-for-success'
  ].map(slug => ({
    loc: `${baseUrl}/blog/${slug}`,
    lastmod: currentDate,
    changefreq: 'monthly' as const,
    priority: 0.6
  }));

  const allPages = [...staticPages, ...servicePages, ...blogPages];

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${allPages.map(page => `  <url>
    <loc>${page.loc}</loc>
    ${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ''}
    ${page.changefreq ? `<changefreq>${page.changefreq}</changefreq>` : ''}
    ${page.priority ? `<priority>${page.priority}</priority>` : ''}
  </url>`).join('\n')}
</urlset>`;

  return sitemapXml;
};

export const generateRobotsTxt = (): string => {
  const baseUrl = 'https://falcon-frontend-six.vercel.app';
  
  return `User-agent: *
Allow: /

# Disallow admin and private areas
Disallow: /admin/
Disallow: /api/
Disallow: /private/
Disallow: /*.json$
Disallow: /*?*utm_*
Disallow: /*?*ref=*
Disallow: /*?*fbclid=*

# Allow important files
Allow: /favicon.ico
Allow: /robots.txt
Allow: /sitemap.xml
Allow: /*.css
Allow: /*.js
Allow: /*.png
Allow: /*.jpg
Allow: /*.jpeg
Allow: /*.gif
Allow: /*.svg
Allow: /*.webp

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml

# Crawl delay (optional)
Crawl-delay: 1`;
};

// Helper function to get current URLs dynamically from API
export const getDynamicUrls = async (): Promise<SitemapUrl[]> => {
  const baseUrl = 'https://falcon-frontend-six.vercel.app';
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  
  try {
    // Fetch blog posts
    const blogResponse = await fetch(`${API_URL}/api/blog`);
    const blogs = blogResponse.ok ? await blogResponse.json() : [];
    
    // Fetch services  
    const servicesResponse = await fetch(`${API_URL}/api/service`);
    const services = servicesResponse.ok ? await servicesResponse.json() : [];

    const dynamicUrls: SitemapUrl[] = [];

    // Add blog post URLs
    blogs.forEach((blog: any) => {
      if (blog.published) {
        dynamicUrls.push({
          loc: `${baseUrl}/blog/${blog.slug}`,
          lastmod: new Date(blog.updatedAt || blog.createdAt).toISOString().split('T')[0],
          changefreq: 'monthly',
          priority: 0.6
        });
      }
    });

    // Add service URLs
    services.forEach((service: any) => {
      if (service.active) {
        const slug = service.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
        dynamicUrls.push({
          loc: `${baseUrl}/services/${slug}`,
          lastmod: new Date(service.updatedAt || service.createdAt).toISOString().split('T')[0],
          changefreq: 'monthly',
          priority: 0.8
        });
      }
    });

    return dynamicUrls;
  } catch (error) {
    console.error('Error fetching dynamic URLs:', error);
    return [];
  }
};