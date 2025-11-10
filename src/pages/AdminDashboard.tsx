import { useState } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import DashboardOverview from '../components/admin/AdminDashboard';
import BannerManagement from '../components/admin/modules/BannerManagement';
import GalleryManagement from '../components/admin/modules/GalleryManagement';
import ProjectsManagement from '../components/admin/modules/ProjectsManagement';
import BlogManagement from '../components/admin/modules/BlogManagement';
import ServicesManagement from '../components/admin/modules/ServicesManagement';
import ContactManagement from '../components/admin/modules/ContactManagement';

const AdminDashboard = () => {
  const [currentModule, setCurrentModule] = useState('dashboard');

  const handleModuleChange = (module: string) => {
    setCurrentModule(module);
  };

  const renderModuleContent = () => {
    switch (currentModule) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'banner':
        return <BannerManagement />;
      case 'gallery':
        return <GalleryManagement />;
      case 'projects':
        return <ProjectsManagement />;
      case 'blog':
        return <BlogManagement />;
      case 'contact':
        return <ContactManagement />;
      case 'social':
        return <div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900 dark:text-white">Social Links Management</h2><p className="text-gray-600 dark:text-gray-400 mt-2">Social links management interface coming soon</p></div>;
      case 'settings':
        return <div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings Management</h2><p className="text-gray-600 dark:text-gray-400 mt-2">Settings management interface coming soon</p></div>;
      case 'services':
        return <ServicesManagement />;
      case 'upload':
        return <div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900 dark:text-white">File Upload Management</h2><p className="text-gray-600 dark:text-gray-400 mt-2">File upload interface coming soon</p></div>;
      case 'clients':
        return <div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900 dark:text-white">Clients Management</h2><p className="text-gray-600 dark:text-gray-400 mt-2">Clients management interface coming soon</p></div>;
      case 'career':
        return <div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900 dark:text-white">Career Management</h2><p className="text-gray-600 dark:text-gray-400 mt-2">Career management interface coming soon</p></div>;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <AdminLayout currentModule={currentModule} onModuleChange={handleModuleChange}>
      {renderModuleContent()}
    </AdminLayout>
  );
};

export default AdminDashboard;