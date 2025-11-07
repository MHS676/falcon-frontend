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

const Home = () => {
  const galleryImages = [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1582139329536-e7284fece509?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      title: "Corporate Security",
      category: "Corporate"
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", 
      title: "Event Security",
      category: "Events"
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      title: "Armed Guards",
      category: "Armed Security"
    },
    {
      id: 4,
      url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      title: "Patrol Services",
      category: "Patrol"
    },
    {
      id: 5,
      url: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      title: "Construction Security",
      category: "Construction"
    },
    {
      id: 6,
      url: "https://images.unsplash.com/photo-1605379399642-870262d3d051?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      title: "Residential Security",
      category: "Residential"
    }
  ];

  const clients = [
    {
      id: 1,
      name: "TechCorp Industries",
      logo: "🏢",
      testimonial: "SecureGuard has provided excellent security services for our corporate campus for over 3 years.",
      industry: "Technology"
    },
    {
      id: 2, 
      name: "Metro Construction",
      logo: "🏗️",
      testimonial: "Professional and reliable security for all our construction sites. Highly recommended!",
      industry: "Construction"
    },
    {
      id: 3,
      name: "Grand Events Center",
      logo: "🎭",
      testimonial: "Outstanding event security services. They handle everything with professionalism.",
      industry: "Events"
    },
    {
      id: 4,
      name: "Riverside Shopping Mall",
      logo: "🛒",
      testimonial: "24/7 security coverage that gives us peace of mind. Excellent service quality.",
      industry: "Retail"
    },
    {
      id: 5,
      name: "Luxury Residences",
      logo: "🏡",
      testimonial: "Premium residential security services. Our residents feel safe and secure.",
      industry: "Residential"
    },
    {
      id: 6,
      name: "Financial Plaza",
      logo: "🏦",
      testimonial: "Top-tier security for our financial district. Professional and dependable.",
      industry: "Finance"
    }
  ];

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
            {[
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
            ))}
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
                    src={image.url} 
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
                  <div className="text-4xl mb-3">{client.logo}</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{client.name}</h3>
                  <div className="text-sm text-slate-500 mb-4">{client.industry}</div>
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
