import { motion } from 'framer-motion';
import Banner from "../components/modules/Banner";
import Gallery from "../components/modules/Gallery";
// import Projects from "../components/modules/Projects";
import Services from "../components/modules/Services";
import Clients from "../components/modules/Clients";
import Blog from "../components/modules/Blog";
import ContactForm from "../components/forms/ContactForm";
import SEO from "../components/SEO";
// import Breadcrumb from "../components/Breadcrumb";
import OptimizedImage from "../components/OptimizedImage";
import { useSEO } from "../hooks/useSEO";
import { useWebVitals } from "../hooks/useWebVitals";

const Home = () => {
  // Initialize SEO and performance monitoring
  const seoData = useSEO({
    title: 'Falcon Security Limited - Premium Security Services in Bangladesh',
    description: 'Leading security company providing comprehensive protection services including residential, commercial, event security, and bodyguard services across Bangladesh. Trusted by thousands for professional security solutions.',
    keywords: [
      'security services bangladesh',
      'falcon security limited',
      'bodyguard services dhaka',
      'commercial security bangladesh',
      'residential security services',
      'event security company',
      'security consultancy dhaka',
      'professional security bangladesh',
      'security company bangladesh',
      'private security services'
    ],
    image: '/images/falcon-security-hero.jpg',
    type: 'website'
  });

  // Convert keywords array to string for SEO component
  const seoProps = {
    ...seoData,
    keywords: seoData.keywords?.join(', ')
  };

  useWebVitals();

  return (
    <>
      <SEO {...seoProps} />
      
      <div itemScope itemType="https://schema.org/WebPage">
      {/* Banner/Hero Section */}
      <Banner />
      
      {/* Featured Services */}
      <section className="py-16 bg-slate-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Services
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Comprehensive solutions tailored to meet your unique requirements and exceed expectations.
            </p>
          </motion.div>
          <Services showFeaturedOnly={true} maxItems={6} />
        </div>
      </section>

      {/* Client Testimonials */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What Our Clients Say
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Trusted by leading organizations and valued clients worldwide.
            </p>
          </motion.div>
          <Clients showFeaturedOnly={true} maxItems={6} />
        </div>
      </section>

      {/* Featured Projects */}
      {/* <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Projects
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Showcase of my latest work and successful project deliveries.
            </p>
          </motion.div>
          <Projects showFeaturedOnly={true} maxItems={6} />
        </div>
      </section> */}

      {/* Gallery Section */}
      <section className="py-16 bg-slate-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Portfolio Gallery
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Visual journey through my creative work and project highlights.
            </p>
          </motion.div>
          <Gallery showFeaturedOnly={true} maxItems={8} />
        </div>
      </section>

      {/* Latest Blog Posts */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Latest Insights
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Recent thoughts, tutorials, and updates from my blog.
            </p>
          </motion.div>
          <Blog maxItems={3} showExcerpt={true} layout="grid" />
        </div>
      </section>

      {/* Main Contact Section */}
      {/* <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Let's Work Together
            </h2>
            <p className="text-blue-100 max-w-2xl mx-auto text-lg">
              Ready to start your next project? Get in touch and let's create something amazing together.
            </p>
          </motion.div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8">
            <ContactForm showAdditionalFields={true} />
          </div>
        </div>
      </section> */}

      {/* Trust Indicators */}
      <section className="py-16 bg-slate-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Trusted by Leading Organizations
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
              <OptimizedImage
                src="/images/clients/client-1.png"
                alt="Client 1 - Falcon Security Services"
                width={120}
                height={60}
                className="h-12 w-auto object-contain mx-auto grayscale hover:grayscale-0 transition-all duration-300"
                loading="lazy"
              />
              <OptimizedImage
                src="/images/clients/client-2.png"
                alt="Client 2 - Professional Security Partner"
                width={120}
                height={60}
                className="h-12 w-auto object-contain mx-auto grayscale hover:grayscale-0 transition-all duration-300"
                loading="lazy"
              />
              <OptimizedImage
                src="/images/clients/client-3.png"
                alt="Client 3 - Trusted Security Provider"
                width={120}
                height={60}
                className="h-12 w-auto object-contain mx-auto grayscale hover:grayscale-0 transition-all duration-300"
                loading="lazy"
              />
              <OptimizedImage
                src="/images/clients/client-4.png"
                alt="Client 4 - Security Solutions Partner"
                width={120}
                height={60}
                className="h-12 w-auto object-contain mx-auto grayscale hover:grayscale-0 transition-all duration-300"
                loading="lazy"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Security Stats */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-white"
            >
              <div className="text-3xl md:text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Clients Protected</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-white"
            >
              <div className="text-3xl md:text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Security Monitoring</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-white"
            >
              <div className="text-3xl md:text-4xl font-bold mb-2">15+</div>
              <div className="text-blue-100">Years Experience</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-white"
            >
              <div className="text-3xl md:text-4xl font-bold mb-2">100%</div>
              <div className="text-blue-100">Client Satisfaction</div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default Home;
