import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPinIcon, 
  ClockIcon, 
  CurrencyDollarIcon,
  CalendarIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';
import { Dialog } from '@headlessui/react';
import toast from 'react-hot-toast';

interface Career {
  id: string;
  title: string;
  description: string;
  requirements?: string[];
  location?: string;
  type: string;
  salary?: string;
  deadline?: string;
  featured: boolean;
  createdAt: string;
  _count: {
    applications: number;
  };
}

interface ApplicationData {
  careerId: string;
  fullName: string;
  email: string;
  phone: string;
  coverLetter: string;
}

const Careers = () => {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [applicationData, setApplicationData] = useState<ApplicationData>({
    careerId: '',
    fullName: '',
    email: '',
    phone: '',
    coverLetter: '',
  });

  useEffect(() => {
    fetchCareers();
  }, []);

  const fetchCareers = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/career/active`);
      if (response.ok) {
        const data = await response.json();
        setCareers(data);
      }
    } catch (error) {
      console.error('Error fetching careers:', error);
      toast.error('Failed to load job openings');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (career: Career) => {
    setSelectedCareer(career);
    setApplicationData(prev => ({ ...prev, careerId: career.id }));
    setIsModalOpen(true);
  };

  const submitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsApplying(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/career/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData),
      });

      if (response.ok) {
        toast.success('Application submitted successfully!');
        setIsModalOpen(false);
        setApplicationData({
          careerId: '',
          fullName: '',
          email: '',
          phone: '',
          coverLetter: '',
        });
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application');
    } finally {
      setIsApplying(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 pb-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6"
          >
            Join Our Amazing Team
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-600 max-w-3xl mx-auto"
          >
            We're always looking for talented individuals who share our passion for 
            creating exceptional digital experiences. Explore our open positions below.
          </motion.p>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {careers.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-slate-600">No open positions at the moment.</p>
              <p className="text-slate-500 mt-2">Check back soon for new opportunities!</p>
            </div>
          ) : (
            <div className="grid gap-8 lg:gap-12">
              {careers.map((career, index) => (
                <motion.div
                  key={career.id}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative bg-white rounded-2xl shadow-lg border border-slate-200 p-8 hover:shadow-xl transition-all duration-300 ${
                    career.featured ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
                  }`}
                >
                  {career.featured && (
                    <div className="absolute -top-3 left-8">
                      <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                        Featured
                      </span>
                    </div>
                  )}

                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-slate-900 mb-3">
                        {career.title}
                      </h3>
                      
                      <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-slate-600">
                        {career.location && (
                          <div className="flex items-center gap-1">
                            <MapPinIcon className="w-4 h-4" />
                            <span>{career.location}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <ClockIcon className="w-4 h-4" />
                          <span className="capitalize">{career.type.replace('-', ' ')}</span>
                        </div>
                        {career.salary && (
                          <div className="flex items-center gap-1">
                            <CurrencyDollarIcon className="w-4 h-4" />
                            <span>{career.salary}</span>
                          </div>
                        )}
                        {career.deadline && (
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="w-4 h-4" />
                            <span>Apply by {formatDate(career.deadline)}</span>
                          </div>
                        )}
                      </div>

                      <p className="text-slate-700 mb-4 line-clamp-3">
                        {career.description}
                      </p>

                      {career.requirements && career.requirements.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-semibold text-slate-900 mb-2">Requirements:</h4>
                          <ul className="list-disc list-inside text-slate-700 space-y-1">
                            {career.requirements.slice(0, 3).map((req, index) => (
                              <li key={index} className="text-sm">{req}</li>
                            ))}
                            {career.requirements.length > 3 && (
                              <li className="text-sm text-slate-500">
                                +{career.requirements.length - 3} more requirements...
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:ml-8">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleApply(career)}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg transition-all duration-300"
                      >
                        Apply Now
                      </motion.button>
                      
                      <div className="text-center text-sm text-slate-500">
                        {career._count.applications} applications
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Application Modal */}
      <AnimatePresence>
        {isModalOpen && selectedCareer && (
          <Dialog
            as={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            className="relative z-50"
          >
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
            
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Panel
                as={motion.div}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <Dialog.Title className="text-2xl font-bold text-slate-900">
                      Apply for {selectedCareer.title}
                    </Dialog.Title>
                    <p className="text-slate-600 mt-1">
                      Fill out the form below to submit your application
                    </p>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={submitApplication} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={applicationData.fullName}
                        onChange={(e) => setApplicationData(prev => ({ ...prev, fullName: e.target.value }))}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={applicationData.email}
                        onChange={(e) => setApplicationData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={applicationData.phone}
                      onChange={(e) => setApplicationData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Cover Letter *
                    </label>
                    <textarea
                      required
                      rows={6}
                      value={applicationData.coverLetter}
                      onChange={(e) => setApplicationData(prev => ({ ...prev, coverLetter: e.target.value }))}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isApplying}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isApplying ? 'Submitting...' : 'Submit Application'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </div>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Careers;