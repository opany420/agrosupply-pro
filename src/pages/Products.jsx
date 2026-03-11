import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Search, ShoppingCart } from "lucide-react";
import { useCart } from '../CartContext';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils';
import { supabase } from '../supabase';

const categoryList = [
  { value: "all", label: "All Products" },
  { value: "seeds", label: "Seeds" },
  { value: "fertilizers", label: "Fertilizers" },
  { value: "pesticides", label: "Pesticides" },
  { value: "tools", label: "Tools" },
  { value: "equipment", label: "Equipment" },
  { value: "animal feed", label: "Animal Feed" },
  { value: "irrigation", label: "Irrigation" },
];

export default function Products() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 12;
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: true });
    if (fetchError) {
      setError('Failed to load products. Please try again.');
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                        (p.description || '').toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'all' || p.category === activeCategory;
    return matchSearch && matchCat;
  });

  const totalPages = Math.ceil(filtered.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filtered.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  // Reset to page 1 when filters change
  useEffect(() => { setCurrentPage(1); }, [search, activeCategory]);

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-emerald-600 font-semibold uppercase text-sm tracking-wide">Our Catalogue</span>
            <h1 className="text-4xl font-bold text-gray-900 mt-2 mb-4">All Products</h1>
            <p className="text-gray-600 max-w-2xl">Browse our complete range of premium agricultural supplies</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Search products..." value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white" />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {categoryList.map(cat => (
            <button key={cat.value} onClick={() => setActiveCategory(cat.value)}
              className={"px-4 py-2 rounded-full font-medium text-sm transition-all " + (
                activeCategory === cat.value
                  ? "bg-emerald-600 text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-emerald-50 border border-gray-200"
              )}>
              {cat.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-red-600 font-medium mb-4">{error}</p>
            <button onClick={fetchProducts} className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors">
              Retry
            </button>
          </div>
        ) : (
          <>
            <p className="text-gray-500 text-sm mb-6">Showing {(currentPage - 1) * PRODUCTS_PER_PAGE + 1}–{Math.min(currentPage * PRODUCTS_PER_PAGE, filtered.length)} of {filtered.length} products</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedProducts.map((product, idx) => (
                <motion.div key={product.id}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100">
                  <Link to={`/products/${product.id}`}>
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      <img src={product.image} alt={product.name} loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={e => e.target.src = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80"} />
                    </div>
                  </Link>
                  <div className="p-4">
                    <span className="text-xs text-emerald-600 font-semibold uppercase tracking-wide">{product.category}</span>
                    <Link to={`/products/${product.id}`}>
                      <h3 className="font-bold text-gray-900 mt-1 mb-2 group-hover:text-emerald-600 transition-colors">{product.name}</h3>
                    </Link>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xl font-bold text-emerald-600">{formatCurrency(product.price)}</span>
                        <span className="text-gray-400 text-sm ml-1">/{product.unit || 'unit'}</span>
                      </div>
                      <button onClick={() => addToCart({ ...product, price: Number(product.price) })}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4" /> Add
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-16">
                <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500">Try a different search or category</p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button key={page} onClick={() => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className={"w-10 h-10 rounded-lg text-sm font-medium transition-all " + (
                      page === currentPage
                        ? "bg-emerald-600 text-white shadow-md"
                        : "border border-gray-200 text-gray-600 hover:bg-emerald-50"
                    )}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
