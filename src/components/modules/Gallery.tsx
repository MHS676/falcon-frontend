import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { galleryAPI } from '../../services/api';
import toast from 'react-hot-toast';

interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  image: string;
  category: string;
  isFeatured: boolean;
  tags?: string[];
  createdAt: string;
}

interface GalleryProps {
  showFeaturedOnly?: boolean;
  maxItems?: number;
  categories?: string[];
}

const Gallery = ({ showFeaturedOnly = false, maxItems, categories }: GalleryProps) => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchGallery();
  }, []);

  useEffect(() => {
    filterItems();
  }, [items, selectedCategory, categories]);

  const fetchGallery = async () => {
    try {
      let response;
      if (showFeaturedOnly) {
        response = await galleryAPI.getFeatured();
      } else {
        response = await galleryAPI.getAll();
      }
      
      let galleryItems = response.data;
      
      // Apply max items limit if specified
      if (maxItems && galleryItems.length > maxItems) {
        galleryItems = galleryItems.slice(0, maxItems);
      }
      
      setItems(galleryItems);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(galleryItems.map((item: GalleryItem) => item.category))] as string[];
      setAvailableCategories(uniqueCategories);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching gallery:', error);
      toast.error('Failed to load gallery');
      setLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = items;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Filter by provided categories prop
    if (categories && categories.length > 0) {
      filtered = filtered.filter(item => categories.includes(item.category));
    }

    setFilteredItems(filtered);
  };

  const openModal = (item: GalleryItem) => {
    setSelectedImage(item);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="aspect-square bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Category Filter - only show if not filtering by specific categories */}
      {!categories && availableCategories.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 rounded-full transition-all duration-300 ${
              selectedCategory === 'All'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            All
          </button>
          {availableCategories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full transition-all duration-300 capitalize ${
                selectedCategory === category
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer"
            onClick={() => openModal(item)}
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                {item.description && (
                  <p className="text-sm opacity-90 line-clamp-2">{item.description}</p>
                )}
                <span className="inline-block mt-2 px-2 py-1 bg-white/20 rounded text-xs capitalize">
                  {item.category}
                </span>
              </div>
              <div className="absolute top-4 right-4">
                <MagnifyingGlassIcon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredItems.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No gallery items found.</p>
        </div>
      )}

      {/* Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90">
          <div className="relative max-w-4xl w-full max-h-full">
            <button
              onClick={closeModal}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <XMarkIcon className="w-8 h-8" />
            </button>
            <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
              <img
                src={selectedImage.image}
                alt={selectedImage.title}
                className="w-full h-auto max-h-[70vh] object-contain"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {selectedImage.title}
                </h3>
                {selectedImage.description && (
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {selectedImage.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm capitalize">
                    {selectedImage.category}
                  </span>
                  {selectedImage.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;