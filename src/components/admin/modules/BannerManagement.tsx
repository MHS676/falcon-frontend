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
      // If there's an image file, upload it
      if (formData.image) {
        // Try external uploader first
        const uploadedUrl = await tryExternalImageUpload(formData.image, 'banner');
        
        if (uploadedUrl) {
          // External upload succeeded - use JSON payload
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
          // External upload failed - send file to backend for local storage
          const submitData = new FormData();
          submitData.append('title', formData.title);
          submitData.append('subtitle', formData.subtitle);
          submitData.append('buttonText', formData.buttonText);
          submitData.append('buttonUrl', formData.buttonUrl);
          submitData.append('active', formData.active.toString());
          submitData.append('order', formData.order.toString());
          submitData.append('image', formData.image);

          if (selectedBanner) {
            await bannerAPI.update(selectedBanner.id, submitData as any);
            toast.success('Banner updated successfully');
          } else {
            await bannerAPI.create(submitData as any);
            toast.success('Banner created successfully');
          }
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
    const file = e.target.files?.[0];
    if (!file) {
      setFormData(prev => ({ ...prev, image: null }));
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPEG, PNG, or WebP)');
      e.target.value = '';
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('Image size must be less than 5MB');
      e.target.value = '';
      return;
    }

    // Check image dimensions
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      
      // Recommended banner size: 1920x1080 (16:9 ratio)
      const recommendedWidth = 1920;
      const recommendedHeight = 1080;
      const aspectRatio = img.width / img.height;
      const recommendedRatio = recommendedWidth / recommendedHeight;
      
      // Allow some tolerance in aspect ratio (±0.1)
      if (Math.abs(aspectRatio - recommendedRatio) > 0.1) {
        toast.error(
          `Banner dimensions should be ${recommendedWidth}x${recommendedHeight} (16:9 ratio).\n` +
          `Your image is ${img.width}x${img.height}.`,
          { duration: 5000 }
        );
        e.target.value = '';
        return;
      }
      
      // Warn if dimensions are too small
      if (img.width < 1280 || img.height < 720) {
        toast.error(
          `Image resolution too low. Minimum: 1280x720\nYour image: ${img.width}x${img.height}`,
          { duration: 4000 }
        );
        e.target.value = '';
        return;
      }
      
      // Success - show image info
      toast.success(
        `Image validated: ${img.width}x${img.height} (${(file.size / 1024 / 1024).toFixed(2)}MB)`,
        { duration: 3000 }
      );
      setFormData(prev => ({ ...prev, image: file, imageUrl: '' }));
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      toast.error('Failed to load image. Please try another file.');
      e.target.value = '';
    };
    
    img.src = objectUrl;
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
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null; // Prevent infinite loop
                  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2UwZTBlMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBOb3QgRm91bmQ8L3RleHQ+PC9zdmc+';
                }}
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
                    Banner Image *
                  </label>
                  <div className="space-y-2">
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3 mb-2">
                      <p className="text-xs text-blue-800 dark:text-blue-200 font-medium">
                        📐 Recommended Size: 1920x1080 pixels (16:9 ratio)
                      </p>
                      <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                        Minimum: 1280x720 | Maximum file size: 5MB | Formats: JPEG, PNG, WebP
                      </p>
                    </div>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      required={!selectedBanner && !formData.imageUrl}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/50 dark:file:text-blue-200"
                    />
                    {formData.image && (
                      <p className="text-xs text-green-600 dark:text-green-400">
                        ✓ {formData.image.name} selected
                      </p>
                    )}
                  </div>
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