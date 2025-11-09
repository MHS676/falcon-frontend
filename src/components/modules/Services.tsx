import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon, StarIcon } from '@heroicons/react/24/solid';
import { servicesAPI } from '../../services/api';
import toast from 'react-hot-toast';

interface Service {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  icon?: string;
  image?: string;
  features: string[];
  price?: {
    min: number;
    max?: number;
    currency: string;
    type: 'fixed' | 'hourly' | 'project';
  };
  category: string;
  isActive: boolean;
  isFeatured: boolean;
  tags?: string[];
  deliverables?: string[];
  timeline?: string;
  testimonials?: {
    name: string;
    role: string;
    company: string;
    feedback: string;
    rating: number;
  }[];
}

interface ServicesProps {
  showFeaturedOnly?: boolean;
  showActiveOnly?: boolean;
  maxItems?: number;
  layout?: 'grid' | 'list';
  categories?: string[];
}

const Services = ({
  showFeaturedOnly = false,
  showActiveOnly = true,
  maxItems,
  layout = 'grid',
  categories
}: ServicesProps) => {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    filterServices();
  }, [services, selectedCategory, categories]);

  const fetchServices = async () => {
    try {
      let response;
      if (showFeaturedOnly) {
        response = await servicesAPI.getFeatured();
      } else if (showActiveOnly) {
        response = await servicesAPI.getActive();
      } else {
        response = await servicesAPI.getAll();
      }

      let servicesList = response.data;

      // Apply max items limit if specified
      if (maxItems && servicesList.length > maxItems) {
        servicesList = servicesList.slice(0, maxItems);
      }

      setServices(servicesList);

      // Extract unique categories
      const uniqueCategories = [...new Set(servicesList.map((service: Service) => service.category))] as string[];
      setAvailableCategories(uniqueCategories);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to load services');
      setLoading(false);
    }
  };

  const filterServices = () => {
    let filtered = services;

    // Filter by selected category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }

    // Filter by provided categories prop
    if (categories && categories.length > 0) {
      filtered = filtered.filter(service => categories.includes(service.category));
    }

    setFilteredServices(filtered);
  };

  const formatPrice = (price?: Service['price']) => {
    // If price is missing entirely
    if (!price || typeof price.min !== 'number') {
      return 'Contact for pricing';
    }

    const symbol = price.currency === 'USD' ? '$' : price.currency || '';
    const typeText =
      price.type === 'hourly'
        ? '/hr'
        : price.type === 'project'
          ? '/project'
          : '';

    // Handle when both min and max are numbers
    if (
      typeof price.max === 'number' &&
      price.max !== price.min
    ) {
      return `${symbol}${price.min.toLocaleString()} - ${symbol}${price.max.toLocaleString()}${typeText}`;
    }

    // Single fixed price
    return `${symbol}${price.min.toLocaleString()}${typeText}`;
  };


  if (loading) {
    const itemCount = maxItems || 6;
    return (
      <div className={layout === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}>
        {[...Array(itemCount)].map((_, index) => (
          <div key={index} className={`bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg ${layout === 'list' ? 'h-32' : 'h-80'}`}></div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Category Filter - only show if not filtering by specific categories */}
      {!categories && availableCategories.length > 1 && (
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 rounded-full transition-all duration-300 ${selectedCategory === 'All'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
          >
            All Services
          </button>
          {availableCategories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full transition-all duration-300 capitalize ${selectedCategory === category
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* Services Grid/List */}
      <div className={layout === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}>
        {filteredServices.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group border border-gray-200 dark:border-gray-700 ${layout === 'list' ? 'flex flex-col md:flex-row' : ''
              }`}
          >
            {/* Service Image */}
            {service.image && (
              <div className={`${layout === 'list' ? 'md:w-1/3' : ''}`}>
                <img
                  src={service.image}
                  alt={service.title}
                  className={`w-full object-cover transition-transform duration-300 group-hover:scale-105 ${layout === 'list' ? 'h-48 md:h-full' : 'h-48'
                    }`}
                />
              </div>
            )}

            {/* Service Content */}
            <div className={`p-6 ${layout === 'list' && service.image ? 'md:w-2/3' : ''} flex-1`}>
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {service.title}
                  </h3>
                  <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-sm capitalize">
                    {service.category}
                  </span>
                </div>
                {service.isFeatured && (
                  <div className="flex items-center space-x-1 text-yellow-500">
                    <StarIcon className="w-5 h-5" />
                    <span className="text-xs font-medium">Featured</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                {service.shortDescription || service.description}
              </p>

              {/* Features */}
              {service.features && service.features.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Key Features:</h4>
                  <ul className="space-y-1">
                    {service.features.slice(0, layout === 'list' ? 6 : 4).map((feature, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-sm">
                        <CheckCircleIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                    {service.features.length > (layout === 'list' ? 6 : 4) && (
                      <li className="text-sm text-gray-500 dark:text-gray-400">
                        +{service.features.length - (layout === 'list' ? 6 : 4)} more features
                      </li>
                    )}
                  </ul>
                </div>
              )}

              {/* Tags */}
              {service.tags && service.tags.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {service.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                    {service.tags.length > 4 && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded text-xs">
                        +{service.tags.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Timeline and Price */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
                <div>
                  {service.timeline && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Timeline: {service.timeline}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {formatPrice(service.price)}
                  </p>
                </div>
              </div>

              {/* CTA Button */}
              <div className="mt-4">
                <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
                  Get Started
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredServices.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No services found{selectedCategory !== 'All' ? ` in ${selectedCategory} category` : ''}.
          </p>
        </div>
      )}
    </div>
  );
};

export default Services;