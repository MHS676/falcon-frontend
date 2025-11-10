import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CloudArrowUpIcon, DocumentIcon, PhotoIcon, TrashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
}

const UploadManagement = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFiles = async (fileList: FileList) => {
    setUploading(true);
    
    try {
      const uploadPromises = Array.from(fileList).map(async (file) => {
        // Simulate upload - in real implementation, you'd upload to your server
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const uploadedFile: UploadedFile = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          size: file.size,
          type: file.type,
          url: URL.createObjectURL(file), // In real app, this would be the server URL
          uploadedAt: new Date().toISOString()
        };
        
        return uploadedFile;
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      setFiles(prev => [...prev, ...uploadedFiles]);
      toast.success(`${uploadedFiles.length} file(s) uploaded successfully`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload files');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const deleteFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
    toast.success('File deleted successfully');
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return <PhotoIcon className="h-8 w-8 text-blue-500" />;
    }
    return <DocumentIcon className="h-8 w-8 text-gray-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">File Upload Management</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Upload and manage your files and media assets
          </p>
        </div>
      </div>

      {/* Upload Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
      >
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
              : 'border-gray-300 dark:border-gray-600'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            multiple
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={uploading}
          />
          
          <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          
          {uploading ? (
            <div className="space-y-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Uploading files...</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {dragActive ? 'Drop files here' : 'Drop files here, or click to select'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Supports images, documents, and other file types
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Maximum file size: 10MB per file
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Files Grid */}
      {files.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Uploaded Files ({files.length})
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((file) => (
              <div
                key={file.id}
                className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getFileIcon(file.type)}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteFile(file.id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>

                {file.type.startsWith('image/') && (
                  <div className="mb-3">
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-full h-24 object-cover rounded"
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Type: {file.type || 'Unknown'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Uploaded: {new Date(file.uploadedAt).toLocaleString()}
                  </p>
                </div>

                <div className="mt-3 flex gap-2">
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white text-xs py-2 px-3 rounded transition-colors"
                  >
                    View
                  </a>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(file.url);
                      toast.success('URL copied to clipboard');
                    }}
                    className="flex-1 text-center bg-gray-600 hover:bg-gray-700 text-white text-xs py-2 px-3 rounded transition-colors"
                  >
                    Copy URL
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Usage Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
          Upload Tips
        </h3>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>• Drag and drop multiple files at once for batch uploads</li>
          <li>• Supported formats: Images (JPG, PNG, GIF), Documents (PDF, DOC, TXT), and more</li>
          <li>• Files are automatically organized and optimized for web delivery</li>
          <li>• Use the "Copy URL" button to get direct links for use in your content</li>
          <li>• Maximum file size is 10MB per file</li>
        </ul>
      </motion.div>
    </div>
  );
};

export default UploadManagement;