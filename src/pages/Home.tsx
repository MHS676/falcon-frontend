import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaArrowRight } from 'react-icons/fa';
import { getActiveBanners, getPublicSettings, getActiveSocialLinks } from '../services/api';
import toast from 'react-hot-toast';

interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  buttonText?: string;
  buttonUrl?: string;
}

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon?: string;
}

const Home = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [bannersRes, settingsRes, socialRes] = await Promise.all([
        getActiveBanners(),
        getPublicSettings(),
        getActiveSocialLinks(),
      ]);
      setBanners(bannersRes.data);
      setSettings(settingsRes.data);
      setSocialLinks(socialRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load some content');
    } finally {
      setLoading(false);
    }
  };

  const activeBanner = banners[0] || {
    title: 'Hi, I\'m Hasan Talukder',
    subtitle: 'Full-Stack Developer | Building Modern Web Applications',
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-primary-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="section-padding pt-32 bg-gradient-to-br from-primary-50 to-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl lg:text-6xl font-heading font-bold mb-6">
                {activeBanner.title}
              </h1>
              {activeBanner.subtitle && (
                <p className="text-xl text-gray-600 mb-8">
                  {activeBanner.subtitle}
                </p>
              )}
              <p className="text-gray-600 mb-8 leading-relaxed">
                I create beautiful, functional, and user-friendly web applications
                using cutting-edge technologies like React, NestJS, and PostgreSQL.
              </p>
              <div className="flex space-x-4">
                <Link to="/projects" className="btn-primary">
                  View Projects <FaArrowRight className="inline ml-2" />
                </Link>
                <Link to="/contact" className="btn-secondary">
                  Get in Touch
                </Link>
              </div>
              <div className="flex space-x-4 mt-8">
                {socialLinks.length > 0 ? (
                  socialLinks.map((social) => (
                    <a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-3xl text-gray-700 hover:text-primary-600 transition-colors"
                      title={social.platform}
                    >
                      {social.platform === 'GitHub' && <FaGithub />}
                      {social.platform === 'LinkedIn' && <FaLinkedin />}
                    </a>
                  ))
                ) : (
                  <>
                    <a
                      href="https://github.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-3xl text-gray-700 hover:text-primary-600 transition-colors"
                    >
                      <FaGithub />
                    </a>
                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-3xl text-gray-700 hover:text-primary-600 transition-colors"
                    >
                      <FaLinkedin />
                    </a>
                  </>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="hidden lg:block"
            >
              {activeBanner.image ? (
                <img
                  src={activeBanner.image}
                  alt={activeBanner.title}
                  className="w-full h-96 object-cover rounded-2xl shadow-2xl"
                />
              ) : (
                <div className="w-full h-96 bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl shadow-2xl flex items-center justify-center">
                  <span className="text-white text-6xl font-bold">HT</span>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-heading font-bold mb-4">
              Technologies I Work With
            </h2>
            <p className="text-gray-600">
              Modern tools and frameworks for building scalable applications
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {['React', 'NestJS', 'PostgreSQL', 'Tailwind CSS', 'TypeScript', 'Prisma', 'Node.js', 'Git'].map(
              (skill, index) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card p-6 text-center"
                >
                  <h3 className="text-lg font-semibold">{skill}</h3>
                </motion.div>
              )
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary-600 text-white">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-heading font-bold mb-6">
              Let's Build Something Amazing Together
            </h2>
            <p className="text-xl mb-8 text-primary-100">
              I'm always open to discussing new projects and opportunities.
            </p>
            <Link
              to="/contact"
              className="inline-block bg-white text-primary-600 font-semibold py-3 px-8 rounded-lg hover:bg-primary-50 transition-all duration-300"
            >
              Start a Conversation
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
