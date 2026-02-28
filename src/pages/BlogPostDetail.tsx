import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getBlogPost } from '../services/api';
import {
  CalendarIcon,
  TagIcon,
  ArrowLeftIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import SEO from '../components/SEO';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  tags: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

const BlogPostDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (slug) fetchPost(slug);
  }, [slug]);

  const fetchPost = async (postSlug: string) => {
    try {
      const response = await getBlogPost(postSlug);
      setPost(response.data);
    } catch (error: any) {
      if (error?.response?.status === 404) {
        setNotFound(true);
      } else {
        setNotFound(true);
      }
    } finally {
      setLoading(false);
    }
  };

  // Calculate reading time
  const readingTime = post
    ? Math.max(1, Math.ceil(post.content.split(/\s+/).length / 200))
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* Skeleton */}
          <div className="animate-pulse space-y-6">
            <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-10 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
            <div className="space-y-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className={`h-4 bg-gray-200 dark:bg-gray-700 rounded ${i % 3 === 2 ? 'w-2/3' : 'w-full'}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="text-7xl mb-6">📄</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Post Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-red-700 hover:to-blue-700 transition-all"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={`${post.title} — Falcon® Security Blog`}
        description={post.excerpt || post.content.substring(0, 160)}
        image={post.coverImage}
        type="article"
      />

      <div className="min-h-screen pt-20 pb-16">
        {/* Hero / Cover */}
        {post.coverImage ? (
          <div className="relative h-72 sm:h-96 w-full overflow-hidden">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 max-w-3xl mx-auto">
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-2xl sm:text-4xl font-bold text-white leading-tight"
              >
                {post.title}
              </motion.h1>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-red-600 to-blue-700 pt-16 pb-12 px-4">
            <div className="max-w-3xl mx-auto">
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-2xl sm:text-4xl font-bold text-white leading-tight"
              >
                {post.title}
              </motion.h1>
            </div>
          </div>
        )}

        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* Meta row */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap items-center gap-4 py-5 border-b border-gray-200 dark:border-gray-700"
          >
            <button
              onClick={() => navigate('/blog')}
              className="flex items-center gap-1.5 text-sm text-red-600 dark:text-red-400 hover:underline font-medium"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Blog
            </button>

            <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
              <CalendarIcon className="w-4 h-4" />
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>

            <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
              <ClockIcon className="w-4 h-4" />
              {readingTime} min read
            </div>
          </motion.div>

          {/* Title (no cover image case - shown below meta) */}
          {!post.coverImage && (
            <h1 className="sr-only">{post.title}</h1>
          )}

          {/* Excerpt */}
          {post.excerpt && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed italic border-l-4 border-red-500 pl-4"
            >
              {post.excerpt}
            </motion.p>
          )}

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 prose prose-slate dark:prose-invert prose-lg max-w-none
              prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white
              prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed
              prose-a:text-red-600 dark:prose-a:text-red-400 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-gray-900 dark:prose-strong:text-white
              prose-li:text-gray-700 dark:prose-li:text-gray-300
              prose-img:rounded-xl prose-img:shadow-lg"
            dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
          />

          {/* Tags */}
          {Array.isArray(post.tags) && post.tags.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-2 flex-wrap">
                <TagIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Back button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="mt-10"
          >
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-red-600 dark:text-red-400 font-semibold hover:gap-3 transition-all"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back to all posts
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  );
};

/**
 * Converts plain-text blog content into simple HTML.
 * - Double newlines → paragraphs
 * - Single newlines → <br>
 * - Already contains HTML tags → pass through
 */
function formatContent(content: string): string {
  // If content already looks like HTML, pass through
  if (/<[a-z][\s\S]*>/i.test(content)) {
    return content;
  }
  // Plain text: wrap paragraphs
  return content
    .split(/\n\n+/)
    .filter(p => p.trim())
    .map(p => `<p>${p.replace(/\n/g, '<br />')}</p>`)
    .join('');
}

export default BlogPostDetail;
