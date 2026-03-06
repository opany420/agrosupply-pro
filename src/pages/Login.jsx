import React, { useState } from 'react';
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      if (formData.email === 'admin@chicagoagro.com' && formData.password === 'Admin@1234') {
        navigate('/dashboard');
      } else {
        setError('Invalid email or password. Try admin@chicagoagro.com / Admin@1234');
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex">

      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80"
          alt="Farm"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/90 to-green-800/80" />
        <div className="absolute inset-0 flex flex-col justify-between p-12">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Leaf className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-xl">Chicago Agro</h1>
              <p className="text-white/70 text-sm">Supplies Limited</p>
            </div>
          </Link>

          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}>
              <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
                Welcome Back to
                <span className="text-emerald-400"> AgroSupply Pro</span>
              </h2>
              <p className="text-white/80 text-xl leading-relaxed mb-8">
                Manage your agricultural supplies, track orders, and grow your business with our powerful platform.
              </p>
              <div className="flex flex-col gap-4">
                {[
                  "Real-time order tracking",
                  "Inventory management",
                  "Client relationship tools",
                  "Advanced analytics"
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-emerald-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <ArrowRight className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-white/90">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {["J", "M", "P", "G"].map((letter, idx) => (
                <div key={idx} className="w-10 h-10 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center text-white font-bold text-sm">
                  {letter}
                </div>
              ))}
            </div>
            <div>
              <p className="text-white font-medium">5,000+ farmers trust us</p>
              <p className="text-white/60 text-sm">Join our growing community</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md">

          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-gray-900">Chicago Agro</h1>
              <p className="text-xs text-gray-500">Supplies Limited</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
            <p className="text-gray-500">Enter your credentials to access the dashboard</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  placeholder="admin@chicagoagro.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-emerald-600" />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <button type="button" className="text-sm text-emerald-600 hover:underline font-medium">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all">
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
            <p className="text-sm text-emerald-800 font-medium mb-1">Demo Credentials:</p>
            <p className="text-sm text-emerald-700">Email: admin@chicagoagro.com</p>
            <p className="text-sm text-emerald-700">Password: Admin@1234</p>
          </div>

          <p className="text-center text-gray-500 text-sm mt-6">
            Back to website?
            <Link to="/" className="text-emerald-600 font-medium hover:underline ml-1">
              Go Home
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}