import React, { useState } from 'react';
import { motion } from "framer-motion";
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Star, CheckCircle, ArrowLeft, Truck, Shield, Award } from "lucide-react";
import { useCart } from '../CartContext';

const products = [
  { id: 1, name: "Hybrid Maize Seeds", category: "seeds", price: 5900, unit: "kg", description: "High-yield hybrid maize seeds specially developed for East African climate conditions. These seeds offer exceptional germination rates and disease resistance.", badge: "Best Seller", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/2015-Corn.jpg/640px-2015-Corn.jpg", rating: 4.8, reviews: 124, stock: 50, features: ["98% germination rate", "Drought resistant", "Matures in 90 days", "High yield potential"] },
  { id: 2, name: "NPK Fertilizer 20-20-20", category: "fertilizers", price: 4200, unit: "bag", description: "Balanced NPK fertilizer providing equal parts nitrogen, phosphorus, and potassium for all-round crop nutrition and healthy growth.", badge: "Popular", image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=400&q=80", rating: 4.6, reviews: 89, stock: 120, features: ["Balanced NPK ratio", "Suitable for all crops", "Fast acting formula", "50kg bag"] },
  { id: 3, name: "Organic Pesticide Spray", category: "pesticides", price: 2450, unit: "litre", description: "Eco-friendly organic pesticide that effectively controls pests without harming beneficial insects or the environment.", badge: null, image: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400&q=80", rating: 4.3, reviews: 56, stock: 80, features: ["100% organic", "Safe for bees", "No harmful residues", "Broad spectrum"] },
  { id: 4, name: "Mini Hand Tractor", category: "equipment", price: 167500, unit: "unit", description: "Compact and powerful mini tractor perfect for small to medium farms. Easy to operate and maintain with low fuel consumption.", badge: "New", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Farmall_M_tractor.jpg/640px-Farmall_M_tractor.jpg", rating: 4.9, reviews: 34, stock: 8, features: ["7HP diesel engine", "Low fuel consumption", "Easy maintenance", "Multiple attachments"] },
  { id: 5, name: "Irrigation Drip Kit", category: "irrigation", price: 11600, unit: "set", description: "Complete drip irrigation system covering 1 acre. Saves up to 60% water compared to flood irrigation.", badge: null, image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&q=80", rating: 4.7, reviews: 67, stock: 25, features: ["Covers 1 acre", "60% water saving", "Easy installation", "UV resistant pipes"] },
  { id: 6, name: "Cattle Feed Premium", category: "animal_feed", price: 7100, unit: "bag", description: "Nutritionally complete feed for dairy and beef cattle. Formulated to maximize milk production and healthy weight gain.", badge: null, image: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400&q=80", rating: 4.5, reviews: 78, stock: 60, features: ["High protein content", "Boosts milk production", "Vitamins & minerals", "50kg bag"] },
  { id: 7, name: "Garden Tool Set", category: "tools", price: 3200, unit: "set", description: "Complete set of 8 essential gardening tools including hoe, rake, spade, fork, and more. All with ergonomic handles.", badge: null, image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80", rating: 4.4, reviews: 92, stock: 40, features: ["8 tools included", "Ergonomic handles", "Rust resistant", "Carrying bag included"] },
  { id: 8, name: "Sunflower Seeds", category: "seeds", price: 3600, unit: "kg", description: "Premium sunflower seeds for oil production and direct consumption. High oil content varieties.", badge: null, image: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=400&q=80", rating: 4.6, reviews: 45, stock: 35, features: ["High oil content", "Disease resistant", "Drought tolerant", "90-day maturity"] },
  { id: 9, name: "Urea Fertilizer", category: "fertilizers", price: 2840, unit: "bag", description: "High nitrogen urea fertilizer ideal for leafy crops and boosting vegetative growth.", badge: null, image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&q=80", rating: 4.5, reviews: 103, stock: 200, features: ["46% nitrogen content", "Fast release", "All crops suitable", "50kg bag"] },
  { id: 10, name: "Sprayer Backpack", category: "tools", price: 5800, unit: "unit", description: "20-litre manual backpack sprayer with adjustable nozzle and comfortable padded straps.", badge: null, image: "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=400&q=80", rating: 4.3, reviews: 61, stock: 30, features: ["20-litre tank", "Adjustable nozzle", "Padded straps", "Anti-leak valve"] },
  { id: 11, name: "Poultry Feed Starter", category: "animal_feed", price: 4900, unit: "bag", description: "Specially formulated starter feed for day-old chicks. Promotes healthy growth and strong immunity.", badge: "Popular", image: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400&q=80", rating: 4.7, reviews: 88, stock: 75, features: ["High protein 22%", "Immune boosters", "Easy to digest", "25kg bag"] },
  { id: 12, name: "Water Pump 2HP", category: "irrigation", price: 23200, unit: "unit", description: "Powerful 2HP electric water pump for irrigation systems. High flow rate and energy efficient motor.", badge: null, image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&q=80", rating: 4.8, reviews: 42, stock: 15, features: ["2HP motor", "High flow rate", "Energy efficient", "1 year warranty"] },
];

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const product = products.find(p => p.id === parseInt(id));
  const related = products.filter(p => p.category === product?.category && p.id !== product?.id).slice(0, 3);

  if (!product) {
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
                {product.features.map((f, i) => (
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
