import { useState } from 'react';
import { motion } from 'framer-motion';
import { EyeIcon, EyeSlashIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import * as api from '../services/api';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Call the actual API for authentication
      const response = await api.login({
        email: credentials.email,
        password: credentials.password
      });
      
      if (response.data.access_token) {
        // Set admin token in localStorage
        localStorage.setItem('adminToken', response.data.access_token);
        localStorage.setItem('adminUser', JSON.stringify({
          email: credentials.email,
          role: 'admin',
          loginTime: new Date().toISOString()
        }));
        
        toast.success('Login successful! Welcome to SecureGuard Admin.');
        navigate('/admin/dashboard');
      } else {
        toast.error('Invalid credentials. Please try again.');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.status === 401) {
        toast.error('Invalid email or password.');
      } else {
        toast.error('Login failed. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-red-900 to-blue-900 py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Logo */}
          <div className="mx-auto w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-2xl">
            <ShieldCheckIcon className="w-12 h-12 text-red-600" />
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-2">
            SecureGuard Admin
          </h2>
          <p className="text-slate-300">
            Secure access to administration panel
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20"
        >
          <div className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={credentials.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-slate-300 focus:ring-2 focus:ring-red-500 focus:border-transparent backdrop-blur-sm transition-all duration-300"
                placeholder="Enter your email"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={credentials.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-slate-300 focus:ring-2 focus:ring-red-500 focus:border-transparent backdrop-blur-sm transition-all duration-300 pr-12"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-300 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Demo Credentials Info */}
            <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-blue-200 mb-2">Demo Credentials:</h4>
              <p className="text-xs text-blue-300">Username: admin</p>
              <p className="text-xs text-blue-300">Password: secureguard123</p>
            </div>

            {/* Login Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-blue-600 text-white rounded-lg font-semibold hover:from-red-700 hover:to-blue-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign in to Admin Panel'
              )}
            </motion.button>

            {/* Security Note */}
            <div className="text-center">
              <p className="text-xs text-slate-400">
                🔒 Secured with encryption • Protected access only
              </p>
            </div>
          </div>
        </motion.form>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-slate-400 text-sm"
        >
          <p>© 2024 SecureGuard. All rights reserved.</p>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLogin;