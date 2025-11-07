import { motion } from 'framer-motion';
import Banner from "../components/modules/Banner";
import Gallery from "../components/modules/Gallery";
import Projects from "../components/modules/Projects";
import Services from "../components/modules/Services";
import Blog from "../components/modules/Blog";
import ContactForm from "../components/forms/ContactForm";

const Home = () => {

  return (
    <div>
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

      {/* Featured Projects */}
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
              Featured Projects
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Showcase of my latest work and successful project deliveries.
            </p>
          </motion.div>
          <Projects showFeaturedOnly={true} maxItems={6} />
        </div>
      </section>

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

      {/* Contact Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-700">
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
      </section>
    </div>
  );
};

export default Home;
