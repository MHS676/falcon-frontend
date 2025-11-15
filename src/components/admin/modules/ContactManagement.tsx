import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  EnvelopeIcon,
  XMarkIcon,
  CheckIcon,
  ClockIcon,
  UserIcon,
  PhoneIcon,
  CalendarIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { contactAPI } from '../../../services/api';
import toast from 'react-hot-toast';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'in-progress' | 'responded';
  createdAt: string;
}

const ContactManagement = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await contactAPI.getAll();
      setContacts(response.data);
      
      // Automatically mark all "new" contacts as "in-progress" when viewing the module
      const newContacts = response.data.filter((contact: Contact) => contact.status === 'new');
      if (newContacts.length > 0) {
        // Update all new contacts to in-progress in the background
        Promise.all(
          newContacts.map((contact: Contact) => {
            const formData = new FormData();
            formData.append('status', 'in-progress');
            return contactAPI.updateStatus(contact.id, formData);
          })
        ).then(() => {
          // Refresh contacts after marking as in-progress
          contactAPI.getAll().then(res => setContacts(res.data));
        }).catch(err => {
          console.error('Error auto-updating contact status:', err);
        });
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: Contact['status']) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('status', status);
      
      await contactAPI.updateStatus(id, formData);
      toast.success('Status updated successfully');
      fetchContacts();
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedContact) return;
    
    setLoading(true);
    try {
      await contactAPI.delete(selectedContact.id);
      toast.success('Contact deleted successfully');
      fetchContacts();
      setIsDeleteModalOpen(false);
      setSelectedContact(null);
    } catch (error: any) {
      console.error('Error deleting contact:', error);
      toast.error(error.response?.data?.message || 'Failed to delete contact');
    } finally {
      setLoading(false);
    }
  };

  const openViewModal = (contact: Contact) => {
    setSelectedContact(contact);
    setIsViewModalOpen(true);
    
    // Mark as in-progress if it's new
    if (contact.status === 'new') {
      handleStatusUpdate(contact.id, 'in-progress');
    }
  };

  const getStatusColor = (status: Contact['status']) => {
    switch (status) {
      case 'new':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'responded':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status: Contact['status']) => {
    switch (status) {
      case 'new':
        return <ClockIcon className="w-4 h-4" />;
      case 'in-progress':
        return <EyeIcon className="w-4 h-4" />;
      case 'responded':
        return <CheckIcon className="w-4 h-4" />;
      default:
        return <ClockIcon className="w-4 h-4" />;
    }
  };

  const filteredContacts = contacts.filter(contact => {
    if (filter === 'all') return true;
    return contact.status === filter;
  });

  if (loading && contacts.length === 0) {
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Contact Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage and respond to contact form submissions</p>
        </div>
        
        {/* Status Filter */}
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All</option>
            <option value="new">New</option>
            <option value="in-progress">In Progress</option>
            <option value="responded">Responded</option>
          </select>
        </div>
      </div>

      {/* Contacts List */}
      <div className="space-y-4">
        {filteredContacts.map((contact, index) => (
          <motion.div
            key={contact.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="flex items-center space-x-2">
                    <UserIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                      {contact.name}
                    </h3>
                  </div>
                  <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(contact.status)}`}>
                    {getStatusIcon(contact.status)}
                    <span>{contact.status}</span>
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                    <EnvelopeIcon className="w-4 h-4" />
                    <span>{contact.email}</span>
                  </div>
                  {contact.phone && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                      <PhoneIcon className="w-4 h-4" />
                      <span>{contact.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{new Date(contact.createdAt).toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="mb-3">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">Subject:</h4>
                  <p className="text-gray-700 dark:text-gray-300">{contact.subject}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">Message:</h4>
                  <p className="text-gray-600 dark:text-gray-300 line-clamp-2">
                    {contact.message}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col space-y-2 ml-4">
                <button
                  onClick={() => openViewModal(contact)}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                >
                  View Full
                </button>
                
                <div className="flex flex-col space-y-1">
                  {contact.status === 'new' && (
                    <button
                      onClick={() => handleStatusUpdate(contact.id, 'in-progress')}
                      className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                      Start Review
                    </button>
                  )}
                  
                  {(contact.status === 'in-progress' || contact.status === 'new') && (
                    <button
                      onClick={() => handleStatusUpdate(contact.id, 'responded')}
                      className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                    >
                      Mark Responded
                    </button>
                  )}
                  
                  <button
                    onClick={() => {
                      setSelectedContact(contact);
                      setIsDeleteModalOpen(true);
                    }}
                    className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredContacts.length === 0 && (
        <div className="text-center py-12">
          <EnvelopeIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {filter === 'all' ? 'No contacts found' : `No ${filter} contacts found`}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {filter === 'all' 
              ? 'Contact form submissions will appear here'
              : `No contacts with ${filter} status at the moment`
            }
          </p>
        </div>
      )}

      {/* View Modal */}
      {isViewModalOpen && selectedContact && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black opacity-50" onClick={() => setIsViewModalOpen(false)}></div>
            <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Contact Details</h2>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(selectedContact.status)}`}>
                    {getStatusIcon(selectedContact.status)}
                    <span>{selectedContact.status}</span>
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(selectedContact.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                    <p className="text-gray-900 dark:text-white">{selectedContact.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                    <a
                      href={`mailto:${selectedContact.email}`}
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {selectedContact.email}
                    </a>
                  </div>
                  {selectedContact.phone && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                      <a
                        href={`tel:${selectedContact.phone}`}
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {selectedContact.phone}
                      </a>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                  <p className="text-gray-900 dark:text-white">{selectedContact.subject}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{selectedContact.message}</p>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <a
                    href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject}&body=Hi ${selectedContact.name},%0A%0A`}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-center"
                  >
                    Reply via Email
                  </a>
                  
                  {selectedContact.status !== 'responded' && (
                    <button
                      onClick={() => {
                        handleStatusUpdate(selectedContact.id, 'responded');
                        setIsViewModalOpen(false);
                      }}
                      className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                    >
                      Mark Responded
                    </button>
                  )}
                </div>
              </div>
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
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Delete Contact</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete the message from "{selectedContact?.name}"? This action cannot be undone.
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

export default ContactManagement;