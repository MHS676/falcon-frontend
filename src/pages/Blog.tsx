import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getBlogPosts } from '../services/api';
import toast from 'react-hot-toast';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: string;
  tags: string[];
  createdAt: string;
}

const Blog = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await getBlogPosts();
      setBlogs(response.data);
    } catch (error) {
      toast.error('Failed to load blog posts');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-primary-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32">
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl font-heading font-bold mb-4">Blog</h1>
            <p className="text-xl text-gray-600">
              Thoughts, tutorials, and insights about web development
            </p>
          </motion.div>

          {blogs.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-gray-600">No blog posts yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog, index) => (
                <motion.article
                  key={blog.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="card group cursor-pointer"
                >
                  {blog.coverImage && (
                    <div className="h-48 bg-gradient-to-br from-primary-400 to-primary-600 overflow-hidden">
                      <img
                        src={blog.coverImage}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="text-sm text-gray-500 mb-2">
                      {new Date(blog.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                    <h2 className="text-2xl font-heading font-bold mb-3">
                      {blog.title}
                    </h2>
                    {blog.excerpt && (
                      <p className="text-gray-600 mb-4">{blog.excerpt}</p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {blog.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog;
