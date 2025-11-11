import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  ClockIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { sendContact } from '../services/api';
import toast from 'react-hot-toast';
import SEO from '../components/SEO';
import Breadcrumb from '../components/Breadcrumb';
import { useSEO } from '../hooks/useSEO';

const Contact = () => {
  // Initialize SEO
  const seoData = useSEO({
    title: 'Contact Falcon Security - Get Professional Security Services Quote',
    description: 'Contact Falcon Security Limited for professional security services in Bangladesh. Get a free quote, consultation, and expert advice on residential, commercial, and event security needs.',
    keywords: [
      'contact falcon security',
      'security quote bangladesh',
      'security consultation',
      'hire security services',
      'professional security quote',
      'security company contact',
      'falcon security phone',
      'security services inquiry'
    ],
    image: '/images/contact/falcon-security-contact.jpg',
    type: 'website'
  });

  // Convert keywords for SEO component
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
    'Armed Security Guards',
    'Unarmed Security Guards', 
    'Corporate Security',
    'Residential Security',
    'Construction Site Security',
    'Event Security',
    'Emergency Response',
    'Other'
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
      toast.success('Security request sent successfully! We will contact you within 24 hours.');
      setFormData({ name: '', email: '', phone: '', serviceType: '', message: '' });
    } catch (error) {
      toast.error('Failed to send request. Please call our emergency line.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO {...seoProps} />
      
      <div className="min-h-screen pt-16" itemScope itemType="https://schema.org/ContactPage">
        {/* Breadcrumb Navigation */}
        <Breadcrumb />
      {/* Emergency Banner */}
      <div className="bg-red-600 text-white py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2">
            <ExclamationTriangleIcon className="w-5 h-5" />
            <span className="font-semibold">EMERGENCY: Call (555) 911-HELP for immediate security assistance</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">Contact Falcon Security Limited</h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Need immediate security assistance or want to discuss your security needs? 
              We are available 24/7 to protect what matters most to you.
            </p>
          </motion.div>
          
          {/* Quick Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl p-6 shadow-lg text-center"
            >
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <ExclamationTriangleIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Emergency Line</h3>
              <p className="text-red-600 font-bold text-xl">(555) 911-HELP</p>
              <p className="text-slate-600 text-sm">24/7 Immediate Response</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl p-6 shadow-lg text-center"
            >
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <PhoneIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Business Line</h3>
              <p className="text-blue-600 font-bold text-xl">(555) 123-4567</p>
              <p className="text-slate-600 text-sm">Mon-Sun 6AM-10PM</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl p-6 shadow-lg text-center"
            >
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <EnvelopeIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Email Support</h3>
              <p className="text-green-600 font-bold">info@Falcon Security Limited.com</p>
              <p className="text-slate-600 text-sm">Response within 2 hours</p>
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
              <h2 className="text-3xl font-bold text-slate-900 mb-8">Get Security Quote</h2>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-start gap-4">
                  <MapPinIcon className="w-6 h-6 text-red-600 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">Headquarters</h3>
                    <p className="text-slate-600">1234 Security Boulevard<br />Safety City, SC 12345</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <ClockIcon className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">Business Hours</h3>
                    <p className="text-slate-600">
                      Monday - Friday: 6:00 AM - 10:00 PM<br />
                      Saturday - Sunday: 8:00 AM - 8:00 PM<br />
                      <span className="text-red-600 font-semibold">Emergency Services: 24/7</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <ShieldCheckIcon className="w-6 h-6 text-green-600 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">Service Areas</h3>
                    <p className="text-slate-600">
                      Serving all metropolitan areas within 50 miles.<br />
                      Licensed in all surrounding states.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Why Choose Falcon Security Limited?</h3>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                    <span>Licensed, bonded & insured</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span>Background-checked personnel</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span>Free security consultations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    <span>Rapid deployment capabilities</span>
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
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Request Security Services</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="serviceType" className="block text-sm font-semibold text-slate-700 mb-2">
                      Service Needed *
                    </label>
                    <select
                      id="serviceType"
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                    >
                      <option value="">Select a service</option>
                      {serviceTypes.map((service, index) => (
                        <option key={index} value={service}>{service}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-6">
                  <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2">
                    Security Requirements *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder="Please describe your security needs, location, duration, and any special requirements..."
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-8 px-6 py-4 bg-gradient-to-r from-red-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending Request...' : 'Request Security Quote'}
                </button>

                <p className="text-sm text-slate-500 mt-4 text-center">
                  * We typically respond within 2 hours during business hours or call for immediate assistance
                </p>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default Contact;
