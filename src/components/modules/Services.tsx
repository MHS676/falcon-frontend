import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon, StarIcon, TagIcon, ShieldCheckIcon } from '@heroicons/react/24/solid';
import { XMarkIcon } from '@heroicons/react/24/outline';
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
  const [selectedService, setSelectedService] = useState<Service | null>(null);

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

      // Ensure servicesList is an array
      if (!Array.isArray(servicesList)) {
        console.warn('API returned non-array data:', servicesList);
        servicesList = [];
      }

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
      setServices([]); // Set empty array on error
      setAvailableCategories(['All']);
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
                ? 'bg-green-500 text-white shadow-lg'
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
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredServices.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.4 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="group relative bg-white dark:bg-[#1a1a1a] rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer"
            style={{ minHeight: 420 }}
          >
            {/* Card Image */}
            <div className="relative h-52 overflow-hidden rounded-3xl m-3">
              {service.image ? (
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gold-500/30 to-forest-600/30 flex items-center justify-center">
                  <ShieldCheckIcon className="w-20 h-20 text-gold-400/40" />
                </div>
              )}
              {/* Featured badge */}
              {service.isFeatured && (
                <div className="absolute top-3 left-3 bg-gradient-to-r from-gold-500 to-forest-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <StarIcon className="w-3 h-3" />
                  Featured
                </div>
              )}
            </div>

            {/* Card Body */}
            <div className="px-5 pb-5 pt-2">
              {/* Title & subtitle */}
              <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-tight mb-1">
                {service.title}
              </h3>
              <p className="text-gray-400 dark:text-gray-400 text-sm mb-4 line-clamp-1">
                {service.shortDescription || service.category}
              </p>

              {/* Info row */}
              <div className="flex items-center gap-4 mb-5 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1.5">
                  <TagIcon className="w-4 h-4 text-gold-500" />
                  {service.price
                    ? <span className="font-semibold text-gray-800 dark:text-gray-200">
                        from <span className="text-lg font-black">${service.price.min}</span>
                      </span>
                    : <span className="font-semibold text-gray-800 dark:text-gray-200">Custom Pricing</span>
                  }
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheckIcon className="w-4 h-4 text-forest-500" />
                  <span className="font-semibold uppercase tracking-wider text-xs">
                    {(service.category ?? '').slice(0, 8)}
                  </span>
                </div>
              </div>

              {/* Action Row */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedService(service)}
                  className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold py-3.5 rounded-2xl text-sm hover:bg-gray-700 dark:hover:bg-gray-100 transition-all duration-200 shadow-md"
                >
                  Learn More
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

      {/* Big Scale Modal */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedService(null)}
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
            />

            {/* Expanded Card */}
            <motion.div
              initial={{ scale: 0.4, opacity: 0, borderRadius: '24px' }}
              animate={{ scale: 1, opacity: 1, borderRadius: '24px' }}
              exit={{ scale: 0.4, opacity: 0, borderRadius: '24px' }}
              transition={{ type: 'spring', stiffness: 280, damping: 26, mass: 0.9 }}
              className="relative bg-white dark:bg-[#1a1a1a] rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              {/* Hero Image */}
              <div className="relative h-72 overflow-hidden rounded-t-3xl">
                {selectedService.image ? (
                  <motion.img
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                    src={selectedService.image}
                    alt={selectedService.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gold-500/30 to-forest-600/40 flex items-center justify-center">
                    <ShieldCheckIcon className="w-28 h-28 text-gold-400/50" />
                  </div>
                )}
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Close btn */}
                <button
                  onClick={() => setSelectedService(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>

                {/* Featured badge */}
                {selectedService.isFeatured && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-gold-500 to-forest-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <StarIcon className="w-3 h-3" /> Featured
                  </div>
                )}

                {/* Title over image bottom */}
                <div className="absolute bottom-4 left-5 right-5">
                  <p className="text-white/70 text-sm mb-0.5">{selectedService.category}</p>
                  <h2 className="text-3xl font-black text-white leading-tight">{selectedService.title}</h2>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-5">
                {/* Price info row */}
                <div className="flex items-center gap-5 text-sm py-3 px-4 bg-gray-50 dark:bg-[#111] rounded-2xl">
                  <div className="flex items-center gap-2">
                    <TagIcon className="w-4 h-4 text-gold-500" />
                    {selectedService.price
                      ? <span className="font-bold text-gray-900 dark:text-white">
                          from <span className="text-xl">${selectedService.price.min}</span>
                        </span>
                      : <span className="font-bold text-gray-900 dark:text-white">Custom Pricing</span>
                    }
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheckIcon className="w-4 h-4 text-forest-500" />
                    <span className="font-semibold uppercase tracking-widest text-xs text-gray-500 dark:text-gray-400">
                      {selectedService.category}
                    </span>
                  </div>
                  {selectedService.timeline && (
                    <div className="ml-auto text-xs text-gray-400 dark:text-gray-500">
                      ⏱ {selectedService.timeline}
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                  {selectedService.description}
                </p>

                {/* Features */}
                {selectedService.features && selectedService.features.length > 0 && (
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-3">Key Features</h4>
                    <ul className="space-y-2">
                      {selectedService.features.map((feature, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 + idx * 0.04 }}
                          className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300"
                        >
                          <CheckCircleIcon className="w-4 h-4 text-forest-500 mt-0.5 flex-shrink-0" />
                          {feature}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tags */}
                {selectedService.tags && selectedService.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedService.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-gold-500/10 text-gold-600 dark:text-gold-400 border border-gold-500/20 rounded-full text-xs font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* CTA */}
                <div className="pt-2">
                  <a
                    href="/contact"
                    className="block w-full text-center bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold py-4 rounded-2xl text-sm hover:bg-gray-700 dark:hover:bg-gray-100 transition-all shadow-lg"
                  >
                    Get a Free Consultation
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


export default Services;
