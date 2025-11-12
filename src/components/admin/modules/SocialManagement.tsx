import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { getSocialLinks, createSocialLink, updateSocialLink, deleteSocialLink } from '../../../services/api';
import toast from 'react-hot-toast';

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon?: string;
  order?: number;
  active?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface SocialFormData {
  platform: string;
  url: string;
  icon?: string;
  order?: number;
  active?: boolean;
}

const SocialManagement = () => {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<SocialFormData>({
    platform: '',
    url: '',
    icon: '',
    order: 0,
    active: false
  });

  const resetForm = () => {
    setFormData({
      platform: '',
      url: '',
      icon: '',
      order: 0,
      active: false
    });
    setEditingId(null);
    setShowForm(false);
  };

  const fetchSocialLinks = async () => {
    try {
      setLoading(true);
      const response = await getSocialLinks();
      setSocialLinks(response.data);
    } catch (error) {
      console.error('Error fetching social links:', error);
      toast.error('Failed to fetch social links');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSocialLinks();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        await updateSocialLink(editingId, formData);
        toast.success('Social link updated successfully');
      } else {
        await createSocialLink(formData);
        toast.success('Social link created successfully');
      }
      
      resetForm();
      fetchSocialLinks();
    } catch (error) {
      console.error('Error saving social link:', error);
      toast.error('Failed to save social link');
    }
  };

  const handleEdit = (socialLink: SocialLink) => {
    setFormData({
      platform: socialLink.platform,
      url: socialLink.url,
      icon: socialLink.icon,
      order: socialLink.order,
      active: socialLink.active
    });
    setEditingId(socialLink.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this social link?')) {
      return;
    }

    try {
      await deleteSocialLink(id);
      toast.success('Social link deleted successfully');
      fetchSocialLinks();
    } catch (error) {
      console.error('Error deleting social link:', error);
      toast.error('Failed to delete social link');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Social Links Management</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your social media links and presence
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          Add Social Link
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {editingId ? 'Edit Social Link' : 'Add New Social Link'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Platform Name
                </label>
                <input
                  type="text"
                  value={formData.platform}
                  onChange={(e) => setFormData(prev => ({ ...prev, platform: e.target.value }))}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., Facebook, Twitter, LinkedIn"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  URL
                </label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="https://..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Icon Class/URL
                </label>
                <input
                  type="text"
                  value={formData.icon || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., fab fa-facebook, /icons/twitter.svg"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active || false}
                  onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="active" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Active
                </label>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
                >
                  {editingId ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Social Links Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {socialLinks.map((link) => (
          <motion.div
            key={link.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  {link.icon && link.icon.startsWith('http') ? (
                    <img src={link.icon} alt={link.platform} className="w-6 h-6" />
                  ) : (
                    <i className={`${link.icon} text-lg text-gray-600 dark:text-gray-400`}></i>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{link.platform}</h3>
                  <div className="flex items-center gap-2">
                    <span className={`inline-block w-2 h-2 rounded-full ${
                      link.active ? 'bg-green-400' : 'bg-red-400'
                    }`}></span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {link.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handleEdit(link)}
                  className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(link.id)}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <a 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 break-all"
              >
                {link.url}
              </a>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Created: {new Date(link.createdAt).toLocaleDateString()}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {socialLinks.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-600 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No social links found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">Get started by creating your first social media link.</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Add Social Link
          </button>
        </div>
      )}
    </div>
  );
};

export default SocialManagement;