import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheckIcon, 
  UserGroupIcon,
  MagnifyingGlassIcon,
  TruckIcon,
  CalendarDaysIcon,
  CpuChipIcon,
  VideoCameraIcon,
  EyeIcon,
  LockClosedIcon,
  PhoneIcon,
  ClockIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';
import SEO from '../components/SEO';
import Breadcrumb from '../components/Breadcrumb';
import { useSEO } from '../hooks/useSEO';
import { Link } from 'react-router-dom';

const iconMap: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  ShieldCheckIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
  TruckIcon,
  CalendarIcon: CalendarDaysIcon,
  CalendarDaysIcon,
  CpuChipIcon,
  VideoCameraIcon,
  EyeIcon,
  LockClosedIcon,
};

interface ServiceData {
  id: string;
  title: string;
  description: string;
  icon?: string;
  features: string[];
  active: boolean;
  featured: boolean;
  order: number;
}

const Services = () => {
  const seoData = useSEO({
    title: 'Security Services - Falcon® Security Limited | Professional Protection Solutions',
    description: 'Comprehensive security services including executive protection, manned guarding, risk consulting, escort services, event security, digital surveillance, CCTV, access control and PSIM integration. Operational since 1993 in Bangladesh.',
    keywords: [
      'security services bangladesh',
      'executive protection dhaka',
      'manned guard service',
      'risk consulting',
      'escort service bangladesh',
      'event security management',
      'digital surveillance cctv',
      'access control systems',
      'psim integration',
      'falcon security services'
    ],
    image: '/images/services/security-services-hero.jpg',
    type: 'website'
  });

  const seoProps = {
    ...seoData,
    keywords: seoData.keywords?.join(', ')
  };

  const [services, setServices] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedService, setExpandedService] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/services/active`);
      if (response.ok) {
        const data = await response.json();
        setServices(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (iconName?: string) => {
    if (!iconName) return ShieldCheckIcon;
    return iconMap[iconName] || ShieldCheckIcon;
  };

  const toggleExpand = (id: string) => {
    setExpandedService(expandedService === id ? null : id);
  };

  return (
    <>
      <SEO {...seoProps} />
      
      <div className="min-h-screen pt-16 pb-12">
        <Breadcrumb />

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-red-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6"
            >
              Our Services
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-slate-600 dark:text-gray-300 max-w-4xl mx-auto mb-8"
            >
              Falcon® Security Limited provides comprehensive security, planning, management and service solutions. 
              With over three decades of experience since 1993, we deliver professional protection services 
              tailored to your specific needs.
            </motion.p>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <div className="flex items-center gap-2 bg-white dark:bg-gray-700 px-4 py-2 rounded-full shadow-lg">
                <ClockIcon className="w-5 h-5 text-red-600" />
                <span className="text-sm font-semibold dark:text-white">24/7 Available</span>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-gray-700 px-4 py-2 rounded-full shadow-lg">
                <ShieldCheckIcon className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-semibold dark:text-white">ISO Certified</span>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-gray-700 px-4 py-2 rounded-full shadow-lg">
                <PhoneIcon className="w-5 h-5 text-green-600" />
                <span className="text-sm font-semibold dark:text-white">Since 1993</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Services List */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="bg-gray-200 dark:bg-gray-700 animate-pulse rounded-2xl h-80" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service, index) => {
                  const IconComponent = getIcon(service.icon);
                  const isExpanded = expandedService === service.id;
                  
                  return (
                    <motion.div
                      key={service.id}
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: index * 0.08 }}
                      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-slate-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300"
                    >
                      <div className="p-8">
                        {/* Icon */}
                        <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-blue-600 rounded-xl mb-6">
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                          {service.title}
                        </h3>
                        
                        {/* Description - show first paragraph or truncated */}
                        <p className="text-slate-600 dark:text-gray-300 mb-4 leading-relaxed">
                          {isExpanded 
                            ? service.description 
                            : service.description.split('\n\n')[0].substring(0, 200) + (service.description.length > 200 ? '...' : '')
                          }
                        </p>

                        {/* Features */}
                        <AnimatePresence>
                          {isExpanded && service.features && service.features.length > 0 && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="mb-4"
                            >
                              <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Key Features:</h4>
                              <ul className="space-y-2">
                                {service.features.map((feature, idx) => (
                                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-600 dark:text-gray-300">
                                    <CheckCircleIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Expand/Collapse button */}
                        <button 
                          onClick={() => toggleExpand(service.id)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          {isExpanded ? 'Show Less' : 'Learn More'}
                          {isExpanded ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Why Falcon Section */}
        <section className="bg-slate-50 dark:bg-gray-900 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Why Choose Falcon®?</h2>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Three Decades of Excellence</h3>
                <p className="text-slate-600 dark:text-gray-300">
                  Operational since 1993, enriched with vast professional experience in security services 
                  with nationwide coverage across Bangladesh.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Military-Grade Leadership</h3>
                <p className="text-slate-600 dark:text-gray-300">
                  Managed by retired officers of the Bangladesh Armed Forces with adequate training 
                  on security and related matters, both from home and abroad.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">ISO Certified Standards</h3>
                <p className="text-slate-600 dark:text-gray-300">
                  Awarded ISO 9001:2015, 18788:2015 & 27001:2013 for quality management, 
                  private security management, and information security management.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Ethical Working Practices</h3>
                <p className="text-slate-600 dark:text-gray-300">
                  We highly focus on ethical working practices which helps us gain market recognition. 
                  We tailor work according to customer needs regardless of project size.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Comprehensive Coverage</h3>
                <p className="text-slate-600 dark:text-gray-300">
                  From conventional guarding to digital surveillance, PSIM integration, escort services, 
                  and event security — we cover all your security needs.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Trained & Vetted Personnel</h3>
                <p className="text-slate-600 dark:text-gray-300">
                  Extensive training at our own facility ensures guards remain motivated and acclimatized 
                  to the scope of work. Fully HES compliant guard force.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-red-600 to-blue-600 py-16 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                If Security is Your Priority, Falcon® is Just a Call Away
              </h2>
              <p className="text-xl mb-8 text-red-100 max-w-2xl mx-auto">
                Your security is our priority. Contact us today for a consultation 
                and let our team of experts design the perfect security solution for you.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <motion.a
                  href="tel:+8801618325266"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-red-600 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
                >
                  Call: +880 1618 325266
                </motion.a>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/contact"
                    className="inline-block px-8 py-4 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-red-600 transition-all duration-300"
                  >
                    Contact Us
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Services;
