import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Leaf, Home, Package, Info, Phone, LayoutDashboard, LogIn, ShoppingCart } from "lucide-react";
import { useCart } from './CartContext';
import Cart from './components/Cart';

export default function Layout({ children }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { totalItems, setIsCartOpen } = useCart();

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
      <Cart />

      {/* WhatsApp Floating Button */}
      <a href="https://wa.me/254757790379?text=Hello! I am interested in your agricultural products."
        target="_blank" rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 group">
        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="w-8 h-8" />
        <span className="absolute right-16 bg-gray-900 text-white text-xs px-3 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          Chat on WhatsApp
        </span>
      </a>

      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || !isHome ? 'bg-white shadow-md' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isScrolled || !isHome ? 'bg-emerald-600' : 'bg-white/20'}`}>
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`font-bold text-lg ${isScrolled || !isHome ? 'text-gray-900' : 'text-white'}`}>Chicago Agro</h1>
                <p className={`text-xs ${isScrolled || !isHome ? 'text-gray-500' : 'text-white/70'}`}>Supplies Limited</p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map(link => (
                <Link key={link.path} to={link.path}
                  className={`font-medium transition-colors ${isScrolled || !isHome ? 'text-gray-700 hover:text-emerald-600' : 'text-white/90 hover:text-white'}`}>
                  {link.name}
                </Link>
              ))}
              <div className="flex items-center gap-3">
                <button onClick={() => setIsCartOpen(true)}
                  className={`relative p-2 rounded-lg transition-colors ${isScrolled || !isHome ? 'hover:bg-gray-100 text-gray-700' : 'hover:bg-white/20 text-white'}`}>
                  <ShoppingCart className="w-6 h-6" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </button>
                <Link to="/dashboard">
                  <button className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors border ${isScrolled || !isHome ? 'border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white' : 'border-white text-white hover:bg-white/20'}`}>
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </button>
                </Link>
                <Link to="/login">
                  <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
                    <LogIn className="w-4 h-4" /> Sign In
                  </button>
                </Link>
              </div>
            </nav>

            {/* Mobile */}
            <div className="lg:hidden flex items-center gap-3">
              <button onClick={() => setIsCartOpen(true)}
                className={`relative p-2 rounded-lg ${isScrolled || !isHome ? 'text-gray-700' : 'text-white'}`}>
                <ShoppingCart className="w-6 h-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
              <button className={`${isScrolled || !isHome ? 'text-gray-900' : 'text-white'}`}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t shadow-lg">
            <div className="px-6 py-4 space-y-2">
              {navLinks.map(link => (
                <Link key={link.path} to={link.path} onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100">
                  <link.icon className="w-5 h-5 text-gray-500" />
                  <span className="font-medium">{link.name}</span>
                </Link>
              ))}
              <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100">
                <LayoutDashboard className="w-5 h-5 text-gray-500" />
                <span className="font-medium">Dashboard</span>
              </Link>
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-emerald-600 text-white">
                <LogIn className="w-5 h-5" />
                <span className="font-medium">Sign In</span>
              </Link>
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
                Your trusted partner for quality agricultural supplies in Kenya.
                Serving farmers across the country with premium products and expert guidance.
              </p>
              <div className="mt-4 space-y-1 text-gray-400 text-sm">
                <p>📍 P.O. Box 7, 40101 Ahero, Kisumu County</p>
                <p>📞 +254 757 790 379</p>
                <p>💳 Equity Paybill: 247247 | Acc: 0790026955</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                {navLinks.map(link => (
                  <li key={link.path}>
                    <Link to={link.path} className="hover:text-white transition-colors">{link.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>P.O. Box 7, 40101 Ahero</li>
                <li>Kisumu County, Kenya</li>
                <li>+254 757 790 379</li>
                <li>rizikisuppliers@gmail.com</li>
                <li className="pt-2">
                  <a href="https://wa.me/254757790379" target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    💬 WhatsApp Us
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
            © 2025 Chicago Agro Supplies Limited. All rights reserved. | Ahero, Kisumu County, Kenya
          </div>
        </div>
      </footer>
    </div>
  );
}