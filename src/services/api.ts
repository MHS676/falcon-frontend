import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const login = (data: any) => api.post('/auth/login', data);
export const register = (data: any) => api.post('/auth/register', data);

// Banner
export const getBanners = () => api.get('/banner');
export const getActiveBanners = () => api.get('/banner/active');
export const createBanner = (data: any) => api.post('/banner', data);
export const updateBanner = (id: string, data: any) => api.patch(`/banner/${id}`, data);
export const deleteBanner = (id: string) => api.delete(`/banner/${id}`);

// Settings
export const getSettings = () => api.get('/settings');
export const getPublicSettings = () => api.get('/settings/public');
export const getSetting = (key: string) => api.get(`/settings/${key}`);
export const createSetting = (data: any) => api.post('/settings', data);
export const updateSetting = (key: string, data: any) => api.patch(`/settings/${key}`, data);
export const deleteSetting = (key: string) => api.delete(`/settings/${key}`);

// Projects
export const getProjects = () => api.get('/projects');
export const getFeaturedProjects = () => api.get('/projects/featured');
export const getProject = (id: string) => api.get(`/projects/${id}`);
export const createProject = (data: any) => api.post('/projects', data);
export const updateProject = (id: string, data: any) => api.patch(`/projects/${id}`, data);
export const deleteProject = (id: string) => api.delete(`/projects/${id}`);

// Contact
export const sendContact = (data: any) => api.post('/contact', data);
export const getContacts = () => api.get('/contact');
export const updateContactStatus = (id: string, status: string) => 
  api.patch(`/contact/${id}/status`, { status });
export const deleteContact = (id: string) => api.delete(`/contact/${id}`);

// Skills
export const getSkills = (category?: string) => 
  api.get('/skills', { params: { category } });
export const createSkill = (data: any) => api.post('/skills', data);
export const deleteSkill = (id: string) => api.delete(`/skills/${id}`);

// Experience
export const getExperience = () => api.get('/experience');
export const createExperience = (data: any) => api.post('/experience', data);
export const deleteExperience = (id: string) => api.delete(`/experience/${id}`);

// Blog
export const getBlogs = () => api.get('/blog');
export const getBlog = (slug: string) => api.get(`/blog/${slug}`);
export const createBlog = (data: any) => api.post('/blog', data);
export const deleteBlog = (id: string) => api.delete(`/blog/${id}`);

// Social Links
export const getSocialLinks = () => api.get('/social');
export const getActiveSocialLinks = () => api.get('/social/active');
export const createSocialLink = (data: any) => api.post('/social', data);
export const updateSocialLink = (id: string, data: any) => api.patch(`/social/${id}`, data);
export const deleteSocialLink = (id: string) => api.delete(`/social/${id}`);

export default api;
