import { useState } from 'react';
import { motion } from 'framer-motion';
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
  EyeIcon
} from '@heroicons/react/24/outline';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentModule: string;
  onModuleChange: (module: string) => void;
}

const AdminLayout = ({ children, currentModule, onModuleChange }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const modules = [
    { id: 'dashboard', name: 'Dashboard', icon: HomeIcon, count: null },
    { id: 'banner', name: 'Banner', icon: PhotoIcon, count: null },
    { id: 'gallery', name: 'Gallery', icon: FolderIcon, count: null },
    { id: 'projects', name: 'Projects', icon: BriefcaseIcon, count: null },
    { id: 'blog', name: 'Blog', icon: ChatBubbleLeftRightIcon, count: null },
    { id: 'contact', name: 'Contact', icon: EnvelopeIcon, count: null },
    { id: 'social', name: 'Social Links', icon: UserGroupIcon, count: null },
    { id: 'settings', name: 'Settings', icon: Cog6ToothIcon, count: null },
    { id: 'services', name: 'Services', icon: WrenchScrewdriverIcon, count: null },
    { id: 'upload', name: 'Upload', icon: CloudArrowUpIcon, count: null },
    { id: 'clients', name: 'Clients', icon: BuildingOfficeIcon, count: null },
    { id: 'career', name: 'Career', icon: BriefcaseIcon, count: null },
  ];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ width: sidebarOpen ? 256 : 80 }}
        className="bg-white dark:bg-gray-800 shadow-lg flex flex-col"
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">P</span>
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">Portfolio</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Admin Panel</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <button
                key={module.id}
                onClick={() => onModuleChange(module.id)}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                  currentModule === module.id
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && (
                  <>
                    <span className="font-medium">{module.name}</span>
                    {module.count !== null && (
                      <span className="ml-auto px-2 py-1 text-xs rounded-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300">
                        {module.count}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Toggle */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center px-3 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <svg
              className={`w-5 h-5 transform transition-transform ${sidebarOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
                {currentModule.replace('-', ' ')}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Manage your {currentModule} content
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2">
                <EyeIcon className="w-4 h-4" />
                <span>View Site</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;