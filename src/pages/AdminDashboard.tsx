import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  UserGroupIcon,
  ShieldCheckIcon,
  BriefcaseIcon,
  PhotoIcon,
  UsersIcon,
  DocumentTextIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ArrowRightOnRectangleIcon,
  RectangleStackIcon,
  DocumentDuplicateIcon,
  EnvelopeIcon,
  LinkIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import * as api from '../services/api';

interface DashboardStats {
  totalGuards: number;
  activeContracts: number;
  pendingApplications: number;
  monthlyRevenue: string;
}

interface Guard {
  id: string;
  name: string;
  position: string;
  status: 'active' | 'inactive' | 'on-duty';
  phone: string;
  email: string;
  hireDate: string;
  licenseNumber?: string;
  image?: string;
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<DashboardStats>({
    totalGuards: 125,
    activeContracts: 42,
    pendingApplications: 8,
    monthlyRevenue: '$125,000'
  });
  const navigate = useNavigate();

  const [guards, setGuards] = useState<Guard[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [banner, setBanner] = useState<any[]>([]);
  const [blog, setBlog] = useState<any[]>([]);
  const [contact, setContact] = useState<any[]>([]);
  const [social, setSocial] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  // Delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);

  useEffect(() => {
    // Check if user is authenticated
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin/login');
      return;
    }
    
    // Fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        const [guardsRes, servicesRes, clientsRes, galleryRes, bannerRes, blogRes, contactRes, socialRes] = await Promise.all([
          api.getGuards(),
          api.getServices(),
          api.getClients(),
          api.getGallery(),
          api.getBanners(),
          api.getBlogs(),
          api.getContacts(),
          api.getSocialLinks()
        ]);
        
        setGuards(guardsRes.data || []);
        setServices(servicesRes.data || []);
        setClients(clientsRes.data || []);
        setGallery(galleryRes.data || []);
        setBanner(bannerRes.data || []);
        setBlog(blogRes.data || []);
        setContact(contactRes.data || []);
        setSocial(socialRes.data || []);
        
        // Update stats based on real data
        setStats(prev => ({
          ...prev,
          totalGuards: guardsRes.data?.length || 0,
          activeContracts: clientsRes.data?.filter((c: any) => c.active)?.length || 0,
          pendingApplications: 3 // This would come from applications API
        }));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  // CRUD Functions for Guards
  const openModal = (mode: 'create' | 'edit' | 'view', item?: any) => {
    setModalMode(mode);
    setSelectedItem(item);
    setFormData(item || {});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
    setFormData({});
  };

  const handleCreateGuard = async () => {
    try {
      const response = await api.createGuard(formData);
      setGuards(prev => [...prev, response.data]);
      toast.success('Guard created successfully');
      closeModal();
    } catch (error: any) {
      console.error('Create guard error:', error);
      toast.error(error.response?.data?.message || 'Failed to create guard');
    }
  };

  const handleUpdateGuard = async () => {
    try {
      const response = await api.updateGuard(selectedItem.id, formData);
      setGuards(prev => prev.map(g => g.id === selectedItem.id ? response.data : g));
      toast.success('Guard updated successfully');
      closeModal();
    } catch (error: any) {
      console.error('Update guard error:', error);
      toast.error(error.response?.data?.message || 'Failed to update guard');
    }
  };

  const confirmDelete = (item: any) => {
    setItemToDelete(item);
    setShowDeleteConfirm(true);
  };

  const handleDeleteGuard = async () => {
    try {
      await api.deleteGuard(itemToDelete.id);
      setGuards(prev => prev.filter(g => g.id !== itemToDelete.id));
      toast.success('Guard deleted successfully');
      setShowDeleteConfirm(false);
      setItemToDelete(null);
    } catch (error: any) {
      console.error('Delete guard error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete guard');
    }
  };

  // CRUD Functions for Services
  const handleCreateService = async () => {
    try {
      const response = await api.createService(formData);
      setServices(prev => [...prev, response.data]);
      toast.success('Service created successfully');
      closeModal();
    } catch (error: any) {
      console.error('Create service error:', error);
      toast.error(error.response?.data?.message || 'Failed to create service');
    }
  };

  const handleUpdateService = async () => {
    try {
      const response = await api.updateService(selectedItem.id, formData);
      setServices(prev => prev.map(s => s.id === selectedItem.id ? response.data : s));
      toast.success('Service updated successfully');
      closeModal();
    } catch (error: any) {
      console.error('Update service error:', error);
      toast.error(error.response?.data?.message || 'Failed to update service');
    }
  };

  const handleDeleteService = async () => {
    try {
      await api.deleteService(itemToDelete.id);
      setServices(prev => prev.filter(s => s.id !== itemToDelete.id));
      toast.success('Service deleted successfully');
      setShowDeleteConfirm(false);
      setItemToDelete(null);
    } catch (error: any) {
      console.error('Delete service error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete service');
    }
  };

  // CRUD Functions for Clients
  const handleCreateClient = async () => {
    try {
      const response = await api.createClient(formData);
      setClients(prev => [...prev, response.data]);
      toast.success('Client created successfully');
      closeModal();
    } catch (error: any) {
      console.error('Create client error:', error);
      toast.error(error.response?.data?.message || 'Failed to create client');
    }
  };

  const handleUpdateClient = async () => {
    try {
      const response = await api.updateClient(selectedItem.id, formData);
      setClients(prev => prev.map(c => c.id === selectedItem.id ? response.data : c));
      toast.success('Client updated successfully');
      closeModal();
    } catch (error: any) {
      console.error('Update client error:', error);
      toast.error(error.response?.data?.message || 'Failed to update client');
    }
  };

  const handleDeleteClient = async () => {
    try {
      await api.deleteClient(itemToDelete.id);
      setClients(prev => prev.filter(c => c.id !== itemToDelete.id));
      toast.success('Client deleted successfully');
      setShowDeleteConfirm(false);
      setItemToDelete(null);
    } catch (error: any) {
      console.error('Delete client error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete client');
    }
  };

  // CRUD Functions for Gallery
  const handleCreateGallery = async () => {
    try {
      const response = await api.createGalleryItem(formData);
      setGallery(prev => [...prev, response.data]);
      toast.success('Gallery item created successfully');
      closeModal();
    } catch (error: any) {
      console.error('Create gallery error:', error);
      toast.error(error.response?.data?.message || 'Failed to create gallery item');
    }
  };

  const handleUpdateGallery = async () => {
    try {
      const response = await api.updateGalleryItem(selectedItem.id, formData);
      setGallery(prev => prev.map(g => g.id === selectedItem.id ? response.data : g));
      toast.success('Gallery item updated successfully');
      closeModal();
    } catch (error: any) {
      console.error('Update gallery error:', error);
      toast.error(error.response?.data?.message || 'Failed to update gallery item');
    }
  };

  const handleDeleteGallery = async () => {
    try {
      await api.deleteGalleryItem(itemToDelete.id);
      setGallery(prev => prev.filter(g => g.id !== itemToDelete.id));
      toast.success('Gallery item deleted successfully');
      setShowDeleteConfirm(false);
      setItemToDelete(null);
    } catch (error: any) {
      console.error('Delete gallery error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete gallery item');
    }
  };

  // CRUD Functions for Banner
  const handleCreateBanner = async () => {
    try {
      const response = await api.createBanner(formData);
      setBanner(prev => [...prev, response.data]);
      toast.success('Banner created successfully');
      closeModal();
    } catch (error: any) {
      console.error('Create banner error:', error);
      toast.error(error.response?.data?.message || 'Failed to create banner');
    }
  };

  const handleUpdateBanner = async () => {
    try {
      const response = await api.updateBanner(selectedItem.id, formData);
      setBanner(prev => prev.map(b => b.id === selectedItem.id ? response.data : b));
      toast.success('Banner updated successfully');
      closeModal();
    } catch (error: any) {
      console.error('Update banner error:', error);
      toast.error(error.response?.data?.message || 'Failed to update banner');
    }
  };

  const handleDeleteBanner = async () => {
    try {
      await api.deleteBanner(itemToDelete.id);
      setBanner(prev => prev.filter(b => b.id !== itemToDelete.id));
      toast.success('Banner deleted successfully');
      setShowDeleteConfirm(false);
      setItemToDelete(null);
    } catch (error: any) {
      console.error('Delete banner error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete banner');
    }
  };

  // CRUD Functions for Blog
  const handleCreateBlog = async () => {
    try {
      const response = await api.createBlog(formData);
      setBlog(prev => [...prev, response.data]);
      toast.success('Blog created successfully');
      closeModal();
    } catch (error: any) {
      console.error('Create blog error:', error);
      toast.error(error.response?.data?.message || 'Failed to create blog');
    }
  };

  const handleUpdateBlog = async () => {
    try {
      const response = await api.updateBlog(selectedItem.id, formData);
      setBlog(prev => prev.map(b => b.id === selectedItem.id ? response.data : b));
      toast.success('Blog updated successfully');
      closeModal();
    } catch (error: any) {
      console.error('Update blog error:', error);
      toast.error(error.response?.data?.message || 'Failed to update blog');
    }
  };

  const handleDeleteBlog = async () => {
    try {
      await api.deleteBlog(itemToDelete.id);
      setBlog(prev => prev.filter(b => b.id !== itemToDelete.id));
      toast.success('Blog deleted successfully');
      setShowDeleteConfirm(false);
      setItemToDelete(null);
    } catch (error: any) {
      console.error('Delete blog error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete blog');
    }
  };

  // CRUD Functions for Contact
  const handleCreateContact = async () => {
    try {
      const response = await api.createContact(formData);
      setContact(prev => [...prev, response.data]);
      toast.success('Contact created successfully');
      closeModal();
    } catch (error: any) {
      console.error('Create contact error:', error);
      toast.error(error.response?.data?.message || 'Failed to create contact');
    }
  };

  const handleUpdateContact = async () => {
    try {
      const response = await api.updateContact(selectedItem.id, formData);
      setContact(prev => prev.map(c => c.id === selectedItem.id ? response.data : c));
      toast.success('Contact updated successfully');
      closeModal();
    } catch (error: any) {
      console.error('Update contact error:', error);
      toast.error(error.response?.data?.message || 'Failed to update contact');
    }
  };

  const handleDeleteContact = async () => {
    try {
      await api.deleteContact(itemToDelete.id);
      setContact(prev => prev.filter(c => c.id !== itemToDelete.id));
      toast.success('Contact deleted successfully');
      setShowDeleteConfirm(false);
      setItemToDelete(null);
    } catch (error: any) {
      console.error('Delete contact error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete contact');
    }
  };

  // CRUD Functions for Social
  const handleCreateSocial = async () => {
    try {
      const response = await api.createSocialLink(formData);
      setSocial(prev => [...prev, response.data]);
      toast.success('Social link created successfully');
      closeModal();
    } catch (error: any) {
      console.error('Create social error:', error);
      toast.error(error.response?.data?.message || 'Failed to create social link');
    }
  };

  const handleUpdateSocial = async () => {
    try {
      const response = await api.updateSocialLink(selectedItem.id, formData);
      setSocial(prev => prev.map(s => s.id === selectedItem.id ? response.data : s));
      toast.success('Social link updated successfully');
      closeModal();
    } catch (error: any) {
      console.error('Update social error:', error);
      toast.error(error.response?.data?.message || 'Failed to update social link');
    }
  };

  const handleDeleteSocial = async () => {
    try {
      await api.deleteSocialLink(itemToDelete.id);
      setSocial(prev => prev.filter(s => s.id !== itemToDelete.id));
      toast.success('Social link deleted successfully');
      setShowDeleteConfirm(false);
      setItemToDelete(null);
    } catch (error: any) {
      console.error('Delete social error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete social link');
    }
  };

  // Generic delete handler
  const handleGenericDelete = async () => {
    switch (activeTab) {
      case 'guards':
        await handleDeleteGuard();
        break;
      case 'services':
        await handleDeleteService();
        break;
      case 'clients':
        await handleDeleteClient();
        break;
      case 'gallery':
        await handleDeleteGallery();
        break;
      case 'banner':
        await handleDeleteBanner();
        break;
      case 'blog':
        await handleDeleteBlog();
        break;
      case 'contact':
        await handleDeleteContact();
        break;
      case 'social':
        await handleDeleteSocial();
        break;
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: DocumentTextIcon },
    { id: 'banner', name: 'Banner', icon: RectangleStackIcon },
    { id: 'guards', name: 'Security Guards', icon: UserGroupIcon },
    { id: 'services', name: 'Services', icon: ShieldCheckIcon },
    { id: 'clients', name: 'Clients', icon: UsersIcon },
    { id: 'gallery', name: 'Gallery', icon: PhotoIcon },
    { id: 'blog', name: 'Blog', icon: DocumentDuplicateIcon },
    { id: 'contact', name: 'Contact', icon: EnvelopeIcon },
    { id: 'social', name: 'Social', icon: LinkIcon }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-red-600 bg-red-100';
      case 'on-duty': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Guards', value: stats.totalGuards, icon: UserGroupIcon, color: 'blue' },
          { title: 'Active Contracts', value: stats.activeContracts, icon: ShieldCheckIcon, color: 'green' },
          { title: 'Pending Applications', value: stats.pendingApplications, icon: BriefcaseIcon, color: 'yellow' },
          { title: 'Monthly Revenue', value: stats.monthlyRevenue, icon: DocumentTextIcon, color: 'purple' }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">{stat.title}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { action: 'New guard hired', name: 'Michael Brown', time: '2 hours ago' },
            { action: 'Contract renewed', name: 'TechCorp Industries', time: '5 hours ago' },
            { action: 'Service updated', name: 'Event Security', time: '1 day ago' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-b-0">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">{activity.action}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">{activity.name}</p>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderGuards = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Security Guards</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => openModal('create')}
          className="px-4 py-2 bg-gradient-to-r from-red-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2"
        >
          <PlusIcon className="w-4 h-4" />
          Add Guard
        </motion.button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Position</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {guards.map((guard) => (
                <tr key={guard.id} className="hover:bg-slate-50 dark:hover:bg-slate-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-slate-900 dark:text-white">{guard.name}</div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">ID: {guard.id}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">{guard.position}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(guard.status)}`}>
                      {guard.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                    <div>{guard.phone}</div>
                    <div>{guard.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => openModal('view', guard)}
                        className="text-blue-600 hover:text-blue-800"
                        title="View Details"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => openModal('edit', guard)}
                        className="text-green-600 hover:text-green-800"
                        title="Edit Guard"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => confirmDelete(guard)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete Guard"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Render functions for other modules
  const renderBanner = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Banner Management</h2>
        <button 
          onClick={() => openModal('create')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <PlusIcon className="w-4 h-4" />
          Add Banner
        </button>
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Subtitle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {banner.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">{item.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">{item.subtitle}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.active ? 'active' : 'inactive')}`}>
                      {item.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button onClick={() => openModal('view', item)} className="text-blue-600 hover:text-blue-800" title="View Details">
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button onClick={() => openModal('edit', item)} className="text-green-600 hover:text-green-800" title="Edit Banner">
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button onClick={() => confirmDelete(item)} className="text-red-600 hover:text-red-800" title="Delete Banner">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderServices = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Services Management</h2>
        <button 
          onClick={() => openModal('create')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <PlusIcon className="w-4 h-4" />
          Add Service
        </button>
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {services.map((service) => (
                <tr key={service.id} className="hover:bg-slate-50 dark:hover:bg-slate-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">{service.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-900 dark:text-white">{service.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">${service.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button onClick={() => openModal('view', service)} className="text-blue-600 hover:text-blue-800" title="View Details">
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button onClick={() => openModal('edit', service)} className="text-green-600 hover:text-green-800" title="Edit Service">
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button onClick={() => confirmDelete(service)} className="text-red-600 hover:text-red-800" title="Delete Service">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderClients = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Clients Management</h2>
        <button 
          onClick={() => openModal('create')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <PlusIcon className="w-4 h-4" />
          Add Client
        </button>
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-slate-50 dark:hover:bg-slate-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">{client.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">{client.company}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">{client.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(client.status)}`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button onClick={() => openModal('view', client)} className="text-blue-600 hover:text-blue-800" title="View Details">
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button onClick={() => openModal('edit', client)} className="text-green-600 hover:text-green-800" title="Edit Client">
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button onClick={() => confirmDelete(client)} className="text-red-600 hover:text-red-800" title="Delete Client">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderGallery = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Gallery Management</h2>
        <button 
          onClick={() => openModal('create')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <PlusIcon className="w-4 h-4" />
          Add Gallery Item
        </button>
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {gallery.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">{item.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">{item.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">
                    <img src={item.imageUrl} alt={item.title} className="w-12 h-12 object-cover rounded-lg" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button onClick={() => openModal('view', item)} className="text-blue-600 hover:text-blue-800" title="View Details">
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button onClick={() => openModal('edit', item)} className="text-green-600 hover:text-green-800" title="Edit Item">
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button onClick={() => confirmDelete(item)} className="text-red-600 hover:text-red-800" title="Delete Item">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderBlog = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Blog Management</h2>
        <button 
          onClick={() => openModal('create')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <PlusIcon className="w-4 h-4" />
          Add Blog Post
        </button>
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Author</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {blog.map((post) => (
                <tr key={post.id} className="hover:bg-slate-50 dark:hover:bg-slate-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">{post.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">{post.author}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(post.published ? 'active' : 'inactive')}`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button onClick={() => openModal('view', post)} className="text-blue-600 hover:text-blue-800" title="View Details">
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button onClick={() => openModal('edit', post)} className="text-green-600 hover:text-green-800" title="Edit Post">
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button onClick={() => confirmDelete(post)} className="text-red-600 hover:text-red-800" title="Delete Post">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderContact = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Contact Messages</h2>
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {contact.map((message) => (
                <tr key={message.id} className="hover:bg-slate-50 dark:hover:bg-slate-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">{message.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">{message.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">{message.subject}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(message.status || 'pending')}`}>
                      {message.status || 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button onClick={() => openModal('view', message)} className="text-blue-600 hover:text-blue-800" title="View Details">
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button onClick={() => confirmDelete(message)} className="text-red-600 hover:text-red-800" title="Delete Message">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSocial = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Social Links Management</h2>
        <button 
          onClick={() => openModal('create')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <PlusIcon className="w-4 h-4" />
          Add Social Link
        </button>
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Platform</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">URL</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {social.map((link) => (
                <tr key={link.id} className="hover:bg-slate-50 dark:hover:bg-slate-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">{link.platform}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                      {link.url}
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(link.active ? 'active' : 'inactive')}`}>
                      {link.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button onClick={() => openModal('view', link)} className="text-blue-600 hover:text-blue-800" title="View Details">
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button onClick={() => openModal('edit', link)} className="text-green-600 hover:text-green-800" title="Edit Link">
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button onClick={() => confirmDelete(link)} className="text-red-600 hover:text-red-800" title="Delete Link">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'guards': return renderGuards();
      case 'banner': return renderBanner();
      case 'services': return renderServices();
      case 'clients': return renderClients();
      case 'gallery': return renderGallery();
      case 'blog': return renderBlog();
      case 'contact': return renderContact();
      case 'social': return renderSocial();
      default: return renderOverview();
    }
  };

  // Helper function to render view fields based on active tab
  const renderViewFields = () => {
    if (!selectedItem) return null;
    
    switch (activeTab) {
      case 'guards':
        return (
          <>
            <div><strong>Name:</strong> {selectedItem.name}</div>
            <div><strong>Position:</strong> {selectedItem.position}</div>
            <div><strong>Email:</strong> {selectedItem.email}</div>
            <div><strong>Phone:</strong> {selectedItem.phone}</div>
            <div><strong>Status:</strong> {selectedItem.status}</div>
            <div><strong>License:</strong> {selectedItem.licenseNumber}</div>
            <div><strong>Hire Date:</strong> {new Date(selectedItem.hireDate).toLocaleDateString()}</div>
          </>
        );
      case 'services':
        return (
          <>
            <div><strong>Name:</strong> {selectedItem.name}</div>
            <div><strong>Description:</strong> {selectedItem.description}</div>
            <div><strong>Price:</strong> ${selectedItem.price}</div>
            <div><strong>Duration:</strong> {selectedItem.duration}</div>
          </>
        );
      case 'clients':
        return (
          <>
            <div><strong>Name:</strong> {selectedItem.name}</div>
            <div><strong>Company:</strong> {selectedItem.company}</div>
            <div><strong>Email:</strong> {selectedItem.email}</div>
            <div><strong>Phone:</strong> {selectedItem.phone}</div>
            <div><strong>Status:</strong> {selectedItem.status}</div>
          </>
        );
      case 'gallery':
        return (
          <>
            <div><strong>Title:</strong> {selectedItem.title}</div>
            <div><strong>Description:</strong> {selectedItem.description}</div>
            <div><strong>Category:</strong> {selectedItem.category}</div>
            <div><strong>Image:</strong> <img src={selectedItem.imageUrl} alt={selectedItem.title} className="w-32 h-32 object-cover rounded" /></div>
          </>
        );
      case 'banner':
        return (
          <>
            <div><strong>Title:</strong> {selectedItem.title}</div>
            <div><strong>Subtitle:</strong> {selectedItem.subtitle}</div>
            <div><strong>Button Text:</strong> {selectedItem.buttonText}</div>
            <div><strong>Button Link:</strong> {selectedItem.buttonLink}</div>
            <div><strong>Active:</strong> {selectedItem.active ? 'Yes' : 'No'}</div>
          </>
        );
      case 'blog':
        return (
          <>
            <div><strong>Title:</strong> {selectedItem.title}</div>
            <div><strong>Author:</strong> {selectedItem.author}</div>
            <div><strong>Content:</strong> {selectedItem.content}</div>
            <div><strong>Published:</strong> {selectedItem.published ? 'Yes' : 'No'}</div>
            <div><strong>Created:</strong> {new Date(selectedItem.createdAt).toLocaleDateString()}</div>
          </>
        );
      case 'contact':
        return (
          <>
            <div><strong>Name:</strong> {selectedItem.name}</div>
            <div><strong>Email:</strong> {selectedItem.email}</div>
            <div><strong>Subject:</strong> {selectedItem.subject}</div>
            <div><strong>Message:</strong> {selectedItem.message}</div>
            <div><strong>Status:</strong> {selectedItem.status}</div>
          </>
        );
      case 'social':
        return (
          <>
            <div><strong>Platform:</strong> {selectedItem.platform}</div>
            <div><strong>URL:</strong> <a href={selectedItem.url} target="_blank" className="text-blue-600">{selectedItem.url}</a></div>
            <div><strong>Icon:</strong> {selectedItem.icon}</div>
            <div><strong>Active:</strong> {selectedItem.active ? 'Yes' : 'No'}</div>
          </>
        );
      default:
        return <div>No details available</div>;
    }
  };

  // Helper function to render form fields based on active tab
  const renderFormFields = () => {
    switch (activeTab) {
      case 'guards':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Position</label>
              <input
                type="text"
                name="position"
                value={formData.position || ''}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone || ''}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Status</label>
              <select
                name="status"
                value={formData.status || ''}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              >
                <option value="">Select Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="on-leave">On Leave</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">License Number</label>
              <input
                type="text"
                name="licenseNumber"
                value={formData.licenseNumber || ''}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Hire Date</label>
              <input
                type="date"
                name="hireDate"
                value={formData.hireDate || ''}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Address</label>
              <textarea
                name="address"
                value={formData.address || ''}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              />
            </div>
          </div>
        );
      case 'services':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Service Name</label>
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description || ''}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Price ($)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price || ''}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Duration</label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration || ''}
                  onChange={handleInputChange}
                  placeholder="e.g., 24/7, Monthly"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                />
              </div>
            </div>
          </div>
        );
      case 'clients':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Company</label>
              <input
                type="text"
                name="company"
                value={formData.company || ''}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Status</label>
              <select
                name="status"
                value={formData.status || ''}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              >
                <option value="">Select Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Testimonial</label>
              <textarea
                name="testimonial"
                value={formData.testimonial || ''}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              />
            </div>
          </div>
        );
      // Add more cases for other entity types...
      default:
        return <div>Form fields for {activeTab} not implemented yet</div>;
    }
  };

  // Guard Form Modal Component
  const GuardModal = () => {
    if (!showModal) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setFormData((prev: any) => ({
        ...prev,
        [e.target.name]: e.target.value
      }));
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      switch (activeTab) {
        case 'guards':
          if (modalMode === 'create') handleCreateGuard();
          else if (modalMode === 'edit') handleUpdateGuard();
          break;
        case 'services':
          if (modalMode === 'create') handleCreateService();
          else if (modalMode === 'edit') handleUpdateService();
          break;
        case 'clients':
          if (modalMode === 'create') handleCreateClient();
          else if (modalMode === 'edit') handleUpdateClient();
          break;
        case 'gallery':
          if (modalMode === 'create') handleCreateGallery();
          else if (modalMode === 'edit') handleUpdateGallery();
          break;
        case 'banner':
          if (modalMode === 'create') handleCreateBanner();
          else if (modalMode === 'edit') handleUpdateBanner();
          break;
        case 'blog':
          if (modalMode === 'create') handleCreateBlog();
          else if (modalMode === 'edit') handleUpdateBlog();
          break;
        case 'contact':
          if (modalMode === 'create') handleCreateContact();
          else if (modalMode === 'edit') handleUpdateContact();
          break;
        case 'social':
          if (modalMode === 'create') handleCreateSocial();
          else if (modalMode === 'edit') handleUpdateSocial();
          break;
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {modalMode === 'create' ? `Add New ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}` : 
               modalMode === 'edit' ? `Edit ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}` : 
               `View ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
            </h3>
            <button onClick={closeModal} className="text-slate-500 hover:text-slate-700">
              ✕
            </button>
          </div>

          {modalMode === 'view' ? (
            <div className="space-y-4">
              {renderViewFields()}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {renderFormFields()}
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-blue-600 text-white rounded-lg hover:shadow-lg"
                >
                  {modalMode === 'create' ? `Create ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}` : `Update ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  };

  // Delete Confirmation Modal
  const DeleteConfirmModal = () => {
    if (!showDeleteConfirm) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-md mx-4">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <TrashIcon className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
              Delete Guard
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Are you sure you want to delete <strong>{itemToDelete?.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleGenericDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-lg border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <ShieldCheckIcon className="w-8 h-8 text-red-600" />
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">SecureGuard Admin</h1>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              <span>Logout</span>
            </motion.button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-64">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-red-600 to-blue-600 text-white shadow-lg'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <GuardModal />
      <DeleteConfirmModal />
    </div>
  );
};

export default AdminDashboard;