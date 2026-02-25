import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  UserGroupIcon,
  AcademicCapIcon,
  ShieldCheckIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';
import SEO from '../components/SEO';
import Breadcrumb from '../components/Breadcrumb';
import { useSEO } from '../hooks/useSEO';

interface TeamMember {
  name: string;
  title: string;
  credentials: string;
  category: 'leadership' | 'management' | 'advisory';
}

const teamMembers: TeamMember[] = [
  { name: 'Mrs. Mayeeda Choudhury', title: 'Chairperson', credentials: '', category: 'leadership' },
  { name: 'Major Zulfiqar H. Choudhury (Retd)', title: 'Managing Director', credentials: '', category: 'leadership' },
  { name: 'Major Md. Nazmul Haque (Retd)', title: 'Executive Director', credentials: 'MBA, PGDHRM', category: 'leadership' },
  { name: 'Major Kazi Ashfaq (Retd)', title: 'Director Marketing', credentials: '', category: 'management' },
  { name: 'Major Asif Chowdhury (Retd)', title: 'Director Business Development', credentials: 'MBA, MBCHRS', category: 'management' },
  { name: 'Mohammad Ali Yusuf Hossain', title: 'Director of Finance & Digital Surveillance Solutions', credentials: 'MCom, MBA, DCS, CSP, Certified Lead Auditor ISO/IEC 27001:2022', category: 'management' },
  { name: 'Lt. Mizanur Rahman BN (Retd)', title: 'General Manager (Admin & Ops)', credentials: 'Certified Lead Auditor ISO 9001:2015', category: 'management' },
  { name: 'Md. Mostafizur Rahman', title: 'Deputy General Manager (Operations)', credentials: '', category: 'management' },
  { name: 'Md. Jalal Ahmed', title: 'Manager Chittagong Region', credentials: '', category: 'management' },
  { name: 'Engr. Sumon Parvez', title: 'Manager Digital Surveillance Solutions', credentials: 'BSc (EEE)', category: 'management' },
  { name: 'Advocate Syed Mehedi Hasan', title: 'Advisor Legal Affairs', credentials: '', category: 'advisory' },
  { name: 'DK Associates', title: 'Advisor Corporate Affairs', credentials: '', category: 'advisory' },
];

const Team = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'leadership' | 'management' | 'advisory'>('all');

  const seoData = useSEO({
    title: 'Our Team - Falcon® Security Limited Management',
    description: 'Meet the experienced management team of Falcon® Security Limited. Led by retired Bangladesh Army officers with extensive security and intelligence training.',
    keywords: [
      'falcon security team',
      'security management team',
      'falcon security leadership',
      'bangladesh security experts',
      'falcon security directors',
    ],
    image: '/images/team/falcon-security-team.jpg',
    type: 'website',
  });

  const seoProps = {
    ...seoData,
    keywords: seoData.keywords?.join(', '),
  };

  const filteredMembers = teamMembers.filter((member) => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || member.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const filters = [
    { key: 'all' as const, label: 'All' },
    { key: 'leadership' as const, label: 'Leadership' },
    { key: 'management' as const, label: 'Management' },
    { key: 'advisory' as const, label: 'Advisory' },
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'leadership':
        return ShieldCheckIcon;
      case 'management':
        return BuildingOfficeIcon;
      case 'advisory':
        return AcademicCapIcon;
      default:
        return UserGroupIcon;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'leadership':
        return 'from-red-500 to-red-700';
      case 'management':
        return 'from-blue-500 to-blue-700';
      case 'advisory':
        return 'from-green-500 to-green-700';
      default:
        return 'from-red-500 to-blue-600';
    }
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'leadership':
        return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300';
      case 'management':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300';
      case 'advisory':
        return 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <>
      <SEO {...seoProps} />

      <div className="min-h-screen pt-16">
        <Breadcrumb />

        {/* Hero */}
        <section className="bg-gradient-to-br from-red-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-8"
            >
              <div className="flex items-center justify-center mb-4">
                <UserGroupIcon className="w-12 h-12 text-red-600" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                Our Team
              </h1>
              <p className="text-lg text-slate-600 dark:text-gray-300 max-w-3xl mx-auto">
                Our management team consists of veterans of the Bangladesh Armed Forces 
                with sufficient training in security and intelligence at home and abroad. 
                There is also a team of information technology experts who look after 
                digital surveillance solutions.
              </p>
            </motion.div>

            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-md mx-auto relative mb-6"
            >
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              />
            </motion.div>

            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-3 justify-center"
            >
              {filters.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeFilter === filter.key
                      ? 'bg-red-600 text-white shadow-lg'
                      : 'bg-white dark:bg-gray-800 text-slate-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-gray-700 border border-slate-200 dark:border-gray-600'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Team Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {filteredMembers.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <UserGroupIcon className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <p className="text-lg text-slate-600 dark:text-slate-400">
                  No team members found matching your search
                </p>
              </motion.div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filteredMembers.map((member, index) => {
                  const IconComponent = getCategoryIcon(member.category);
                  return (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      whileHover={{ y: -5 }}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-slate-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
                    >
                      <div className="p-6 text-center">
                        {/* Avatar */}
                        <div className={`w-20 h-20 bg-gradient-to-br ${getCategoryColor(member.category)} rounded-full flex items-center justify-center mx-auto mb-4`}>
                          <IconComponent className="w-10 h-10 text-white" />
                        </div>

                        {/* Name */}
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                          {member.name}
                        </h3>

                        {/* Title */}
                        <p className="text-red-600 dark:text-red-400 font-semibold text-sm mb-2">
                          {member.title}
                        </p>

                        {/* Credentials */}
                        {member.credentials && (
                          <p className="text-slate-500 dark:text-gray-400 text-xs mb-3">
                            {member.credentials}
                          </p>
                        )}

                        {/* Category Badge */}
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${getCategoryBadgeColor(member.category)}`}>
                          {member.category}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </div>
        </section>

        {/* Bottom Info */}
        <section className="bg-gradient-to-r from-red-600 to-blue-600 py-12 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                Managed by Professionals Since 1993
              </h2>
              <p className="text-red-100 max-w-2xl mx-auto">
                Retired officers from the Bangladesh Army having adequate training on security 
                and related matters, both from home and abroad, manage the services of the company.
              </p>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Team;
