import { motion } from 'framer-motion';
import { 
  ShieldCheckIcon, 
  UserGroupIcon, 
  ClockIcon,
  TrophyIcon,
  GlobeAmericasIcon,
  CheckBadgeIcon 
} from '@heroicons/react/24/outline';

const About = () => {
  const stats = [
    { number: '10+', label: 'Years Experience' },
    { number: '500+', label: 'Security Guards' },
    { number: '1000+', label: 'Protected Events' },
    { number: '24/7', label: 'Available Service' }
  ];

  const values = [
    {
      icon: ShieldCheckIcon,
      title: 'Reliability',
      description: 'We provide consistent, dependable security services you can trust.'
    },
    {
      icon: UserGroupIcon,
      title: 'Professionalism',
      description: 'Our trained security professionals maintain the highest standards.'
    },
    {
      icon: ClockIcon,
      title: 'Availability',
      description: '24/7 security services available whenever you need protection.'
    },
    {
      icon: CheckBadgeIcon,
      title: 'Excellence',
      description: 'We strive for excellence in every security solution we provide.'
    }
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">About Falcon Security Limited</h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Your trusted partner in professional security services, protecting what matters most 
              to you and your business for over a decade.
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl font-bold text-red-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-slate-600 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-slate-600">
                <p>
                  Founded over a decade ago, Falcon Security Limited has established itself as a leading 
                  provider of professional security services. We started with a simple mission: 
                  to provide reliable, professional security solutions that give our clients 
                  peace of mind.
                </p>
                <p>
                  Today, we protect businesses, events, residential communities, and construction 
                  sites across the region. Our team of licensed and trained security professionals 
                  is committed to maintaining the highest standards of service and professionalism.
                </p>
                <p>
                  From small retail stores to large corporate campuses, we tailor our security 
                  solutions to meet the unique needs of each client, ensuring comprehensive 
                  protection and outstanding service.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-br from-red-500 to-blue-600 rounded-2xl p-8 text-white"
            >
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-red-100 mb-6">
                To provide exceptional security services that protect our clients' assets, 
                personnel, and reputation while delivering peace of mind through professional, 
                reliable, and customized security solutions.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <TrophyIcon className="w-6 h-6" />
                  <span>Industry-leading expertise</span>
                </div>
                <div className="flex items-center gap-3">
                  <GlobeAmericasIcon className="w-6 h-6" />
                  <span>Comprehensive coverage</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckBadgeIcon className="w-6 h-6" />
                  <span>Licensed & certified</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Core Values</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              These values guide everything we do and shape how we serve our clients.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-slate-600">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-8">
              Why Choose Falcon Security Limited?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Licensed & Insured</h3>
                <p className="text-slate-600">
                  All our security personnel are fully licensed, bonded, and insured for your protection.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Trained Professionals</h3>
                <p className="text-slate-600">
                  Comprehensive training programs ensure our guards meet the highest industry standards.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Custom Solutions</h3>
                <p className="text-slate-600">
                  Tailored security plans designed to meet your specific needs and requirements.
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-red-600 to-blue-600 text-white rounded-full font-semibold text-lg hover:shadow-lg transition-all duration-300"
            >
              Contact Us Today
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
