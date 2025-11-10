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
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Welcome back, Admin! 👋</h1>
        <p className="text-blue-100">
          Here's what's happening with your portfolio today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{card.total}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {card.active} active
                    </span>
                    <div className="flex items-center space-x-1 text-green-500">
                      <ArrowUpIcon className="w-3 h-3" />
                      <span className="text-xs">{card.trend}</span>
                    </div>
                  </div>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-br ${getColorClasses(card.color)} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
              <BriefcaseIcon className="w-6 h-6 text-blue-500" />
              <div className="text-left">
                <p className="font-medium text-gray-900 dark:text-white">Add Project</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Create new project</p>
              </div>
            </button>
            <button className="flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors">
              <ChatBubbleLeftRightIcon className="w-6 h-6 text-green-500" />
              <div className="text-left">
                <p className="font-medium text-gray-900 dark:text-white">Write Post</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Create blog post</p>
              </div>
            </button>
            <button className="flex items-center space-x-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors">
              <FolderIcon className="w-6 h-6 text-purple-500" />
              <div className="text-left">
                <p className="font-medium text-gray-900 dark:text-white">Upload Images</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Add to gallery</p>
              </div>
            </button>
            <button className="flex items-center space-x-3 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors">
              <Cog6ToothIcon className="w-6 h-6 text-orange-500" />
              <div className="text-left">
                <p className="font-medium text-gray-900 dark:text-white">Settings</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Update config</p>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity) => {
              const Icon = getActivityIcon(activity.type);
              return (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.title}
                      {activity.status && (
                        <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                          {activity.status}
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{activity.timestamp}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">System Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <div className="w-8 h-8 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <h4 className="font-medium text-gray-900 dark:text-white">API Status</h4>
            <p className="text-sm text-green-600 dark:text-green-400">All systems operational</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <BuildingOfficeIcon className="w-8 h-8 text-blue-500" />
            </div>
            <h4 className="font-medium text-gray-900 dark:text-white">Database</h4>
            <p className="text-sm text-blue-600 dark:text-blue-400">Connected & healthy</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <ShieldCheckIcon className="w-8 h-8 text-purple-500" />
            </div>
            <h4 className="font-medium text-gray-900 dark:text-white">Security</h4>
            <p className="text-sm text-purple-600 dark:text-purple-400">Protected & secure</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;