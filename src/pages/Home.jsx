import React from 'react';
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Leaf, Truck, Shield, Users, Package, Star, CheckCircle2, Clock, Headphones, CreditCard, Award } from "lucide-react";

// ── HERO SECTION ──
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80"
          alt="Farm field"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 backdrop-blur-sm rounded-full text-emerald-300 text-sm font-medium mb-6">
              <Leaf className="w-4 h-4" />
              Trusted Since 1985
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Growing Success,
              <span className="text-emerald-400"> Together</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Chicago Agro Supplies Limited - Your premier partner for quality agricultural supplies.
              From seeds to equipment, we provide everything your farm needs to thrive.
            </p>
            <div className="flex flex-wrap gap-4 mb-12">
              <Link to="/products">
                <button className="bg-emerald-600 hover:bg-emerald-700 text-white text-lg px-8 py-4 rounded-xl font-semibold flex items-center gap-2 transition-colors">
                  Browse Products
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <Link to="/contact">
                <button className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-4 rounded-xl font-semibold transition-colors">
                  Contact Sales
                </button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap gap-6">
            <div className="flex items-center gap-3 text-white/90">
              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold">Fast Delivery</p>
                <p className="text-sm text-white/70">Midwest Coverage</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold">Quality Guaranteed</p>
                <p className="text-sm text-white/70">Premium Products</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ── CATEGORIES ──
const categories = [
  {
    name: "Seeds",
    description: "Premium crop seeds for maximum yield",
    color: "from-green-500 to-emerald-600",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80"
  },
  {
    name: "Fertilizers",
    description: "Nutrient-rich soil enhancers",
    color: "from-amber-500 to-orange-600",
    image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=400&q=80"
  },
  {
    name: "Pesticides",
    description: "Effective crop protection",
    color: "from-red-500 to-rose-600",
    image: "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=400&q=80"
  },
  {
    name: "Equipment",
    description: "Modern farming machinery",
    color: "from-blue-500 to-indigo-600",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&q=80"
  },
  {
    name: "Tools",
    description: "Essential hand and power tools",
    color: "from-gray-500 to-slate-600",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80"
  },
  {
    name: "Animal Feed",
    description: "Nutritious livestock feed",
    color: "from-yellow-500 to-amber-600",
    image: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400&q=80"
  },
  {
    name: "Irrigation",
    description: "Water management systems",
    color: "from-cyan-500 to-teal-600",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80"
  },
];

function CategoryGrid() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-emerald-600 font-semibold tracking-wide uppercase text-sm">Categories</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3 mb-4">Shop by Category</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Everything you need for successful farming</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}>
              <Link to="/products">
                <div className="group relative overflow-hidden rounded-2xl h-52 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  {/* Real Image */}
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent`} />
                  {/* Text */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-bold text-lg">{cat.name}</h3>
                    <p className="text-white/80 text-sm mt-1">{cat.description}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── STATS ──
const stats = [
  { icon: Users, value: "5,000+", label: "Happy Clients", color: "text-blue-500" },
  { icon: Package, value: "10,000+", label: "Products Sold", color: "text-emerald-500" },
  { icon: Truck, value: "500+", label: "Deliveries Monthly", color: "text-amber-500" },
  { icon: Star, value: "4.9", label: "Customer Rating", color: "text-purple-500" },
];

function StatsSection() {
  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <motion.div key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="text-center">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/10 flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-8 h-8" />
              </div>
              <h3 className="text-4xl font-bold text-white mb-2">{stat.value}</h3>
              <p className="text-gray-400 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── WHY CHOOSE US ──
const features = [
  { icon: Award, title: "Premium Quality", description: "All products sourced from certified manufacturers" },
  { icon: Clock, title: "Fast Delivery", description: "Same-day delivery in Chicago area, 2-3 days Midwest" },
  { icon: CreditCard, title: "Flexible Payment", description: "Multiple payment options for qualified businesses" },
  { icon: Headphones, title: "Expert Support", description: "Dedicated agronomists available to assist you" },
  { icon: Leaf, title: "Eco-Friendly", description: "Sustainable and environmentally responsible products" },
  { icon: CheckCircle2, title: "Guaranteed", description: "100% satisfaction guarantee with easy returns" },
];

function WhyChooseUs() {
  return (
    <section className="py-24 bg-emerald-50/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}>
            <span className="text-emerald-600 font-semibold tracking-wide uppercase text-sm">Why Choose Us</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-3 mb-6">Your Trusted Partner in Agriculture</h2>
            <p className="text-xl text-gray-600 mb-8">
              For over 35 years, Chicago Agro Supplies has been the backbone of successful farms
              across the Midwest.
            </p>
            <div className="relative rounded-2xl overflow-hidden h-72">
              <img
                src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80"
                alt="Modern farming"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <p className="text-3xl font-bold">35+</p>
                <p className="text-white/80">Years of Excellence</p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature, idx) => (
              <motion.div key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── MAIN HOME PAGE ──
export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <CategoryGrid />
      <StatsSection />
      <WhyChooseUs />
    </div>
  );
}