import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, FileText, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate=useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      toast.success('Logged In Successfully')
      navigate('/')
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
              <FileText className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-gray-400">Sign in to your PDF ChatBot account</p>
        </div>

        {/* Sign In Form */}
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-600 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Link to="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                Forgot your password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}