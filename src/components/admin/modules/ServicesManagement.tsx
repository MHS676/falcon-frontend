import React, { useState, useEffect } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { getServices } from '../../../services/api';
import toast from 'react-hot-toast';

interface Service {
  id: number;
  title: string;
  shortDescription: string;
  isActive: boolean;
  createdAt: string;
}

const ServicesManagement: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await getServices();
      setServices(response.data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Falcon Security Services</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage Falcon Security Limited's professional security solutions
          </p>
        </div>
        <button
          onClick={() => toast('Add service functionality coming soon')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          Add Service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
          >
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">{service.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{service.shortDescription}</p>
            <div className="flex items-center gap-2">
              <span className={`inline-block w-2 h-2 rounded-full $&#123;
                service.isActive ? 'bg-green-400' : 'bg-red-400'
              &#125;`}></span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {service.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {services.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No security services found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">Get started by adding your first security service offering.</p>
          <button
            onClick={() => toast('Add service functionality coming soon')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Add Service
          </button>
        </div>
      )}
    </div>
  );
};

export default ServicesManagement;