import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StarIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { clientsAPI } from '../../services/api';
import toast from 'react-hot-toast';

interface Client {
  id: string;
  name: string;
  company: string;
  position: string;
  testimonial: string;
  image?: string;
  rating: number;
  projectType: string;
  featured: boolean;
  active: boolean;
  createdAt: string;
}

interface ClientsProps {
  showFeaturedOnly?: boolean;
  maxItems?: number;
  layout?: 'grid' | 'carousel';
}

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
  const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
  if (years >= 1) return `${years} year${years > 1 ? 's' : ''} ago`;
  if (months >= 1) return `${months} month${months > 1 ? 's' : ''} ago`;
  return 'recently';
}

const CARDS_PER_PAGE = 3;

const Clients = ({
  showFeaturedOnly = true,
  maxItems,
}: ClientsProps) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  useEffect(() => { fetchClients(); }, []);

  const fetchClients = async () => {
    try {
      const response = showFeaturedOnly
        ? await clientsAPI.getFeatured()
        : await clientsAPI.getActive();

      let list = Array.isArray(response.data) ? response.data : [];
      if (maxItems) list = list.slice(0, maxItems);
      setClients(list);
    } catch {
      toast.error('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(clients.length / CARDS_PER_PAGE);
  const visibleClients = clients.slice(page * CARDS_PER_PAGE, page * CARDS_PER_PAGE + CARDS_PER_PAGE);

  const prev = useCallback(() => setPage(p => Math.max(0, p - 1)), []);
  const next = useCallback(() => setPage(p => Math.min(totalPages - 1, p + 1)), [totalPages]);

  const avgRating = clients.length
    ? (clients.reduce((s, c) => s + c.rating, 0) / clients.length).toFixed(1)
    : '5.0';

  const renderStars = (rating: number, size = 'h-5 w-5') => (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <StarIcon key={i} className={`${size} ${i < rating ? 'text-[#F5A623]' : 'text-gray-300 dark:text-gray-600'}`} />
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gold-500" />
      </div>
    );
  }

  if (clients.length === 0) {
    return <p className="text-center text-gray-500 py-12">No testimonials available yet.</p>;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-stretch">

      {/* ── Left summary card ── */}
      <div className="flex-shrink-0 w-full lg:w-56 bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-lg p-6 flex flex-col items-start gap-3 border border-gray-100 dark:border-gray-800">
        <p className="font-bold text-gray-900 dark:text-white text-lg leading-tight">Falcon Security Limited</p>
        <div className="flex items-center gap-2">
          <span className="text-3xl font-black text-[#F5A623]">{avgRating}</span>
          {renderStars(Math.round(parseFloat(avgRating)), 'h-4 w-4')}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Based on {clients.length} reviews</p>
        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
          <span>powered by</span>
          <span className="font-bold text-[#4285F4]">G</span>
          <span className="font-bold text-[#EA4335]">o</span>
          <span className="font-bold text-[#FBBC05]">o</span>
          <span className="font-bold text-[#4285F4]">g</span>
          <span className="font-bold text-[#34A853]">l</span>
          <span className="font-bold text-[#EA4335]">e</span>
        </div>
        <a
          href="https://g.page/r/review"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 flex items-center gap-2 px-4 py-2 rounded-full bg-[#1A73E8] hover:bg-[#1557b0] text-white text-sm font-semibold transition-colors shadow"
        >
          <GoogleIcon />
          review us on
        </a>
      </div>

      {/* ── Right carousel ── */}
      <div className="flex-1 relative flex flex-col gap-4">
        {/* Arrows */}
        {totalPages > 1 && (
          <>
            <button
              onClick={prev}
              disabled={page === 0}
              className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white dark:bg-[#1a1a1a] shadow-md border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 transition-all"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              disabled={page >= totalPages - 1}
              className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white dark:bg-[#1a1a1a] shadow-md border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 transition-all"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[200px]">
          <AnimatePresence mode="popLayout">
            {visibleClients.map((client) => (
              <motion.div
                key={`${client.id}-${page}`}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.28 }}
                className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-md border border-gray-100 dark:border-gray-800 p-5 flex flex-col gap-3"
              >
                {/* Header: avatar + name + G icon */}
                <div className="flex items-center gap-3">
                  {client.image ? (
                    <img
                      src={client.image}
                      alt={client.name}
                      className="w-11 h-11 rounded-full object-cover flex-shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(client.name)}&background=1A73E8&color=fff`;
                      }}
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-[#1A73E8] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {client.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#1A73E8] text-sm truncate">{client.name}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{timeAgo(client.createdAt)}</p>
                  </div>
                  <GoogleIcon />
                </div>

                {/* Stars */}
                {renderStars(client.rating, 'h-4 w-4')}

                {/* Review text */}
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-4">
                  {client.testimonial}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Dot pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-1">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${i === page ? 'bg-[#1A73E8] w-4' : 'bg-gray-300 dark:bg-gray-600'}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Clients;
