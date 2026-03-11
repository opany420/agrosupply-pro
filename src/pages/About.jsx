import React from 'react';
import { motion } from "framer-motion";
import { Leaf, Award, Users, Globe, Heart, TrendingUp } from "lucide-react";

const team = [
  { name: "Chicago Agro CEO", role: "CEO & Founder", emoji: "👨‍💼" },
  { name: "Operations Manager", role: "Head of Operations", emoji: "👩‍💼" },
  { name: "Dr. Agronomy", role: "Chief Agronomist", emoji: "👨‍🔬" },
  { name: "Customer Care", role: "Customer Relations", emoji: "👩‍💻" },
];

const values = [
  { icon: Award, title: "Quality First", description: "We never compromise on the quality of our products" },
  { icon: Heart, title: "Customer Care", description: "Our customers are at the heart of everything we do" },
  { icon: Globe, title: "Sustainability", description: "Committed to environmentally responsible farming" },
  { icon: TrendingUp, title: "Innovation", description: "Always seeking better solutions for modern Kenyan farming" },
];

const milestones = [
  { year: "2010", event: "Founded in Ahero, Kisumu County" },
  { year: "2014", event: "Expanded to serve all of Western Kenya" },
  { year: "2018", event: "Opened main warehouse in Ahero" },
  { year: "2022", event: "Reached 5,000+ satisfied farmers" },
  { year: "2025", event: "Launched Chicago Agro digital platform" },
];

export default function About() {
  return (
    <div className="min-h-screen pt-20">

      {/* Hero */}
      <section className="relative py-24 bg-gradient-to-br from-emerald-800 to-green-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="https://images.unsplash.com/photo-1560493676-04071c5f467b?w=1920&q=80" alt="Agricultural fields in the Kenyan countryside" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center text-white">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-6">
              <Leaf className="w-4 h-4" /> Our Story
            </span>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">About Chicago Agro</h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              For over 15 years we have been the trusted partner for farmers across Kenya,
              providing quality agricultural supplies and expert guidance from our base in Ahero, Kisumu.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="text-emerald-600 font-semibold uppercase text-sm tracking-wide">Our Mission</span>
              <h2 className="text-4xl font-bold text-gray-900 mt-3 mb-6">Empowering Kenyan Farmers to Grow More</h2>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                At Chicago Agro Supplies, we believe that every Kenyan farmer deserves access
                to the best agricultural inputs at fair prices. Our mission is to bridge
                the gap between cutting-edge agricultural science and everyday farming.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Based in Ahero, Kisumu County, we serve farmers across Kenya — from
                smallholder farms to large commercial operations — with certified, genuine products.
              </p>
              <div className="grid grid-cols-3 gap-6 mt-10">
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600">15+</div>
                  <div className="text-gray-500 text-sm">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600">5K+</div>
                  <div className="text-gray-500 text-sm">Happy Farmers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600">26+</div>
                  <div className="text-gray-500 text-sm">Products</div>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
              <img src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=80" alt="Chicago Agro Supplies team at work"
                className="rounded-2xl w-full h-96 object-cover shadow-xl" />
              <div className="absolute -bottom-6 -left-6 bg-emerald-600 text-white p-6 rounded-2xl shadow-xl">
                <div className="text-3xl font-bold">4.9 ⭐</div>
                <div className="text-emerald-100 text-sm">Customer Rating</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-emerald-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-emerald-600 font-semibold uppercase text-sm tracking-wide">What We Stand For</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-3">Our Core Values</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, idx) => (
              <motion.div key={value.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-500 text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-emerald-600 font-semibold uppercase text-sm tracking-wide">Our Journey</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-3">Company Milestones</h2>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 -translate-x-1/2 h-full w-0.5 bg-emerald-200" />
            {milestones.map((m, idx) => (
              <motion.div key={m.year} initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}
                className={`relative flex items-center gap-8 mb-12 ${idx % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className={`flex-1 ${idx % 2 === 0 ? 'text-right' : 'text-left'}`}>
                  <div className="bg-white border border-emerald-100 rounded-xl p-4 shadow-sm inline-block">
                    <div className="text-emerald-600 font-bold text-lg">{m.year}</div>
                    <div className="text-gray-600 text-sm">{m.event}</div>
                  </div>
                </div>
                <div className="w-4 h-4 bg-emerald-600 rounded-full border-4 border-white shadow-md z-10 flex-shrink-0" />
                <div className="flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-emerald-600 font-semibold uppercase text-sm tracking-wide">The People Behind</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-3">Meet Our Team</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, idx) => (
              <motion.div key={member.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition-shadow">
                <div className="text-6xl mb-4">{member.emoji}</div>
                <h3 className="font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-emerald-600 text-sm font-medium">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}