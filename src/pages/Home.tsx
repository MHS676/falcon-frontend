import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Hero from "../components/Hero";
import { 
  ShieldCheckIcon, 
  UserGroupIcon, 
  BuildingOfficeIcon,
  TruckIcon,
  HomeIcon,
  CalendarDaysIcon 
} from '@heroicons/react/24/outline';
import * as api from '../services/api';

interface Service {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

interface GalleryImage {
  id: string;
  title: string;
  description?: string;
  image: string;
  category: string;
  url?: string; // For fallback compatibility
}

interface Client {
  id: string;
  name: string;
  company?: string;
  testimonial: string;
  image?: string;
  rating?: number;
  projectType?: string;
  logo?: string; // For fallback compatibility
  industry?: string; // For fallback compatibility
}

const Home = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, galleryRes, clientsRes] = await Promise.all([
          api.getActiveServices(),
          api.getFeaturedGallery(),
          api.getFeaturedClients()
        ]);
        
        setServices(servicesRes.data || []);
        setGalleryImages(galleryRes.data || []);
        setClients(clientsRes.data || []);
      } catch (error) {
        console.error('Error fetching home page data:', error);
        // Set fallback data if API fails
        setServices([
          { id: '1', title: "Armed Security", description: "Highly trained armed guards for maximum protection", icon: "ShieldCheckIcon" },
          { id: '2', title: "Unarmed Guards", description: "Professional security personnel for general safety", icon: "UserGroupIcon" },
          { id: '3', title: "Corporate Security", description: "Complete office and campus security solutions", icon: "BuildingOfficeIcon" },
          { id: '4', title: "Residential Security", description: "Protecting homes and gated communities", icon: "HomeIcon" }
        ]);
        setGalleryImages([]);
        setClients([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Service icon mapping
  const getServiceIcon = (iconName: string) => {
    const iconMap: any = {
      'ShieldCheckIcon': ShieldCheckIcon,
      'UserGroupIcon': UserGroupIcon, 
      'BuildingOfficeIcon': BuildingOfficeIcon,
      'TruckIcon': TruckIcon,
      'HomeIcon': HomeIcon,
      'CalendarDaysIcon': CalendarDaysIcon,
      'EyeIcon': ShieldCheckIcon,
      'LockClosedIcon': BuildingOfficeIcon,
      'UsersIcon': UserGroupIcon
    };
    return iconMap[iconName] || ShieldCheckIcon;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div>
      <Hero />
      
      {/* Services Overview */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Comprehensive Security Solutions
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              From armed guards to event security, we provide tailored protection services for every need.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.length > 0 ? services.map((service, index) => {
              const IconComponent = getServiceIcon(service.icon || 'ShieldCheckIcon');
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{service.title}</h3>
                  <p className="text-slate-600">{service.description}</p>
                </motion.div>
              );
            }) : (
              // Fallback static services if no data from API
              [
                { icon: ShieldCheckIcon, title: "Armed Security", desc: "Highly trained armed guards for maximum protection" },
                { icon: UserGroupIcon, title: "Unarmed Guards", desc: "Professional security personnel for general safety" },
                { icon: BuildingOfficeIcon, title: "Corporate Security", desc: "Complete office and campus security solutions" },
                { icon: HomeIcon, title: "Residential Security", desc: "Protecting homes and gated communities" },
                { icon: TruckIcon, title: "Construction Security", desc: "Site protection and equipment security" },
                { icon: CalendarDaysIcon, title: "Event Security", desc: "Professional event and crowd management" }
              ].map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{service.title}</h3>
                  <p className="text-slate-600">{service.desc}</p>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Security Operations Gallery
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              See our professional security teams in action across various industries and environments.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                <div className="aspect-w-16 aspect-h-12 bg-gray-200">
                  <img 
                    src={image.image || image.url} 
                    alt={image.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="text-xs font-semibold text-red-400 mb-1">{image.category}</div>
                  <div className="text-lg font-bold">{image.title}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Clients Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Trusted by Leading Organizations
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              We proudly serve businesses, institutions, and communities with reliable security solutions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {clients.map((client, index) => (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="text-center mb-4">
                  {client.logo ? (
                    <div className="text-4xl mb-3">{client.logo}</div>
                  ) : client.image ? (
                    <img src={client.image} alt={client.name} className="w-16 h-16 mx-auto mb-3 rounded-full object-cover" />
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold text-xl">{client.name.charAt(0)}</span>
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{client.name}</h3>
                  <div className="text-sm text-slate-500 mb-4">{client.company || client.industry || client.projectType}</div>
                </div>
                <blockquote className="text-slate-600 italic text-center">
                  "{client.testimonial}"
                </blockquote>
                <div className="flex justify-center mt-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-sm">⭐</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Ready to Protect Your Assets?
            </h2>
            <p className="text-xl mb-8 text-red-100 max-w-2xl mx-auto">
              Get a free security consultation and custom quote tailored to your specific needs.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-red-600 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
              >
                Get Free Quote
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-red-600 transition-all duration-300"
              >
                Emergency: (555) 911-HELP
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
