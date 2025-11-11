import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  HomeIcon,
  PhotoIcon,
  FolderIcon,
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  BriefcaseIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  WrenchScrewdriverIcon,
  CloudArrowUpIcon,
  BuildingOfficeIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentModule: string;
  onModuleChange: (module: string) => void;
}

const AdminLayout = ({ children, currentModule, onModuleChange }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    toast.success('Logged out successfully');
    navigate('/', { replace: true });
  };

  // Handle browser back button to prevent accidental logout
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = 'Are you sure you want to leave? You will be logged out of the admin dashboard.';
      return event.returnValue;
    };

    // Add event listener for page unload/refresh
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const modules = [
    { id: 'dashboard', name: 'Dashboard', icon: HomeIcon, count: null },
    { id: 'messaging', name: 'Messages', icon: ChatBubbleLeftRightIcon, count: null },
    { id: 'banner', name: 'Banner', icon: PhotoIcon, count: null },
    { id: 'gallery', name: 'Gallery', icon: FolderIcon, count: null },
    { id: 'projects', name: 'Projects', icon: BriefcaseIcon, count: null },
    { id: 'blog', name: 'Blog', icon: EnvelopeIcon, count: null },
    { id: 'contact', name: 'Contact', icon: EnvelopeIcon, count: null },
    { id: 'social', name: 'Social Links', icon: UserGroupIcon, count: null },
    { id: 'settings', name: 'Settings', icon: Cog6ToothIcon, count: null },
    { id: 'services', name: 'Services', icon: WrenchScrewdriverIcon, count: null },
    { id: 'upload', name: 'Upload', icon: CloudArrowUpIcon, count: null },
    { id: 'clients', name: 'Clients', icon: BuildingOfficeIcon, count: null },
    { id: 'career', name: 'Career', icon: BriefcaseIcon, count: null },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20">
      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        className="bg-gradient-to-b from-slate-900 via-blue-900 to-indigo-950 shadow-2xl flex flex-col relative overflow-hidden"
      >
        {/* Decorative background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        {/* Sidebar Header */}
        <div className="p-6 border-b border-white/10 backdrop-blur-sm bg-white/5 relative z-10">
          <div className="flex items-center space-x-3">
            <motion.div 
              className="w-12 h-12 bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg ring-2 ring-white/20"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <span className="text-white font-bold text-xl drop-shadow-lg">F</span>
            </motion.div>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h1 className="text-xl font-bold text-white tracking-tight drop-shadow-md">Falcon Security</h1>
                <p className="text-sm text-blue-200 font-medium">Admin Control Panel</p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent relative z-10">
          {modules.map((module, index) => {
            const Icon = module.icon;
            const isActive = currentModule === module.id;
            return (
              <motion.button
                key={module.id}
                onClick={() => onModuleChange(module.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/50 ring-2 ring-white/20'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white hover:shadow-md'
                }`}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                {isActive && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-20"
                    layoutId="activeTab"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className={`w-6 h-6 flex-shrink-0 transition-all duration-300 ${
                  isActive ? 'scale-110 drop-shadow-md' : 'group-hover:scale-110'
                }`} />
                {sidebarOpen && (
                  <>
                    <span className="text-sm font-semibold tracking-wide flex-1 text-left">{module.name}</span>
                    {module.count !== null && (
                      <span className={`px-2.5 py-1 text-xs rounded-full font-bold transition-all duration-300 ${
                        isActive 
                          ? 'bg-white/30 text-white backdrop-blur-sm' 
                          : 'bg-white/10 text-gray-300 group-hover:bg-white/20 group-hover:text-white'
                      }`}>
                        {module.count}
                      </span>
                    )}
                    {isActive && (
                      <motion.div
                        className="w-2 h-2 bg-white rounded-full shadow-lg"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500 }}
                      />
                    )}
                  </>
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Sidebar Toggle */}
        <div className="p-4 border-t border-white/10 backdrop-blur-sm bg-white/5 relative z-10">
          <motion.button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center px-3 py-3 rounded-xl text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-300 group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg
              className={`w-5 h-5 transform transition-transform duration-300 group-hover:scale-110 ${sidebarOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {sidebarOpen && <span className="ml-2 text-sm font-medium">Collapse</span>}
          </motion.button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <motion.header 
          className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-200/50 px-8 py-5"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <motion.h2 
                className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent capitalize"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                {currentModule.replace('-', ' ')}
              </motion.h2>
              <motion.p 
                className="text-gray-600 text-sm mt-1 font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Manage your {currentModule} content efficiently
              </motion.p>
            </div>
            <div className="flex items-center space-x-3">
              <motion.button 
                onClick={() => navigate('/')}
                className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center space-x-2 shadow-lg shadow-green-500/30 font-medium"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <HomeIcon className="w-5 h-5" />
                <span className="hidden sm:inline">Home</span>
              </motion.button>
              <motion.button 
                onClick={handleLogout}
                className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl hover:from-red-600 hover:to-rose-700 transition-all duration-300 flex items-center space-x-2 shadow-lg shadow-red-500/30 font-medium"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                <span className="hidden sm:inline">Logout</span>
              </motion.button>
            </div>
          </div>
        </motion.header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-8 bg-gradient-to-br from-gray-50/50 to-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;