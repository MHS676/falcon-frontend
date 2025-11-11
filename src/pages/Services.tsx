import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheckIcon, 
  BuildingOfficeIcon, 
  HomeIcon, 
  TruckIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  PhoneIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import SEO from '../components/SEO';
import Breadcrumb from '../components/Breadcrumb';
// import OptimizedImage from '../components/OptimizedImage';
import { useSEO } from '../hooks/useSEO';
// import { generateServiceSchema } from '../hooks/useSEO';

const Services = () => {
  // Initialize SEO
  const seoData = useSEO({
    title: 'Security Services - Professional Protection Solutions | Falcon Security',
    description: 'Comprehensive security services including armed guards, corporate security, residential protection, event security, and construction site security. Professional security solutions across Bangladesh.',
    keywords: [
      'security services',
      'armed security guards',
      'corporate security',
      'residential security',
      'event security',
      'construction site security',
      'professional security',
      'security company bangladesh'
    ],
    image: '/images/services/security-services-hero.jpg',
    type: 'website'
  });

  // Convert keywords for SEO component
  const seoProps = {
    ...seoData,
    keywords: seoData.keywords?.join(', ')
  };
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const services = [
    {
      id: 'armed-security',
      title: 'Armed Security Guards',
      description: 'Highly trained armed security personnel for high-risk environments and valuable asset protection.',
      icon: ShieldCheckIcon,
      features: [
        'Licensed armed security officers',
        'Advanced weapons training',
        'High-value asset protection',
        'Bank and financial institution security',
        'Government facility security'
      ],
      price: 'Starting from $35/hour'
    },
    {
      id: 'unarmed-security', 
      title: 'Unarmed Security Guards',
      description: 'Professional unarmed security for general protection, access control, and surveillance.',
      icon: UserGroupIcon,
      features: [
        'Access control and monitoring',
        'Patrol services',
        'Customer service oriented',
        'Incident reporting',
        'Emergency response coordination'
      ],
      price: 'Starting from $18/hour'
    },
    {
      id: 'corporate-security',
      title: 'Corporate Security',
      description: 'Comprehensive security solutions for office buildings, corporate campuses, and business facilities.',
      icon: BuildingOfficeIcon,
      features: [
        'Office building security',
        'Executive protection', 
        'Employee safety programs',
        'Access control systems',
        'Security consulting'
      ],
      price: 'Custom pricing'
    },
    {
      id: 'residential-security',
      title: 'Residential Security',
      description: 'Protecting homes, gated communities, and residential properties with professional security services.',
      icon: HomeIcon,
      features: [
        'Gated community security',
        'Residential patrol services',
        'Property surveillance',
        'Guest management',
        'Emergency response'
      ],
      price: 'Starting from $20/hour'
    },
    {
      id: 'construction-security',
      title: 'Construction Site Security',
      description: 'Specialized security for construction sites, protecting equipment, materials, and work areas.',
      icon: TruckIcon,
      features: [
        'Equipment protection',
        'Material theft prevention',
        'Site access control',
        'Safety compliance monitoring',
        'Mobile patrol units'
      ],
      price: 'Starting from $22/hour'
    },
    {
      id: 'event-security',
      title: 'Event Security',
      description: 'Professional event security for concerts, conferences, private parties, and public gatherings.',
      icon: CalendarDaysIcon,
      features: [
        'Crowd control management',
        'VIP protection services',
        'Entry/exit monitoring',
        'Emergency evacuation planning',
        'Alcohol compliance monitoring'
      ],
      price: 'Starting from $25/hour'
    }
  ];

  return (
    <>
      <SEO {...seoProps} />
      
      <div className="min-h-screen pt-16 pb-12" itemScope itemType="https://schema.org/WebPage">
        {/* Breadcrumb Navigation */}
        <Breadcrumb />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6"
          >
            Professional Security Services
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-600 max-w-3xl mx-auto mb-8"
          >
            Comprehensive security solutions tailored to protect your business, property, and personnel. 
            Licensed, trained, and professional security guards available 24/7.
          </motion.p>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-lg">
              <ClockIcon className="w-5 h-5 text-red-600" />
              <span className="text-sm font-semibold">24/7 Available</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-lg">
              <ShieldCheckIcon className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-semibold">Licensed & Insured</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-lg">
              <PhoneIcon className="w-5 h-5 text-green-600" />
              <span className="text-sm font-semibold">Emergency Response</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-2xl shadow-lg border border-slate-200 p-8 hover:shadow-xl transition-all duration-300 cursor-pointer ${
                  selectedService === service.id ? 'ring-2 ring-red-500 ring-opacity-50' : ''
                }`}
                onClick={() => setSelectedService(selectedService === service.id ? null : service.id)}
              >
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-blue-600 rounded-xl mb-6">
                  <service.icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  {service.title}
                </h3>
                
                <p className="text-slate-600 mb-6 leading-relaxed">
                  {service.description}
                </p>

                <div className="mb-6">
                  <div className="text-lg font-semibold text-red-600 mb-3">
                    {service.price}
                  </div>
                </div>

                {selectedService === service.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-slate-200 pt-4 mt-4"
                  >
                    <h4 className="font-semibold text-slate-900 mb-3">Service Features:</h4>
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-red-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                    >
                      Request Quote
                    </motion.button>
                  </motion.div>
                )}

                {selectedService !== service.id && (
                  <button className="w-full px-4 py-2 border-2 border-red-200 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors">
                    Learn More
                  </button>
                )}
              </motion.div>
            ))}
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
              Need Immediate Security Services?
            </h2>
            <p className="text-xl mb-8 text-red-100 max-w-2xl mx-auto">
              Our security professionals are available 24/7 to respond to your needs. 
              Contact us for immediate assistance or to schedule a security consultation.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-red-600 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
              >
                Call Now: (555) 123-4567
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-red-600 transition-all duration-300"
              >
                Request Quote
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
    </>
  );
};

export default Services;