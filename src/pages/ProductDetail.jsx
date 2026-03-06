import React, { useState } from 'react';
import { motion } from "framer-motion";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ShoppingCart, ArrowLeft, Star, Truck, Shield, Award, Plus, Minus, Check } from "lucide-react";
import { useCart } from '../CartContext';

const products = [
  { id: 1, name: "Hybrid Maize Seeds", category: "seeds", price: 45.99, unit: "kg", description: "High-yield hybrid maize seeds for maximum harvest. Our premium hybrid maize seeds are carefully selected and tested to ensure maximum germination rates and yield potential. Suitable for all soil types across the Midwest.", badge: "Best Seller", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/2015-Corn.jpg/640px-2015-Corn.jpg", rating: 4.8, reviews: 124, stock: 450, features: ["High germination rate 95%+", "Drought resistant variety", "Matures in 90-110 days", "Yield: 8-12 tons per acre"] },
  { id: 2, name: "NPK Fertilizer 20-20-20", category: "fertilizers", price: 32.50, unit: "bag", description: "Balanced nutrition fertilizer for all crops. This complete fertilizer provides equal parts nitrogen, phosphorus, and potassium to support healthy plant growth at all stages.", badge: "Popular", image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=400&q=80", rating: 4.6, reviews: 89, stock: 120, features: ["Equal NPK ratio 20-20-20", "Fast dissolving formula", "Suitable for all crops", "50kg bag coverage: 2 acres"] },
  { id: 3, name: "Organic Pesticide Spray", category: "pesticides", price: 18.99, unit: "litre", description: "Eco-friendly crop protection solution. Made from natural ingredients, this pesticide effectively controls pests while being safe for the environment, beneficial insects, and human health.", badge: null, image: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400&q=80", rating: 4.5, reviews: 67, stock: 200, features: ["100% organic ingredients", "Safe for bees and wildlife", "Controls 50+ pest species", "Ready to use formula"] },
  { id: 4, name: "Mini Hand Tractor", category: "equipment", price: 1299.00, unit: "unit", description: "Compact tractor for small to medium farms. This powerful mini tractor is perfect for tillage, planting, and cultivation on farms up to 10 acres. Easy to operate with minimal maintenance.", badge: "New", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Farmall_M_tractor.jpg/640px-Farmall_M_tractor.jpg", rating: 4.9, reviews: 45, stock: 12, features: ["7HP diesel engine", "Covers up to 10 acres", "Multiple attachments", "2 year warranty"] },
  { id: 5, name: "Irrigation Drip Kit", category: "irrigation", price: 89.99, unit: "set", description: "Complete drip irrigation system for 1 acre. Save up to 60% water while improving crop yield with our efficient drip irrigation system. Includes all fittings and installation guide.", badge: null, image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&q=80", rating: 4.7, reviews: 98, stock: 65, features: ["Covers 1 full acre", "Saves 60% water", "Easy DIY installation", "10 year pipe warranty"] },
  { id: 6, name: "Cattle Feed Premium", category: "animal_feed", price: 55.00, unit: "bag", description: "Nutritionally complete feed for dairy cattle. Formulated by expert animal nutritionists, this premium feed maximizes milk production and maintains optimal cattle health.", badge: null, image: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400&q=80", rating: 4.6, reviews: 56, stock: 89, features: ["18% protein content", "Added vitamins & minerals", "Improves milk production", "50kg bag"] },
  { id: 7, name: "Garden Tool Set", category: "tools", price: 24.99, unit: "set", description: "Complete set of essential gardening tools. This comprehensive 8-piece tool set includes everything you need for planting, weeding, and maintaining your garden or small farm.", badge: null, image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80", rating: 4.4, reviews: 112, stock: 200, features: ["8 piece complete set", "Rust resistant steel", "Ergonomic handles", "Includes carrying bag"] },
  { id: 8, name: "Sunflower Seeds", category: "seeds", price: 28.00, unit: "kg", description: "Premium sunflower seeds for oil production. High oleic sunflower seeds with excellent oil content, ideal for commercial oil production or direct consumption.", badge: null, image: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=400&q=80", rating: 4.5, reviews: 78, stock: 300, features: ["High oil content 45%+", "Disease resistant variety", "Matures in 80-100 days", "Yield: 2-3 tons per acre"] },
  { id: 9, name: "Urea Fertilizer", category: "fertilizers", price: 22.00, unit: "bag", description: "High nitrogen fertilizer for leafy crops. Urea is the most concentrated nitrogen fertilizer available, ideal for promoting healthy leaf and stem growth in all crops.", badge: null, image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&q=80", rating: 4.3, reviews: 94, stock: 180, features: ["46% nitrogen content", "Highest N concentration", "Fast acting formula", "50kg bag"] },
  { id: 10, name: "Sprayer Backpack", category: "tools", price: 45.00, unit: "unit", description: "20-litre manual backpack sprayer. Durable and comfortable backpack sprayer perfect for applying pesticides, herbicides, and liquid fertilizers on small to medium farms.", badge: null, image: "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=400&q=80", rating: 4.5, reviews: 67, stock: 150, features: ["20 litre capacity", "Adjustable nozzle spray", "Padded shoulder straps", "Pressure relief valve"] },
  { id: 11, name: "Poultry Feed Starter", category: "animal_feed", price: 38.00, unit: "bag", description: "Starter feed for day-old chicks. Specially formulated for chicks from day 1 to 4 weeks, this starter feed provides optimal nutrition for healthy growth and development.", badge: "Popular", image: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400&q=80", rating: 4.7, reviews: 145, stock: 250, features: ["22% protein for chicks", "Medicated formula", "Week 1-4 formula", "25kg bag"] },
  { id: 12, name: "Water Pump 2HP", category: "irrigation", price: 180.00, unit: "unit", description: "Powerful water pump for irrigation systems. This reliable 2HP water pump can move up to 500 litres per minute, perfect for irrigation, drainage, and water transfer on farms.", badge: null, image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&q=80", rating: 4.6, reviews: 88, stock: 45, features: ["2HP powerful motor", "500 litres per minute", "Self priming pump", "1 year warranty"] },
];

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const product = products.find(p => p.id === parseInt(id));

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
          <Link to="/products" className="text-emerald-600 hover:underline">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-emerald-600">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-emerald-600">Products</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{product.name}</span>
        </div>

        {/* Main Product */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-12">
          <div className="grid lg:grid-cols-2 gap-0">

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative h-96 lg:h-full min-h-96 overflow-hidden bg-gray-100">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80";
                }}
              />
              {product.badge && (
                <span className="absolute top-4 left-4 bg-emerald-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                  {product.badge}
                </span>
              )}
            </motion.div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-8 lg:p-12">

              <span className="text-emerald-600 font-semibold uppercase text-sm tracking-wide">
                {product.category.replace(/_/g, ' ')}
              </span>

              <h1 className="text-3xl font-bold text-gray-900 mt-2 mb-4">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`}
                    />
                  ))}
                </div>
                <span className="font-semibold text-gray-900">{product.rating}</span>
                <span className="text-gray-500">({product.reviews} reviews)</span>
              </div>

              <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

              {/* Features */}
              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-3">Key Features</h3>
                <div className="space-y-2">
                  {product.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-emerald-600" />
                      </div>
                      <span className="text-gray-600 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-bold text-emerald-600">${product.price.toFixed(2)}</span>
                <span className="text-gray-500">per {product.unit}</span>
              </div>

              {/* Stock */}
              <div className="flex items-center gap-2 mb-6">
                <div className={`w-2 h-2 rounded-full ${product.stock > 20 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                <span className={`text-sm font-medium ${product.stock > 20 ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {product.stock > 20 ? `In Stock (${product.stock} units)` : `Low Stock (${product.stock} left)`}
                </span>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-8">
                <span className="font-medium text-gray-700">Quantity:</span>
                <div className="flex items-center gap-3 bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-gray-500 text-sm">
                  Total: <strong className="text-gray-900">${(product.price * quantity).toFixed(2)}</strong>
                </span>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                    added
                      ? 'bg-green-500 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}>
                  {added ? (
                    <>
                      <Check className="w-5 h-5" />
                      Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      Add to Cart
                    </>
                  )}
                </button>
                <button
                  onClick={() => navigate('/products')}
                  className="px-6 py-4 border border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100">
                <div className="text-center">
                  <Truck className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Free Delivery</p>
                </div>
                <div className="text-center">
                  <Shield className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Quality Guaranteed</p>
                </div>
                <div className="text-center">
                  <Award className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Certified Products</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all group border border-gray-100">
                  <Link to={`/products/${item.id}`}>
                    <div className="h-40 overflow-hidden bg-gray-100">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80";
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors text-sm">
                        {item.name}
                      </h3>
                      <span className="text-emerald-600 font-bold">${item.price.toFixed(2)}</span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}