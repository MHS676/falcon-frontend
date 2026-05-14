import { useState, useEffect } from 'react';
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
import { employeeAPI } from '../services/api';

interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
  department?: string;
  photo?: string;
  skills?: string[];
  notes?: string;
  status: string;
  active: boolean;
}

const STATIC_TEAM: TeamMember[] = [
  { id: 's1', firstName: 'Mrs. Mayeeda', lastName: 'Choudhury', position: 'Chairperson', department: 'Leadership', status: 'active', active: true },
  { id: 's2', firstName: 'Major Zulfiqar H.', lastName: 'Choudhury (Retd)', position: 'Managing Director', department: 'Leadership', status: 'active', active: true },
  { id: 's3', firstName: 'Major Md. Nazmul', lastName: 'Haque (Retd)', position: 'Executive Director', department: 'Leadership', notes: 'MBA, PGDHRM', status: 'active', active: true },
  { id: 's4', firstName: 'Major Kazi', lastName: 'Ashfaq (Retd)', position: 'Director Marketing', department: 'Management', status: 'active', active: true },
  { id: 's5', firstName: 'Mohammad Ali Yusuf', lastName: 'Hossain', position: 'Director of Finance & Digital Surveillance Solutions', department: 'Management', notes: 'MCom, MBA, DCS, CSP, Certified Lead Auditor ISO/IEC 27001:2022', status: 'active', active: true },
  { id: 's6', firstName: 'Lt. Mizanur', lastName: 'Rahman BN (Retd)', position: 'General Manager (Admin & Ops)', department: 'Management', notes: 'Certified Lead Auditor ISO 9001:2015', status: 'active', active: true },
  { id: 's7', firstName: 'Md. Mostafizur', lastName: 'Rahman', position: 'Deputy General Manager (Operations)', department: 'Management', status: 'active', active: true },
  { id: 's8', firstName: 'Md. Jalal', lastName: 'Ahmed', position: 'Manager Chittagong Region', department: 'Management', status: 'active', active: true },
  { id: 's9', firstName: 'Engr. Sumon', lastName: 'Parvez', position: 'Manager Digital Surveillance Solutions', department: 'Management', notes: 'BSc (EEE)', status: 'active', active: true },
  { id: 's10', firstName: 'Advocate Syed Mehedi', lastName: 'Hasan', position: 'Advisor Legal Affairs', department: 'Advisory', status: 'active', active: true },
  { id: 's11', firstName: 'DK', lastName: 'Associates', position: 'Advisor Corporate Affairs', department: 'Advisory', status: 'active', active: true },
];

const Team = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState<string[]>([]);

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

  const applyOrder = (data: TeamMember[]) => {
    const saved: string[] = JSON.parse(localStorage.getItem('falcon_team_order') || '[]');
    if (saved.length === 0) return data;
    const mapped = new Map(data.map(m => [m.id, m]));
    const ordered = saved.map(id => mapped.get(id)).filter(Boolean) as TeamMember[];
    // Append any members not in saved order at the end
    data.forEach(m => { if (!saved.includes(m.id)) ordered.push(m); });
    return ordered;
  };

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await employeeAPI.getActive();
        const apiData: TeamMember[] = Array.isArray(res.data) ? res.data : [];
        const data = apiData.length > 0 ? apiData : STATIC_TEAM;
        const ordered = applyOrder(data);
        setTeamMembers(ordered);
        const depts = [...new Set(ordered.map(m => m.department).filter(Boolean))] as string[];
        setDepartments(depts);
      } catch {
        setTeamMembers(STATIC_TEAM);
        const depts = [...new Set(STATIC_TEAM.map(m => m.department).filter(Boolean))] as string[];
        setDepartments(depts);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  const filteredMembers = teamMembers.filter((member) => {
    const fullName = `${member.firstName} ${member.lastName}`;
    const matchesSearch = fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.position.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || member.department?.toLowerCase() === activeFilter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const filters = [
    { key: 'all', label: 'All' },
    ...departments.map(d => ({ key: d, label: d })),
  ];

  const getDeptIcon = (dept?: string) => {
    const d = (dept || '').toLowerCase();
    if (d.includes('lead') || d.includes('director') || d.includes('chair')) return ShieldCheckIcon;
    if (d.includes('advis')) return AcademicCapIcon;
    return BuildingOfficeIcon;
  };

  const getDeptColor = (dept?: string) => {
    const d = (dept || '').toLowerCase();
    if (d.includes('lead')) return 'from-amber-500 to-amber-700';
    if (d.includes('advis')) return 'from-green-500 to-green-700';
    return 'from-green-500 to-green-700';
  };

  const apiBase = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:3001';

  const getPhotoUrl = (photo?: string) => {
    if (!photo) return null;
    if (photo.startsWith('http')) return photo;
    return `${apiBase}${photo}`;
  };

  return (
    <>
      <SEO {...seoProps} />

      <div className="min-h-screen pt-16">
        <Breadcrumb />

        {/* Hero */}
        <section className="bg-gradient-to-br from-amber-50 to-green-50 dark:from-gray-900 dark:to-gray-800 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-8"
            >
              <div className="flex items-center justify-center mb-4">
                <UserGroupIcon className="w-12 h-12 text-amber-600" />
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
                placeholder="Search by name or position..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
            </motion.div>

            {/* Filters */}
            {filters.length > 1 && (
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
                        ? 'bg-amber-600 text-white shadow-lg'
                        : 'bg-white dark:bg-gray-800 text-slate-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-gray-700 border border-slate-200 dark:border-gray-600'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </section>

        {/* Team Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-xl h-64 animate-pulse" />
                ))}
              </div>
            ) : filteredMembers.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <UserGroupIcon className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <p className="text-lg text-slate-600 dark:text-slate-400">
                  No team members found
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredMembers.map((member, index) => {
                  const IconComponent = getDeptIcon(member.department);
                  const photoUrl = getPhotoUrl(member.photo);
                  const initials = `${member.firstName.charAt(0)}${member.lastName.charAt(0)}`;
                  return (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.06 }}
                      whileHover={{ y: -5 }}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-slate-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
                    >
                      <div className="p-6 text-center">
                        {/* Avatar / Photo */}
                        <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                          {photoUrl ? (
                            <img
                              src={photoUrl}
                              alt={`${member.firstName} ${member.lastName}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className={`w-full h-full bg-gradient-to-br ${getDeptColor(member.department)} flex items-center justify-center`}>
                              {member.photo === undefined ? (
                                <span className="text-white font-bold text-xl">{initials}</span>
                              ) : (
                                <IconComponent className="w-10 h-10 text-white" />
                              )}
                            </div>
                          )}
                        </div>

                        {/* Name */}
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                          {member.firstName} {member.lastName}
                        </h3>

                        {/* Position */}
                        <p className="text-amber-600 dark:text-amber-400 font-semibold text-sm mb-2">
                          {member.position}
                        </p>

                        {/* Credentials */}
                        {member.notes && (
                          <p className="text-slate-500 dark:text-gray-400 text-xs mb-3 leading-relaxed">
                            {member.notes}
                          </p>
                        )}

                        {/* Department Badge */}
                        {member.department && (
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 capitalize">
                            {member.department}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Bottom Info */}
        <section className="bg-gradient-to-r from-amber-600 to-green-600 py-12 text-white">
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
              <p className="text-amber-100 max-w-2xl mx-auto">
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
