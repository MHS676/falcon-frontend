import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CalendarIcon, ClockIcon, TagIcon, EyeIcon } from '@heroicons/react/24/outline';
import { blogAPI } from '../../services/api';
import toast from 'react-hot-toast';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  slug: string;
  featuredImage?: string;
  author: {
    name: string;
    avatar?: string;
    bio?: string;
  };
  category: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  readTime?: number;
  views?: number;
  likes?: number;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
}

interface BlogProps {
  maxItems?: number;
  showExcerpt?: boolean;
  layout?: 'grid' | 'list' | 'featured';
  categories?: string[];
}

const Blog = ({ maxItems, showExcerpt = true, layout = 'grid', categories }: BlogProps) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [posts, selectedCategory, categories]);

  const fetchPosts = async () => {
    try {
      const response = await blogAPI.getAll();
      let blogPosts = response.data;
      
      // Ensure blogPosts is an array
      if (!Array.isArray(blogPosts)) {
        console.warn('API returned non-array data:', blogPosts);
        blogPosts = [];
      }
      
      // Filter only published posts
      blogPosts = blogPosts.filter((post: BlogPost) => post.status === 'published');
      
      // Sort by publication date (newest first)
      blogPosts.sort((a: BlogPost, b: BlogPost) => 
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
      
      // Apply max items limit if specified
      if (maxItems && blogPosts.length > maxItems) {
        blogPosts = blogPosts.slice(0, maxItems);
      }
      
      setPosts(blogPosts);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(blogPosts.map((post: BlogPost) => post.category))] as string[];
      setAvailableCategories(uniqueCategories);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      toast.error('Failed to load blog posts');
      setPosts([]); // Set empty array on error
      setAvailableCategories(['All']);
      setLoading(false);
    }
  };

  const filterPosts = () => {
    let filtered = posts;

    // Filter by selected category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    // Filter by provided categories prop
    if (categories && categories.length > 0) {
      filtered = filtered.filter(post => categories.includes(post.category));
    }

    setFilteredPosts(filtered);
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

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  const handlePostClick = (slug: string) => {
    // Navigate to blog post detail page
    window.location.href = `/blog/${slug}`;
  };

  if (loading) {
    const itemCount = maxItems || 6;
    return (
      <div className={layout === 'list' ? 'space-y-6' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'}>
        {[...Array(itemCount)].map((_, index) => (
          <div key={index} className={`bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg ${layout === 'list' ? 'h-32' : 'h-80'}`}></div>
        ))}
      </div>
    );
  }

  if (layout === 'featured' && filteredPosts.length > 0) {
    const featuredPost = filteredPosts[0];
    const otherPosts = filteredPosts.slice(1, 5);

    return (
      <div className="space-y-8">
        {/* Featured Post */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer group"
          onClick={() => handlePostClick(featuredPost.slug)}
        >
          <div className="md:flex">
            <div className="md:w-1/2">
              {featuredPost.featuredImage && (
                <img
                  src={featuredPost.featuredImage}
                  alt={featuredPost.title}
                  className="w-full h-64 md:h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              )}
            </div>
            <div className="md:w-1/2 p-8">
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <div className="flex items-center space-x-1">
                  <CalendarIcon className="w-4 h-4" />
                  <span>{formatDate(featuredPost.publishedAt)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ClockIcon className="w-4 h-4" />
                  <span>{featuredPost.readTime || calculateReadTime(featuredPost.content)} min read</span>
                </div>
              </div>
              
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {featuredPost.title}
              </h1>
              
              {showExcerpt && (
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  {featuredPost.excerpt || truncateText(featuredPost.content.replace(/<[^>]*>/g, ''), 200)}
                </p>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {featuredPost.author.avatar && (
                    <img
                      src={featuredPost.author.avatar}
                      alt={featuredPost.author.name}
                      className="w-10 h-10 rounded-full"
                    />
                  )}
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{featuredPost.author.name}</p>
                    <span className="text-sm text-blue-600 dark:text-blue-400 capitalize">{featuredPost.category}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                  {featuredPost.views && (
                    <div className="flex items-center space-x-1">
                      <EyeIcon className="w-4 h-4" />
                      <span>{featuredPost.views}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.article>

        {/* Other Posts */}
        {otherPosts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {otherPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (index + 1) * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group"
                onClick={() => handlePostClick(post.slug)}
              >
                {post.featuredImage && (
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {formatDate(post.publishedAt)}
                  </p>
                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded capitalize">
                    {post.category}
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      {/* Category Filter - only show if not filtering by specific categories */}
      {!categories && availableCategories.length > 1 && (
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 rounded-full transition-all duration-300 ${
              selectedCategory === 'All'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            All Posts
          </button>
          {availableCategories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full transition-all duration-300 capitalize ${
                selectedCategory === category
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* Posts Grid/List */}
      <div className={layout === 'list' ? 'space-y-6' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'}>
        {filteredPosts.map((post, index) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group ${
              layout === 'list' ? 'flex flex-col md:flex-row' : ''
            }`}
            onClick={() => handlePostClick(post.slug)}
          >
            {/* Post Image */}
            {post.featuredImage && (
              <div className={layout === 'list' ? 'md:w-1/3' : ''}>
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className={`w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                    layout === 'list' ? 'h-48 md:h-full' : 'h-48'
                  }`}
                />
              </div>
            )}

            {/* Post Content */}
            <div className={`p-6 ${layout === 'list' && post.featuredImage ? 'md:w-2/3' : ''} flex-1`}>
              {/* Meta Information */}
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                <div className="flex items-center space-x-1">
                  <CalendarIcon className="w-4 h-4" />
                  <span>{formatDate(post.publishedAt)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ClockIcon className="w-4 h-4" />
                  <span>{post.readTime || calculateReadTime(post.content)} min</span>
                </div>
                {post.views && (
                  <div className="flex items-center space-x-1">
                    <EyeIcon className="w-4 h-4" />
                    <span>{post.views}</span>
                  </div>
                )}
              </div>
              
              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {post.title}
              </h3>
              
              {/* Excerpt */}
              {showExcerpt && (
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                  {post.excerpt || truncateText(post.content.replace(/<[^>]*>/g, ''), 150)}
                </p>
              )}
              
              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center space-x-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
                    >
                      <TagIcon className="w-3 h-3" />
                      <span>{tag}</span>
                    </span>
                  ))}
                  {post.tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded text-xs">
                      +{post.tags.length - 3}
                    </span>
                  )}
                </div>
              )}
              
              {/* Author and Category */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-center space-x-3">
                  {post.author.avatar && (
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{post.author.name}</p>
                  </div>
                </div>
                <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded capitalize">
                  {post.category}
                </span>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      {filteredPosts.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No blog posts found{selectedCategory !== 'All' ? ` in ${selectedCategory} category` : ''}.
          </p>
        </div>
      )}
    </div>
  );
};

export default Blog;