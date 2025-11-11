import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

interface BreadcrumbItem {
  label: string;
  path: string;
  current?: boolean;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
  const location = useLocation();
  
  // Generate breadcrumbs automatically if not provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', path: '/' }
    ];

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Convert segment to readable label
      let label = segment.charAt(0).toUpperCase() + segment.slice(1);
      label = label.replace(/-/g, ' ');
      
      // Customize labels for known pages
      const labelMap: { [key: string]: string } = {
        'services': 'Our Services',
        'about': 'About Us',
        'blog': 'Security Blog',
        'career': 'Career Opportunities',
        'contact': 'Contact Us',
        'gallery': 'Project Gallery',
        'admin': 'Admin Dashboard'
      };
      
      if (labelMap[segment]) {
        label = labelMap[segment];
      }
      
      breadcrumbs.push({
        label,
        path: currentPath,
        current: index === pathSegments.length - 1
      });
    });

    return breadcrumbs;
  };

  const breadcrumbItems = items || generateBreadcrumbs();

  // Don't show breadcrumbs on home page
  if (location.pathname === '/' || breadcrumbItems.length <= 1) {
    return null;
  }

  // Generate JSON-LD structured data for breadcrumbs
  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbItems.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": `https://falcon-frontend-six.vercel.app${item.path}`
    }))
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbStructuredData)}
      </script>
      
      <nav 
        className={`bg-gray-50 border-b border-gray-200 ${className}`}
        aria-label="Breadcrumb"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <ol className="flex items-center space-x-2 text-sm">
              {breadcrumbItems.map((item, index) => (
                <li key={item.path} className="flex items-center">
                  {index > 0 && (
                    <ChevronRightIcon 
                      className="h-4 w-4 text-gray-400 mx-2" 
                      aria-hidden="true" 
                    />
                  )}
                  
                  {index === 0 ? (
                    <Link 
                      to={item.path}
                      className="text-gray-500 hover:text-blue-600 transition-colors flex items-center"
                    >
                      <HomeIcon className="h-4 w-4 mr-1" />
                      <span className="sr-only">Home</span>
                    </Link>
                  ) : item.current ? (
                    <span 
                      className="text-gray-900 font-medium"
                      aria-current="page"
                    >
                      {item.label}
                    </span>
                  ) : (
                    <Link 
                      to={item.path}
                      className="text-gray-500 hover:text-blue-600 transition-colors"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Breadcrumb;