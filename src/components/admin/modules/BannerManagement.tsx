import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import { bannerAPI, tryExternalImageUpload } from '../../../services/api';
import toast from 'react-hot-toast';

interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  buttonText?: string;
  buttonUrl?: string;
  active: boolean;
  order: number;
  createdAt: string;
}

const BannerManagement = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image: null as File | null,
    imageUrl: '',
    buttonText: '',
    buttonUrl: '',
    active: true,
    order: 1
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await bannerAPI.getAll();
      setBanners(response.data.sort((a: Banner, b: Banner) => a.order - b.order));
    } catch (error) {
      console.error('Error fetching banners:', error);
      toast.error('Failed to load banners');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // If there's an image file, try external uploader first
      if (formData.image) {
        const uploadedUrl = await tryExternalImageUpload(formData.image, 'banner');
        if (uploadedUrl) {
          const payload = {
            title: formData.title,
            subtitle: formData.subtitle || undefined,
            buttonText: formData.buttonText || undefined,
            buttonUrl: formData.buttonUrl || undefined,
            active: !!formData.active,
            order: Number(formData.order) || 0,
            image: uploadedUrl,
          };
          if (selectedBanner) {
            await bannerAPI.update(selectedBanner.id, payload as any);
            toast.success('Banner updated successfully');
          } else {
            await bannerAPI.create(payload as any);
            toast.success('Banner created successfully');
          }
        } else {
          // External upload failed - inform user to use image URL instead
          toast.error('Image upload service is unavailable. Please paste a direct image URL instead.');
          setLoading(false);
          return;
        }
      } else if (formData.imageUrl) {
        // No file uploaded, use image URL directly
        const payload = {
          title: formData.title,
          subtitle: formData.subtitle || undefined,
          buttonText: formData.buttonText || undefined,
          buttonUrl: formData.buttonUrl || undefined,
          active: !!formData.active,
          order: Number(formData.order) || 0,
          image: formData.imageUrl,
        };

        if (selectedBanner) {
          await bannerAPI.update(selectedBanner.id, payload as any);
          toast.success('Banner updated successfully');
        } else {
          await bannerAPI.create(payload as any);
          toast.success('Banner created successfully');
        }
      } else {
        toast.error('Please upload an image file or provide an image URL');
        setLoading(false);
        return;
      }
      
      fetchBanners();
      resetForm();
      setIsModalOpen(false);
    } catch (error: any) {
      // Improve visibility of server-side validation errors
      const serverData = error?.response?.data;
      const message = Array.isArray(serverData?.message)
        ? serverData.message.join('\n')
        : (serverData?.message || serverData?.error || error.message || 'Failed to save banner');
      
      // Enhanced error logging
      console.error('❌ Banner save failed:');
      console.error('Status:', error?.response?.status);
      console.error('Server response:', serverData);
      console.error('Full error:', error);
      
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedBanner) return;
    
    setLoading(true);
    try {
      await bannerAPI.delete(selectedBanner.id);
      toast.success('Banner deleted successfully');
      fetchBanners();
      setIsDeleteModalOpen(false);
      setSelectedBanner(null);
    } catch (error: any) {
      console.error('Error deleting banner:', error);
      toast.error(error.response?.data?.message || 'Failed to delete banner');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (banner?: Banner) => {
    if (banner) {
      setSelectedBanner(banner);
      setFormData({
        title: banner.title,
        subtitle: banner.subtitle || '',
        image: null,
        imageUrl: banner.image || '',
        buttonText: banner.buttonText || '',
        buttonUrl: banner.buttonUrl || '',
        active: banner.active,
        order: banner.order
      });
    } else {
      setSelectedBanner(null);
      resetForm();
    }
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      image: null,
      imageUrl: '',
      buttonText: '',
      buttonUrl: '',
      active: true,
      order: banners.length + 1
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, image: file }));
  };

  if (loading && banners.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Banner Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage homepage banner slides</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add Banner</span>
        </button>
      </div>

      {/* Banner Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.map((banner, index) => (
          <motion.div
            key={banner.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="relative h-48">
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  banner.active 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                }`}>
                  {banner.active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="absolute top-2 right-2">
                <span className="px-2 py-1 bg-black/50 text-white rounded text-xs">
                  Order: {banner.order}
                </span>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                {banner.title}
              </h3>
              {banner.subtitle && (
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  {banner.subtitle}
                </p>
              )}
              {banner.buttonText && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  Button: {banner.buttonText} → {banner.buttonUrl}
                </p>
              )}
              
              <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-600">
                <div className="flex space-x-2">
                  <button
                    onClick={() => openModal(banner)}
                    className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                    title="Edit"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedBanner(banner);
                      setIsDeleteModalOpen(true);
                    }}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                    title="Delete"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(banner.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {banners.length === 0 && (
        <div className="text-center py-12">
          <PhotoIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No banners found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Get started by creating your first banner slide</p>
          <button
            onClick={() => openModal()}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Add First Banner
          </button>
        </div>
      )}

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black opacity-50" onClick={() => setIsModalOpen(false)}></div>
            <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {selectedBanner ? 'Edit Banner' : 'Create Banner'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Subtitle
                    </label>
                    <input
                      type="text"
                      name="subtitle"
                      value={formData.subtitle}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Banner Image
                  </label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    required={!selectedBanner && !formData.imageUrl}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Upload a file or provide an image URL below.</p>
                  <input
                    type="url"
                    name="imageUrl"
                    placeholder="https://... (optional image URL)"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    className="mt-2 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Button Text
                    </label>
                    <input
                      type="text"
                      name="buttonText"
                      value={formData.buttonText}
                      onChange={handleInputChange}
                      placeholder="e.g., Learn More"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Button URL
                    </label>
                    <input
                      type="url"
                      name="buttonUrl"
                      value={formData.buttonUrl}
                      onChange={handleInputChange}
                      placeholder="e.g., /services"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Order
                    </label>
                    <input
                      type="number"
                      name="order"
                      value={formData.order}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="flex items-center mt-7">
                    <input
                      type="checkbox"
                      name="active"
                      checked={formData.active}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Active
                    </label>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : selectedBanner ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black opacity-50" onClick={() => setIsDeleteModalOpen(false)}></div>
            <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Delete Banner</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete "{selectedBanner?.title}"? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerManagement;