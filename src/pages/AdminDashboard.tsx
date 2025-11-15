import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout';
import DashboardOverview from '../components/admin/AdminDashboard';
import BannerManagement from '../components/admin/modules/BannerManagement';
import GalleryManagement from '../components/admin/modules/GalleryManagement';
// import ProjectsManagement from '../components/admin/modules/ProjectsManagement';
import BlogManagement from '../components/admin/modules/BlogManagement';
import ServicesManagement from '../components/admin/modules/ServicesManagement';
import ContactManagement from '../components/admin/modules/ContactManagement';
import JobsManagement from '../components/admin/modules/JobsManagement';
import SocialManagement from '../components/admin/modules/SocialManagement';
import SettingsManagement from '../components/admin/modules/SettingsManagement';
import AdminManagement from '../components/admin/modules/AdminManagement';
import ClientsManagement from '../components/admin/modules/ClientsManagement';
import UploadManagement from '../components/admin/modules/UploadManagement';
import EmployeeManagement from '../components/admin/modules/EmployeeManagement';
import AdminMessaging from './AdminMessaging';

const AdminDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentModule, setCurrentModule] = useState(() => {
    return searchParams.get('module') || 'dashboard';
  });

  const handleModuleChange = (module: string) => {
    setCurrentModule(module);
    // Update URL without full page reload
    setSearchParams({ module });
  };

  // Handle browser back/forward buttons
  useEffect(() => {
    const module = searchParams.get('module') || 'dashboard';
    setCurrentModule(module);
  }, [searchParams]);

  const renderModuleContent = () => {
    switch (currentModule) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'banner':
        return <BannerManagement />;
      case 'gallery':
        return <GalleryManagement />;
      // case 'projects':
      //   return <ProjectsManagement />;
      case 'blog':
        return <BlogManagement />;
      case 'contact':
        return <ContactManagement />;
      case 'social':
        return <SocialManagement />;
      case 'settings':
        return <SettingsManagement />;
      case 'admins':
        return <AdminManagement />;
      case 'services':
        return <ServicesManagement />;
      case 'upload':
        return <UploadManagement />;
      case 'clients':
        return <ClientsManagement />;
      case 'career':
        return <JobsManagement />;
      case 'jobs':
        return <JobsManagement />;
      case 'employees':
        return <EmployeeManagement />;
      case 'messaging':
        return <AdminMessaging />;
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