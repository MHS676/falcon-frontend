import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
const EXTERNAL_UPLOAD_BASE: string | undefined =
  (import.meta as any).env?.VITE_IMAGE_UPLOAD_SERVICE_URL ||
  (import.meta as any).env?.IMAGE_UPLOAD_SERVICE_URL;

// Main API instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // For FormData, let axios set the Content-Type with boundary automatically
    // Don't override it or multipart uploads will fail
    if (config.data instanceof FormData) {
      // Remove any Content-Type header to let axios set it with proper boundary
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      // Redirect to login if not already there
      if (!window.location.pathname.includes('/admin/login')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// Helper function to create FormData from object
export const createFormData = (data: Record<string, any>): FormData => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (item instanceof File) {
            formData.append(key, item);
          } else {
            formData.append(`${key}[${index}]`, item.toString());
          }
        });
      } else {
        formData.append(key, value.toString());
      }
    }
  });
  return formData;
};

// Try to upload an image to an external upload service (if configured)
export const tryExternalImageUpload = async (
  file: File,
  folder?: string
): Promise<string | null> => {
  if (!EXTERNAL_UPLOAD_BASE) return null;

  const base = EXTERNAL_UPLOAD_BASE.replace(/\/$/, '');
  // Common conventions: '/upload' endpoint and 'file' field; allow 'image' fallback
  const urlCandidates = [`${base}/upload`, base];

  const form = new FormData();
  form.append('file', file);
  if (folder) form.append('folder', folder);

  let lastError: any = null;
  for (const url of urlCandidates) {
    try {
      const res = await axios.post(url, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: false,
      });
      const data = res?.data ?? {};
      const imageUrl =
        data.url || data.secure_url || data.location || data.imageUrl || data.result?.url || res.headers?.location;
      if (typeof imageUrl === 'string' && imageUrl.startsWith('http')) {
        return imageUrl;
      }
    } catch (err: any) {
      lastError = err;
      // try next candidate
    }
  }
  if (lastError) {
    console.error('External image upload failed:', lastError);
  }
  return null;
};

// Auth API
export const authAPI = {
  login: (data: FormData) => api.post('/auth/login', data),
  register: (data: FormData) => api.post('/auth/register', data),
};

// Banner API
export const bannerAPI = {
  create: (data: FormData) => api.post('/banner', data),
  getAll: () => api.get('/banner'),
  getActive: () => api.get('/banner/active'),
  getById: (id: string) => api.get(`/banner/${id}`),
  update: (id: string, data: FormData) => api.patch(`/banner/${id}`, data),
  delete: (id: string) => api.delete(`/banner/${id}`),
};

// Gallery API
export const galleryAPI = {
  create: (data: FormData) => api.post('/gallery', data),
  getAll: () => api.get('/gallery'),
  getFeatured: () => api.get('/gallery/featured'),
  getById: (id: string) => api.get(`/gallery/${id}`),
  update: (id: string, data: FormData) => api.patch(`/gallery/${id}`, data),
  delete: (id: string) => api.delete(`/gallery/${id}`),
};

// Projects API
export const projectsAPI = {
  create: (data: FormData) => api.post('/projects', data),
  getAll: () => api.get('/projects'),
  getFeatured: () => api.get('/projects/featured'),
  getById: (id: string) => api.get(`/projects/${id}`),
  update: (id: string, data: FormData) => api.patch(`/projects/${id}`, data),
  delete: (id: string) => api.delete(`/projects/${id}`),
};

// Blog API
export const blogAPI = {
  create: (data: FormData) => api.post('/blog', data),
  getAll: () => api.get('/blog'),
  getBySlug: (slug: string) => api.get(`/blog/${slug}`),
  update: (id: string, data: FormData) => api.patch(`/blog/${id}`, data),
  delete: (id: string) => api.delete(`/blog/${id}`),
};

// Contact API
export const contactAPI = {
  submit: (data: any) => api.post('/contact', data),
  getAll: () => api.get('/contact'),
  getUnreadCount: () => api.get('/contact/unread/count'),
  getById: (id: string) => api.get(`/contact/${id}`),
  updateStatus: (id: string, data: any) => api.patch(`/contact/${id}/status`, data),
  delete: (id: string) => api.delete(`/contact/${id}`),
};

// Social Links API
export const socialAPI = {
  create: (data: any) => api.post('/social', data),
  getAll: () => api.get('/social'),
  getActive: () => api.get('/social/active'),
  getById: (id: string) => api.get(`/social/${id}`),
  update: (id: string, data: any) => api.patch(`/social/${id}`, data),
  delete: (id: string) => api.delete(`/social/${id}`),
};

// Settings API
export const settingsAPI = {
  create: (data: any) => api.post('/settings', data),
  getAll: () => api.get('/settings'),
  getPublic: () => api.get('/settings/public'),
  getByKey: (key: string) => api.get(`/settings/${key}`),
  update: (key: string, data: any) => api.patch(`/settings/${key}`, data),
  delete: (key: string) => api.delete(`/settings/${key}`),
};

// Services API
export const servicesAPI = {
  create: (data: FormData) => api.post('/service', data),
  getAll: () => api.get('/service'),
  getActive: () => api.get('/service/active'),
  getFeatured: () => api.get('/service/featured'),
  getById: (id: string) => api.get(`/service/${id}`),
  update: (id: string, data: FormData) => api.patch(`/service/${id}`, data),
  delete: (id: string) => api.delete(`/service/${id}`),
};

// Upload API
export const uploadAPI = {
  uploadImage: (data: FormData, folder?: string) => {
    const url = folder ? `/upload/image?folder=${folder}` : '/upload/image';
    return api.post(url, data);
  },
  uploadImages: (data: FormData, folder?: string) => {
    const url = folder ? `/upload/images?folder=${folder}` : '/upload/images';
    return api.post(url, data);
  },
  uploadDocument: (data: FormData, folder?: string) => {
    const url = folder ? `/upload/document?folder=${folder}` : '/upload/document';
    return api.post(url, data);
  },
  deleteFile: (publicId: string) => api.delete(`/upload/${publicId}`),
  getOptimized: (params: {
    publicId: string;
    width?: number;
    height?: number;
    quality?: string;
    format?: string;
  }) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) query.append(key, value.toString());
    });
    return api.get(`/upload/optimize?${query.toString()}`);
  },
};

// Clients API
export const clientsAPI = {
  create: (data: FormData) => api.post('/client', data),
  getAll: () => api.get('/client'),
  getActive: () => api.get('/client/active'),
  getFeatured: () => api.get('/client/featured'),
  getById: (id: string) => api.get(`/client/${id}`),
  update: (id: string, data: FormData) => api.patch(`/client/${id}`, data),
  delete: (id: string) => api.delete(`/client/${id}`),
};

// Career API
export const careerAPI = {
  create: (data: FormData) => api.post('/career', data),
  getAll: () => api.get('/career'),
  getActive: () => api.get('/career/active'),
  getFeatured: () => api.get('/career/featured'),
  getById: (id: string) => api.get(`/career/${id}`),
  getPublicById: (id: string) => api.get(`/career/public/${id}`),
  apply: (data: FormData) => api.post('/career/apply', data),
  getStats: () => api.get('/career/stats'),
  getAllApplications: (careerId?: string) => {
    const url = careerId ? `/career/applications?careerId=${careerId}` : '/career/applications';
    return api.get(url);
  },
  getApplication: (id: string) => api.get(`/career/applications/${id}`),
  updateApplicationStatus: (id: string, status: string) => {
    const data = new FormData();
    data.append('status', status);
    return api.patch(`/career/applications/${id}/status`, data);
  },
  deleteApplication: (id: string) => api.delete(`/career/applications/${id}`),
  update: (id: string, data: FormData) => api.patch(`/career/${id}`, data),
  delete: (id: string) => api.delete(`/career/${id}`),
};

// Guards API
export const guardsAPI = {
  create: (data: FormData) => api.post('/guards', data),
  getAll: () => api.get('/guards'),
  getStats: () => api.get('/guards/stats'),
  getById: (id: string) => api.get(`/guards/${id}`),
  update: (id: string, data: FormData) => api.patch(`/guards/${id}`, data),
  delete: (id: string) => api.delete(`/guards/${id}`),
};

// Messaging API
export const messagingAPI = {
  getAllSessions: () => api.get('/messaging/sessions'),
  getSessionMessages: (sessionId: string) => api.get(`/messaging/session/${sessionId}/messages`),
  getSessionByToken: (sessionToken: string) => api.get(`/messaging/session/token/${sessionToken}`),
  markAsRead: (sessionId: string) => api.patch(`/messaging/session/${sessionId}/read`),
  closeSession: (sessionId: string) => api.patch(`/messaging/session/${sessionId}/close`),
  getUnreadCount: () => api.get('/messaging/unread/count'),
  sendAdminReply: (data: any) => api.post('/messaging/admin/reply', data),
};

// Admin Management API
export const adminAPI = {
  getAll: () => api.get('/auth/admins'),
  getById: (id: string) => api.get(`/auth/admins/${id}`),
  create: (data: any) => api.post('/auth/admins', data),
  update: (id: string, data: any) => api.patch(`/auth/admins/${id}`, data),
  delete: (id: string) => api.delete(`/auth/admins/${id}`),
  changePassword: (data: any) => api.post('/auth/change-password', data),
  forgotPassword: (data: any) => api.post('/auth/forgot-password', data),
  resetPassword: (data: any) => api.post('/auth/reset-password', data),
  getProfile: () => api.get('/auth/profile'),
};

// Employee API
export const employeeAPI = {
  create: (data: FormData) => api.post('/employee', data),
  getAll: () => api.get('/employee'),
  getActive: () => api.get('/employee/active'),
  getStats: () => api.get('/employee/stats'),
  getByDepartment: (department: string) => api.get(`/employee/department/${department}`),
  getByStatus: (status: string) => api.get(`/employee/status/${status}`),
  getByEmployeeId: (employeeId: string) => api.get('/employee/search', { params: { employeeId } }),
  getById: (id: string) => api.get(`/employee/${id}`),
  update: (id: string, data: FormData) => api.patch(`/employee/${id}`, data),
  delete: (id: string) => api.delete(`/employee/${id}`),
};

// Legacy functions for backward compatibility
// The backend expects JSON for authentication routes (email/password).
// Send a JSON body for login rather than FormData to avoid 400 Bad Request
// from servers that validate JSON payloads.
export const login = (data: any) => api.post('/auth/login', data);
export const register = (data: any) => authAPI.register(createFormData(data));
export const getBanners = () => bannerAPI.getAll();
export const getActiveBanners = () => bannerAPI.getActive();
export const createBanner = (data: any) => bannerAPI.create(createFormData(data));
export const updateBanner = (id: string, data: any) => bannerAPI.update(id, createFormData(data));
export const deleteBanner = (id: string) => bannerAPI.delete(id);
export const getSettings = () => settingsAPI.getAll();
export const getPublicSettings = () => settingsAPI.getPublic();
export const getSetting = (key: string) => settingsAPI.getByKey(key);
export const createSetting = (data: any) => settingsAPI.create(data);
export const updateSetting = (key: string, data: any) => settingsAPI.update(key, data);
export const deleteSetting = (key: string) => settingsAPI.delete(key);
export const getProjects = () => projectsAPI.getAll();
export const getFeaturedProjects = () => projectsAPI.getFeatured();
export const getProject = (id: string) => projectsAPI.getById(id);
export const createProject = (data: any) => projectsAPI.create(createFormData(data));
export const updateProject = (id: string, data: any) => projectsAPI.update(id, createFormData(data));
export const deleteProject = (id: string) => projectsAPI.delete(id);
export const sendContact = (data: any) => contactAPI.submit(data);
export const getContacts = () => contactAPI.getAll();
export const getContact = (id: string) => contactAPI.getById(id);
export const updateContactStatus = (id: string, status: string) => {
  const data = { status };
  return contactAPI.updateStatus(id, data);
};
export const deleteContact = (id: string) => contactAPI.delete(id);
export const getBlogPosts = () => blogAPI.getAll();
export const getBlogPost = (slug: string) => blogAPI.getBySlug(slug);
export const createBlogPost = (data: any) => blogAPI.create(createFormData(data));
export const deleteBlogPost = (id: string) => blogAPI.delete(id);
export const getSocialLinks = () => socialAPI.getAll();
export const getActiveSocialLinks = () => socialAPI.getActive();
export const createSocialLink = (data: any) => socialAPI.create(data);
export const updateSocialLink = (id: string, data: any) => socialAPI.update(id, data);
export const deleteSocialLink = (id: string) => socialAPI.delete(id);
export const getGuards = () => guardsAPI.getAll();
export const getGuard = (id: string) => guardsAPI.getById(id);
export const createGuard = (data: any) => guardsAPI.create(createFormData(data));
export const updateGuard = (id: string, data: any) => guardsAPI.update(id, createFormData(data));
export const deleteGuard = (id: string) => guardsAPI.delete(id);
export const getGuardsStats = () => guardsAPI.getStats();
export const getServices = () => servicesAPI.getAll();
export const getService = (id: string) => servicesAPI.getById(id);
export const createService = (data: any) => servicesAPI.create(createFormData(data));
export const updateService = (id: string, data: any) => servicesAPI.update(id, createFormData(data));
export const deleteService = (id: string) => servicesAPI.delete(id);
export const getActiveServices = () => servicesAPI.getActive();
export const getFeaturedServices = () => servicesAPI.getFeatured();
export const getClients = () => clientsAPI.getAll();
export const getClient = (id: string) => clientsAPI.getById(id);
export const createClient = (data: any) => clientsAPI.create(data);
export const updateClient = (id: string, data: any) => clientsAPI.update(id, data);
export const deleteClient = (id: string) => clientsAPI.delete(id);
export const getFeaturedClients = () => clientsAPI.getFeatured();
export const getActiveClients = () => clientsAPI.getActive();
export const getGallery = () => galleryAPI.getAll();
export const getGalleryItem = (id: string) => galleryAPI.getById(id);
export const createGalleryItem = (data: any) => galleryAPI.create(createFormData(data));
export const updateGalleryItem = (id: string, data: any) => galleryAPI.update(id, createFormData(data));
export const deleteGalleryItem = (id: string) => galleryAPI.delete(id);
export const getFeaturedGallery = () => galleryAPI.getFeatured();
export const getJobs = () => careerAPI.getActive();
export const getFeaturedJobs = () => careerAPI.getFeatured();
export const getJob = (id: string) => careerAPI.getPublicById(id);
export const applyForJob = (data: any) => careerAPI.apply(createFormData(data));
export const createJob = (data: any) => careerAPI.create(createFormData(data));
export const updateJob = (id: string, data: any) => careerAPI.update(id, createFormData(data));
export const deleteJob = (id: string) => careerAPI.delete(id);
export const getJobApplications = () => careerAPI.getAllApplications();
export const getCareerStats = () => careerAPI.getStats();

// Upload functions
export const uploadImage = (file: File, folder = 'portfolio') => {
  const formData = new FormData();
  formData.append('file', file);
  return uploadAPI.uploadImage(formData, folder);
};

export const uploadImages = (files: File[], folder = 'portfolio') => {
  const formData = new FormData();
  files.forEach(file => formData.append('files', file));
  return uploadAPI.uploadImages(formData, folder);
};

export const uploadDocument = (file: File, folder = 'documents') => {
  const formData = new FormData();
  formData.append('file', file);
  return uploadAPI.uploadDocument(formData, folder);
};
export const deleteFile = (publicId: string) => uploadAPI.deleteFile(publicId);
export const getOptimizedUrl = (publicId: string, options: any = {}) => uploadAPI.getOptimized({ publicId, ...options });

// Employee helper functions
export const getEmployees = () => employeeAPI.getAll();
export const getActiveEmployees = () => employeeAPI.getActive();
export const getEmployeeStats = () => employeeAPI.getStats();
export const getEmployee = (id: string) => employeeAPI.getById(id);
export const createEmployee = (data: FormData) => employeeAPI.create(data);
export const updateEmployee = (id: string, data: FormData) => employeeAPI.update(id, data);
export const deleteEmployee = (id: string) => employeeAPI.delete(id);
export const getEmployeesByDepartment = (department: string) => employeeAPI.getByDepartment(department);
export const getEmployeesByStatus = (status: string) => employeeAPI.getByStatus(status);

// Jobs API
export const jobsAPI = {
  // Job endpoints
  create: (data: any) => api.post('/jobs', data),
  getAll: () => api.get('/jobs'),
  getActive: () => api.get('/jobs/active'),
  getById: (id: string) => api.get(`/jobs/${id}`),
  update: (id: string, data: any) => api.patch(`/jobs/${id}`, data),
  delete: (id: string) => api.delete(`/jobs/${id}`),
  getStats: () => api.get('/jobs/stats'),
  
  // Job Application endpoints
  apply: (data: FormData) => api.post('/jobs/apply', data),
  applyWithPortfolio: (data: FormData) => api.post('/jobs/apply-with-portfolio', data),
  getAllApplications: () => api.get('/jobs/applications/all'),
  getApplicationsByJob: (jobId: string) => api.get(`/jobs/applications/job/${jobId}`),
  getApplication: (id: string) => api.get(`/jobs/applications/${id}`),
  updateApplication: (id: string, data: FormData) => api.patch(`/jobs/applications/${id}`, data),
  deleteApplication: (id: string) => api.delete(`/jobs/applications/${id}`),
};

// Convenience functions for jobs
export const getAllJobs = () => jobsAPI.getAll();
export const getActiveJobListings = () => jobsAPI.getActive();
export const getJobListing = (id: string) => jobsAPI.getById(id);
export const createJobListing = (data: any) => jobsAPI.create(createFormData(data));
export const updateJobListing = (id: string, data: any) => jobsAPI.update(id, createFormData(data));
export const deleteJobListing = (id: string) => jobsAPI.delete(id);

export const submitJobApplication = (data: any) => jobsAPI.apply(createFormData(data));
export const getAllJobApplications = () => jobsAPI.getAllApplications();

export default api;
