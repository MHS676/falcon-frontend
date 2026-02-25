import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  ClockIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { sendContact } from '../services/api';
import toast from 'react-hot-toast';
import SEO from '../components/SEO';
import Breadcrumb from '../components/Breadcrumb';
import { useSEO } from '../hooks/useSEO';

const Contact = () => {
  const seoData = useSEO({
    title: 'Contact Falcon® Security Limited - Get Professional Security Services',
    description: 'Contact Falcon® Security Limited for professional security services in Bangladesh. Head office in Dhaka with branches in Chittagong, Khulna, and Bogra. Call +8801618325266.',
    keywords: [
      'contact falcon security',
      'security services dhaka',
      'security consultation bangladesh',
      'hire security services',
      'falcon security phone',
      'security company contact dhaka',
      'security services inquiry',
      'falcon security limited contact'
    ],
    image: '/images/contact/falcon-security-contact.jpg',
    type: 'website'
  });

  const seoProps = {
    ...seoData,
    keywords: seoData.keywords?.join(', ')
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceType: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const serviceTypes = [
    'Executive Protection',
    'Manned Guard Service',
    'Risk Consulting',
    'Escort Service',
    'Event Security Management',
    'Integration (PSIM)',
    'Digital Surveillance',
    'Video Surveillance (CCTV)',
    'Access Control',
    'Other'
  ];

  const branches = [
    {
      name: 'Head Office — Dhaka',
      address: 'House # 155, Lane # 3, Eastern Road, New D.O.H.S. Mohakhali, Dhaka 1206, Bangladesh',
      phone: '+8801618325266',
      email: 'info@falconslimited.com',
    },
    {
      name: 'Chittagong Office',
      address: 'Vernal Vale, House No-568 A/1/1389, Road -04, Zakir Hossain Society, North Khulshi, Chittagong',
      phone: '01913052845',
    },
    {
      name: 'Khulna Office',
      address: 'A 43/44 Mojid Saroni Road (4th Floor), Shib Bari More Khulna TNT',
      phone: '01711-480287, 01682-509540',
    },
    {
      name: 'Bogra Office',
      address: 'Fuldighi (Near of Pepsi Gate), Banani, Bogra',
      phone: '01703-307173',
    },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await sendContact(formData);
      toast.success('Your message has been sent successfully! We will contact you shortly.');
      setFormData({ name: '', email: '', phone: '', serviceType: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try calling us directly.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO {...seoProps} />
      
      <div className="min-h-screen pt-16" itemScope itemType="https://schema.org/ContactPage">
        <Breadcrumb />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">Contact Us</h1>
            <p className="text-xl text-slate-600 dark:text-gray-300 max-w-3xl mx-auto">
              If security is in your priority list, Falcon® is just a call away. 
              Reach out to discuss your security requirements.
            </p>
          </motion.div>
          
          {/* Quick Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center"
            >
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <PhoneIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Call Us</h3>
              <a href="tel:+8801618325266" className="text-red-600 font-bold text-xl hover:underline">
                +880 1618 325266
              </a>
              <p className="text-slate-600 dark:text-gray-400 text-sm mt-1">Available 24/7</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center"
            >
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <EnvelopeIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Email Us</h3>
              <a href="mailto:info@falconslimited.com" className="text-blue-600 font-bold hover:underline">
                info@falconslimited.com
              </a>
              <p className="text-slate-500 dark:text-gray-400 text-sm mt-1">
                <a href="mailto:falconslimited@gmail.com" className="hover:underline">falconslimited@gmail.com</a>
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center"
            >
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPinIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Head Office</h3>
              <p className="text-slate-600 dark:text-gray-300 text-sm">
                House # 155, Lane # 3, Eastern Road,<br />
                New D.O.H.S. Mohakhali, Dhaka 1206
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Get in Touch</h2>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-start gap-4">
                  <MapPinIcon className="w-6 h-6 text-red-600 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">Head Office</h3>
                    <p className="text-slate-600 dark:text-gray-300">
                      House # 155, Lane # 3, Eastern Road,<br />
                      New D.O.H.S. Mohakhali, Dhaka 1206, Bangladesh
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <ClockIcon className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">Business Hours</h3>
                    <p className="text-slate-600 dark:text-gray-300">
                      Saturday - Thursday: 9:00 AM - 6:00 PM<br />
                      <span className="text-red-600 font-semibold">Security Services: 24/7</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <ShieldCheckIcon className="w-6 h-6 text-green-600 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">Service Coverage</h3>
                    <p className="text-slate-600 dark:text-gray-300">
                      Nationwide coverage across Bangladesh<br />
                      with regional offices in Chittagong, Khulna, and Bogra.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Why Choose Falcon®?</h3>
                <ul className="space-y-2 text-slate-600 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                    <span>ISO 9001:2015, 18788:2015 & 27001:2013 Certified</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span>Managed by retired Bangladesh Army officers</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span>Founder member of BPSSPA</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    <span>Serving clients since 1993</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Request Security Services</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-slate-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition bg-white dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-slate-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition bg-white dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-slate-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition bg-white dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="serviceType" className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">
                      Service Needed *
                    </label>
                    <select
                      id="serviceType"
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-slate-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition bg-white dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select a service</option>
                      {serviceTypes.map((service, index) => (
                        <option key={index} value={service}>{service}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-6">
                  <label htmlFor="message" className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">
                    Your Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder="Please describe your security needs, location, and any special requirements..."
                    className="w-full px-4 py-3 border border-slate-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition resize-none bg-white dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-8 px-6 py-4 bg-gradient-to-r from-red-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>

                <p className="text-sm text-slate-500 dark:text-gray-400 mt-4 text-center">
                  * We will respond within 24 hours or call +880 1618 325266 for immediate assistance
                </p>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Branch Offices */}
      <section className="bg-slate-50 dark:bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Our Offices</h2>
            <p className="text-slate-600 dark:text-gray-300">
              Nationwide presence with regional offices across Bangladesh
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {branches.map((branch, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
              >
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">{branch.name}</h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPinIcon className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-600 dark:text-gray-300">{branch.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <PhoneIcon className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span className="text-sm text-slate-600 dark:text-gray-300">{branch.phone}</span>
                  </div>
                  {branch.email && (
                    <div className="flex items-center gap-2">
                      <EnvelopeIcon className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm text-slate-600 dark:text-gray-300">{branch.email}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default Contact;
