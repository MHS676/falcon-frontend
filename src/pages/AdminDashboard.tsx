import { useState } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import DashboardOverview from '../components/admin/AdminDashboard';

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
        return <div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900 dark:text-white">Banner Management</h2><p className="text-gray-600 dark:text-gray-400 mt-2">Banner management interface coming soon</p></div>;
      case 'gallery':
        return <div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900 dark:text-white">Gallery Management</h2><p className="text-gray-600 dark:text-gray-400 mt-2">Gallery management interface coming soon</p></div>;
      case 'projects':
        return <div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900 dark:text-white">Projects Management</h2><p className="text-gray-600 dark:text-gray-400 mt-2">Projects management interface coming soon</p></div>;
      case 'blog':
        return <div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900 dark:text-white">Blog Management</h2><p className="text-gray-600 dark:text-gray-400 mt-2">Blog management interface coming soon</p></div>;
      case 'contact':
        return <div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900 dark:text-white">Contact Management</h2><p className="text-gray-600 dark:text-gray-400 mt-2">Contact management interface coming soon</p></div>;
      case 'experience':
        return <div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900 dark:text-white">Experience Management</h2><p className="text-gray-600 dark:text-gray-400 mt-2">Experience management interface coming soon</p></div>;
      case 'social':
        return <div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900 dark:text-white">Social Links Management</h2><p className="text-gray-600 dark:text-gray-400 mt-2">Social links management interface coming soon</p></div>;
      case 'settings':
        return <div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings Management</h2><p className="text-gray-600 dark:text-gray-400 mt-2">Settings management interface coming soon</p></div>;
      case 'services':
        return <div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900 dark:text-white">Services Management</h2><p className="text-gray-600 dark:text-gray-400 mt-2">Services management interface coming soon</p></div>;
      case 'skills':
        return <div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900 dark:text-white">Skills Management</h2><p className="text-gray-600 dark:text-gray-400 mt-2">Skills management interface coming soon</p></div>;
      case 'upload':
        return <div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900 dark:text-white">File Upload Management</h2><p className="text-gray-600 dark:text-gray-400 mt-2">File upload interface coming soon</p></div>;
      case 'clients':
        return <div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900 dark:text-white">Clients Management</h2><p className="text-gray-600 dark:text-gray-400 mt-2">Clients management interface coming soon</p></div>;
      case 'career':
        return <div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900 dark:text-white">Career Management</h2><p className="text-gray-600 dark:text-gray-400 mt-2">Career management interface coming soon</p></div>;
      case 'guards':
        return <div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900 dark:text-white">Guards Management</h2><p className="text-gray-600 dark:text-gray-400 mt-2">Guards management interface coming soon</p></div>;
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