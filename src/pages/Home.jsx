import React from 'react';
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Truck, Shield, Star, Users, Package, Award, Leaf, ArrowRight, Phone } from "lucide-react";
import Reviews from '../components/Reviews';

const categories = [
  { name: "Seeds", description: "Premium crop seeds for maximum yield", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80" },
  { name: "Fertilizers", description: "Nutrient-rich soil enhancers", image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=400&q=80" },
  { name: "Pesticides", description: "Effective crop protection", image: "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=400&q=80" },
  { name: "Equipment", description: "Modern farming machinery", image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&q=80" },
  { name: "Tools", description: "Essential hand and power tools", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80" },
  { name: "Animal Feed", description: "Nutritious livestock feed", image: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400&q=80" },
  { name: "Irrigation", description: "Water management systems", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" },
];

const stats = [
  { value: "5,000+", label: "Happy Clients", icon: Users },
  { value: "10,000+", label: "Products Sold", icon: Package },
  { value: "500+", label: "Deliveries/Month", icon: Truck },
  { value: "4.9", label: "Average Rating", icon: Star },
];

const features = [
  { icon: Award, title: "Premium Quality", description: "All products certified and tested for maximum performance" },
  { icon: Truck, title: "Fast Delivery", description: "Same day delivery in Chicago, 3-5 days nationwide" },
  { icon: Phone, title: "Expert Support", description: "Agricultural experts available 7 days a week" },
  { icon: Shield, title: "Guaranteed", description: "100% satisfaction guarantee on all products" },
  { icon: Leaf, title: "Eco-Friendly", description: "Committed to sustainable and responsible farming" },
  { icon: Star, title: "Best Prices", description: "Competitive pricing with bulk discount options" },
];

export default function Home() {
  return (
    <div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80"
            alt="Farm"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600/20 backdrop-blur-sm border border-emerald-500/30 rounded-full text-emerald-400 text-sm font-medium mb-6">
                <Leaf className="w-4 h-4" />
                Trusted by 5,000+ Farmers
              </span>
              <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Growing Success,
                <span className="text-emerald-400"> Together</span>
              </h1>
              <p className="text-xl text-white/80 mb-10 leading-relaxed max-w-2xl">
                Chicago Agro Supplies — your one-stop shop for premium agricultural inputs.
                Quality seeds, fertilizers, equipment and more delivered to your farm.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/products">
                  <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-2 transition-all hover:scale-105">
                    Browse Products
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>
                <Link to="/contact">
                  <button className="border-2 border-white/30 hover:border-white text-white px-8 py-4 rounded-xl font-semibold transition-all hover:bg-white/10">
                    Contact Sales
                  </button>
                </Link>
              </div>

              <div className="flex flex-wrap gap-6 mt-12">
                {[
                  { icon: Truck, text: "Free Delivery" },
                  { icon: Shield, text: "Quality Guaranteed" },
                  { icon: Star, text: "4.9 Star Rating" },
                ].map((badge, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                    <badge.icon className="w-4 h-4 text-emerald-400" />
                    <span className="text-white text-sm font-medium">{badge.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-emerald-600">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center text-white">
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-4xl font-bold mb-1">{stat.value}</div>
                <div className="text-emerald-100">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-emerald-600 font-semibold tracking-wide uppercase text-sm">Categories</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-3 mb-4">Shop by Category</h2>
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
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
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

      {/* Why Choose Us */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-emerald-600 font-semibold uppercase text-sm tracking-wide">Why Us</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-3 mb-4">Why Choose Chicago Agro?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">We go above and beyond for every farmer</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-emerald-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-500">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <Reviews />

      {/* CTA Section */}
      <section className="py-24 bg-emerald-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1920&q=80"
            alt="Farm"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}>
            <h2 className="text-5xl font-bold text-white mb-6">
              Ready to Grow Your Farm?
            </h2>
            <p className="text-xl text-white/80 mb-10">
              Join thousands of successful farmers who trust Chicago Agro Supplies for all their agricultural needs.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/products">
                <button className="bg-white text-emerald-800 hover:bg-emerald-50 px-8 py-4 rounded-xl font-bold transition-all hover:scale-105 flex items-center gap-2">
                  Shop Now
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <Link to="/contact">
                <button className="border-2 border-white text-white hover:bg-white/10 px-8 py-4 rounded-xl font-bold transition-all">
                  Talk to an Expert
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
