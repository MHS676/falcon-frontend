import { motion } from 'framer-motion';
import { 
  ShieldCheckIcon, 
  UserGroupIcon, 
  ClockIcon,
  TrophyIcon,
  GlobeAltIcon,
  CheckBadgeIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import SEO from '../components/SEO';
import Breadcrumb from '../components/Breadcrumb';
import { useSEO } from '../hooks/useSEO';
import { Link } from 'react-router-dom';

const About = () => {
  const seoData = useSEO({
    title: 'About Falcon® Security Limited - Professional Security Company Since 1993',
    description: 'Learn about Falcon® Security Limited, a leading security company in Bangladesh since 1993. Managed by retired Bangladesh Army officers. ISO 9001:2015, 18788:2015 & 27001:2013 certified.',
    keywords: [
      'about falcon security',
      'security company bangladesh',
      'falcon security history',
      'security management team',
      'iso certified security company',
      'bangladesh army retired officers security',
      'bpsspa founder member',
      'falcon security limited'
    ],
    image: '/images/about/falcon-security-team.jpg',
    type: 'website'
  });

  const seoProps = {
    ...seoData,
    keywords: seoData.keywords?.join(', ')
  };

  const stats = [
    { number: '33+', label: 'Years of Experience' },
    { number: '500+', label: 'Clients Served' },
    { number: '5500+', label: 'Consignments Yearly' },
    { number: '24/7', label: 'Available Service' }
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
      email: 'chittagong@falconslimited.com',
    },
    {
      name: 'Khulna Office',
      address: 'A 43/44 Mojid Saroni Road (4th Floor), Shib Bari More Khulna TNT',
      phone: '01711-480287, 01682-509540',
      email: 'khulna@falconslimited.com',
    },
    {
      name: 'Bogra Office',
      address: 'Fuldighi (Near of Pepsi Gate), Banani, Bogra',
      phone: '01703-307173',
      email: 'Bogra@falconslimited.com',
    },
    {
      name: 'Training Center',
      address: '6715 Gaoir Madrasa, Dakkhinkhan, Dhaka 1230',
      phone: '',
      email: '',
    },
  ];

  const certifications = [
    'ISO 9001:2015 — Quality Management System',
    'ISO 18788:2015 — Private Security Operations Management',
    'ISO 27001:2013 — Information Security Management',
    'Founder Member — BPSSPA (Bangladesh Professional Security Service Provider\'s Association)',
    'Platinum Distributor Partner — ISM UK (PSIM)',
    'Trademark Registered — Government of Bangladesh',
    'VAT & Tax Registered — Government of Bangladesh',
    'Registered under Ministry of Labour',
  ];

  return (
    <>
      <SEO {...seoProps} />
      
      <div className="min-h-screen pt-16">
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
              <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
                About Falcon® Security Limited
              </h1>
              <p className="text-xl text-slate-600 dark:text-gray-300 max-w-4xl mx-auto">
                A security, planning, management and service company enjoying the confidence 
                of our clientele since 1993. Your security is our priority.
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
                  <div className="text-slate-600 dark:text-gray-300 font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* The Company */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">The Company</h2>
                <div className="space-y-4 text-slate-600 dark:text-gray-300 leading-relaxed">
                  <p>
                    Falcon® Security Limited is a security, planning, management, and services company 
                    enjoying the confidence of our clientele. Retired officers from the Bangladesh Army 
                    having adequate training on security and related matters, both from home and abroad, 
                    among others, manage the services of the company.
                  </p>
                  <p>
                    Our experience includes VVIP security, protection planning of key point installation 
                    (KPI), aviation security, planning, and securing big industrial projects from its 
                    inception till operation and providing security and other essential services to 
                    expatriate/local companies, offices, factories, residential complexes, and other 
                    installations.
                  </p>
                  <p>
                    <strong>Our Policy:</strong> The company policy is to provide concentrated and quality services 
                    without overstretching our supervisory system. By this, we ensure strict supervision 
                    round the clock to maintain the high standard of performance set by us.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-red-500 to-blue-600 rounded-2xl p-8 text-white"
              >
                <h3 className="text-2xl font-bold mb-4">Founder's Message</h3>
                <p className="text-red-100 mb-6 leading-relaxed italic">
                  "Everything we hold near and dear needs to be protected and cared for. But we need 
                  to find out someone worthy enough to ensure the security of the fruits of our hard 
                  work and indeed, our very lives and properties, can be difficult. That's where 
                  Falcon® comes in."
                </p>
                
                <div className="space-y-3 mt-8">
                  <div className="flex items-center gap-3">
                    <TrophyIcon className="w-6 h-6" />
                    <span>Operational since 1993</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <GlobeAltIcon className="w-6 h-6" />
                    <span>Nationwide coverage across Bangladesh</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckBadgeIcon className="w-6 h-6" />
                    <span>ISO 9001, 18788 & 27001 Certified</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* History & Growth */}
        <section className="bg-slate-50 dark:bg-gray-900 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">History & Growth</h2>
              <div className="max-w-4xl mx-auto space-y-4 text-slate-600 dark:text-gray-300 leading-relaxed">
                <p>
                  Falcon Security was set up as a Proprietorship Company under the management of 
                  the present Managing Director in 1993. With a gradual increase in business, the 
                  office was shifted to the present address being centrally located for the convenience 
                  of command and control.
                </p>
                <p>
                  The company was later registered in 1997 with the registrar of joint-stock companies 
                  and firms, Government of Bangladesh as a private limited company under the same 
                  management. Falcon® logo and name have also received the trademark registration 
                  from the concerned registrar of the government. The company has the required VAT 
                  and Tax registration and is also registered under the Ministry of Labour.
                </p>
                <p>
                  With time Falcon® established its countrywide operation with regional offices and 
                  branches located in Khulna, Kushtia, Chittagong, Sylhet, Barishal, Bogura and more.
                </p>
                <p>
                  Falcon® Security Limited is the founder member of the Bangladesh Professional 
                  Security Service Provider's Association (BPSSPA). Though a security-focused company, 
                  Falcon® has been providing other essential services at the request of clients including 
                  receptionists, caretakers, messengers, drivers, gardeners, electricians, plumbers, 
                  and lift operators.
                </p>
                <p>
                  Beside conventional guarding service, Falcon® also provides digital surveillance 
                  solutions by installing and maintaining CCTV systems, Access Control Systems, 
                  Scanning Systems, intrusion detection systems, guard tour management systems and 
                  different tracking systems. We are the platinum distributor-partner of ISM UK in 
                  integration (PSIM).
                </p>
                <p>
                  Falcon® brings your systems together. We design, construct and maintain stand-alone 
                  and integrated security systems and communication networks — a trusted partner to 
                  customers and suppliers. Our knowledge in a wide range of technologies, products, 
                  and systems provides cost-effective, reliable and scalable solutions.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Why Falcon */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Why Falcon®?</h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: ShieldCheckIcon,
                  title: 'Quality Assured',
                  description: 'We ensure our clients receive a full range of quality assured products and services related to security and surveillance.'
                },
                {
                  icon: UserGroupIcon,
                  title: 'Trained Personnel',
                  description: 'Fully trained, highly visible uniformed security personnel who deliver services in accordance with client requirements.'
                },
                {
                  icon: ClockIcon,
                  title: 'Since 1993',
                  description: 'Operational for over three decades, enriching vast professional experience in security services.'
                },
                {
                  icon: BuildingOfficeIcon,
                  title: 'Nationwide Coverage',
                  description: 'Nationwide operation with many regional and branch offices across Bangladesh.'
                }
              ].map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                    {value.title}
                  </h3>
                  <p className="text-slate-600 dark:text-gray-300">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Certifications */}
        <section className="bg-slate-50 dark:bg-gray-900 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Certifications & Accreditations</h2>
              <p className="text-slate-600 dark:text-gray-300 max-w-2xl mx-auto">
                Practicing international standards in quality management, private security management, 
                and information security management.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {certifications.map((cert, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md flex items-start gap-3"
                >
                  <CheckBadgeIcon className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700 dark:text-gray-300 font-medium">{cert}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Management Team CTA */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <UserGroupIcon className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Management Team</h2>
              <p className="text-slate-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
                Our management team consists of veterans of the Bangladesh Armed Forces with 
                sufficient training in security and intelligence at home and abroad.
              </p>
              <Link
                to="/team"
                className="inline-block px-8 py-4 bg-gradient-to-r from-red-600 to-blue-600 text-white rounded-full font-semibold text-lg hover:shadow-lg transition-all duration-300"
              >
                Meet Our Team
              </Link>
            </motion.div>
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
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Our Locations</h2>
              <p className="text-slate-600 dark:text-gray-300">
                Nationwide presence with offices across Bangladesh
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                      <MapPinIcon className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-600 dark:text-gray-300">{branch.address}</span>
                    </div>
                    {branch.phone && (
                      <div className="flex items-center gap-2">
                        <PhoneIcon className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        <span className="text-sm text-slate-600 dark:text-gray-300">{branch.phone}</span>
                      </div>
                    )}
                    {branch.email && (
                      <div className="flex items-center gap-2">
                        <EnvelopeIcon className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <span className="text-sm text-slate-600 dark:text-gray-300">{branch.email}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-red-600 to-blue-600 py-16 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Your Security is Our Priority
              </h2>
              <p className="text-xl mb-8 text-red-100 max-w-2xl mx-auto">
                If security is in your priority list, Falcon® is just a call away.
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/contact"
                  className="inline-block px-8 py-4 bg-white text-red-600 rounded-full font-semibold text-lg hover:shadow-lg transition-all duration-300"
                >
                  Contact Us Today
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default About;
