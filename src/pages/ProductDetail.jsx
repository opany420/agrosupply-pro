import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Star, CheckCircle, ArrowLeft, Truck, Shield, Award } from "lucide-react";
import { useCart } from '../CartContext';
import { supabase } from '../supabase';

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setQuantity(1);
    supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error: fetchError }) => {
        if (fetchError || !data) {
          setError('Product not found');
          setLoading(false);
          return;
        }
        setProduct(data);
        // Fetch related products in same category
        supabase
          .from('products')
          .select('*')
          .eq('category', data.category)
          .neq('id', data.id)
          .limit(3)
          .then(({ data: relatedData }) => {
            setRelated(relatedData || []);
            setLoading(false);
          });
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
          <Link to="/products">
            <button className="bg-emerald-600 text-white px-6 py-3 rounded-xl">Back to Products</button>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-6 py-8">

        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-emerald-600">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-emerald-600">Products</Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">

          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <div className="relative h-96">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover"
                onError={e => e.target.src = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80"} />
              {product.badge && (
                <span className="absolute top-4 left-4 bg-emerald-600 text-white text-sm font-bold px-4 py-2 rounded-full">
                  {product.badge}
                </span>
              )}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col justify-center">
            <span className="text-emerald-600 font-semibold uppercase text-sm tracking-wide mb-2">
              {product.category.replace(/_/g, ' ')}
            </span>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={"w-5 h-5 " + (i < Math.floor(product.rating) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200")} />
                ))}
              </div>
              <span className="font-bold text-gray-900">{product.rating}</span>
              <span className="text-gray-500">({product.reviews} reviews)</span>
            </div>

            <div className="mb-6">
              <span className="text-4xl font-bold text-emerald-600">KES {product.price.toLocaleString()}</span>
              <span className="text-gray-500 ml-2">per {product.unit}</span>
            </div>

            <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

            <div className="mb-6">
              <h3 className="font-bold text-gray-900 mb-3">Key Features:</h3>
              <div className="grid grid-cols-2 gap-2">
                {(product.features || []).map((f, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span className="text-gray-600 text-sm">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 hover:bg-gray-50 transition-colors font-bold text-gray-700">−</button>
                <span className="px-6 py-3 font-bold text-gray-900 border-x border-gray-200">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-4 py-3 hover:bg-gray-50 transition-colors font-bold text-gray-700">+</button>
              </div>
              <span className="text-gray-500 text-sm">{product.stock} in stock</span>
            </div>

            <button onClick={handleAddToCart}
              className={"w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all " + (
                added ? "bg-green-500 text-white" : "bg-emerald-600 hover:bg-emerald-700 text-white"
              )}>
              {added ? <><CheckCircle className="w-6 h-6" /> Added to Cart!</> : <><ShoppingCart className="w-6 h-6" /> Add to Cart — KES {(product.price * quantity).toLocaleString()}</>}
            </button>

            <div className="grid grid-cols-3 gap-4 mt-6">
              {[
                { icon: Truck, text: "Free Delivery" },
                { icon: Shield, text: "Quality Guaranteed" },
                { icon: Award, text: "Certified Products" },
              ].map((badge, i) => (
                <div key={i} className="flex flex-col items-center text-center bg-gray-50 rounded-xl p-3">
                  <badge.icon className="w-5 h-5 text-emerald-600 mb-1" />
                  <span className="text-xs text-gray-600 font-medium">{badge.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {related.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map(p => (
                <Link key={p.id} to={"/products/" + p.id}>
                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
                    <div className="h-48 overflow-hidden">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        onError={e => e.target.src = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80"} />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 mb-1">{p.name}</h3>
                      <span className="text-emerald-600 font-bold">KES {p.price.toLocaleString()}</span>
                      <span className="text-gray-400 text-sm ml-1">/{p.unit}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
