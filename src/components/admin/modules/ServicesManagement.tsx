import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  PhotoIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  TagIcon,
} from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import { servicesAPI } from '../../../services/api';
import toast from 'react-hot-toast';

interface Service {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  icon?: string;
  image?: string;
  features: string[];
  price?: { min: number; max?: number; currency: string; type: string } | null;
  category: string;
  // API returns 'active'/'featured' but we also support isActive/isFeatured
  active?: boolean;
  isActive?: boolean;
  featured?: boolean;
  isFeatured?: boolean;
  tags?: string[];
  deliverables?: string[];
  timeline?: string;
}

const isServiceActive = (s: Service) => s.active ?? s.isActive ?? false;
const isServiceFeatured = (s: Service) => s.featured ?? s.isFeatured ?? false;

const emptyForm = {
  title: '',
  description: '',
  shortDescription: '',
  category: '',
  features: '',
  tags: '',
  deliverables: '',
  timeline: '',
  priceMin: '',
  priceMax: '',
  priceCurrency: 'BDT',
  priceType: 'fixed',
  isActive: true,
  isFeatured: false,
  image: null as File | null,
};

const ServicesManagement = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({ ...emptyForm });

  useEffect(() => { fetchServices(); }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await servicesAPI.getAll();
      setServices(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to load services');
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setSelectedService(null);
    setFormData({ ...emptyForm });
    setImagePreview(null);
    setIsModalOpen(true);
  };

  const openEditModal = (service: Service) => {
    setSelectedService(service);
    setFormData({
      title: service.title,
      description: service.description,
      shortDescription: service.shortDescription || '',
      category: service.category || '',
      features: (service.features || []).join('\n'),
      tags: (service.tags || []).join(', '),
      deliverables: (service.deliverables || []).join('\n'),
      timeline: service.timeline || '',
      priceMin: service.price?.min?.toString() || '',
      priceMax: service.price?.max?.toString() || '',
      priceCurrency: service.price?.currency || 'BDT',
      priceType: service.price?.type || 'fixed',
      isActive: isServiceActive(service),
      isFeatured: isServiceFeatured(service),
      image: null,
    });
    setImagePreview(service.image || null);
    setIsModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }
    setFormData(prev => ({ ...prev, image: file }));
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) { toast.error('Title is required'); return; }
    if (!formData.description.trim()) { toast.error('Description is required'); return; }

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('title', formData.title.trim());
      fd.append('description', formData.description.trim());
      if (formData.shortDescription) fd.append('shortDescription', formData.shortDescription.trim());
      if (formData.category) fd.append('category', formData.category.trim());
      if (formData.timeline) fd.append('timeline', formData.timeline.trim());
      fd.append('isActive', String(formData.isActive));
      fd.append('isFeatured', String(formData.isFeatured));

      const featuresArr = formData.features.split('\n').map(f => f.trim()).filter(Boolean);
      fd.append('features', JSON.stringify(featuresArr));

      const tagsArr = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
      fd.append('tags', JSON.stringify(tagsArr));

      const deliverablesArr = formData.deliverables.split('\n').map(d => d.trim()).filter(Boolean);
      if (deliverablesArr.length) fd.append('deliverables', JSON.stringify(deliverablesArr));

      if (formData.priceMin) {
        const price = {
          min: parseFloat(formData.priceMin),
          max: formData.priceMax ? parseFloat(formData.priceMax) : undefined,
          currency: formData.priceCurrency,
          type: formData.priceType,
        };
        fd.append('price', JSON.stringify(price));
      }

      if (formData.image) fd.append('image', formData.image);

      if (selectedService) {
        await servicesAPI.update(selectedService.id, fd);
        toast.success('Service updated successfully!');
      } else {
        await servicesAPI.create(fd);
        toast.success('Service created successfully!');
      }

      await fetchServices();
      setIsModalOpen(false);
    } catch (error: any) {
      console.error('Submit error:', error);
      toast.error(error?.response?.data?.message || 'Failed to save service');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedService) return;
    setSubmitting(true);
    try {
      await servicesAPI.delete(selectedService.id);
      toast.success('Service deleted');
      await fetchServices();
      setIsDeleteModalOpen(false);
      setSelectedService(null);
    } catch {
      toast.error('Failed to delete service');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async (service: Service) => {
    try {
      const cur = isServiceActive(service);
      const fd = new FormData();
      fd.append('active', String(!cur));
      await servicesAPI.update(service.id, fd);
      setServices(prev => prev.map(s => s.id === service.id ? { ...s, active: !cur, isActive: !cur } : s));
      toast.success(`Service ${!cur ? 'activated' : 'deactivated'}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const filtered = services.filter(s => {
    const matchSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.category ?? '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchFilter = filterActive === 'all' || (filterActive === 'active' ? isServiceActive(s) : !isServiceActive(s));
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Falcon Security Services</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage Falcon Security Limited's professional security solutions</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-colors shadow"
        >
          <PlusIcon className="w-5 h-5" /> Add Service
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search by title or category..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <div className="flex gap-2">
          {(['all', 'active', 'inactive'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilterActive(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${
                filterActive === f
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total', value: services.length, color: 'text-gray-700 dark:text-gray-200' },
          { label: 'Active', value: services.filter(s => isServiceActive(s)).length, color: 'text-green-600' },
          { label: 'Featured', value: services.filter(s => isServiceFeatured(s)).length, color: 'text-amber-500' },
        ].map(stat => (
          <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center shadow-sm">
            <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-600">
          <ShieldCheckIcon className="w-14 h-14 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No services found</p>
          <button onClick={openAddModal} className="mt-4 text-green-600 font-semibold hover:underline text-sm">+ Add your first service</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
            >
              {/* Image */}
              <div className="relative h-36 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 overflow-hidden">
                {service.image ? (
                  <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShieldCheckIcon className="w-14 h-14 text-gray-300 dark:text-gray-500" />
                  </div>
                )}
                {isServiceFeatured(service) && (
                  <span className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <StarIcon className="w-2.5 h-2.5" /> Featured
                  </span>
                )}
                <span className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${isServiceActive(service) ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                  {isServiceActive(service) ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Body */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-tight line-clamp-1">{service.title}</h3>
                  {service.category && (
                    <span className="text-[10px] bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full whitespace-nowrap font-medium flex-shrink-0">
                      {(service.category ?? '').slice(0, 14)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
                  {service.shortDescription || service.description}
                </p>
                {service.price && (
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-1">
                    <TagIcon className="w-3.5 h-3.5" />
                    {service.price.currency} {service.price.min}{service.price.max ? ` – ${service.price.max}` : ''}
                  </p>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-1 border-t border-gray-100 dark:border-gray-700">
                  <button
                    onClick={() => toggleActive(service)}
                    className={`flex-1 text-xs py-1.5 rounded-lg font-medium transition-colors ${
                      isServiceActive(service)
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200'
                    }`}
                  >
                    {isServiceActive(service) ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => openEditModal(service)}
                    className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-600 hover:bg-amber-100 transition-colors"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => { setSelectedService(service); setIsDeleteModalOpen(true); }}
                    className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 bg-black/50 backdrop-blur-sm overflow-y-auto"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl mb-8"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {selectedService ? 'Edit Service' : 'Add New Service'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <XMarkIcon className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[78vh] overflow-y-auto">

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Service Image</label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="relative cursor-pointer group rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-green-500 transition-colors overflow-hidden"
                    style={{ height: 180 }}
                  >
                    {imagePreview ? (
                      <>
                        <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <p className="text-white text-sm font-semibold flex items-center gap-2">
                            <PhotoIcon className="w-5 h-5" /> Change Image
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-gray-400">
                        <PhotoIcon className="w-12 h-12 mb-2" />
                        <p className="text-sm font-medium">Click to upload image</p>
                        <p className="text-xs mt-1">JPG, PNG, WebP — max 5MB</p>
                      </div>
                    )}
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </div>

                {/* Title & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Title *</label>
                    <input
                      required
                      type="text"
                      value={formData.title}
                      onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                      placeholder="e.g. Manned Guard Service"
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Category</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={e => setFormData(p => ({ ...p, category: e.target.value }))}
                      placeholder="e.g. Physical Security"
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                {/* Short Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Short Description</label>
                  <input
                    type="text"
                    value={formData.shortDescription}
                    onChange={e => setFormData(p => ({ ...p, shortDescription: e.target.value }))}
                    placeholder="Brief tagline shown on cards"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Full Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Full Description *</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                    placeholder="Detailed description of the service..."
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  />
                </div>

                {/* Features & Deliverables */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Features <span className="font-normal text-gray-400">(one per line)</span>
                    </label>
                    <textarea
                      rows={4}
                      value={formData.features}
                      onChange={e => setFormData(p => ({ ...p, features: e.target.value }))}
                      placeholder={"24/7 monitoring\nArmed personnel\nGPS tracking"}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Deliverables <span className="font-normal text-gray-400">(one per line)</span>
                    </label>
                    <textarea
                      rows={4}
                      value={formData.deliverables}
                      onChange={e => setFormData(p => ({ ...p, deliverables: e.target.value }))}
                      placeholder={"Monthly report\nIncident logs\nSite assessment"}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                    />
                  </div>
                </div>

                {/* Tags & Timeline */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Tags <span className="font-normal text-gray-400">(comma-separated)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={e => setFormData(p => ({ ...p, tags: e.target.value }))}
                      placeholder="security, guard, patrol"
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Timeline</label>
                    <input
                      type="text"
                      value={formData.timeline}
                      onChange={e => setFormData(p => ({ ...p, timeline: e.target.value }))}
                      placeholder="e.g. 24/7 ongoing"
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                {/* Pricing */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Pricing (optional)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Min Price</label>
                      <input
                        type="number"
                        value={formData.priceMin}
                        onChange={e => setFormData(p => ({ ...p, priceMin: e.target.value }))}
                        placeholder="0"
                        min={0}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Max Price</label>
                      <input
                        type="number"
                        value={formData.priceMax}
                        onChange={e => setFormData(p => ({ ...p, priceMax: e.target.value }))}
                        placeholder="optional"
                        min={0}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Currency</label>
                      <select
                        value={formData.priceCurrency}
                        onChange={e => setFormData(p => ({ ...p, priceCurrency: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="BDT">BDT</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Type</label>
                      <select
                        value={formData.priceType}
                        onChange={e => setFormData(p => ({ ...p, priceType: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="fixed">Fixed</option>
                        <option value="hourly">Hourly</option>
                        <option value="project">Project</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Toggles */}
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <div
                      onClick={() => setFormData(p => ({ ...p, isActive: !p.isActive }))}
                      className={`relative w-10 h-5 rounded-full transition-colors ${formData.isActive ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${formData.isActive ? 'translate-x-5' : ''}`} />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Active</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <div
                      onClick={() => setFormData(p => ({ ...p, isFeatured: !p.isFeatured }))}
                      className={`relative w-10 h-5 rounded-full transition-colors ${formData.isFeatured ? 'bg-amber-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${formData.isFeatured ? 'translate-x-5' : ''}`} />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Featured</span>
                  </label>
                </div>

                {/* Submit */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {submitting ? (
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    ) : (
                      <CheckCircleIcon className="w-5 h-5" />
                    )}
                    {submitting ? 'Saving...' : selectedService ? 'Update Service' : 'Create Service'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center"
            >
              <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <ExclamationTriangleIcon className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Delete Service?</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                "<span className="font-semibold text-gray-700 dark:text-gray-300">{selectedService.title}</span>" will be permanently deleted.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors disabled:opacity-60"
                >
                  {submitting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ServicesManagement;
