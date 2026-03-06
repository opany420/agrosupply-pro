import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Leaf, Home, Package, Info, Phone, LayoutDashboard, LogIn } from "lucide-react";

export default function Layout({ children }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = location.pathname === '/';

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Products', path: '/products', icon: Package },
    { name: 'About', path: '/about', icon: Info },
    { name: 'Contact', path: '/contact', icon: Phone },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || !isHome ? 'bg-white shadow-md' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isScrolled || !isHome ? 'bg-emerald-600' : 'bg-white/20'
              }`}>
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`font-bold text-lg ${
                  isScrolled || !isHome ? 'text-gray-900' : 'text-white'
                }`}>Chicago Agro</h1>
                <p className={`text-xs ${
                  isScrolled || !isHome ? 'text-gray-500' : 'text-white/70'
                }`}>Supplies Limited</p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map(link => (
                <Link key={link.path} to={link.path}
                  className={`font-medium transition-colors ${
                    isScrolled || !isHome
                      ? 'text-gray-700 hover:text-emerald-600'
                      : 'text-white/90 hover:text-white'
                  }`}>
                  {link.name}
                </Link>
              ))}
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                <LogIn className="w-4 h-4 inline mr-2" />
                Sign In
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className={`lg:hidden ${isScrolled || !isHome ? 'text-gray-900' : 'text-white'}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t shadow-lg">
            <div className="px-6 py-4 space-y-2">
              {navLinks.map(link => (
                <Link key={link.path} to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100">
                  <link.icon className="w-5 h-5 text-gray-500" />
                  <span className="font-medium">{link.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Chicago Agro Supplies</h3>
                  <p className="text-xs text-gray-400">Limited</p>
                </div>
              </div>
              <p className="text-gray-400 max-w-md">
                Your trusted partner for quality agricultural supplies since 1985.
                Serving farmers across the Midwest with premium products and expert guidance.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                {navLinks.map(link => (
                  <li key={link.path}>
                    <Link to={link.path} className="hover:text-white transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>123 Agricultural Blvd</li>
                <li>Chicago, IL 60601</li>
                <li>(312) 555-AGRO</li>
                <li>info@chicagoagro.com</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
            © 2024 Chicago Agro Supplies Limited. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}