import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';
import { blogAPI } from '../../services/api';
import toast from 'react-hot-toast';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  slug: string;
  coverImage?: string;
  published: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface BlogProps {
  maxItems?: number;
  showExcerpt?: boolean;
  layout?: 'grid' | 'list';
}

const Blog = ({ maxItems, showExcerpt = true, layout = 'grid' }: BlogProps) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await blogAPI.getAll();
      let blogPosts = response.data;
      
      if (!Array.isArray(blogPosts)) {
        console.warn('API returned non-array data:', blogPosts);
        blogPosts = [];
      }
      
      blogPosts.sort((a: BlogPost, b: BlogPost) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      if (maxItems && blogPosts.length > maxItems) {
        blogPosts = blogPosts.slice(0, maxItems);
      }
      
      setPosts(blogPosts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      toast.error('Failed to load blog posts');
      setPosts([]);
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateReadTime = (content: string, wordsPerMinute = 200): number => {
    const words = content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  const handlePostClick = (slug: string) => {
    window.location.href = `/blog/${slug}`;
  };

  if (loading) {
    const itemCount = maxItems || 6;
    return (
      <div className={layout === 'list' ? 'space-y-6' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'}>
        {[...Array(itemCount)].map((_, index) => (
          <div key={index} className={`bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg -Force{layout === 'list' ? 'h-32' : 'h-80'}`}></div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-600 dark:text-gray-400">No blog posts found.</p>
      </div>
    );
  }

  return (
    <div>
      <div className={layout === 'list' ? 'space-y-6' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'}>
        {posts.map((post, index) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group"
            onClick={() => handlePostClick(post.slug)}
          >
            {post.coverImage && (
              <div className="h-48 overflow-hidden">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
            )}
            <div className="p-6">
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                <CalendarIcon className="w-4 h-4" />
                <span>{formatDate(post.createdAt)}</span>
                <ClockIcon className="w-4 h-4 ml-3" />
                <span>{calculateReadTime(post.content)} min read</span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                {post.title}
              </h3>
              
              {showExcerpt && post.excerpt && (
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
              )}
              
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
};

export default Blog;
