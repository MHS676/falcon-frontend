import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Public API instance (no authentication required)
const publicApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Admin API instance (authentication required)
const adminApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to admin requests
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Legacy api instance for backward compatibility
const api = adminApi;

// Auth
export const login = (data: any) => publicApi.post('/auth/login', data);
export const register = (data: any) => publicApi.post('/auth/register', data);

// Banner - Public reads, Admin writes
export const getBanners = () => publicApi.get('/banner');
export const getActiveBanners = () => publicApi.get('/banner/active');
export const createBanner = (data: any) => adminApi.post('/banner', data);
export const updateBanner = (id: string, data: any) => adminApi.patch(`/banner/${id}`, data);
export const deleteBanner = (id: string) => adminApi.delete(`/banner/${id}`);

// Settings - Public reads, Admin writes
export const getSettings = () => publicApi.get('/settings');
export const getPublicSettings = () => publicApi.get('/settings/public');
export const getSetting = (key: string) => publicApi.get(`/settings/${key}`);
export const createSetting = (data: any) => adminApi.post('/settings', data);
export const updateSetting = (key: string, data: any) => adminApi.patch(`/settings/${key}`, data);
export const deleteSetting = (key: string) => adminApi.delete(`/settings/${key}`);

// Projects - Public reads, Admin writes
export const getProjects = () => publicApi.get('/projects');
export const getFeaturedProjects = () => publicApi.get('/projects/featured');
export const getProject = (id: string) => publicApi.get(`/projects/${id}`);
export const createProject = (data: any) => adminApi.post('/projects', data);
export const updateProject = (id: string, data: any) => adminApi.patch(`/projects/${id}`, data);
export const deleteProject = (id: string) => adminApi.delete(`/projects/${id}`);

// Contact - Public can send, Admin manages
export const sendContact = (data: any) => publicApi.post('/contact', data);
export const getContacts = () => adminApi.get('/contact');
export const createContact = (data: any) => adminApi.post('/contact', data);
export const updateContact = (id: string, data: any) => adminApi.patch(`/contact/${id}`, data);
export const updateContactStatus = (id: string, status: string) => 
  adminApi.patch(`/contact/${id}/status`, { status });
export const deleteContact = (id: string) => adminApi.delete(`/contact/${id}`);

// Experience (Admin only)
export const getExperience = () => adminApi.get('/experience');
export const createExperience = (data: any) => adminApi.post('/experience', data);
export const deleteExperience = (id: string) => adminApi.delete(`/experience/${id}`);

// Blog - Public reads, Admin writes
export const getBlogs = () => publicApi.get('/blog');
export const getBlog = (slug: string) => publicApi.get(`/blog/${slug}`);
export const createBlog = (data: any) => adminApi.post('/blog', data);
export const updateBlog = (id: string, data: any) => adminApi.patch(`/blog/${id}`, data);
export const deleteBlog = (id: string) => adminApi.delete(`/blog/${id}`);

// Social Links - Public reads, Admin writes
export const getSocialLinks = () => publicApi.get('/social');
export const getActiveSocialLinks = () => publicApi.get('/social/active');
export const createSocialLink = (data: any) => adminApi.post('/social', data);
export const updateSocialLink = (id: string, data: any) => adminApi.patch(`/social/${id}`, data);
export const deleteSocialLink = (id: string) => adminApi.delete(`/social/${id}`);

// Guards - Public reads, Admin writes
export const getGuards = () => publicApi.get('/guards');
export const getGuard = (id: string) => publicApi.get(`/guards/${id}`);
export const createGuard = (data: any) => adminApi.post('/guards', data);
export const updateGuard = (id: string, data: any) => adminApi.patch(`/guards/${id}`, data);
export const deleteGuard = (id: string) => adminApi.delete(`/guards/${id}`);
export const getGuardsStats = () => publicApi.get('/guards/stats');

// Services - Public reads, Admin writes
export const getServices = () => publicApi.get('/service');
export const getService = (id: string) => publicApi.get(`/service/${id}`);
export const createService = (data: any) => adminApi.post('/service', data);
export const updateService = (id: string, data: any) => adminApi.patch(`/service/${id}`, data);
export const deleteService = (id: string) => adminApi.delete(`/service/${id}`);
export const getActiveServices = () => publicApi.get('/service/active');

// Clients - Public reads, Admin writes
export const getClients = () => publicApi.get('/client');
export const getClient = (id: string) => publicApi.get(`/client/${id}`);
export const createClient = (data: any) => adminApi.post('/client', data);
export const updateClient = (id: string, data: any) => adminApi.patch(`/client/${id}`, data);
export const deleteClient = (id: string) => adminApi.delete(`/client/${id}`);
export const getFeaturedClients = () => publicApi.get('/client/featured');

// Gallery - Public reads, Admin writes
export const getGallery = () => publicApi.get('/gallery');
export const getGalleryItem = (id: string) => publicApi.get(`/gallery/${id}`);
export const createGalleryItem = (data: any) => adminApi.post('/gallery', data);
export const updateGalleryItem = (id: string, data: any) => adminApi.patch(`/gallery/${id}`, data);
export const deleteGalleryItem = (id: string) => adminApi.delete(`/gallery/${id}`);
export const getFeaturedGallery = () => publicApi.get('/gallery/featured');

export default api;
