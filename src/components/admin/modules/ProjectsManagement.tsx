import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  FolderIcon,
  LinkIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline';
import { projectsAPI } from '../../../services/api';
import toast from 'react-hot-toast';

interface Project {
  id: string;
  title: string;
  description: string;
  image?: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  createdAt: string;
  updatedAt?: string;
  userId?: string;
}

const ProjectsManagement = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null as File | null,
    technologies: '',
    liveUrl: '',
    githubUrl: '',
    featured: false
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectsAPI.getAll();
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert technologies from string to array
      const technologiesArray = formData.technologies
        .split(',')
        .map(tech => tech.trim())
        .filter(tech => tech.length > 0);

      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      
      // Send technologies as JSON string for proper array deserialization
      submitData.append('technologies', JSON.stringify(technologiesArray));
      
      submitData.append('liveUrl', formData.liveUrl);
      submitData.append('githubUrl', formData.githubUrl);
      submitData.append('featured', formData.featured.toString());
      
      if (formData.image) {
        submitData.append('image', formData.image);
      }

      if (selectedProject) {
        await projectsAPI.update(selectedProject.id, submitData);
        toast.success('Project updated successfully');
      } else {
        await projectsAPI.create(submitData);
        toast.success('Project created successfully');
      }
      
      fetchProjects();
      resetForm();
      setIsModalOpen(false);
    } catch (error: any) {
      console.error('Error saving project:', error);
      toast.error(error.response?.data?.message || 'Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedProject) return;
    
    setLoading(true);
    try {
      await projectsAPI.delete(selectedProject.id);
      toast.success('Project deleted successfully');
      fetchProjects();
      setIsDeleteModalOpen(false);
      setSelectedProject(null);
    } catch (error: any) {
      console.error('Error deleting project:', error);
      toast.error(error.response?.data?.message || 'Failed to delete project');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (project?: Project) => {
    if (project) {
      setSelectedProject(project);
      setFormData({
        title: project.title,
        description: project.description,
        image: null,
        technologies: Array.isArray(project.technologies) ? project.technologies.join(', ') : '',
        liveUrl: project.liveUrl || '',
        githubUrl: project.githubUrl || '',
        featured: project.featured
      });
    } else {
      setSelectedProject(null);
      resetForm();
    }
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image: null,
      technologies: '',
      liveUrl: '',
      githubUrl: '',
      featured: false
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, image: file }));
  };



  if (loading && projects.length === 0) {
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Projects Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your portfolio projects</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add Project</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="relative h-48">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              {project.featured && (
                <div className="absolute top-2 right-2">
                  <span className="px-2 py-1 bg-yellow-500 text-white rounded text-xs font-medium">
                    Featured
                  </span>
                </div>
              )}
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                {project.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-1 mb-3">
                {Array.isArray(project.technologies) ? project.technologies.slice(0, 3).map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
                  >
                    {tech}
                  </span>
                )) : null}
                {Array.isArray(project.technologies) && project.technologies.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded text-xs">
                    +{project.technologies.length - 3}
                  </span>
                )}
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-600">
                <div className="flex space-x-2">
                  <button
                    onClick={() => openModal(project)}
                    className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                    title="Edit"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded"
                      title="Live Demo"
                    >
                      <LinkIcon className="w-4 h-4" />
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-900/20 rounded"
                      title="Source Code"
                    >
                      <CodeBracketIcon className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    onClick={() => {
                      setSelectedProject(project);
                      setIsDeleteModalOpen(true);
                    }}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                    title="Delete"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(project.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12">
          <FolderIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No projects found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Get started by creating your first project</p>
          <button
            onClick={() => openModal()}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Add First Project
          </button>
        </div>
      )}

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black opacity-50" onClick={() => setIsModalOpen(false)}></div>
            <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {selectedProject ? 'Edit Project' : 'Create Project'}
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
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Project Image *
                  </label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    required={!selectedProject}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Technologies (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="technologies"
                    value={formData.technologies}
                    onChange={handleInputChange}
                    placeholder="React, TypeScript, Node.js"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Featured Project
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Live URL
                    </label>
                    <input
                      type="url"
                      name="liveUrl"
                      value={formData.liveUrl}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      name="githubUrl"
                      value={formData.githubUrl}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
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
                    {loading ? 'Saving...' : selectedProject ? 'Update' : 'Create'}
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
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Delete Project</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete "{selectedProject?.title}"? This action cannot be undone.
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

export default ProjectsManagement;