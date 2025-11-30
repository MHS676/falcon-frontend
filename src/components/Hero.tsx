import { motion } from 'framer-motion';
import {
  ChevronDownIcon,
  ShieldCheckIcon,
  PhoneIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Full Banner Background Image with Overlay */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
          }}
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-800/70 to-slate-900/80" />
        {/* Additional red accent overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 via-transparent to-blue-900/30" />
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-red-400/10 to-blue-600/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            rotate: [360, 0],
            scale: [1.1, 1, 1.1]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-tl from-blue-400/10 to-red-600/10 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center">
          {/* Company Logo/Badge */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <div className="relative inline-block">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500 via-blue-500 to-slate-700 p-2"
              />
              <div className="relative w-32 h-32 rounded-full bg-white p-4 flex items-center justify-center overflow-hidden">
                <ShieldCheckIcon className="w-20 h-20 text-red-600" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                <span className="text-xs text-white">✓</span>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <span className="block text-white mb-2">Professional</span>
              <span className="block bg-gradient-to-r from-red-400 via-blue-400 to-white bg-clip-text text-transparent">
                Security Services
              </span>
            </motion.h1>

            <motion.p
              className="text-xl sm:text-2xl text-slate-200 mb-4 max-w-3xl mx-auto"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              Protecting What Matters Most - 24/7 Security Solutions
            </motion.p>

            <motion.p
              className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              Licensed, trained, and professional security guards providing comprehensive protection
              for businesses, events, residential properties, and construction sites.
            </motion.p>

            {/* Quick Stats */}
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.1 }}
            >
              <div className="flex items-center gap-2 text-white">
                <ShieldCheckIcon className="w-6 h-6 text-green-400" />
                <span className="text-sm font-semibold">Licensed & Insured</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <ClockIcon className="w-6 h-6 text-blue-400" />
                <span className="text-sm font-semibold">24/7 Available</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <PhoneIcon className="w-6 h-6 text-red-400" />
                <span className="text-sm font-semibold">Emergency Response</span>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <Link
                to="/services"
                className="group relative px-8 py-4 bg-gradient-to-r from-red-600 to-blue-600 text-white rounded-full font-semibold hover:shadow-2xl hover:shadow-red-500/25 transition-all duration-300"
              >
                <span className="relative z-10">Our Services</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-red-700 to-blue-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
              </Link>

              <Link
                to="/contact"
                className="group px-8 py-4 border-2 border-white/30 text-white rounded-full font-semibold hover:border-red-400 hover:bg-white/10 transition-all duration-300 hover:shadow-lg backdrop-blur-sm"
              >
                Emergency: (555) 911-HELP
                <motion.span
                  className="inline-block ml-2"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  📞
                </motion.span>
              </Link>
            </motion.div>

            {/* Key Features */}
            <motion.div
              className="flex items-center justify-center space-x-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.4 }}
            >
              {[
                { name: '24/7 Service', icon: '🕐', description: 'Round the clock protection' },
                { name: 'Licensed', icon: '🛡️', description: 'Fully licensed & insured' },
                { name: 'Emergency Response', icon: '🚨', description: 'Quick response team' },
                { name: 'Professional', icon: '👮', description: 'Trained security personnel' },
              ].map((feature) => (
                <motion.div
                  key={feature.name}
                  whileHover={{ scale: 1.1, y: -5 }}
                  className="text-center p-4 bg-white rounded-lg shadow-lg border border-slate-200 hover:border-red-300 transition-all duration-300"
                >
                  <div className="text-2xl mb-2">{feature.icon}</div>
                  <div className="text-sm font-semibold text-slate-800">{feature.name}</div>
                  <div className="text-xs text-slate-500 mt-1">{feature.description}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center text-slate-400"
        >
          <span className="text-sm mb-2">Scroll to explore</span>
          <ChevronDownIcon className="w-6 h-6" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;