import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  UserGroupIcon,
  EnvelopeIcon,
  PhoneIcon,
  BriefcaseIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import { employeeAPI } from '../services/api';
import toast from 'react-hot-toast';
import { clsx } from 'clsx';

interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  position: string;
  department?: string;
  status: string;
  photo?: string;
  city?: string;
  country: string;
}

const Employees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await employeeAPI.getActive();
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  // Filter employees by name (first name or last name)
  const filteredEmployees = employees.filter((employee) => {
    const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
    const query = searchQuery.toLowerCase();
    return fullName.includes(query);
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <UserGroupIcon className="w-12 h-12 text-red-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Our Team
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Meet the dedicated professionals who keep your security in focus
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="max-w-md mx-auto relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
            />
            {searchQuery && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-slate-500">
                {filteredEmployees.length} result{filteredEmployees.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        </motion.div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        ) : filteredEmployees.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <UserGroupIcon className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-lg text-slate-600 dark:text-slate-400">
              {searchQuery ? 'No employees found matching your search' : 'No employees available'}
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredEmployees.map((employee) => (
              <motion.div
                key={employee.id}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700"
              >
                <div className="p-6">
                  {/* Employee Photo */}
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="relative">
                      {employee.photo ? (
                        <img
                          src={`${import.meta.env.VITE_API_BASE_URL?.replace('/api', '')}/${employee.photo}`}
                          alt={`${employee.firstName} ${employee.lastName}`}
                          className="w-16 h-16 rounded-full object-cover border-2 border-red-500"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold">
                          {employee.firstName.charAt(0)}
                          {employee.lastName.charAt(0)}
                        </div>
                      )}
                      <div
                        className={clsx(
                          'absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white dark:border-slate-800',
                          employee.status === 'active'
                            ? 'bg-green-500'
                            : 'bg-slate-400'
                        )}
                      ></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {employee.firstName} {employee.lastName}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {employee.employeeId}
                      </p>
                    </div>
                  </div>

                  {/* Employee Details */}
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <BriefcaseIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {employee.position}
                        </p>
                        {employee.department && (
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {employee.department}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <EnvelopeIcon className="w-5 h-5 text-red-600 flex-shrink-0" />
                      <a
                        href={`mailto:${employee.email}`}
                        className="text-sm text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-500 transition-colors truncate"
                      >
                        {employee.email}
                      </a>
                    </div>

                    {employee.phone && (
                      <div className="flex items-center space-x-3">
                        <PhoneIcon className="w-5 h-5 text-red-600 flex-shrink-0" />
                        <a
                          href={`tel:${employee.phone}`}
                          className="text-sm text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-500 transition-colors"
                        >
                          {employee.phone}
                        </a>
                      </div>
                    )}

                    <div className="flex items-center space-x-3">
                      <MapPinIcon className="w-5 h-5 text-red-600 flex-shrink-0" />
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        {employee.city ? `${employee.city}, ` : ''}{employee.country}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <span
                      className={clsx(
                        'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
                        employee.status === 'active'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400'
                      )}
                    >
                      {employee.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Stats */}
        {!loading && filteredEmployees.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 text-center"
          >
            <div className="inline-flex items-center space-x-2 px-6 py-3 bg-white dark:bg-slate-800 rounded-full shadow-lg border border-slate-200 dark:border-slate-700">
              <UserGroupIcon className="w-5 h-5 text-red-600" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Showing {filteredEmployees.length} of {employees.length} team member{employees.length !== 1 ? 's' : ''}
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Employees;
