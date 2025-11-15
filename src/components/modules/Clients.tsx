import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { StarIcon } from '@heroicons/react/24/solid';
import { clientsAPI } from '../../services/api';
import toast from 'react-hot-toast';

interface Client {
  id: string;
  name: string;
  company: string;
  position: string;
  testimonial: string;
  image?: string;
  rating: number;
  projectType: string;
  featured: boolean;
  active: boolean;
  createdAt: string;
}

interface ClientsProps {
  showFeaturedOnly?: boolean;
  maxItems?: number;
  layout?: 'grid' | 'carousel';
}

const Clients = ({
  showFeaturedOnly = true,
  maxItems,
  layout = 'grid'
}: ClientsProps) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      let response;
      if (showFeaturedOnly) {
        response = await clientsAPI.getFeatured();
      } else {
        response = await clientsAPI.getActive();
      }

      let clientsList = response.data;

      if (!Array.isArray(clientsList)) {
        console.warn('API returned non-array data:', clientsList);
        clientsList = [];
      }

      // Apply maxItems limit if specified
      if (maxItems && clientsList.length > maxItems) {
        clientsList = clientsList.slice(0, maxItems);
      }

      setClients(clientsList);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast.error('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, index) => (
          <StarIcon
            key={index}
            className={`h-5 w-5 ${
              index < rating
                ? 'text-yellow-400'
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No testimonials available yet.</p>
      </div>
    );
  }

  return (
    <div className={`grid gap-8 ${
      layout === 'grid' 
        ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
        : 'grid-cols-1'
    }`}>
      {clients.map((client, index) => (
        <motion.div
          key={client.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
        >
          {/* Rating */}
          <div className="mb-4">
            {renderStars(client.rating)}
          </div>

          {/* Testimonial */}
          <p className="text-gray-700 dark:text-gray-300 mb-6 italic">
            "{client.testimonial}"
          </p>

          {/* Client Info */}
          <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            {client.image && (
              <img
                src={client.image}
                alt={client.name}
                className="h-12 w-12 rounded-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(client.name)}&background=3b82f6&color=fff`;
                }}
              />
            )}
            {!client.image && (
              <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                {client.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {client.name}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {client.position}
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                {client.company}
              </p>
            </div>
          </div>

          {/* Project Type Badge */}
          {client.projectType && (
            <div className="mt-4">
              <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {client.projectType}
              </span>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default Clients;
