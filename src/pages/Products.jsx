import React, { useState } from 'react';
import { motion } from "framer-motion";
import { Search, Filter } from "lucide-react";

const products = [
  { id: 1, name: "Hybrid Maize Seeds", category: "seeds", price: 45.99, unit: "kg", description: "High-yield hybrid maize seeds for maximum harvest", icon: "🌱", badge: "Best Seller" },
  { id: 2, name: "NPK Fertilizer 20-20-20", category: "fertilizers", price: 32.50, unit: "bag", description: "Balanced nutrition fertilizer for all crops", icon: "🧪", badge: "Popular" },
  { id: 3, name: "Organic Pesticide Spray", category: "pesticides", price: 18.99, unit: "litre", description: "Eco-friendly crop protection solution", icon: "🛡️", badge: null },
  { id: 4, name: "Mini Hand Tractor", category: "equipment", price: 1299.00, unit: "unit", description: "Compact tractor for small to medium farms", icon: "🚜", badge: "New" },
  { id: 5, name: "Irrigation Drip Kit", category: "irrigation", price: 89.99, unit: "set", description: "Complete drip irrigation system for 1 acre", icon: "💧", badge: null },
  { id: 6, name: "Cattle Feed Premium", category: "animal_feed", price: 55.00, unit: "bag", description: "Nutritionally complete feed for dairy cattle", icon: "🌾", badge: null },
  { id: 7, name: "Garden Tool Set", category: "tools", price: 24.99, unit: "set", description: "Complete set of essential gardening tools", icon: "🔧", badge: null },
  { id: 8, name: "Sunflower Seeds", category: "seeds", price: 28.00, unit: "kg", description: "Premium sunflower seeds for oil production", icon: "🌻", badge: null },
  { id: 9, name: "Urea Fertilizer", category: "fertilizers", price: 22.00, unit: "bag", description: "High nitrogen fertilizer for leafy crops", icon: "🧪", badge: null },
  { id: 10, name: "Sprayer Backpack", category: "tools", price: 45.00, unit: "unit", description: "20-litre manual backpack sprayer", icon: "🎒", badge: null },
  { id: 11, name: "Poultry Feed Starter", category: "animal_feed", price: 38.00, unit: "bag", description: "Starter feed for day-old chicks", icon: "🐔", badge: "Popular" },
  { id: 12, name: "Water Pump 2HP", category: "irrigation", price: 180.00, unit: "unit", description: "Powerful water pump for irrigation systems", icon: "⚙️", badge: null },
];

const categories = [
  { value: "all", label: "All Products" },
  { value: "seeds", label: "🌱 Seeds" },
  { value: "fertilizers", label: "🧪 Fertilizers" },
  { value: "pesticides", label: "🛡️ Pesticides" },
  { value: "equipment", label: "🚜 Equipment" },
  { value: "tools", label: "🔧 Tools" },
  { value: "animal_feed", label: "🌾 Animal Feed" },
  { value: "irrigation", label: "💧 Irrigation" },
];

export default function Products() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                       p.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'all' || p.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}>
            <span className="text-emerald-600 font-semibold uppercase text-sm tracking-wide">
              Our Catalogue
            </span>
            <h1 className="text-4xl font-bold text-gray-900 mt-2 mb-4">
              All Products
            </h1>
            <p className="text-gray-600 max-w-2xl">
              Browse our complete range of premium agricultural supplies
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`px-4 py-2 rounded-full font-medium text-sm transition-all ${
                activeCategory === cat.value
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-emerald-50 border border-gray-200'
              }`}>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-gray-500 text-sm mb-6">
          Showing {filtered.length} products
        </p>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100">
              {/* Image */}
              <div className="relative h-48 bg-gradient-to-br from-emerald-50 to-green-100 flex items-center justify-center">
                <span className="text-6xl">{product.icon}</span>
                {product.badge && (
                  <span className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {product.badge}
                  </span>
                )}
              </div>
              {/* Content */}
              <div className="p-4">
                <span className="text-xs text-emerald-600 font-semibold uppercase tracking-wide">
                  {product.category.replace(/_/g, ' ')}
                </span>
                <h3 className="font-bold text-gray-900 mt-1 mb-2 group-hover:text-emerald-600 transition-colors">
                  {product.name}
                </h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-emerald-600">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="text-gray-400 text-sm ml-1">/{product.unit}</span>
                  </div>
                  <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                    Order
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">🔍</p>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500">Try a different search or category</p>
          </div>
        )}
      </div>
    </div>
  );
}