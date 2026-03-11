import React, { useState } from 'react';
import { motion } from "framer-motion";
import { Leaf, LogIn, Eye, EyeOff } from "lucide-react";
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError('Invalid email or password. Please try again.');
      setLoading(false);
    } else {
      navigate('/dashboard');
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address first.');
      return;
    }
    setResetLoading(true);
    setError('');
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/login',
    });
    setResetLoading(false);
    if (resetError) {
      setError(resetError.message);
    } else {
      setResetSent(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-800 to-green-900 flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">

        {/* Logo */}
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center">
            <Leaf className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-xl text-gray-900">Chicago Agro</h1>
            <p className="text-xs text-gray-500">Supplies Limited</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Admin Login</h2>
        <p className="text-gray-500 text-center mb-8 text-sm">Sign in to access your dashboard</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        {resetSent && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl mb-6 text-sm">
            Password reset link sent! Check your email inbox.
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" required value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@chicagoagro.com"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} required value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 pr-12" />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <div className="flex justify-end mt-1">
              <button type="button" onClick={handleForgotPassword} disabled={resetLoading}
                className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline disabled:opacity-50">
                {resetLoading ? 'Sending...' : 'Forgot password?'}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <><LogIn className="w-5 h-5" /> Sign In</>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-8">
          Chicago Agro Supplies Limited · Ahero, Kisumu
        </p>
      </motion.div>
    </div>
  );
}
