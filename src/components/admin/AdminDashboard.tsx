import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  PhotoIcon,
  FolderIcon,
  BriefcaseIcon,
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  Cog6ToothIcon,
  WrenchScrewdriverIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  ShieldCheckIcon,
  EyeIcon,
  ArrowUpIcon
} from '@heroicons/react/24/outline';
import {
  bannerAPI,
  galleryAPI,
  projectsAPI,
  blogAPI,
  contactAPI,
  socialAPI,
  servicesAPI,
  clientsAPI,
  careerAPI
} from '../../services/api';
import toast from 'react-hot-toast';

interface DashboardStats {
  banners: { total: number; active: number };
  gallery: { total: number; featured: number };
  projects: { total: number; featured: number; completed: number };
  blog: { total: number; published: number };
  contacts: { total: number; unread: number };
  social: { total: number; active: number };
  services: { total: number; active: number };
  clients: { total: number; featured: number };
  career: { total: number; active: number; applications: number };
}

interface RecentActivity {
  id: string;
  type: string;
  title: string;
  timestamp: string;
  status?: string;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch data from all modules in parallel
      const [
        bannersRes,
        galleryRes,
        projectsRes,
        blogRes,
        contactsRes,
        socialRes,
        servicesRes,
        clientsRes,
        careerRes
      ] = await Promise.allSettled([
        bannerAPI.getAll(),
        galleryAPI.getAll(),
        projectsAPI.getAll(),
        blogAPI.getAll(),
        contactAPI.getAll(),
        socialAPI.getAll(),
        servicesAPI.getAll(),
        clientsAPI.getAll(),
        careerAPI.getAll()
      ]);

      // Process stats
      const dashboardStats: DashboardStats = {
        banners: {
          total: bannersRes.status === 'fulfilled' ? bannersRes.value.data.length : 0,
          active: bannersRes.status === 'fulfilled' ? bannersRes.value.data.filter((b: any) => b.isActive).length : 0
        },
        gallery: {
          total: galleryRes.status === 'fulfilled' ? galleryRes.value.data.length : 0,
          featured: galleryRes.status === 'fulfilled' ? galleryRes.value.data.filter((g: any) => g.isFeatured).length : 0
        },
        projects: {
          total: projectsRes.status === 'fulfilled' ? projectsRes.value.data.length : 0,
          featured: projectsRes.status === 'fulfilled' ? projectsRes.value.data.filter((p: any) => p.isFeatured).length : 0,
          completed: projectsRes.status === 'fulfilled' ? projectsRes.value.data.filter((p: any) => p.status === 'completed').length : 0
        },
        blog: {
          total: blogRes.status === 'fulfilled' ? blogRes.value.data.length : 0,
          published: blogRes.status === 'fulfilled' ? blogRes.value.data.filter((b: any) => b.status === 'published').length : 0
        },
        contacts: {
          total: contactsRes.status === 'fulfilled' ? contactsRes.value.data.length : 0,
          unread: contactsRes.status === 'fulfilled' ? contactsRes.value.data.filter((c: any) => c.status === 'unread').length : 0
        },
        social: {
          total: socialRes.status === 'fulfilled' ? socialRes.value.data.length : 0,
          active: socialRes.status === 'fulfilled' ? socialRes.value.data.filter((s: any) => s.isActive).length : 0
        },
        services: {
          total: servicesRes.status === 'fulfilled' ? servicesRes.value.data.length : 0,
          active: servicesRes.status === 'fulfilled' ? servicesRes.value.data.filter((s: any) => s.isActive).length : 0
        },
        clients: {
          total: clientsRes.status === 'fulfilled' ? clientsRes.value.data.length : 0,
          featured: clientsRes.status === 'fulfilled' ? clientsRes.value.data.filter((c: any) => c.isFeatured).length : 0
        },
        career: {
          total: careerRes.status === 'fulfilled' ? careerRes.value.data.length : 0,
          active: careerRes.status === 'fulfilled' ? careerRes.value.data.filter((c: any) => c.isActive).length : 0,
          applications: 0 // Would need separate API call for applications
        }
      };

      setStats(dashboardStats);

      // Create mock recent activity (in real app, this would come from audit logs)
      const activities: RecentActivity[] = [
        { id: '1', type: 'contact', title: 'New contact form submission', timestamp: '2 minutes ago', status: 'unread' },
        { id: '2', type: 'project', title: 'Project "Portfolio Website" updated', timestamp: '1 hour ago' },
        { id: '3', type: 'blog', title: 'New blog post published', timestamp: '3 hours ago' },
        { id: '4', type: 'gallery', title: 'New images added to gallery', timestamp: '5 hours ago' },
        { id: '5', type: 'career', title: 'Job application received', timestamp: '1 day ago', status: 'new' }
      ];

      setRecentActivity(activities);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Banner Slides',
      icon: PhotoIcon,
      total: stats?.banners.total || 0,
      active: stats?.banners.active || 0,
      color: 'blue',
      trend: '+5%'
    },
    {
      title: 'Gallery Items',
      icon: FolderIcon,
      total: stats?.gallery.total || 0,
      active: stats?.gallery.featured || 0,
      color: 'green',
      trend: '+12%'
    },
    {
      title: 'Projects',
      icon: BriefcaseIcon,
      total: stats?.projects.total || 0,
      active: stats?.projects.completed || 0,
      color: 'purple',
      trend: '+8%'
    },
    {
      title: 'Blog Posts',
      icon: ChatBubbleLeftRightIcon,
      total: stats?.blog.total || 0,
      active: stats?.blog.published || 0,
      color: 'orange',
      trend: '+15%'
    },
    {
      title: 'Contact Messages',
      icon: EnvelopeIcon,
      total: stats?.contacts.total || 0,
      active: stats?.contacts.unread || 0,
      color: 'red',
      trend: '+3%'
    },
    {
      title: 'Services',
      icon: WrenchScrewdriverIcon,
      total: stats?.services.total || 0,
      active: stats?.services.active || 0,
      color: 'indigo',
      trend: '+6%'
    },
    {
      title: 'Clients',
      icon: BuildingOfficeIcon,
      total: stats?.clients.total || 0,
      active: stats?.clients.featured || 0,
      color: 'teal',
      trend: '+10%'
    },
    {
      title: 'Career Opportunities',
      icon: AcademicCapIcon,
      total: stats?.career.total || 0,
      active: stats?.career.active || 0,
      color: 'pink',
      trend: '+2%'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      orange: 'from-orange-500 to-orange-600',
      red: 'from-red-500 to-red-600',
      indigo: 'from-indigo-500 to-indigo-600',
      teal: 'from-teal-500 to-teal-600',
      pink: 'from-pink-500 to-pink-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'contact': return EnvelopeIcon;
      case 'project': return BriefcaseIcon;
      case 'blog': return ChatBubbleLeftRightIcon;
      case 'gallery': return FolderIcon;
      case 'career': return AcademicCapIcon;
      default: return EyeIcon;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow animate-pulse">
              <div className="flex items-center justify-between">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-20"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded w-16"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-12"></div>
                </div>
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white p-10 rounded-2xl shadow-2xl relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>
        <div className="relative z-10">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold mb-3 drop-shadow-md"
          >
            Welcome back, Admin! 👋
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="text-blue-100 text-lg"
          >
            Here's what's happening with your Falcon Security portfolio today.
          </motion.p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden relative"
            >
              {/* Decorative gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${getColorClasses(card.color)} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              
              <div className="relative z-10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <motion.div 
                    className={`w-14 h-14 bg-gradient-to-br ${getColorClasses(card.color)} rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300`}
                    whileHover={{ rotate: 5 }}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </motion.div>
                  <div className="flex items-center space-x-1.5 text-green-500 bg-green-50 px-3 py-1.5 rounded-full">
                    <ArrowUpIcon className="w-4 h-4" />
                    <span className="text-sm font-bold">{card.trend}</span>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">{card.title}</p>
                  <p className="text-4xl font-extrabold text-gray-900 mb-3">{card.total}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-sm text-gray-500 font-medium">
                      <span className="text-gray-900 font-bold">{card.active}</span> active
                    </span>
                    <ShieldCheckIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full mr-3"></div>
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <motion.button 
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center space-y-3 p-5 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl hover:from-blue-100 hover:to-blue-200/50 transition-all duration-300 shadow-sm hover:shadow-md border border-blue-200/50"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <BriefcaseIcon className="w-6 h-6 text-white" />
              </div>
              <div className="text-center">
                <p className="font-bold text-gray-900">Add Project</p>
                <p className="text-xs text-gray-600 mt-1">Create new project</p>
              </div>
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center space-y-3 p-5 bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl hover:from-green-100 hover:to-green-200/50 transition-all duration-300 shadow-sm hover:shadow-md border border-green-200/50"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <ChatBubbleLeftRightIcon className="w-6 h-6 text-white" />
              </div>
              <div className="text-center">
                <p className="font-bold text-gray-900">Write Post</p>
                <p className="text-xs text-gray-600 mt-1">Create blog post</p>
              </div>
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center space-y-3 p-5 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl hover:from-purple-100 hover:to-purple-200/50 transition-all duration-300 shadow-sm hover:shadow-md border border-purple-200/50"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <FolderIcon className="w-6 h-6 text-white" />
              </div>
              <div className="text-center">
                <p className="font-bold text-gray-900">Upload Images</p>
                <p className="text-xs text-gray-600 mt-1">Add to gallery</p>
              </div>
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center space-y-3 p-5 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl hover:from-orange-100 hover:to-orange-200/50 transition-all duration-300 shadow-sm hover:shadow-md border border-orange-200/50"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <Cog6ToothIcon className="w-6 h-6 text-white" />
              </div>
              <div className="text-center">
                <p className="font-bold text-gray-900">Settings</p>
                <p className="text-xs text-gray-600 mt-1">Update config</p>
              </div>
            </motion.button>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full mr-3"></div>
            Recent Activity
          </h3>
          <div className="space-y-4">
            {recentActivity.map((activity, idx) => {
              const Icon = getActivityIcon(activity.type);
              return (
                <motion.div 
                  key={activity.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + (idx * 0.1) }}
                  className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200 group cursor-pointer"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center group-hover:from-blue-100 group-hover:to-blue-200 transition-colors flex-shrink-0">
                    <Icon className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">{activity.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                  </div>
                  {activity.status && (
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                      activity.status === 'unread' || activity.status === 'new'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {activity.status}
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* System Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-gradient-to-br from-white to-blue-50/30 p-8 rounded-2xl shadow-md border border-gray-100"
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <div className="w-2 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full mr-3"></div>
          System Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-4 p-5 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <ShieldCheckIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600">Security Status</p>
              <p className="text-xl font-bold text-green-600">All Systems Secure</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-5 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <EyeIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600">Site Visitors</p>
              <p className="text-xl font-bold text-gray-900">2,547 Today</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-5 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <ArrowUpIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600">Performance</p>
              <p className="text-xl font-bold text-green-600">+12% This Month</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;